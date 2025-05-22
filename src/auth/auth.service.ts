import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { RegisterDto } from './dto/register.dto';
import { User } from '../users/schemas/user.schema';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
    ) { }

    async validateUser(email: string, password: string): Promise<any> {
        const user = await this.usersService.findByEmail(email);

        if (!user) {
            return null;
        }

        const isPasswordValid = await user.comparePassword(password);

        if (!isPasswordValid) {
            return null;
        }

        // Don't return the password
        const { password: _, ...result } = user.toObject();
        return result;
    }

    async login(user: any) {
        const payload: JwtPayload = {
            sub: user._id || user.id,
            email: user.email,
            role: user.role,
        };

        return {
            user,
            access_token: this.jwtService.sign(payload),
        };
    }

    async register(registerDto: RegisterDto): Promise<User> {
        const user = await this.usersService.create({
            ...registerDto,
        });
        return user;
    }
}