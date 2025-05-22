import { Module } from '@nestjs/common';
import { CommandModule } from 'nestjs-command';
import { SeedService } from './seed.service';
import { UsersModule } from '../users/users.module';
import { ProductsModule } from '../products/products.module';

@Module({
    imports: [
        CommandModule,
        UsersModule,
        ProductsModule,
    ],
    providers: [SeedService],
    exports: [SeedService],
})
export class SeederModule { }
