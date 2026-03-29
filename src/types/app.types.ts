export type AppInfoResponse = {
  status: boolean
  path: string
  statusCode: number
  timestamp: string
  result: {
    name: string
    version: string
    description: string
    env: {
      nodeVersion: string
      hostName: string
      platform: string
    }
  }
}
