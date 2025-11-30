import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class User {
    @ApiProperty({example: '10', description: 'User ID'})
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty({example: 'email@example.com', description: 'User email'})
    @Column()
    email: string;

    @ApiProperty({example: '12345678', description: 'User password'})
    @Column()
    password: string;

    @ApiProperty({example: 'ADMIN', description: 'User role'})
    @Column({default: "USER"})
    role: string;
}