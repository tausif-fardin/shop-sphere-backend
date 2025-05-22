import { Injectable, Logger } from '@nestjs/common';
import { Command } from 'nestjs-command';
import { UsersService } from '../users/users.service';
import { ProductsService } from '../products/products.service';
import { UserRole } from '../users/schemas/user.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SeedService {
    private readonly logger = new Logger(SeedService.name);

    constructor(
        private readonly usersService: UsersService,
        private readonly productsService: ProductsService,
    ) { }

    @Command({
        command: 'seed:all',
        describe: 'Seed the database with initial data',
    })
    async seedAll(): Promise<void> {
        await this.seedUsers();
        await this.seedProducts();
        this.logger.log('All seed data has been created!');
    }

    @Command({
        command: 'seed:users',
        describe: 'Seed the database with users',
    })
    async seedUsers(): Promise<void> {
        this.logger.log('Seeding users...');

        // Check if admin exists first to avoid duplication
        const adminExists = await this.usersService.findByEmail('admin@example.com');
        if (!adminExists) {
            await this.usersService.create({
                name: 'Admin User',
                email: 'admin@example.com',
                password: 'Admin123!',
                role: UserRole.ADMIN,
            });
            this.logger.log('Admin user created');
        } else {
            this.logger.log('Admin user already exists');
        }

        // Check if customer exists first
        const customerExists = await this.usersService.findByEmail('customer@example.com');
        if (!customerExists) {
            await this.usersService.create({
                name: 'Test Customer',
                email: 'customer@example.com',
                password: 'Customer123!',
                role: UserRole.CUSTOMER,
            });
            this.logger.log('Customer user created');
        } else {
            this.logger.log('Customer user already exists');
        }
    }

    @Command({
        command: 'seed:products',
        describe: 'Seed the database with products',
    })
    async seedProducts(): Promise<void> {
        this.logger.log('Seeding products...');

        // Sample products
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
            // Simple check to avoid duplication by name
            const existingProducts = await this.productsService.findAll({ name: product.name });
            if (!existingProducts || existingProducts.length === 0) {
                await this.productsService.create(product);
                this.logger.log(`Created product: ${product.name}`);
            } else {
                this.logger.log(`Product ${product.name} already exists`);
            }
        }
    }
}
