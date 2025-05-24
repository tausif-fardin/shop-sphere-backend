import { CanActivate, ExecutionContext } from '@nestjs/common';
import { OrdersService } from '../orders.service';
export declare class UpdateOrderGuard implements CanActivate {
    private readonly ordersService;
    constructor(ordersService: OrdersService);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
