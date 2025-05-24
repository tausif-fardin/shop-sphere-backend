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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const order_schema_1 = require("./schemas/order.schema");
const products_service_1 = require("../products/products.service");
let OrdersService = class OrdersService {
    orderModel;
    productsService;
    constructor(orderModel, productsService) {
        this.orderModel = orderModel;
        this.productsService = productsService;
    }
    async create(userId, createOrderDto) {
        const newOrder = new this.orderModel({
            ...createOrderDto,
            user: userId,
        });
        await this.validateAndUpdateStock(createOrderDto.items);
        return newOrder.save();
    }
    async findAll(query = {}) {
        return this.orderModel
            .find(query)
            .populate('user', 'name email')
            .sort({ createdAt: -1 })
            .exec();
    }
    async findAllByUser(userId) {
        return this.orderModel
            .find({ user: userId })
            .populate('user', 'name email')
            .sort({ createdAt: -1 })
            .exec();
    }
    async findOne(id) {
        const order = await this.orderModel
            .findById(id)
            .populate('user', 'name email')
            .exec();
        if (!order) {
            throw new common_1.NotFoundException(`Order with ID ${id} not found`);
        }
        return order;
    }
    async update(id, updateOrderDto) {
        const updatedOrder = await this.orderModel
            .findByIdAndUpdate(id, updateOrderDto, { new: true })
            .exec();
        if (!updatedOrder) {
            throw new common_1.NotFoundException(`Order with ID ${id} not found`);
        }
        return updatedOrder;
    }
    async updateStatus(id, status) {
        const order = await this.orderModel.findById(id).exec();
        if (!order) {
            throw new common_1.NotFoundException(`Order with ID ${id} not found`);
        }
        order.status = status;
        return order.save();
    }
    async remove(id) {
        const deletedOrder = await this.orderModel.findByIdAndDelete(id).exec();
        if (!deletedOrder) {
            throw new common_1.NotFoundException(`Order with ID ${id} not found`);
        }
        return deletedOrder;
    }
    async validateAndUpdateStock(orderItems) {
        for (const item of orderItems) {
            const product = await this.productsService.findOne(item.product);
            if (product.stock < item.quantity) {
                throw new common_1.BadRequestException(`Product ${product.name} has insufficient stock. Available: ${product.stock}, Requested: ${item.quantity}`);
            }
            await this.productsService.update(item.product, {
                stock: product.stock - item.quantity,
            });
        }
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(order_schema_1.Order.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        products_service_1.ProductsService])
], OrdersService);
//# sourceMappingURL=orders.service.js.map