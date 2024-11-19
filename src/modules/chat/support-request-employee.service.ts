import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserRoleEnum } from 'src/enums/user-role.enum';
import { ID } from 'src/types/ID';
import {
  MarkMessagesAsRead,
  ISupportRequestEmployeeService,
} from './support-request.interfaces';
import { Message } from './mongo.schemas/message.schema';
import {
  SupportRequest,
  SupportRequestDocument,
} from './mongo.schemas/chat-request.schema';
import { SupportRequestService } from './support-request.service';

@Injectable()
export class SupportRequestEmployeeService
  implements ISupportRequestEmployeeService
{
  constructor(
    @InjectModel(SupportRequest.name)
    private SupportRequestModel: Model<SupportRequestDocument>,
    private requestService: SupportRequestService,
  ) {}

  public async markMessagesAsRead(
    request: SupportRequest,
    params: MarkMessagesAsRead,
  ) {
    request?.messages
      .filter((message) => !message.readAt)
      .filter((message) => message.authorId == params.user)
      .filter((message) => message.sentAt < params.createdBefore)
      .forEach((message) => {
        message.readAt = new Date();
        message.save();
      });
  }

  public async getUnreadCount(supportRequest: ID): Promise<Message[]> {
    return (
      (await this.requestService.findById(supportRequest))?.messages
        .filter((message) => message.author?.role == UserRoleEnum.client)
        .filter((message) => !message.readAt) || []
    );
  }

  public async closeRequest(supportRequest: ID): Promise<void> {
    const request = await this.requestService.findById(supportRequest);
    if (request) {
      request.isActive = false;
      await request.save();
    }
  }
}
