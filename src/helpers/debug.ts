const isDevelopment = process.env.NODE_ENV === 'development'

export function debug(...args: unknown[]) {
  if (isDevelopment) {
    console.log(...args)
  }
}
