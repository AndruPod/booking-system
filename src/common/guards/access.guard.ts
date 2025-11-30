import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { Roles, ROLES_KEY } from '../decorators/roles.decorator';
import { jwtDecode } from 'jwt-decode';
import { JwtService } from '@nestjs/jwt';

interface JwtPayloadWithRole {
    id: number;
    email: string;
    role: string;
    iat: number;
    exp: number;
}


@Injectable()
export class AccessGuard implements CanActivate {

    constructor(
        private reflector: Reflector,
        private readonly jwtService: JwtService,
    ) {}

    canActivate(
        context: ExecutionContext
    ): boolean | Promise<boolean> | Observable<boolean> {
        const roles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        if(!roles)
            return true;

        const request = context.switchToHttp().getRequest();
        const authHeader = request.headers.authorization;

        if(!authHeader)
            throw new UnauthorizedException("You are not logged in.");

        const token = authHeader.split(' ')[1];
        const decodedToken = this.jwtService.verify(token);
        request.user = decodedToken;
        return roles.includes(decodedToken.role);
    }
}