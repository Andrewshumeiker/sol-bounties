// Placeholder entity for User. This will be expanded with real properties later.
export class User {
  /** Identificador único del usuario */
  id: string;
  /** Nombre de usuario */
  username: string;
  /** Dirección de correo electrónico del usuario */
  email: string;
  /** Dirección pública de la wallet Solana (base58) asociada al usuario */
  walletAddress: string | null;
  /** Lista de bounties creados por el usuario (relación uno a muchos) */
  createdBounties?: any[];

  /**
   * Insignias obtenidas por el usuario. Cada elemento es el código de una
   * insignia definida en el sistema. Inicialmente es un arreglo vacío.
   */
  badges: string[];
}