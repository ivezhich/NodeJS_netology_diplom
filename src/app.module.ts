import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { MongooseModule } from '@nestjs/mongoose';
import { AppGateway } from './app.gateway';
//import config from './config';
import { AuthModule } from './modules/auth/auth.module';
import { DownloadModule } from './modules/download/download.module';
import { HotelsModule } from './modules/hotels/hotels.module';
import { ReservationsModule } from './modules/reservations/reservations.module';
import { SupportRequestModule } from './modules/chat/support-request.module';
import { UsersModule } from './modules/users/users.module';
import { getMongoConfig } from './config/mongo.config';
import { ConfigModule, ConfigService } from '@nestjs/config';

const modules = [
  ConfigModule.forRoot({
    envFilePath: './config/.env',
  }),
  //MongooseModule.forRoot('mongodb://usr:pwd123@mongodb:27017/admin'),
  MongooseModule.forRootAsync({
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: getMongoConfig,
  }),
  AuthModule,
  HotelsModule,
  ReservationsModule,
  SupportRequestModule,
  UsersModule,
  DownloadModule,
  EventEmitterModule.forRoot(),
];

@Module({
  imports: [...modules],
  controllers: [],
  providers: [AppGateway],
})
export class AppModule {}
