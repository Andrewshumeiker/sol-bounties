import { Injectable, NotFoundException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { User } from './entities/user.entity';

/**
 * Servicio en memoria para gestionar usuarios. Esta implementación
 * almacena usuarios en un mapa y debería ser reemplazada por una
 * integración con la base de datos. Proporciona métodos para crear
 * usuarios, buscarlos y actualizar la dirección de la wallet.
 */
@Injectable()
export class UsersService {
  /** Almacena usuarios en memoria */
  private readonly users: Map<string, User> = new Map();

  /**
   * Crea un nuevo usuario con un identificador único. Esta función
   * simula un registro y devuelve el usuario creado.
   */
  create(username: string, email: string): User {
    const id = uuidv4();
    const user: User = {
      id,
      username,
      email,
      walletAddress: null,
      createdBounties: [],
      badges: [],
    } as any;
    // Otorga la insignia de bienvenida al nuevo usuario
    user.badges.push('WELCOME');
    this.users.set(id, user);
    return user;
  }

  /**
   * Busca un usuario por su identificador. Si no existe, lanza una
   * excepción.
   */
  findById(id: string): User {
    const user = this.users.get(id);
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }
    return user;
  }

  /**
   * Actualiza la dirección de la wallet asociada a un usuario. Si el
   * usuario no existe, se lanza una excepción.
   */
  updateWalletAddress(id: string, walletAddress: string): User {
    const user = this.findById(id);
    user.walletAddress = walletAddress;
    this.users.set(id, user);
    return user;
  }

  /**
   * Añade una insignia a un usuario si aún no la tiene. Devuelve el usuario
   * actualizado. Si la insignia ya existe en su lista, no se duplica.
   */
  addBadge(userId: string, badgeId: string): User {
    const user = this.findById(userId);
    if (!user.badges) {
      user.badges = [];
    }
    if (!user.badges.includes(badgeId)) {
      user.badges.push(badgeId);
    }
    this.users.set(userId, user);
    return user;
  }
}