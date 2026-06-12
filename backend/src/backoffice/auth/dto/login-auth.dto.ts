import { IsNotEmpty, IsString, Matches, MinLength } from 'class-validator';

export class LoginDto {
  @IsNotEmpty()
  @IsString()
  userName!: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8, {
    message: 'password ต้องอย่างน้อย 8 ตัวอักษร',
  })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).+$/, {
    message: 'password ต้องมี พิมพ์เล็ก พิมพ์ใหญ่ ตัวเลข และอักขระพิเศษ',
  })
  password!: string;
}
