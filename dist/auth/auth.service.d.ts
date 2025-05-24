import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { User } from '../users/schemas/user.schema';
type UserWithMethods = User & {
    comparePassword(password: string): Promise<boolean>;
    toObject(): Record<string, any>;
};
export declare class AuthService {
    private readonly usersService;
    private readonly jwtService;
    constructor(usersService: UsersService, jwtService: JwtService);
    validateUser(email: string, password: string): Promise<Partial<User> | null>;
    login(user: UserWithMethods): {
        user: {
            _id: any;
            email: string;
            role: import("../users/schemas/user.schema").UserRole;
            name: string;
        };
        access_token: string;
    };
    register(registerDto: RegisterDto): Promise<User>;
}
export {};
