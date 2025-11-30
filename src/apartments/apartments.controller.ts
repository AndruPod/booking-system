import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApartmentsService } from "./apartments.service";
import { Apartment } from "./apartments.entity";
import { CreateApartmentDto } from "./dto/create-apartment.dto";
import { AccessGuard } from '../common/guards/access.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateApartmentResponse } from './dto/create-apartment-response.dto';

@Controller("apartments")
export class ApartmentsController {
    constructor(private readonly apartmentsService: ApartmentsService) {}

    @ApiOperation({ summary: "Get all apartments" })
    @ApiResponse({status: 200, type: [Apartment]})
    @Get("get-all")
    getAll(): Promise<Apartment[]> {
        return this.apartmentsService.getAll();
    }

    @ApiOperation({ summary: "Get one apartment by ID" })
    @ApiResponse({status: 200, type: Apartment})
    @Get("get-one/:id")
    getOne(@Param("id") id: number): Promise<Apartment> {
        return this.apartmentsService.getOne(id);
    }

    @ApiOperation({ summary: "Create an apartment" })
    @ApiResponse({status: 200, type: CreateApartmentResponse})
    @Post("create")
    @Roles("MANAGER")
    @UseGuards(AccessGuard)
    create(@Body() dto: CreateApartmentDto): Promise<Apartment> {
        return this.apartmentsService.create(dto);
    }

    @ApiOperation({ summary: "Delete an apartment by ID" })
    @ApiResponse({status: 200, type: Boolean})
    @Delete("delete/:id")
    @Roles("MANAGER")
    @UseGuards(AccessGuard)
    delete(@Param("id") id: number): Promise<Boolean> {
        return this.apartmentsService.delete(id);
    }
}
