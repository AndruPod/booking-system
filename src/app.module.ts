import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { UsersModule } from "./users/users.module";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { AuthModule } from "./auth/auth.module";
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/users.entity';
import { ApartmentsModule } from './apartments/apartments.module';
import { Apartment } from './apartments/apartments.entity';
import { BookingModule } from './booking/booking.module';
import { Booking } from './booking/booking.entity';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                type: 'postgres',
                host: configService.getOrThrow<string>('POSTGRES_HOST'),
                port: configService.getOrThrow<number>('POSTGRES_PORT'),
                username: configService.getOrThrow<string>('POSTGRES_USER'),
                password: configService.getOrThrow<string>('POSTGRES_PASSWORD'),
                database: configService.getOrThrow<string>('POSTGRES_DB'),
                entities: [User, Apartment, Booking],
                synchronize: true,
                autoLoadEntities: true,
            }),
        }),
        UsersModule,
        AuthModule,
        ApartmentsModule,
        BookingModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
