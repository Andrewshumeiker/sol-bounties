import { Module } from '@nestjs/common';
import { BadgesService } from './badges.service';
import { BadgesController } from './badges.controller';
import { UsersModule } from '../users/users.module';

/**
 * Módulo de insignias que expone el servicio y el controlador asociado.
 */
@Module({
  imports: [UsersModule],
  providers: [BadgesService],
  controllers: [BadgesController],
  exports: [BadgesService],
})
export class BadgesModule {}