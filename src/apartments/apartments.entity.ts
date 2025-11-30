import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Booking } from '../booking/booking.entity';
import { ApiProperty } from "@nestjs/swagger";


@Entity()
export class Apartment {
    @ApiProperty({ example: 1, description: 'An Apartment ID' })
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty({ example: "Simple Flat", description: 'An Apartment name' })
    @Column()
    name: string;

    @ApiProperty({ example: 2, description: 'An Apartment rooms number' })
    @Column()
    roomsNum: number;

    @ApiProperty({ example: [{
            id: 1,
            user_id: 2,
            apartment_id: 3,
            start_date: "2025-10-06",
            end_date: "2025-10-10",
        }], description: 'Booking apartment info' })
    @OneToMany(() => Booking, booking => booking.apartment)
    bookings: Booking[];
}