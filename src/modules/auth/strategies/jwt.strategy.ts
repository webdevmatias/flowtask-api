import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';

// Tipo do payload JWT — ajuste os campos conforme o que você assina no login
interface JwtPayload {
  sub: string;
  email: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    private authService: AuthService,
  ) {
    const secret = configService.get<string>('JWT_SECRET');
    if (!secret) {
      throw new Error('JWT_SECRET não definido nas variáveis de ambiente');
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret, // agora é string garantida, sem undefined
    });
  }

  async validate(payload: JwtPayload): Promise<unknown> {
    // Renomeie o método no AuthService para findUserById ou similar
    const user = await this.authService.findUserById(payload.sub);
    if (!user) {
      throw new UnauthorizedException(
        'Usuário não encontrado ou token inválido',
      );
    }
    return user;
  }
}
