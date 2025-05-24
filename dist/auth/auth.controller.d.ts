import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(registerDto: RegisterDto): Promise<import("../users/schemas/user.schema").User>;
    login(req: any, _loginDto: LoginDto): Promise<{
        user: {
            _id: any;
            email: string;
            role: import("../users/schemas/user.schema").UserRole;
            name: string;
        };
        access_token: string;
    }>;
    getProfile(req: any): any;
}
