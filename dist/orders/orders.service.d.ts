import { Model } from 'mongoose';
import { Order, OrderStatus } from './schemas/order.schema';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { ProductsService } from '../products/products.service';
export declare class OrdersService {
    private readonly orderModel;
    private readonly productsService;
    constructor(orderModel: Model<Order>, productsService: ProductsService);
    create(userId: string, createOrderDto: CreateOrderDto): Promise<Order>;
    findAll(query?: Record<string, any>): Promise<Order[]>;
    findAllByUser(userId: string): Promise<Order[]>;
    findOne(id: string): Promise<Order>;
    update(id: string, updateOrderDto: UpdateOrderDto): Promise<Order>;
    updateStatus(id: string, status: OrderStatus): Promise<Order>;
    remove(id: string): Promise<Order>;
    private validateAndUpdateStock;
}
