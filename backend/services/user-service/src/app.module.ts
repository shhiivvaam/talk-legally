import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getPostgresConfig } from '@shared/database/postgres.config';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User } from '@shared/database/entities/user.entity';
import { Lawyer } from '@shared/database/entities/lawyer.entity';
import { Session } from '@shared/database/entities/session.entity';
import { Favorite } from '@shared/database/entities/favorite.entity';
import { LoggerModule } from '@shared/utils/logger.module';
import { SharedAuthModule } from '@shared/auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    SharedAuthModule,
    LoggerModule,
    TypeOrmModule.forRoot(getPostgresConfig()),
    TypeOrmModule.forFeature([User, Lawyer, Session, Favorite]),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class AppModule { }
