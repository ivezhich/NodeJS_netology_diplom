import { IsDefined, IsString } from 'class-validator';
import { ID } from 'src/types/ID';
import { CreateSupportRequest } from '../support-request.interfaces';

export class CreateSupportRequestDto implements CreateSupportRequest {
  @IsDefined()
  @IsString()
  text: string;

  userId: ID;
}
