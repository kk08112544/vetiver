import { Injectable } from '@nestjs/common';
import { LoginDto } from './dto/login-auth.dto';
import { AuthRepositories } from './auth.repositories';
import { ExceptionService } from 'src/common/exception/exception.service';
import { JwtService } from '@nestjs/jwt';
import { comparePassword } from 'src/common/utils/bcrypt.util';
import { generateTokens, verifyRefreshToken } from 'src/common/utils/jwt.util';
import { RenewTokenDto } from './dto/renew-auth.dto';
import { MESSAGE } from 'src/common/message/message';
import { toAuthResponse } from './dto/response-auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly authRepositories: AuthRepositories,
    private readonly exceptionService: ExceptionService,
    private readonly jwtService: JwtService,
  ) {}
  async login(loginDto: LoginDto) {
    // แก้ไข: ส่งเฉพาะ username ไปค้นหา (ขึ้นอยู่กับ implementation ของ repository คุณด้วยนะ)
    const admin = await this.authRepositories.findByUserName(loginDto.userName);

    if (!admin) {
      this.exceptionService.throwInvalidUserName();
    }

    const isMatches = await comparePassword(loginDto.password, admin.password);
    console.log(isMatches);
    if (!isMatches) {
      this.exceptionService.throwInvalidPassword();
    }

    const tokens = generateTokens({
      sub: admin.id,
      userName: admin.userName,
      password: admin.password,
      firstName: admin.firstName,
      lastName: admin.lastName,
      role: admin.role,
    });

    return {
      // ปรับโครงสร้างให้คลีนขึ้น ไม่ซ้อน user ซ้ำซ้อน
      admin: toAuthResponse(admin),
      ...tokens,
      message: MESSAGE.AUTH.LOGIN_SUCCESS,
    };
  }
  async renew(renewTokenDto: RenewTokenDto) {
    try {
      const payload = verifyRefreshToken(renewTokenDto.refreshToken);
      const user = await this.authRepositories.findById(payload.sub);

      if (!user) {
        this.exceptionService.throwInvalidRenewToken();
      }

      // สร้าง object ใหม่จาก payload
      const tokenPayload = { ...payload };

      // ลบตัวที่ไม่อยากให้ติดไปใน Token ใหม่ (ไม่ต้องประกาศตัวแปร iat, exp มารับ)
      delete tokenPayload.iat;
      delete tokenPayload.exp;

      const tokens = generateTokens(tokenPayload);

      return {
        token: tokens,
        message: MESSAGE.AUTH.RENEW_TOKEN_SUCCESS,
      };
    } catch {
      this.exceptionService.throwInvalidRenewToken();
    }
  }
}
