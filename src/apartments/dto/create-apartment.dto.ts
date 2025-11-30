import { IsNotEmpty, IsNumber, IsString } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class CreateApartmentDto {
    @ApiProperty({ example: "Big Flat", description: 'An Apartment name' })
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty({ example: 3, description: 'An Apartment rooms number' })
    @IsNotEmpty()
    @IsNumber()
    roomsNum: number;
}
