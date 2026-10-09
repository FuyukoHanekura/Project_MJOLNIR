/** Déclenche le téléchargement d'un fichier JSON côté navigateur. */
export function downloadJson(fileName: string, data: unknown): void {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = fileName
  document.body.appendChild(a)
  a.click()
  a.remove()
  // Laisse au navigateur le temps de démarrer le téléchargement avant de libérer l'URL.
  setTimeout(() => URL.revokeObjectURL(url), 10_000)
}

/** Taille maximale d'un fichier d'import : au-delà, c'est presque sûrement le mauvais fichier. */
export const MAX_IMPORT_BYTES = 10 * 1024 * 1024
