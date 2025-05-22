import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';
import { TerminusModule } from '@nestjs/terminus';
import { HttpModule } from '@nestjs/axios';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
    imports: [
        TerminusModule,
        HttpModule,
        MongooseModule,
    ],
    controllers: [HealthController],
})
export class HealthModule { }
