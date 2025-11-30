import { Body, Controller, Delete, Param, Post, UseGuards } from '@nestjs/common';
import { BookingService } from "./booking.service";
import { Booking } from "./booking.entity";
import { BookingDto } from './booking.dto';
import { AccessGuard } from '../common/guards/access.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { User } from '../common/decorators/user.decorator';
import { ApiBearerAuth, ApiHeader, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller("booking")
export class BookingController {
    constructor(private readonly bookingService: BookingService) {}

    @ApiHeader({
        name: 'Authorization Bearer',
        description: 'User ID got from the header',
        required: true,
    })
    @ApiOperation({ summary: "Book an apartment" })
    @ApiResponse({status: 200, type: Booking})
    @Post("book/:id")
    @Roles("USER")
    @UseGuards(AccessGuard)
    async book(
        @Body() body: BookingDto,
        @Param("appId") appId: number,
        @User("id") userId: number
    ): Promise<Booking> {
        return await this.bookingService.book(body, appId, userId);
    }

    @ApiHeader({
        name: 'Authorization Bearer',
        description: 'User ID got from the header',
        required: true,
    })
    @ApiOperation({ summary: "Delete booking" })
    @ApiResponse({status: 200, type: Boolean})
    @Delete("delete")
    @Roles("USER")
    @UseGuards(AccessGuard)
    async cancel(@User("id") userId: number): Promise<Boolean> {
        return await this.bookingService.cancel(userId);
    }

}
