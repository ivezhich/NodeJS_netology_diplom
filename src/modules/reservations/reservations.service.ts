import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ID } from 'src/types/ID';
import {
  ReservationDto,
  ReservationSearchOptions,
  IReservationService,
} from './reservations.interfaces';
import {
  Reservation,
  ReservationDocument,
} from './mongo.schemas/reservation.schema';

@Injectable()
export class ReservationsService implements IReservationService {
  constructor(
    @InjectModel(Reservation.name)
    private ReservationModel: Model<ReservationDocument>,
  ) {}

  public async addReservation(
    data: ReservationDto,
  ): Promise<ReservationDocument> {
    const { roomId, dateStart, dateEnd } = data;
    const reservations = await this.getReservations({
      roomId,
      dateStart,
      dateEnd,
    });
    if (reservations.length) {
      throw new BadRequestException('Dates are already reserved');
    }
    const model = new this.ReservationModel(data);
    await model.save();
    return await this.findById(model.id);
  }

  public async removeReservation(id: ID): Promise<void> {
    await this.ReservationModel.findByIdAndDelete(id).exec();
  }

  public async getReservations(
    filter: ReservationSearchOptions,
  ): Promise<ReservationDocument[]> {
    const { userId, roomId } = filter;
    const parsedFilter: any = {};
    if (userId) {
      parsedFilter.userId = userId;
    }
    if (roomId) {
      parsedFilter.roomId = roomId;
    }
    if (filter.dateStart) {
      parsedFilter.dateStart = { $gte: filter.dateStart };
    }
    if (filter.dateEnd) {
      parsedFilter.dateEnd = { $lte: filter.dateEnd };
    }

    return await this.ReservationModel.find(parsedFilter)
      .populate(this.populateParams())
      .exec();
  }

  public async findById(id: ID): Promise<ReservationDocument | undefined> {
    return await this.ReservationModel.findById(id)
      .populate(this.populateParams())
      .select('-__v')
      .exec();
  }

  private populateParams() {
    return ['user', { path: 'room', populate: { path: 'hotel' } }];
  }
}
