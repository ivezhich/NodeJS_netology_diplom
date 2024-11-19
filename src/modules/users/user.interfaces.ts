import { ID } from 'src/types/ID';
import { User } from './mongo.schemas/user.schema';

export interface iUser {
  email: string;
  passwordHash: string;
  name: string;
  contactPhone: string;
  role: string;
}

export interface IUserService {
  create(data: Partial<User>): Promise<User>;
  findById(id: ID): Promise<User>;
  findByEmail(email: string): Promise<User>;
  findAll(params: SearchUserParams): Promise<User[]>;
}

export interface SearchUserParams {
  limit: number;
  offset: number;
  email: string;
  name: string;
  contactPhone: string;
}
