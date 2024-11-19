import { ID } from 'src/types/ID';
import { Reservation } from './mongo.schemas/reservation.schema';

import { ObjectId } from 'mongoose';

export interface iReservation {
  userId: ObjectId;
  roomId: ObjectId;
  dateStart: Date;
  dateEnd: Date;
}

export interface ReservationDto {
  userId: ID;
  roomId: ID;
  dateStart: Date;
  dateEnd: Date;
}

export interface ReservationSearchOptions {
  userId?: ID;
  dateStart?: Date;
  dateEnd?: Date;
  roomId?: ID;
}

export interface IReservationService {
  addReservation(data: ReservationDto): Promise<Reservation>;
  removeReservation(id: ID): Promise<void>;
  getReservations(
    filter: ReservationSearchOptions,
  ): Promise<Array<Reservation>>;
}
