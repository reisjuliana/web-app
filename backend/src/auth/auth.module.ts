import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from 'src/users/users.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';

export const DEFAULT_SECRETKEY = 'sD8$kP0!zYq3#nX1^wT7uJ9mH5@cL4%gF';
export const DEFAULT_EXPIRESIN = '12H';

@Module({
  imports: [
    UsersModule,
    PassportModule.register({
      defaultStrategy: 'jwt',
      property: 'user',
      session: false,
    }),
    JwtModule.register({
      secret: DEFAULT_SECRETKEY,
      signOptions: {
        expiresIn: DEFAULT_EXPIRESIN,
      },
    }),
  ],
  controllers: [AuthController],
  providers: [JwtStrategy, AuthService],
  exports: [PassportModule, JwtModule],
})
export class AuthModule {}
