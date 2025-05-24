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
var SeedService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SeedService = void 0;
const common_1 = require("@nestjs/common");
const nestjs_command_1 = require("nestjs-command");
const users_service_1 = require("../users/users.service");
const products_service_1 = require("../products/products.service");
const user_schema_1 = require("../users/schemas/user.schema");
let SeedService = SeedService_1 = class SeedService {
    usersService;
    productsService;
    logger = new common_1.Logger(SeedService_1.name);
    constructor(usersService, productsService) {
        this.usersService = usersService;
        this.productsService = productsService;
    }
    async seedAll() {
        await this.seedUsers();
        await this.seedProducts();
        this.logger.log('All seed data has been created!');
    }
    async seedUsers() {
        this.logger.log('Seeding users...');
        const adminExists = await this.usersService.findByEmail('admin@example.com');
        if (!adminExists) {
            await this.usersService.create({
                name: 'Admin User',
                email: 'admin@example.com',
                password: 'Admin123!',
                role: user_schema_1.UserRole.ADMIN,
            });
            this.logger.log('Admin user created');
        }
        else {
            this.logger.log('Admin user already exists');
        }
        const customerExists = await this.usersService.findByEmail('customer@example.com');
        if (!customerExists) {
            await this.usersService.create({
                name: 'Test Customer',
                email: 'customer@example.com',
                password: 'Customer123!',
                role: user_schema_1.UserRole.CUSTOMER,
            });
            this.logger.log('Customer user created');
        }
        else {
            this.logger.log('Customer user already exists');
        }
    }
    async seedProducts() {
        this.logger.log('Seeding products...');
        const products = [
            {
                name: 'Smartphone X',
                description: 'Latest flagship smartphone with amazing camera',
                price: 999.99,
                stock: 100,
                images: ['smartphone1.jpg', 'smartphone2.jpg'],
                categories: ['electronics', 'smartphones'],
            },
            {
                name: 'Laptop Pro',
                description: 'Powerful laptop for professionals',
                price: 1499.99,
                stock: 50,
                images: ['laptop1.jpg', 'laptop2.jpg'],
                categories: ['electronics', 'computers'],
            },
            {
                name: 'Wireless Headphones',
                description: 'Noise-cancelling wireless headphones',
                price: 199.99,
                stock: 200,
                images: ['headphones1.jpg', 'headphones2.jpg'],
                categories: ['electronics', 'audio'],
            },
            {
                name: 'Smart Watch',
                description: 'Track your fitness and receive notifications',
                price: 249.99,
                stock: 75,
                images: ['smartwatch1.jpg', 'smartwatch2.jpg'],
                categories: ['electronics', 'wearables'],
            },
            {
                name: 'Tablet Ultra',
                description: '10-inch tablet with high-resolution display',
                price: 399.99,
                stock: 60,
                images: ['tablet1.jpg', 'tablet2.jpg'],
                categories: ['electronics', 'tablets'],
            },
        ];
        for (const product of products) {
            const existingProducts = await this.productsService.findAll({ name: product.name });
            if (!existingProducts || existingProducts.length === 0) {
                await this.productsService.create(product);
                this.logger.log(`Created product: ${product.name}`);
            }
            else {
                this.logger.log(`Product ${product.name} already exists`);
            }
        }
    }
};
exports.SeedService = SeedService;
__decorate([
    (0, nestjs_command_1.Command)({
        command: 'seed:all',
        describe: 'Seed the database with initial data',
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SeedService.prototype, "seedAll", null);
__decorate([
    (0, nestjs_command_1.Command)({
        command: 'seed:users',
        describe: 'Seed the database with users',
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SeedService.prototype, "seedUsers", null);
__decorate([
    (0, nestjs_command_1.Command)({
        command: 'seed:products',
        describe: 'Seed the database with products',
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SeedService.prototype, "seedProducts", null);
exports.SeedService = SeedService = SeedService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        products_service_1.ProductsService])
], SeedService);
//# sourceMappingURL=seed.service.js.map