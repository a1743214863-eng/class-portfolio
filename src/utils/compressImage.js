const MAX_WIDTH = 1600
const JPEG_QUALITY = 0.82

export function compressImage(file) {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('NOT_IMAGE'))
      return
    }

    const url = URL.createObjectURL(file)
    const img = new Image()

    img.onload = () => {
      URL.revokeObjectURL(url)

      let width = img.naturalWidth
      let height = img.naturalHeight

      if (width > MAX_WIDTH) {
        height = Math.round((height * MAX_WIDTH) / width)
        width = MAX_WIDTH
      }

      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height

      const ctx = canvas.getContext('2d')
      if (!ctx) {
        reject(new Error('CANVAS_ERROR'))
        return
      }

      ctx.drawImage(img, 0, 0, width, height)

      try {
        resolve(canvas.toDataURL('image/jpeg', JPEG_QUALITY))
      } catch {
        reject(new Error('COMPRESS_ERROR'))
      }
    }

    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('LOAD_ERROR'))
    }

    img.src = url
  })
}

export async function compressImages(files) {
  const results = []

  for (const file of files) {
    results.push(await compressImage(file))
  }

  return results
}
