import { Controller, Post, Body, Get, Headers } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto } from './dto';
import { GetUser } from './decorators/get-user.decorator';
import { User } from './entities/user.entity';
import { Auth } from './decorators/auth.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @Post('register')
  register(@Body() createUserDto: CreateUserDto) {
    return this.service.create(createUserDto);
  }

  @Post('login')
  login(@Body() loginUserDto: LoginUserDto) {
    return this.service.login(loginUserDto);
  }

  // TODO: Este endpoint en realidad no está del todo bien. Ahora mismo usa el token viejo
  // para generar un nuevo token, pero la verdadera utilidad es usar un refresh-token.
  // El token que se envía en la cabecera con bearer normalmente es almacenado por el
  // frontend en el local storage e inyectado en cada petición, ya que una cookie puede
  // ser poco flexible, ya que httpOnly evita que se use desde javascript, ergo los frameworks
  // tienen problemas para incrustarlas. Lo suyo, al autenticarse, es darle al usuario el
  // token, como ya se está haciendo, y establecer una cookie segura con un refresh-token, que
  // es otro token generado de identica forma al normal (pero con algún flag extra).
  // Cuando el token caduca, se debe hacer una llamada a este endpoint y este endpoint lo que
  // debe hacer el leer el refresh-token de la cookie (que suelen vivir 7 días o así) y devolver
  // otro token (que suelen expirar en 15/30 minutos) al usuario. Como la cookie se envía sola
  // al llamar a este endpoint, si el refresh-token todavía es válido, generará el nuevo
  // token sin problemas y el frontend lo almacenará en el local storage para sustituir al
  // antiguo y seguir pudiendo inyectar el bearer. Esto hace que si un CSRF/XSS roba nuestro
  // token solo les vale por 15 minutos o menos. Sin embargo, el usuario puede seguir haciendo
  // login durante una semana. El refresh-token al estar en una cookie sameSite y httpOnly no es
  // posible de robar por estas técnicas.
  @Get('refresh')
  @Auth()
  refresh(@GetUser() user: User) {
    return this.service.refresh(user);
  }
}
