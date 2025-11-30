import { Injectable, NotFoundException, Param } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './users.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ) {}

    async getAll(): Promise<User[]> {
        const users = await this.userRepository.find();
        if(!users) throw new NotFoundException(`Users not found.`);
        return users;
    }

    async getOneById(id: number): Promise<User> {
        const user = await this.userRepository.findOneBy({ id });
        if(!user) throw new NotFoundException(`User with id ${id} not found.`);
        return user;
    }

    async delete(id: number): Promise<Boolean> {
        const user = await this.userRepository.findOneBy({ id });

        if(!user) throw new NotFoundException(`User with id ${id} not found.`);

        const isDeleted = await this.userRepository.delete(id);
        return !!(isDeleted.affected && isDeleted.affected > 0);
    }

}
