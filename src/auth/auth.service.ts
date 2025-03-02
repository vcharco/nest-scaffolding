import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto, LoginUserDto } from './dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interfaces/jwt-payload';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly repository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async create(createAuthDto: CreateUserDto) {
    try {
      const user = this.repository.create({
        ...createAuthDto,
        username: createAuthDto.username.toLocaleLowerCase(),
        password: bcrypt.hashSync(createAuthDto.password, 10),
      });
      await this.repository.save(user);

      return {
        id: user.id,
        username: user.username,
        fullName: user.fullName,
        role: user.role,
      };
    } catch (err) {
      this.handleDBErrors(err);
    }
  }

  async login(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;

    // Como pusimos en password { select: false }, debemos solicitarlo explicitamente
    // además así aprovechamos y solo traemos lo que necesitamos (email y contraseña).
    const user = await this.repository.findOne({
      where: { email },
      select: { email: true, password: true, id: true },
    });

    if (!user || !bcrypt.compareSync(password, user.password))
      throw new UnauthorizedException('Invalid email or password');

    // Generate and return JWT
    return {
      ...user,
      token: this.genJwtToken({ id: user.id }),
    };
  }

  refresh(user: User) {
    return {
      ...user,
      token: this.genJwtToken({ id: user.id }),
    };
  }

  private genJwtToken(payload: JwtPayload) {
    return this.jwtService.sign({ id: payload.id });
  }

  private handleDBErrors(err: any): never {
    const errorMsg = err?.detail ?? '';
    console.log(errorMsg);
    throw new InternalServerErrorException(errorMsg);
  }
}
