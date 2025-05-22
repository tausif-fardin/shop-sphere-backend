import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Order, OrderStatus } from './schemas/order.schema';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { ProductsService } from '../products/products.service';

@Injectable()
export class OrdersService {
    constructor(
        @InjectModel(Order.name) private readonly orderModel: Model<Order>,
        private readonly productsService: ProductsService,
    ) { }

    async create(userId: string, createOrderDto: CreateOrderDto): Promise<Order> {
        // Create a new order with the user id
        const newOrder = new this.orderModel({
            ...createOrderDto,
            user: userId,
        });

        // Check product availability and update stock
        await this.validateAndUpdateStock(createOrderDto.items);

        return newOrder.save();
    }

    async findAll(query: Record<string, any> = {}): Promise<Order[]> {
        return this.orderModel
            .find(query)
            .populate('user', 'name email')
            .sort({ createdAt: -1 })
            .exec();
    }

    async findAllByUser(userId: string): Promise<Order[]> {
        return this.orderModel
            .find({ user: userId })
            .populate('user', 'name email')
            .sort({ createdAt: -1 })
            .exec();
    }

    async findOne(id: string): Promise<Order> {
        const order = await this.orderModel
            .findById(id)
            .populate('user', 'name email')
            .exec();

        if (!order) {
            throw new NotFoundException(`Order with ID ${id} not found`);
        }

        return order;
    }

    async update(id: string, updateOrderDto: UpdateOrderDto): Promise<Order> {
        const updatedOrder = await this.orderModel
            .findByIdAndUpdate(id, updateOrderDto, { new: true })
            .exec();

        if (!updatedOrder) {
            throw new NotFoundException(`Order with ID ${id} not found`);
        }

        return updatedOrder;
    }

    async updateStatus(id: string, status: OrderStatus): Promise<Order> {
        const order = await this.orderModel.findById(id).exec();

        if (!order) {
            throw new NotFoundException(`Order with ID ${id} not found`);
        }

        order.status = status;
        return order.save();
    }

    async remove(id: string): Promise<Order> {
        const deletedOrder = await this.orderModel.findByIdAndDelete(id).exec();

        if (!deletedOrder) {
            throw new NotFoundException(`Order with ID ${id} not found`);
        }

        return deletedOrder;
    }

    private async validateAndUpdateStock(orderItems: any[]): Promise<void> {
        // Check product availability and update stock
        for (const item of orderItems) {
            const product = await this.productsService.findOne(item.product);

            if (product.stock < item.quantity) {
                throw new BadRequestException(
                    `Product ${product.name} has insufficient stock. Available: ${product.stock}, Requested: ${item.quantity}`,
                );
            }

            // Update product stock
            await this.productsService.update(item.product, {
                stock: product.stock - item.quantity,
            });
        }
    }
}
