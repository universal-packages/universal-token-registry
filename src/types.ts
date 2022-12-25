export interface MemoryRegistry {
  [token: string]: Record<string, any>
}

export interface EngineInterface {
  set: (token: string, subject: Record<string, any>) => void | Promise<void>
  get: (token: string) => Record<string, any> | Promise<Record<string, any>>
  delete: (token: string) => void | Promise<void>
}
