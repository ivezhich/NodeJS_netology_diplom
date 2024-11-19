import { IsString } from 'class-validator';
import { UpdateHotelParams } from '../hotels.interfaces';

export class UpdateHotelParamsDto implements UpdateHotelParams {
  @IsString()
  title: string;

  @IsString()
  description: string;
}
