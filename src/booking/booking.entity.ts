import { Column, Entity, ForeignKey, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../users/users.entity';
import { Apartment } from '../apartments/apartments.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity("booking")
export class Booking {
    @ApiProperty({example: 1, description: 'Booking ID'})
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty({example: 2, description: 'User ID'})
    @Column()
    user_id: number;

    @ManyToOne(() => User)
    user: User;

    @ApiProperty({example: 3, description: 'Apartment ID'})
    @Column()
    apartment_id: number;

    @ManyToOne(() => Apartment, apartment => apartment.bookings)
    apartment: Apartment;

    @ApiProperty({example: "2025-10-06", description: 'Booking start date'})
    @Column()
    start_date: Date;

    @ApiProperty({example: "2025-10-10", description: 'Booking end date'})
    @Column()
    end_date: Date;
}