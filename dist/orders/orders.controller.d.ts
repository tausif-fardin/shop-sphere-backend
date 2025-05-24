import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { UserRole } from '../users/schemas/user.schema';
import { OrderStatus } from './schemas/order.schema';
interface RequestWithUser extends Request {
    user: {
        userId: string;
        role: UserRole;
    };
}
export declare class OrdersController {
    private readonly ordersService;
    constructor(ordersService: OrdersService);
    create(createOrderDto: CreateOrderDto, req: RequestWithUser): Promise<import("./schemas/order.schema").Order>;
    findAll(): Promise<import("./schemas/order.schema").Order[]>;
    findMyOrders(req: RequestWithUser): Promise<import("./schemas/order.schema").Order[]>;
    findOne(id: string, req: RequestWithUser): Promise<import("./schemas/order.schema").Order>;
    update(id: string, updateOrderDto: UpdateOrderDto): Promise<import("./schemas/order.schema").Order>;
    updateStatus(id: string, status: OrderStatus): Promise<import("./schemas/order.schema").Order>;
    remove(id: string): Promise<import("./schemas/order.schema").Order>;
}
export {};
