import { Controller, Delete, Get, NotFoundException, Param, UseGuards } from '@nestjs/common';
import { UsersService } from "./users.service";
import { User } from './users.entity';
import { Roles } from '../common/decorators/roles.decorator';
import { AccessGuard } from '../common/guards/access.guard';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller("users")
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @ApiOperation({ summary: "Get all users" })
    @ApiResponse({status: 200, type: [User]})
    @Get("get-all")
    @Roles("ADMIN")
    @UseGuards(AccessGuard)
    getAll(): Promise<User[]> {
        return this.usersService.getAll();
    }

    @ApiOperation({ summary: "Get one user by ID" })
    @ApiResponse({status: 200, type: User})
    @Get("get-one/:id")
    @Roles("ADMIN")
    @UseGuards(AccessGuard)
    getOne(@Param("id") id: number): Promise<User> {
        return this.usersService.getOneById(id);
    }

    @ApiOperation({ summary: "Delete a user by ID" })
    @ApiResponse({status: 200, type: Boolean})
    @Delete("delete/:id")
    @Roles("ADMIN")
    @UseGuards(AccessGuard)
    delete(@Param("id") id: number): Promise<Boolean> {
        return this.usersService.delete(id);
    }

}
