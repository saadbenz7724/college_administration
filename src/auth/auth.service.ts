import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt'
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { Repository } from 'typeorm';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        @InjectRepository(User) private userRepo: Repository<User>,
    ){}

    async register(dto: RegisterDto){
        const existing = await this.userRepo.findOne({where: {email: dto.email}});
        if(existing) throw new BadRequestException('User already exist');

        const hash = await bcrypt.hash(dto.password, 10);
        const user = this.userRepo.create({...dto, password: hash})
        await this.userRepo.save(user);
        return {message: 'User Register successfully'};
    }

    async login(dto: LoginDto){
        const user = await this.userRepo.findOne({where: {email: dto.email}});
        if(!user) throw new UnauthorizedException('Invalid Credentials');
        const isMatch = await bcrypt.compare(dto.password, user.password);
        if(!isMatch) throw new UnauthorizedException('Invalid Credentials');
        const payload = {id: user.id, email: user.email, role: user.role};
        const token = this.jwtService.sign(payload);

        return { token, user };
    }
}
