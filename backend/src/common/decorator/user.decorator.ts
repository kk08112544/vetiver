import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Admin } from '@prisma/client';

interface AuthenticatedRequest {
  admin: Admin;
}

interface CurrentAdmin {
  id: string;
  // ถ้ามี property อื่นก็ใส่เพิ่มได้
}

export const CurrentAdmin = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): Admin => {
    const request = ctx.switchToHttp().getRequest<AuthenticatedRequest>();
    return request.admin;
  },
);
