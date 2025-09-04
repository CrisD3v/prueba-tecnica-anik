/**
 * Utilidades para manipulación de texto
 */

/**
 * Normaliza texto removiendo acentos y caracteres especiales
 * @param text - Texto a normalizar
 * @returns Texto normalizado en minúsculas sin acentos
 */
export const normalizeText = (text: string): string => {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remover acentos
    .replace(/[^a-z0-9\s]/g, '') // Remover caracteres especiales excepto espacios
    .trim();
};

/**
 * Resalta términos de búsqueda en un texto considerando normalización
 * @param text - Texto donde resaltar
 * @param searchTerm - Término a resaltar
 * @returns HTML string con términos resaltados
 */
export const highlightSearchTerm = (text: string, searchTerm: string): string => {
  if (!searchTerm.trim()) return text;

  const normalizedSearch = normalizeText(searchTerm);
  const words = text.split(/\s+/);

  return words
    .map((word) => {
      const normalizedWord = normalizeText(word);
      if (normalizedWord.includes(normalizedSearch)) {
        return `<mark class="bg-yellow-200 px-1 rounded">${word}</mark>`;
      }
      return word;
    })
    .join(' ');
};