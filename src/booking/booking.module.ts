import { Module } from "@nestjs/common";
import { BookingService } from "./booking.service";
import { BookingController } from "./booking.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Booking } from "./booking.entity";
import { Apartment } from "../apartments/apartments.entity";
import { ApartmentsService } from "../apartments/apartments.service";
import { AuthModule } from "../auth/auth.module";

@Module({
    imports: [AuthModule, TypeOrmModule.forFeature([Booking, Apartment])],
    controllers: [BookingController],
    providers: [BookingService, ApartmentsService],
    exports: [BookingService, TypeOrmModule],
})
export class BookingModule {}
