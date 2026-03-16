/*
 * eslint-disable aplicado neste arquivo intencionalmente.
 *
 * O Prisma 7 gera o client.ts com `@ts-nocheck` no topo (código interno deles),
 * o que faz o TypeScript tratar todos os exports como `any`, incluindo os tipos
 * dos models e namespaces. Não é possível usar esses tipos sem contaminação.
 * A solução é definir os tipos manualmente aqui e exportá-los para o restante
 * do projeto — o eslint-disable fica contido apenas neste arquivo.
 */
/* eslint-disable
  @typescript-eslint/no-unsafe-assignment,
  @typescript-eslint/no-unsafe-call,
  @typescript-eslint/no-unsafe-member-access
*/
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

// ─── Tipos manuais (espelham o schema.prisma) ─────────────────────────────────
// Necessário porque o client gerado usa @ts-nocheck e exporta tudo como any.
// Atualize aqui sempre que alterar os models no schema.

export interface UserRecord {
  id: string;
  email: string;
  name: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserCreateInput {
  email: string;
  name: string;
  password: string;
}

export interface UserUpdateInput {
  email?: string;
  name?: string;
  password?: string;
}

export interface UserWhereUniqueInput {
  id?: string;
  email?: string;
}

// ─── Interface tipada do banco ────────────────────────────────────────────────

export interface PrismaDb {
  user: {
    findUnique: (args: {
      where: UserWhereUniqueInput;
    }) => Promise<UserRecord | null>;
    findMany: (args?: { where?: Partial<UserRecord> }) => Promise<UserRecord[]>;
    create: (args: { data: UserCreateInput }) => Promise<UserRecord>;
    update: (args: {
      where: UserWhereUniqueInput;
      data: UserUpdateInput;
    }) => Promise<UserRecord>;
    delete: (args: { where: UserWhereUniqueInput }) => Promise<UserRecord>;
  };
  // Adicione outros models aqui conforme o schema crescer
}

// ─── Service ──────────────────────────────────────────────────────────────────

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
  private readonly client: any;

  constructor() {
    const adapter = new PrismaPg({
      connectionString: process.env['DATABASE_URL']!,
    });
    this.client = new (PrismaClient as any)({ adapter });
  }

  get db(): PrismaDb {
    return this.client as PrismaDb;
  }

  async onModuleInit(): Promise<void> {
    await this.client.$connect();
  }

  async onModuleDestroy(): Promise<void> {
    await this.client.$disconnect();
  }
}
