import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';

@Module({
    imports: [
        MongooseModule.forRootAsync({
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                uri: configService.get<string>('MONGODB_URI'),
                useNewUrlParser: true,
                useUnifiedTopology: true,
                // Enable if you need auto-index creation
                autoIndex: configService.get<string>('NODE_ENV') !== 'production',
            }),
        }),
    ],
})
export class DatabaseModule { }
