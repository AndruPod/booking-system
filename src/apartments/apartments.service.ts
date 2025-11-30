import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Apartment } from './apartments.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ApartmentsService {
    constructor(
        @InjectRepository(Apartment)
        private readonly apartmentRepository: Repository<Apartment>,
    ) {}

    async getAll(): Promise<Apartment[]> {
        return await this.apartmentRepository.find();
    }

    async getOne(id: number): Promise<Apartment> {
        if(!id)
            throw new BadRequestException("ID should be provided");

        const candidate = await this.apartmentRepository.findOneBy({id});
        if(!candidate)
            throw new NotFoundException("Could not find apartment");

        return candidate;
    }

    async create({ name, roomsNum }): Promise<Apartment> {
        if(!name || !roomsNum)
            throw new BadRequestException("Name or room number is not provided");

        const apartment: Apartment = this.apartmentRepository.create({name, roomsNum});
        return await this.apartmentRepository.save(apartment);
    }

    async delete(id: number): Promise<Boolean> {
        if(!id)
            throw new BadRequestException("ID should be provided");

        const candidate = await this.apartmentRepository.findOneBy({ id });
        if(!candidate)
            throw new NotFoundException("Could not find appartment");
        
        const isDeleted = await this.apartmentRepository.delete(id);
        return !!(isDeleted.affected && isDeleted.affected > 0);
    }

}
