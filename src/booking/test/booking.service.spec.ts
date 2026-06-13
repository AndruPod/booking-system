import { Test, TestingModule } from '@nestjs/testing';
import { BookingService } from '../booking.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Booking } from '../entities/booking.entity';
import { Apartment } from '../../apartments/entities/apartments.entity';
import { ApartmentsService } from '../../apartments/apartments.service';
import { Repository } from 'typeorm';
import { BadRequestException } from '@nestjs/common';

describe('BookingService', () => {
    let service: BookingService;
    let bookingRepository: Repository<Booking>;

    const mockBookingRepository = {
        findOneBy: jest.fn(),
        create: jest.fn(),
        save: jest.fn(),
        delete: jest.fn(),
    };

    const mockApartmentRepository = {};
    const mockApartmentsService = {};

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                BookingService,
                {
                    provide: getRepositoryToken(Booking),
                    useValue: mockBookingRepository,
                },
                {
                    provide: getRepositoryToken(Apartment),
                    useValue: mockApartmentRepository,
                },
                {
                    provide: ApartmentsService,
                    useValue: mockApartmentsService,
                },
            ],
        }).compile();

        service = module.get<BookingService>(BookingService);
        bookingRepository = module.get<Repository<Booking>>(getRepositoryToken(Booking));
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('book', () => {
        it('should throw BadRequestException if user already has a booking for this apartment', async () => {
            const dates = { start_date: '2026-07-01', end_date: '2026-07-10' };
            const appId = 5;
            const userId = 1;

            mockBookingRepository.findOneBy.mockResolvedValue({
                apartment_id: appId,
                user_id: userId,
                end_date: new Date('2026-07-05'),
            });

            await expect(service.book(dates, appId, userId)).rejects.toThrow(
                new BadRequestException("You already have a booking"),
            );
        });

        it('should throw BadRequestException if apartment is already booked by someone else for overlapping dates', async () => {
            const dates = { start_date: '2026-07-01', end_date: '2026-07-10' };
            const appId = 5;
            const userId = 1;

            mockBookingRepository.findOneBy.mockResolvedValue({
                apartment_id: appId,
                user_id: 99,
                end_date: new Date('2026-07-05'),
            });

            await expect(service.book(dates, appId, userId)).rejects.toThrow(
                new BadRequestException("Apartment already booked"),
            );
        });

        it('should successfully create and save a booking if apartment is available', async () => {
            const dates = { start_date: '2026-07-01', end_date: '2026-07-10' };
            const appId = 5;
            const userId = 1;

            mockBookingRepository.findOneBy.mockResolvedValue(null);

            const mockBookingInstance = {
                user_id: userId,
                apartment_id: appId,
                start_date: new Date(dates.start_date),
                end_date: new Date(dates.end_date),
            };

            mockBookingRepository.create.mockReturnValue(mockBookingInstance);
            mockBookingRepository.save.mockResolvedValue({ id: 123, ...mockBookingInstance });

            const result = await service.book(dates, appId, userId);

            expect(bookingRepository.findOneBy).toHaveBeenCalledWith({ apartment_id: appId });
            expect(bookingRepository.create).toHaveBeenCalled();
            expect(bookingRepository.save).toHaveBeenCalledWith(mockBookingInstance);
            expect(result).toHaveProperty('id', 123);
        });
    });

    describe('cancel', () => {
        it('should throw BadRequestException if id is not provided', async () => {
            await expect(service.cancel(undefined as any)).rejects.toThrow(
                new BadRequestException("ID is not provided"),
            );
        });

        it('should throw BadRequestException if booking candidate does not exist', async () => {
            mockBookingRepository.findOneBy.mockResolvedValue(null);

            await expect(service.cancel(42)).rejects.toThrow(
                new BadRequestException("It is already available"),
            );
        });

        it('should successfully delete booking and return true', async () => {
            mockBookingRepository.findOneBy.mockResolvedValue({ id: 10, user_id: 42 });
            mockBookingRepository.delete.mockResolvedValue({ affected: 1 });

            const result = await service.cancel(42);

            expect(bookingRepository.findOneBy).toHaveBeenCalledWith({ user_id: 42 });
            expect(bookingRepository.delete).toHaveBeenCalledWith(10);
            expect(result).toBe(true);
        });
    });
});