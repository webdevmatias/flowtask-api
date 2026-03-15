import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(private configService: ConfigService) {}

  private getPepper(): string {
    return this.configService.getOrThrow<string>('PASSWORD_PEPPER');
  }

  getHello(): string {
    return 'auth service';
  }
}
