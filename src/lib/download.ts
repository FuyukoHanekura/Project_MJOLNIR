/** Triggers the download of a JSON file in the browser. */
export function downloadJson(fileName: string, data: unknown): void {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = fileName
  document.body.appendChild(a)
  a.click()
  a.remove()
  // Gives the browser time to start the download before releasing the URL.
  setTimeout(() => URL.revokeObjectURL(url), 10_000)
}

/** Maximum size of an import file: beyond that, it is almost certainly the wrong file. */
export const MAX_IMPORT_BYTES = 10 * 1024 * 1024
