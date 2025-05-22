import { UserRole } from '../../users/schemas/user.schema';

export interface JwtPayload {
    sub: string; // userId
    email: string;
    role: UserRole;
}