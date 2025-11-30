import { ApiProperty } from "@nestjs/swagger";
import { IsDateString } from 'class-validator';


export class BookingDto {
    @ApiProperty({example: "2025-10-06", description: "Start date of booking"})
    @IsDateString()
    start_date: string

    @ApiProperty({example: "2025-10-10", description: "End date of booking"})
    @IsDateString()
    end_date: string

}