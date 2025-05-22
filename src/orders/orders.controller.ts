import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
    Request,
    ForbiddenException,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/schemas/user.schema';
import { OrderStatus } from './schemas/order.schema';
import {
    ApiTags,
    ApiOperation,
    ApiBearerAuth,
    ApiParam,
    ApiBody,
    ApiResponse,
} from '@nestjs/swagger';
import { UpdateOrderGuard } from './guards/update-order.guard'; // Import the new guard

@ApiTags('orders')
@Controller('orders')
export class OrdersController {
    constructor(private readonly ordersService: OrdersService) { }

    @Post()
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Create a new order' })
    @ApiBody({ type: CreateOrderDto })
    @ApiResponse({ status: 201, description: 'Order created successfully' })
    @ApiResponse({ status: 400, description: 'Bad request - Insufficient stock' })
    create(@Body() createOrderDto: CreateOrderDto, @Request() req) {
        return this.ordersService.create(req.user.userId, createOrderDto);
    }

    @Get()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get all orders (admin only)' })
    @ApiResponse({ status: 200, description: 'Return all orders' })
    findAll() {
        return this.ordersService.findAll();
    }

    @Get('my-orders')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get all orders for the current user' })
    @ApiResponse({ status: 200, description: 'Return all orders for the user' })
    findMyOrders(@Request() req) {
        return this.ordersService.findAllByUser(req.user.userId);
    }

    @Get(':id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get an order by ID' })
    @ApiParam({ name: 'id', description: 'Order ID' })
    @ApiResponse({ status: 200, description: 'Order found' })
    @ApiResponse({ status: 404, description: 'Order not found' })
    async findOne(@Param('id') id: string, @Request() req) {
        const order = await this.ordersService.findOne(id);

        // Check if the order belongs to the current user or if the user is an admin
        if (
            req.user.role !== UserRole.ADMIN &&
            order.user._id.toString() !== req.user.userId
        ) {
            throw new ForbiddenException('You can only access your own orders');
        }

        return order;
    }

    @Patch(':id')
    @UseGuards(JwtAuthGuard, UpdateOrderGuard) // Apply the new guard
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Update an order' })
    @ApiParam({ name: 'id', description: 'Order ID' })
    @ApiBody({ type: UpdateOrderDto })
    @ApiResponse({ status: 200, description: 'Order updated successfully' })
    @ApiResponse({ status: 404, description: 'Order not found' })
    async update(
        @Param('id') id: string,
        @Body() updateOrderDto: UpdateOrderDto,
    ) {
        // Authorization logic is now handled by UpdateOrderGuard
        return this.ordersService.update(id, updateOrderDto);
    }

    @Patch(':id/status')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Update order status (admin only)' })
    @ApiParam({ name: 'id', description: 'Order ID' })
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                status: {
                    type: 'string',
                    enum: Object.values(OrderStatus),
                    example: OrderStatus.PROCESSING,
                },
            },
        },
    })
    @ApiResponse({ status: 200, description: 'Order status updated successfully' })
    @ApiResponse({ status: 404, description: 'Order not found' })
    updateStatus(
        @Param('id') id: string,
        @Body('status') status: OrderStatus,
    ) {
        return this.ordersService.updateStatus(id, status);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Delete an order (admin only)' })
    @ApiParam({ name: 'id', description: 'Order ID' })
    @ApiResponse({ status: 200, description: 'Order deleted successfully' })
    @ApiResponse({ status: 404, description: 'Order not found' })
    remove(@Param('id') id: string) {
        return this.ordersService.remove(id);
    }
}
