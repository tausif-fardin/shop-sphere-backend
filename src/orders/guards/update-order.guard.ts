import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { OrdersService } from '../orders.service';
import { UserRole } from '../../users/schemas/user.schema';
import { OrderStatus, Order } from '../schemas/order.schema';
import { UpdateOrderDto } from '../dto/update-order.dto';
import { Request } from 'express';
import { Types } from 'mongoose';

interface RequestWithUser extends Request {
  user: {
    userId: string;
    role: UserRole;
  };
}

@Injectable()
export class UpdateOrderGuard implements CanActivate {
  constructor(private readonly ordersService: OrdersService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const user = request.user;
    const orderId = request.params.id as string;
    const updateOrderDto = request.body as UpdateOrderDto;

    if (!user || !user.userId) {
      throw new ForbiddenException(
        'User not authenticated or user ID missing.',
      );
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
    } else if (
      order.user &&
      typeof order.user === 'object' &&
      Object.prototype.hasOwnProperty.call(order.user, '_id')
    ) {
      // Handle case where user is populated as a User object
      const userObj = order.user as unknown as { _id: Types.ObjectId | string };
      orderUserId = userObj._id.toString();
    } else {
      throw new ForbiddenException(
        'Could not verify order ownership due to unexpected user data format.',
      );
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