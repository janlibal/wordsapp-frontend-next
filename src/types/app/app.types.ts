export type SystemInfo = {
  name: string
  version: string
  description: string
  env: {
    nodeVersion: string
    hostName: string
    platform: string
  }
}

export type AppInfoResponse = {
  success: boolean
  path: string
  timestamp: string
  data: SystemInfo
}
