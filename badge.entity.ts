/**
 * Entidad que representa una insignia del sistema. Las insignias
 * se utilizan para gamificar la plataforma y reconocer logros
 * específicos de los usuarios. En esta implementación se utiliza
 * exclusivamente en memoria.
 */
export class Badge {
  /** Código único que identifica la insignia. */
  id: string;
  /** Nombre legible de la insignia. */
  name: string;
  /** Descripción corta de la condición para obtenerla. */
  description: string;
  /** Texto con la condición o requisito para otorgar la insignia. */
  requirement: string;
  /** URL de la imagen asociada a la insignia (opcional). */
  imageUrl?: string;
}