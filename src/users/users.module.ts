import { Module } from "@nestjs/common";
import { UsersService } from "./users.service";
import { UsersController } from "./users.controller";
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users.entity';
import { AuthModule } from '../auth/auth.module';
import { AccessGuard } from '../common/guards/access.guard';

@Module({
    imports: [AuthModule, TypeOrmModule.forFeature([User])],
    controllers: [UsersController],
    providers: [UsersService, AccessGuard],
    exports: [UsersService, TypeOrmModule],
})
export class UsersModule {}
