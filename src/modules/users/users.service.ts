import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GenerateHashService } from 'src/modules/auth/generate-hash.service';
import { ID } from 'src/types/ID';
import { CreateUserDto } from './dto/user-create.dto';
import { SearchUserParams, IUserService } from './user.interfaces';
import { User, UserDocument } from './mongo.schemas/user.schema';

@Injectable()
export class UsersService implements IUserService {
  constructor(
    @InjectModel(User.name) private UserModel: Model<UserDocument>,
    private hashService: GenerateHashService,
  ) {}

  public async create(
    data: Partial<CreateUserDto> & Partial<User>,
  ): Promise<UserDocument> {
    const exist = await this.findByEmail(data.email);
    if (exist) {
      throw new BadRequestException(
        `Пользователь с email ${data.email} уже есть`,
      );
    }
    data.passwordHash = this.hashService.generate(data.password);
    const user = new this.UserModel(data);
    try {
      await user.save();
      return user;
    } catch (e) {
      throw new BadRequestException(
        'Ошибка при создании пользователя: указаны неверные данные или такой пользователь уже есть',
      );
    }
  }

  async findById(id: ID): Promise<UserDocument | undefined> {
    return await this.UserModel.findById(id).exec();
  }

  async findByEmail(email: string): Promise<UserDocument | undefined> {
    return await this.UserModel.findOne({ email }).exec();
  }

  async findAll(params: SearchUserParams): Promise<User[]> {
    return this.UserModel.find({
      email: { $regex: params.email },
      name: { $regex: params.name },
      contactPhone: { $regex: params.contactPhone },
    })
      .sort('_id')
      .skip(params.offset)
      .limit(params.limit)
      .exec();
  }
}
