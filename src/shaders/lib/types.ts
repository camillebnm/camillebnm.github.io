/**
 * Contrat entre ShaderCanvas et les fichiers d'animation (src/animations/*.ts).
 *
 * Un fichier d'animation exporte par défaut une fonction `Timeline`, appelée à chaque frame.
 * Elle est pure : elle dépend uniquement du contexte (temps, clics), ce qui rend l'animation
 * reproductible et synchronisée entre le texte (DOM) et le shader (uniforms).
 */

export interface TimelineContext {
  /** Secondes écoulées depuis le montage du composant (même horloge que iTime et u_clickTimes). */
  readonly time: number;
  /** Durée de la frame précédente, en secondes. */
  readonly dt: number;
  readonly frame: number;
  /** Nombre de clics effectués jusqu'ici. */
  readonly clickCount: number;
  /** Instants des clics : clickTimes[k] est l'instant du (k+1)-ième clic. */
  readonly clickTimes: readonly number[];
  /** Taille du canvas en pixels CSS et rapport largeur/hauteur. */
  readonly width: number;
  readonly height: number;
  readonly aspect: number;
  /** Champs initiaux des textBlocks (même index) */
  readonly textBlocks: TextBlockInfo[];
}

/** État d'un bloc de texte. Tout champ omis laisse la valeur par défaut du composant. */
export interface TextState {
  /** Position en % de la largeur (0 = gauche). */
  x?: number;
  /** Position en % de la hauteur (0 = haut). */
  y?: number;
  opacity?: number;
  scale?: number;
  /** Rotation en degrés. */
  rotate?: number;
  /** Surcharge la visibilité (par défaut : géré par la propriété `clicks` du bloc). */
  visible?: boolean;
}

export interface TimelineResult {
  /** États des textes, indexés comme la prop `textBlocks` (undefined = inchangé). */
  texts?: Array<TextState | undefined>;
  /**
   * Uniforms à envoyer au shader : nombre (float) ou tableau de 2 à 4 nombres (vec2/3/4).
   * Les clés doivent toutes être présentes dès le premier appel (temps 0, aucun clic) :
   * c'est lui qui crée les uniforms. Elles sont à déclarer dans le shader.
   */
  uniforms?: Record<string, number | number[]>;
}

export interface TextBlockInfo {
  text: string;
  color?: string;
  size?: number;
  /** % de la largeur */
  x: number;
  /** % de la hauteur */
  y: number;
  clicks?: number;
}

export type Timeline = (ctx: TimelineContext) => TimelineResult;
