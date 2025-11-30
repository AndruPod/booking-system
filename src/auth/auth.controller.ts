import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { SignUpDto } from './dto/sign-up.dto';
import { LoginDto } from './dto/login.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthResponseDto } from './dto/auth-response';

@Controller("auth")
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @ApiOperation({ summary: "Log In" })
    @ApiResponse({ status: 200, type: AuthResponseDto })
    @Post("login")
    login(@Body() body: LoginDto): Promise<{ access_token: string }> {
        return this.authService.login(body);
    }

    @ApiOperation({ summary: "Sign Up" })
    @ApiResponse({ status: 200, type: AuthResponseDto })
    @Post("sign-up")
    signUp(@Body() body: SignUpDto): Promise<{ access_token: string }> {
        return this.authService.signUp(body);
    }
}