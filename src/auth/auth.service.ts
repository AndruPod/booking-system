import { BadRequestException, Injectable } from "@nestjs/common";
import { SignUpDto } from "./dto/sign-up.dto";
import { User } from "../users/users.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import * as bcrypt from "bcrypt";
import { JwtService } from "@nestjs/jwt";
import { LoginDto } from "./dto/login.dto";

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly jwtService: JwtService,
    ) {}

    private async sign({ id, email, role }): Promise<{ access_token: string }> {
        const payload = { id, email, role };
        return {
            access_token: await this.jwtService.signAsync(payload),
        };
    }

    async login({ email, password }: LoginDto): Promise<{ access_token: string }> {
        const candidate = await this.userRepository.findOneBy({ email });
        if (!candidate) throw new BadRequestException("User does not exist");

        const isMatch = await bcrypt.compare(password, candidate.password);
        if (!isMatch) throw new BadRequestException("Passwords do not match");

        return this.sign(candidate);
    }

    async signUp({ email, password, confirmPassword, role }: SignUpDto): Promise<{ access_token: string }> {
        const candidate = await this.userRepository.findOneBy({ email });
        if (candidate)
            throw new BadRequestException("User already exists");

        if (password !== confirmPassword)
            throw new BadRequestException("Passwords do not match");

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = this.userRepository.create({
            email,
            password: hashedPassword,
            role: role,
        });

        const userData = await this.userRepository.save(user);
        const payload = { id: userData.id, email: userData.email, role: userData.role };
        return {
            access_token: await this.jwtService.signAsync(payload),
        };
    }
}
