import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { Order, OrderSchema } from './schemas/order.schema';
import { ProductsModule } from '../products/products.module';
import { UpdateOrderGuard } from './guards/update-order.guard'; // Import the guard

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Order.name, schema: OrderSchema },
        ]),
        ProductsModule, // We need the ProductsService to check stock
    ],
    controllers: [OrdersController],
    providers: [OrdersService, UpdateOrderGuard], // Add the guard to providers
    exports: [OrdersService],
})
export class OrdersModule { }
