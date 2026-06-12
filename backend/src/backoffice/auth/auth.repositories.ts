import { Injectable } from '@nestjs/common';
// import { LoginDto } from './dto/login-auth.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ResponseAuthDto } from './dto/response-auth.dto';
@Injectable()
export class AuthRepositories {
  constructor(private prisma: PrismaService) {}
  async findByUserName(userName: string): Promise<ResponseAuthDto | null> {
    const admin = await this.prisma.admin.findFirst({
      where: {
        userName: String(userName),
        deletedAt: null,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        userName: true,
        password: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        deletedAt: true,
      },
    });
    return admin;
  }

  async findById(id: number): Promise<ResponseAuthDto | null> {
    const admin = await this.prisma.admin.findFirst({
      where: {
        id: Number(id),
        deletedAt: null,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        userName: true,
        password: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        deletedAt: true,
      },
    });
    return admin;
  }
}
