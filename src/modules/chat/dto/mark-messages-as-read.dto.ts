import { IsDateString, IsDefined } from 'class-validator';
import { ID } from 'src/types/ID';
import { MarkMessagesAsRead } from '../support-request.interfaces';

export class MarkMessagesAsReadDto implements MarkMessagesAsRead {
  @IsDefined()
  @IsDateString()
  createdBefore: Date;

  supportRequest: ID;
  user: ID;
}
