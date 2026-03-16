import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { PrismaService } from '../../database/prisma.service';
import type { UserRecord } from '../../database/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthResponseDto } from './dto/auth-response.dto';

interface JwtPayload {
  sub: string;
  email: string;
}

@Injectable()
export class AuthService {
  constructor(
    private configService: ConfigService,
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  // ─── Helpers privados ────────────────────────────────────────────────────────

  private getPepper(): string {
    return this.configService.getOrThrow<string>('PASSWORD_PEPPER');
  }

  private async hashPassword(password: string): Promise<string> {
    const pepper = this.getPepper();
    return argon2.hash(password + pepper, {
      type: argon2.argon2id,
      memoryCost: 2 ** 16,
      timeCost: 3,
      parallelism: 1,
    });
  }

  private async verifyPassword(
    hash: string,
    password: string,
  ): Promise<boolean> {
    const pepper = this.getPepper();
    return argon2.verify(hash, password + pepper);
  }

  private buildResponse(
    user: UserRecord,
    accessToken: string,
  ): AuthResponseDto {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      access_token: accessToken,
    };
  }

  private signToken(user: Pick<UserRecord, 'id' | 'email'>): string {
    const payload: JwtPayload = { sub: user.id, email: user.email };
    return this.jwtService.sign(payload);
  }

  // ─── Registro ────────────────────────────────────────────────────────────────

  async register(dto: RegisterDto): Promise<AuthResponseDto> {
    const existing = await this.prisma.db.user.findUnique({
      where: { email: dto.email },
    });

    if (existing) {
      throw new ConflictException('E-mail já cadastrado');
    }

    const hashedPassword = await this.hashPassword(dto.password);

    const user = await this.prisma.db.user.create({
      data: {
        email: dto.email,
        name: dto.name,
        password: hashedPassword,
      },
    });

    return this.buildResponse(user, this.signToken(user));
  }

  // ─── Login ───────────────────────────────────────────────────────────────────

  async login(dto: LoginDto): Promise<AuthResponseDto> {
    const user = await this.prisma.db.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      // Mensagem genérica para não revelar se o e-mail existe
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const valid = await this.verifyPassword(user.password, dto.password);
    if (!valid) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    return this.buildResponse(user, this.signToken(user));
  }

  // ─── Usado pelo JwtStrategy ──────────────────────────────────────────────────

  async findUserById(id: string): Promise<UserRecord | null> {
    return this.prisma.db.user.findUnique({ where: { id } });
  }
}
