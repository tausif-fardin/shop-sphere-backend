"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateOrderGuard = void 0;
const common_1 = require("@nestjs/common");
const orders_service_1 = require("../orders.service");
const user_schema_1 = require("../../users/schemas/user.schema");
const order_schema_1 = require("../schemas/order.schema");
let UpdateOrderGuard = class UpdateOrderGuard {
    ordersService;
    constructor(ordersService) {
        this.ordersService = ordersService;
    }
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        const orderId = request.params.id;
        const updateOrderDto = request.body;
        if (!user || !user.userId) {
            throw new common_1.ForbiddenException('User not authenticated or user ID missing.');
        }
        const order = await this.ordersService.findOne(orderId);
        if (!order) {
            throw new common_1.NotFoundException(`Order with ID ${orderId} not found`);
        }
        if (user.role === user_schema_1.UserRole.ADMIN) {
            return true;
        }
        let orderUserId;
        if (typeof order.user === 'string') {
            orderUserId = order.user;
        }
        else if (order.user &&
            typeof order.user === 'object' &&
            Object.prototype.hasOwnProperty.call(order.user, '_id')) {
            const userObj = order.user;
            orderUserId = userObj._id.toString();
        }
        else {
            throw new common_1.ForbiddenException('Could not verify order ownership due to unexpected user data format.');
        }
        if (orderUserId !== user.userId) {
            throw new common_1.ForbiddenException('You can only update your own orders.');
        }
        if (order.status !== order_schema_1.OrderStatus.PENDING) {
            throw new common_1.ForbiddenException('You can only update orders that are in PENDING status.');
        }
        if (updateOrderDto.status !== undefined) {
            throw new common_1.ForbiddenException('Customers are not allowed to change the order status. Please remove the status field from your request.');
        }
        return true;
    }
};
exports.UpdateOrderGuard = UpdateOrderGuard;
exports.UpdateOrderGuard = UpdateOrderGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [orders_service_1.OrdersService])
], UpdateOrderGuard);
//# sourceMappingURL=update-order.guard.js.map