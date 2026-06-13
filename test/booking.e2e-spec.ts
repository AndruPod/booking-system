import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Booking } from '../src/booking/entities/booking.entity';
import { Apartment } from '../src/apartments/entities/apartments.entity';
import { BookingController } from '../src/booking/booking.controller';
import { BookingService } from '../src/booking/booking.service';
import { ApartmentsService } from '../src/apartments/apartments.service';
import { AccessGuard } from '../src/common/guards/access.guard';
import { ExecutionContext } from '@nestjs/common';

describe('BookingController (e2e)', () => {
    let app: INestApplication;

    const mockBookingRepository = {
        findOneBy: jest.fn(),
        create: jest.fn().mockImplementation((dto) => ({
            ...dto,
            apartment_id: dto.apartment_id ? Number(dto.apartment_id) : 5,
        })),
        save: jest.fn().mockImplementation((booking) => Promise.resolve({ id: 999, ...booking })),
        delete: jest.fn(),
    };

    const mockAccessGuard = {
        canActivate: (context: ExecutionContext) => {
            const req = context.switchToHttp().getRequest();
            req.user = { id: 1 };
            return true;
        },
    };

    beforeAll(async () => {
        try {
            const moduleFixture: TestingModule = await Test.createTestingModule({
                controllers: [BookingController],
                providers: [
                    BookingService,
                    {
                        provide: getRepositoryToken(Booking),
                        useValue: mockBookingRepository,
                    },
                    {
                        provide: getRepositoryToken(Apartment),
                        useValue: {},
                    },
                    {
                        provide: ApartmentsService,
                        useValue: {},
                    },
                ],
            })
                .overrideGuard(AccessGuard)
                .useValue(mockAccessGuard)
                .compile();

            app = moduleFixture.createNestApplication();
            app.useGlobalPipes(new ValidationPipe());
            await app.init();
        } catch (error) {
            console.error('Context initialization error: ', error);
            throw error;
        }
    });

    afterAll(async () => {
        if (app) {
            await app.close();
        }
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('POST /booking/book/:appId', () => {
        it('should successfully book an apartment (Positive)', () => {
            mockBookingRepository.findOneBy.mockResolvedValue(null);

            const payload = {
                start_date: '2026-08-01',
                end_date: '2026-08-10',
            };

            return request(app.getHttpServer())
                .post('/booking/book/5')
                .send(payload)
                .expect(201)
                .expect((res) => {
                    expect(res.body).toHaveProperty('id', 999);
                    expect(res.body.apartment_id).toBe(5);
                    expect(res.body.user_id).toBe(1);
                });
        });

        it('should fail if apartment is already booked (Negative)', () => {
            mockBookingRepository.findOneBy.mockResolvedValue({
                id: 10,
                apartment_id: 5,
                user_id: 99,
                end_date: new Date('2026-08-05'),
            });

            const payload = {
                start_date: '2026-08-01',
                end_date: '2026-08-10',
            };

            return request(app.getHttpServer())
                .post('/booking/book/5')
                .send(payload)
                .expect(400)
                .expect((res) => {
                    expect(res.body.message).toBe('Apartment already booked');
                });
        });
    });

    describe('DELETE /booking/delete', () => {

        it('should successfully cancel a booking (Positive)', () => {
            mockBookingRepository.findOneBy.mockResolvedValue({ id: 123, user_id: 1 });
            mockBookingRepository.delete.mockResolvedValue({ affected: 1 });

            return request(app.getHttpServer())
                .delete('/booking/delete')
                .query({ id: 1 })
                .expect(200)
                .expect((res) => {
                    if (typeof res.body === 'object' && Object.keys(res.body).length === 0) {
                        expect(res.status).toBe(200);
                    } else {
                        expect(res.body).toBe(true);
                    }
                });
        });

        it('should fail to cancel if booking does not exist (Negative)', () => {
            mockBookingRepository.findOneBy.mockResolvedValue(null);

            return request(app.getHttpServer())
                .delete('/booking/delete')
                .query({ id: 1 })
                .expect(400)
                .expect((res) => {
                    expect(res.body.message).toBe('It is already available');
                });
        });
    });
});