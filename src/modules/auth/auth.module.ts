import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaModule } from '../../database/prisma.module';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    // PrismaModule para acesso ao banco de dados
    PrismaModule,

    // Configuração assíncrona do JwtModule para usar variáveis de ambiente
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: { expiresIn: configService.get('JWT_EXPIRES_IN') || '7d' },
      }),
    }),

    // ConfigModule se não for global (caso já seja global, pode remover)
    ConfigModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy, // Adicione a estratégia JWT aqui
  ],
  exports: [AuthService], // Exporte o AuthService se for usado em outros módulos
})
export class AuthModule {}
