import { Injectable } from '@nestjs/common';
// import { RegisterDto } from './dto/register.dto';
// import { LoginDto } from './dto/login.dto';
// import { AuthResponseDto } from './dto/auth-response.dto';

@Injectable()
export class AuthService {
  getHello(): string {
    return 'auth service';
  }
}
