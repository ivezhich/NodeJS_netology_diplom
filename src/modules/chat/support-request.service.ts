import { Injectable } from '@nestjs/common';
import { isUndefined } from '@nestjs/common/utils/shared.utils';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserRoleEnum } from 'src/enums/user-role.enum';
import { User } from 'src/modules/users/mongo.schemas/user.schema';
import { ID } from 'src/types/ID';
import {
  SendMessage,
  GetChatListParams,
  ISupportRequestService,
} from './support-request.interfaces';
import { Message } from './mongo.schemas/message.schema';
import {
  SupportRequest,
  SupportRequestDocument,
} from './mongo.schemas/chat-request.schema';
import { SupportRequestMessageService } from './support-request-message.service';

@Injectable()
export class SupportRequestService implements ISupportRequestService {
  constructor(
    @InjectModel(SupportRequest.name)
    private SupportRequestModel: Model<SupportRequestDocument>,
    private messageService: SupportRequestMessageService,
    private eventEmitter: EventEmitter2,
  ) {}

  public async findSupportRequests(
    params: GetChatListParams,
  ): Promise<SupportRequest[]> {
    const queryParams: Partial<SupportRequest> = {};
    const { limit, offset } = params;
    if (params.userId) {
      queryParams.userId = params.userId;
    }
    if (!isUndefined(params.isActive)) {
      queryParams.isActive = params.isActive;
    }
    const query = this.SupportRequestModel.find(queryParams);
    if (limit) {
      query.limit(limit);
    }
    if (offset) {
      query.skip(offset);
    }
    return await query.populate(this.populateParams()).exec();
  }

  public async sendMessage(
    request: SupportRequestDocument,
    data: SendMessage,
  ): Promise<Message> {
    const message = await this.messageService.addMessage(data);
    request.messageIds.push(message.id);
    await request.save();
    this.eventEmitter.emit('newMessage', { request, message });
    return message;
  }

  public async getMessages(supportRequest: ID): Promise<Message[]> {
    return (await this.findById(supportRequest)).messages || [];
  }

  public subscribe(
    handler: (supportRequest: SupportRequest, message: Message) => void,
  ): void {
    this.eventEmitter.on('newMessage', (params) =>
      handler(params.request, params.message),
    );
  }

  public async findById(id: ID): Promise<SupportRequestDocument | undefined> {
    return await this.SupportRequestModel.findById(id)
      .populate(this.populateParams())
      .select('-__v')
      .exec();
  }

  public canAccessRequest(request: SupportRequest, user: User) {
    const isClient = [UserRoleEnum.client as string].includes(user.role);
    return !isClient || request.userId === user.id;
  }

  private populateParams() {
    return ['user', { path: 'messages', populate: { path: 'author' } }];
  }
}
