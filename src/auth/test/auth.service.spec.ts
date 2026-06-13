import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../../users/entities/users.entity';
import { BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from "bcrypt";

describe('AuthService', () => {
    let authService: AuthService;

    const mockUserRepository = {
        findOneBy: jest.fn(),
        create: jest.fn().mockImplementation((dto) => dto),
        save: jest.fn().mockImplementation((user) => Promise.resolve({ id: 1, ...user })),
    };

    const mockJwtService = {
        signAsync: jest.fn().mockResolvedValue('mock_token'),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                {
                    provide: getRepositoryToken(User),
                    useValue: mockUserRepository,
                },
                {
                    provide: JwtService,
                    useValue: mockJwtService,
                },
            ],
        }).compile();

        authService = module.get<AuthService>(AuthService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('signUp', () => {
        it('should throw BadRequestException if email already exists', async () => {
            const signUpDto = {
                email: 'busy@test.com',
                password: 'password123',
                confirmPassword: 'password123',
                role: 'USER'
            };

            mockUserRepository.findOneBy.mockResolvedValue({ id: 1, email: 'busy@test.com' });

            await expect(authService.signUp(signUpDto)).rejects.toThrow(
                new BadRequestException('User already exists'),
            );

            expect(mockUserRepository.save).not.toHaveBeenCalled();
        });
    });

    describe('login', () => {
        it('should successfully login and return an access token', async () => {
            const loginDto = { email: 'test@test.com', password: 'password123' };

            // We generate a real hash for 'password123' so bcrypt.compare returns true
            const hashedPassword = await bcrypt.hash('password123', 10);

            mockUserRepository.findOneBy.mockResolvedValue({
                id: 1,
                email: 'test@test.com',
                password: hashedPassword,
                role: 'USER',
            });

            const result = await authService.login(loginDto);

            expect(mockUserRepository.findOneBy).toHaveBeenCalledWith({ email: loginDto.email });
            expect(result).toHaveProperty('access_token', 'mock_token');
        });

        it('should throw BadRequestException if user does not exist', async () => {
            const loginDto = { email: 'wrong@test.com', password: 'password123' };

            mockUserRepository.findOneBy.mockResolvedValue(null);

            await expect(authService.login(loginDto)).rejects.toThrow(
                new BadRequestException('User does not exist'),
            );
        });

        it('should throw BadRequestException if passwords do not match', async () => {
            const loginDto = { email: 'test@test.com', password: 'wrong_password' };
            const hashedPassword = await bcrypt.hash('correct_password', 10);

            mockUserRepository.findOneBy.mockResolvedValue({
                id: 1,
                email: 'test@test.com',
                password: hashedPassword,
                role: 'USER',
            });

            await expect(authService.login(loginDto)).rejects.toThrow(
                new BadRequestException('Passwords do not match'),
            );
        });
    });

});