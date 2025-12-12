import { Injectable } from '@nestjs/common';
import { Badge } from './entities/badge.entity';
import { UsersService } from '../users/users.service';

/**
 * Servicio que gestiona la colección de insignias disponibles en el
 * sistema y las operaciones de asignación a usuarios. Las insignias
 * están definidas en memoria y pueden extenderse fácilmente.
 */
@Injectable()
export class BadgesService {
  /**
   * Lista de todas las insignias disponibles en el MVP. El código
   * (id) se utiliza para referenciar la insignia en la API y en
   * el frontend. El requisito describe cuándo debe otorgarse.
   */
  private readonly badges: Badge[] = [
    {
      id: 'FIRST_BOUNTY_WIN',
      name: 'Primer Bounty',
      description: 'Ganaste tu primer bounty',
      requirement: 'Completar y ganar tu primer bounty',
    },
    {
      id: 'FIVE_BOUNTIES',
      name: 'Cazador Novato',
      description: 'Completaste cinco bounties',
      requirement: 'Completar 5 bounties con éxito',
    },
    {
      id: 'STREAK_7_DAYS',
      name: 'Constancia',
      description: 'Participaste 7 días seguidos',
      requirement: 'Enviar submissions durante 7 días consecutivos',
    },
    {
      id: 'COMMUNITY_HELPER',
      name: 'Comunidad Activa',
      description: 'Apoyaste a otros usuarios',
      requirement: 'Dar feedback útil o votar 10 submissions',
    },
    {
      id: 'GITHUB_CONNECT',
      name: 'GitHub Integrado',
      description: 'Conectaste tu cuenta de GitHub',
      requirement: 'Conectar tu cuenta de GitHub y realizar tu primer PR a través de la plataforma',
    },
    {
      id: 'FAST_SOLVER',
      name: 'Velocidad',
      description: 'Fuiste el primero en resolver un bounty',
      requirement: 'Ser el primer usuario en enviar una solución correcta',
    },
    {
      id: 'POINTS_1000',
      name: 'Leyenda',
      description: 'Acumulaste 1000 puntos',
      requirement: 'Alcanzar un total de 1000 puntos en la plataforma',
    },
    {
      id: 'SEASON_WINNER',
      name: 'Campeón de Temporada',
      description: 'Quedaste entre los 3 primeros al terminar una temporada',
      requirement: 'Finalizar una temporada en el top 3 del leaderboard',
    },
    {
      id: 'WALLET_VERIFIED',
      name: 'Wallet Verificada',
      description: 'Has vinculado y verificado tu wallet de Solana',
      requirement: 'Completar el flujo de verificación de wallet Phantom',
    },
    {
      id: 'WELCOME',
      name: 'Bienvenido',
      description: 'Has creado tu cuenta',
      requirement: 'Registrarte en la plataforma',
    },
  ];

  /** Mapa de usuarios y las insignias que han obtenido (ids) */
  private readonly userBadges: Map<string, Set<string>> = new Map();

  constructor(private readonly usersService: UsersService) {}

  /**
   * Devuelve la lista completa de insignias disponibles.
   */
  findAll(): Badge[] {
    return this.badges;
  }

  /**
   * Obtiene una insignia por su código. Si no existe, devuelve undefined.
   */
  findById(id: string): Badge | undefined {
    return this.badges.find((b) => b.id === id);
  }

  /**
   * Otorga una insignia a un usuario si aún no la posee. Actualiza la
   * lista de insignias del usuario en memoria y devuelve true si se
   * asignó con éxito. Si el usuario ya tenía la insignia, devuelve false.
   */
  awardBadge(userId: string, badgeId: string): boolean {
    const badge = this.findById(badgeId);
    if (!badge) {
      return false;
    }
    const user = this.usersService.findById(userId);
    // Usa UsersService para asegurar consistencia
    if (!user.badges.includes(badgeId)) {
      this.usersService.addBadge(userId, badgeId);
      return true;
    }
    return false;
  }

  /**
   * Devuelve la lista de insignias que ha obtenido un usuario. Si no tiene
   * insignias, devuelve un arreglo vacío.
   */
  getBadgesForUser(userId: string): Badge[] {
    const user = this.usersService.findById(userId);
    return user.badges.map((id) => this.findById(id)).filter((b): b is Badge => !!b);
  }
}