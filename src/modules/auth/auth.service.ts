import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as argon2 from 'argon2';

@Injectable()
export class AuthService {
  constructor(private configService: ConfigService) {}

  // Metodo para obter o pepper
  private getPepper(): string {
    return this.configService.getOrThrow<string>('PASSWORD_PEPPER');
  }

  // Hash da senha com pepper
  private async hashPassword(password: string): Promise<string> {
    const pepper = this.getPepper();
    // Concatena a senha com o pepper antes de hashing
    const pepperedPassword = password + pepper;
    // Opções recomendadas para Argon2id
    return argon2.hash(pepperedPassword, {
      type: argon2.argon2id,
      memoryCost: 2 ** 16, // 64 MB
      timeCost: 3,
      parallelism: 1,
    });
  }

  // Verificar
  private async verifyPassword(
    hash: string,
    password: string,
  ): Promise<boolean> {
    const pepper = this.getPepper();
    const pepperedPassword = password + pepper;
    return argon2.verify(hash, pepperedPassword);
  }

  // Registro
  // Gerar token JWT
  // login
  // Método usado pelo JwtStrategy para validar o usuário

  getHello(): string {
    return 'auth service';
  }
}
