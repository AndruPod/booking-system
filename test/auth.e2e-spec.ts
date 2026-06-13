import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe, BadRequestException } from '@nestjs/common';
import request from 'supertest';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../src/users/entities/users.entity';
import { AuthController } from '../src/auth/auth.controller';
import { AuthService } from '../src/auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

describe('AuthController (e2e)', () => {
    let app: INestApplication;

    const mockUserRepository = {
        findOneBy: jest.fn(),
        create: jest.fn().mockImplementation((dto) => dto),
        save: jest.fn().mockImplementation((user) => Promise.resolve({ id: 1, ...user })),
    };

    const mockJwtService = {
        signAsync: jest.fn().mockResolvedValue('mock_token'),
    };

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            controllers: [AuthController],
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

        app = moduleFixture.createNestApplication();
        app.useGlobalPipes(new ValidationPipe());
        await app.init();
    });

    afterAll(async () => {
        if (app) {
            await app.close();
        }
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('POST /auth/sign-up', () => {
        it('should successfully register a new user and return an access token', () => {
            mockUserRepository.findOneBy.mockResolvedValue(null);

            const payload = {
                email: 'newuser@test.com',
                password: 'password123',
                confirmPassword: 'password123',
                role: 'USER',
            };

            return request(app.getHttpServer())
                .post('/auth/sign-up')
                .send(payload)
                .expect(201)
                .expect((res) => {
                    expect(res.body).toHaveProperty('access_token', 'mock_token');
                });
        });

        it('should return 400 Bad Request if passwords do not match', () => {
            mockUserRepository.findOneBy.mockResolvedValue(null);

            const invalidPayload = {
                email: 'newuser@test.com',
                password: 'password123',
                confirmPassword: 'different_password',
                role: 'USER',
            };

            return request(app.getHttpServer())
                .post('/auth/sign-up')
                .send(invalidPayload)
                .expect(400)
                .expect((res) => {
                    expect(res.body.message).toBe('Passwords do not match');
                });
        });
    });

    describe('POST /auth/login', () => {
        it('should successfully login and return an access token', async () => {
            const hashedPassword = await bcrypt.hash('password123', 10);

            mockUserRepository.findOneBy.mockResolvedValue({
                id: 1,
                email: 'existing@test.com',
                password: hashedPassword,
                role: 'USER',
            });

            const payload = {
                email: 'existing@test.com',
                password: 'password123',
            };

            return request(app.getHttpServer())
                .post('/auth/login')
                .send(payload)
                .expect(201)
                .expect((res) => {
                    expect(res.body).toHaveProperty('access_token', 'mock_token');
                });
        });
    });
});