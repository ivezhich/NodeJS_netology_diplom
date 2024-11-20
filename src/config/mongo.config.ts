import { ConfigService } from '@nestjs/config';
import { MongooseModuleFactoryOptions } from '@nestjs/mongoose';
export const getMongoConfig = async (
  configService: ConfigService,
): Promise<MongooseModuleFactoryOptions> => {
  return {
    uri: getMongoString(configService),
    user: configService.get('DB_USERNAME'),
    pass: configService.get('DB_PASSWORD'),
    dbName: configService.get('DB_NAME'),
  };
};

export const getMongoString = (configService: ConfigService) => {
  return (
    'mongodb://' +
    configService.get('MONGO_HOST') +
    ':' +
    configService.get('MONGO_PORT')
  );
};
