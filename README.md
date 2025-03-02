<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

# Levantar proyecto en desarrollo

1. Clonar el repositorio.

```
git clone https://github.com/vcharco/nest-scaffolding.git
```

2. Acceder al directorio y ejecutar:

```bash
npm install
```

3. Tener nest CLI instalado.

```bash
npm i -g @nestjs/cli
```

4. Levantar la base de datos.

```bash
docker-compose up -d
```

5. Clonar `.env.template` y renombrar a `.env`.

6. Rellenar las variables de entorno en el archivo `.env`. Para desarrollo puedes dejar las variables con los valores del template. Pero no olvides cambiarlas en producción.

7. Lanzar la aplicación en desarrollo.

```bash
npm run start:dev
```

# Quick Start

Una vez desplegado el proyecto, podemos beneficiarnos de muchas funcionalidades como autenticación, autorización y logging de forma inmediata.

1. Comencemos creando un módulo de prueba con un controlador.

```bash
nest g mo foo
nest g c foo
```

2. Importamos lo siguiente:

- `CustomLoggerModule`: Contiene el servicio para registrar logs.
- `AuthModule`: Contiene el decorador para autenticar y autorizar.
- `ConfigModule`: Contiene el mapeo de las variables de entorno.
- `TypeOrmModule`: Módulo para usar TypeORM (pasar las entidades en el array).

Observa que `TypeOrmModule` está comentado, esto es porque no es necesario para este ejemplo ya que no tenemos ninguna entidad. Se deja comentado con fines de documentación.

```ts
import { Module } from '@nestjs/common';
import { FooController } from './foo.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from 'src/auth/auth.module';
import { CustomLoggerModule } from 'src/custom-logger.module';

@Module({
  imports: [
    //TypeOrmModule.forFeature([ Foo ]),
    AuthModule,
    CustomLoggerModule,
    ConfigModule,
  ],
  controllers: [FooController],
  providers: [],
  exports: [],
})
export class FooModule {}
```

3. Ahora podemos editar nuestro controlador.

```ts
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { CustomLoggerService } from 'src/custom-logger/custom-logger.service';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { ValidRoles } from 'src/auth/interfaces/valid-roles.enum';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { User } from 'src/auth/entities/user.entity';

@Controller()
// @Auth()   // Puedes aplicar autenticación/autorización a nivel de clase
export class FooController {
  constructor(
    private readonly appService: AppService,
    private readonly logger: CustomLoggerService,
  ) {}

  @Get('public')
  thisIsPublic(): string {
    return 'Este es público para cualquier usuario';
  }

  @Get('private')
  @Auth()
  onlyAuthenticated(): string {
    return 'Esto solo es accesible para usuarios autenticados';
  }

  @Get('privileged')
  @Auth(ValidRoles.admin, ValidRoles.superUser)
  onlyPrivileged(): string {
    return 'Esto solo es accesible para usuarios admin y superUser';
  }

  // Puedes acceder a la información del usuario con @GetUser()
  @Get('details')
  @Auth()
  printUser(@GetUser() user: User) {
    return `Eres el usuario ${user.username}.`;
  }

  // Se incluye un Dto para paginación.
  @Get('all')
  findAll(@Query() paginationDto: PaginationDto) {
    const { limit, offset } = paginationDto;
    return `El limit es ${limit} y el offset ${offset}`;
  }

  // Logging
  @Get('log')
  logEverything() {
    this.logger.log('foo');
    this.logger.error('foo');
    this.logger.warn('foo');
    this.logger.debug('foo');
    this.logger.verbose('foo');
    return '¡Todo registrado!';
  }
}
```
