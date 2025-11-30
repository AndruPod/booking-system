import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from '@nestjs/typeorm';
import { Booking } from './booking.entity';
import { Apartment } from '../apartments/apartments.entity';
import { Repository } from 'typeorm';
import { ApartmentsService } from '../apartments/apartments.service';

@Injectable()
export class BookingService {

    constructor(
        @InjectRepository(Booking)
        private bookingRepository: Repository<Booking>,
        @InjectRepository(Apartment)
        private apartmentRepository: Repository<Apartment>,
        private apartmentService: ApartmentsService,
    ) {}

    async book({start_date, end_date}, appId: number, userId: number): Promise<Booking> {
        const candidate = await this.bookingRepository.findOneBy({ apartment_id: appId });

        if(candidate)
            if(candidate.user_id === userId)
                throw new BadRequestException("You already have a booking");
            else if(new Date(start_date) <= new Date(candidate.end_date))
                throw new BadRequestException("Apartment already booked");

        const booking = this.bookingRepository.create({
            user_id: userId,
            apartment_id: appId,
            start_date: new Date(start_date),
            end_date: new Date(end_date),
        });

        return await this.bookingRepository.save(booking);
    }

    async cancel(id: number): Promise<Boolean> {
        if(!id)
            throw new BadRequestException("ID is not provided");

        const candidate = await this.bookingRepository.findOneBy({user_id: id});
        if(!candidate)
            throw new BadRequestException("It is already available");

        const isDeleted = await this.bookingRepository.delete(candidate.id);
        return !!(isDeleted.affected && isDeleted.affected > 0);
    }

}
