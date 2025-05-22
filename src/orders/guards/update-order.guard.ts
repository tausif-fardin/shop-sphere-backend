import {
    Injectable,
    CanActivate,
    ExecutionContext,
    ForbiddenException,
    NotFoundException,
} from '@nestjs/common';
import { OrdersService } from '../orders.service';
import { UserRole, User } from '../../users/schemas/user.schema'; // Combined User import
import { OrderStatus, Order } from '../schemas/order.schema';
import { UpdateOrderDto } from '../dto/update-order.dto';

@Injectable()
export class UpdateOrderGuard implements CanActivate {
    constructor(private readonly ordersService: OrdersService) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const user = request.user as { userId: string; role: UserRole }; // Assuming user structure from JWT
        const orderId = request.params.id;
        const updateOrderDto: UpdateOrderDto = request.body;

        if (!user || !user.userId) {
            throw new ForbiddenException('User not authenticated or user ID missing.');
        }

        const order: Order = await this.ordersService.findOne(orderId);
        if (!order) {
            throw new NotFoundException(`Order with ID ${orderId} not found`);
        }

        // Admin users can update any order and any field
        if (user.role === UserRole.ADMIN) {
            return true;
        }

        // Customer-specific logic:
        let orderUserId: string;
        if (typeof order.user === 'string') {
            orderUserId = order.user;
        } else if (order.user && typeof order.user === 'object' && order.user.hasOwnProperty('_id')) {
            // Type assertion after check
            orderUserId = (order.user as User)._id.toString();
        } else {
            throw new ForbiddenException('Could not verify order ownership due to unexpected user data format.');
        }

        if (orderUserId !== user.userId) {
            throw new ForbiddenException('You can only update your own orders.');
        }

        if (order.status !== OrderStatus.PENDING) {
            throw new ForbiddenException(
                'You can only update orders that are in PENDING status.',
            );
        }

        if (updateOrderDto.status !== undefined) {
            throw new ForbiddenException(
                'Customers are not allowed to change the order status. Please remove the status field from your request.',
            );
        }

        return true;
    }
}
