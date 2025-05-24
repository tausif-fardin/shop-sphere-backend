import { UsersService } from '../users/users.service';
import { ProductsService } from '../products/products.service';
export declare class SeedService {
    private readonly usersService;
    private readonly productsService;
    private readonly logger;
    constructor(usersService: UsersService, productsService: ProductsService);
    seedAll(): Promise<void>;
    seedUsers(): Promise<void>;
    seedProducts(): Promise<void>;
}
