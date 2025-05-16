import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';
import { User, UserRole } from '../user/entities/user.entity';
import { LoginDto } from './dto/login.dto';

export interface JwtPayload {
  id: string;
  email: string;
  role: UserRole;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    // Find user with password (which is normally hidden by select: false)
    const user = await this.userRepository.findOne({
      where: { email },
      select: { id: true, email: true, password: true, role: true }
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check if password matches
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate JWT
    return {
      user: {
        id: user.id,
        email: user.email,
        role: user.role
      },
      token: this.getJwtToken({
        id: user.id,
        email: user.email,
        role: user.role
      })
    };
  }

  private getJwtToken(payload: JwtPayload): string {
    return this.jwtService.sign(payload);
  }
}
