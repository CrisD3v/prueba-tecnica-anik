/**
 * Constantes para filtros de productos
 */

export const PRICE_RANGE = {
  MIN: 15,
  MAX: 65,
  DEFAULT: [15, 65] as [number, number],
} as const;

export const SEARCH_CONFIG = {
  PLACEHOLDER: 'Buscar producto...',
  MIN_SEARCH_LENGTH: 0,
} as const;

export const SORT_OPTIONS = {
  ASCENDING: true,
  DESCENDING: false,
} as const;