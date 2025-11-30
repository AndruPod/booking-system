import { ApiProperty } from '@nestjs/swagger';
import { Column, PrimaryGeneratedColumn } from 'typeorm';


export class CreateApartmentResponse {
    @ApiProperty({ example: 1, description: 'An Apartment ID' })
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty({ example: "Simple Flat", description: 'An Apartment name' })
    @Column()
    name: string;

    @ApiProperty({ example: 2, description: 'An Apartment rooms number' })
    @Column()
    roomsNum: number;
}