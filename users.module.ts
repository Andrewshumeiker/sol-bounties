import { Module } from '@nestjs/common';
import { UsersService } from './users.service';

/**
 * Módulo de usuarios. Actualmente provee un servicio sencillo en memoria
 * para gestionar el registro y actualización de usuarios. En una
 * implementación real, este módulo se integraría con una base de datos.
 */
@Module({
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}