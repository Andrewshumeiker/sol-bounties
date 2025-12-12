import { Controller, Get, Param } from '@nestjs/common';
import { BadgesService } from './badges.service';

/**
 * Controlador de insignias. Permite consultar la lista de insignias
 * disponibles y las insignias que ha obtenido un usuario en particular.
 */
@Controller('badges')
export class BadgesController {
  constructor(private readonly badgesService: BadgesService) {}

  /**
   * Devuelve todas las insignias disponibles en el sistema.
   */
  @Get()
  findAll() {
    return this.badgesService.findAll();
  }

  /**
   * Devuelve las insignias obtenidas por un usuario específico.
   */
  @Get(':userId')
  findByUser(@Param('userId') userId: string) {
    return this.badgesService.getBadgesForUser(userId);
  }
}