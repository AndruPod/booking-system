import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignUpDto {
    @ApiProperty({example: 'email@example.com', description: 'User email'})
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({example: '12345678', description: 'User password'})
    @IsString()
    @IsNotEmpty()
    password: string;

    @ApiProperty({example: '12345678', description: 'User confirm password'})
    @IsString()
    @IsNotEmpty()
    confirmPassword: string;

    @ApiProperty({example: 'USER', description: 'User role'})
    @IsString()
    @IsOptional()
    role: string
}
