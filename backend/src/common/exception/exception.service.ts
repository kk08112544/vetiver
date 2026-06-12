import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
// import { I18nService } from "nestjs-i18n";
import { MESSAGE } from 'src/common/message/message';

@Injectable()
export class ExceptionService {
  //   constructor(private readonly i18n: I18nService) {}

  throwInvalidUserName(): never {
    throw new NotFoundException(MESSAGE.AUTH.INVALID_USERNAME);
  }

  throwInvalidPassword(): never {
    throw new NotFoundException(MESSAGE.AUTH.INVALID_PASSWORD);
  }

  throwInvalidRenewToken(): never {
    throw new UnauthorizedException(MESSAGE.AUTH.INVALID_RENEW_TOKEN);
  }
}
