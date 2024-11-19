import { ID } from 'src/types/ID';
import { HotelRoom } from './mongo.schemas/hotel-room.schema';
import { Hotel } from './mongo.schemas/hotel.schema';

export interface iHotel {
  title: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface iHotelRoom {
  hotelId: ID;
  description: string;
  images: string[];
  createdAt: Date;
  updatedAt: Date;
  isEnabled: boolean;
}

export interface IHotelsRoomService {
  create(data: Partial<HotelRoom>): Promise<HotelRoom>;
  findById(id: ID): Promise<HotelRoom | undefined>;
  search(params: SearchRoomsParams): Promise<HotelRoom[]>;
  update(id: ID, data: Partial<HotelRoom>): Promise<HotelRoom>;
}

export interface IHotelsService {
  create(data: any): Promise<Hotel>;
  findById(id: ID): Promise<Hotel>;
  search(params: SearchHotelParams): Promise<Hotel[]>;
  update(id: ID, data: UpdateHotelParams): Promise<Hotel>;
}

export interface SearchHotelParams {
  limit: number;
  offset: number;
  title: string;
}

export interface SearchRoomsParams {
  limit: number;
  offset: number;
  hotelId: ID;
  isEnabled?: boolean;
}

export interface UpdateHotelParams {
  title: string;
  description: string;
}
