import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login-auth.dto';
import { RenewTokenDto } from './dto/renew-auth.dto';

@Controller('backoffice/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('renew')
  renew(@Body() renewDto: RenewTokenDto) {
    return this.authService.renew(renewDto);
  }
}
