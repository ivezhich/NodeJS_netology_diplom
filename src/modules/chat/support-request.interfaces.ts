import { ID } from 'src/types/ID';
import { Message } from './mongo.schemas/message.schema';
import { SupportRequest } from './mongo.schemas/chat-request.schema';

export interface iMessage {
  authorId: ID;
  sentAt: Date;
  text: string;
  readAt: Date;
}

export interface iSupportRequest {
  userId: ID;
  createdAt: Date;
  messages: iMessage[];
  isActive: boolean;
}

export interface ISupportRequestService {
  findSupportRequests(params: GetChatListParams): Promise<SupportRequest[]>;
  sendMessage(request: SupportRequest, data: SendMessage): Promise<Message>;
  getMessages(supportRequest: ID): Promise<Message[]>;
  subscribe(
    handler: (supportRequest: SupportRequest, message: Message) => void,
  ): void;
}

export interface ISupportRequestEmployeeService {
  markMessagesAsRead(
    request: SupportRequest,
    params: MarkMessagesAsRead,
  ): Promise<void>;
  getUnreadCount(supportRequest: ID): Promise<Message[]>;
  closeRequest(supportRequest: ID): Promise<void>;
}

export interface ISupportRequestClientService {
  createSupportRequest(data: CreateSupportRequest): Promise<SupportRequest>;
  markMessagesAsRead(
    request: SupportRequest,
    params: MarkMessagesAsRead,
  ): Promise<void>;
  getUnreadCount(supportRequest: ID): Promise<Message[]>;
}

export interface CreateSupportRequest {
  userId: ID;
  text: string;
}

export interface GetChatListParams {
  userId: ID | null;
  isActive: boolean;
  limit: number;
  offset: number;
}

export interface MarkMessagesAsRead {
  user: ID;
  supportRequest: ID;
  createdBefore: Date;
}

export interface SendMessage {
  authorId: ID;
  supportRequest: ID;
  text: string;
}
