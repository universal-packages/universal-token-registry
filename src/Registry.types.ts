export interface RegistryOptions {
  engine?: string | EngineInterface
  engineOptions?: Record<string, any>
  seed?: string
}

export interface EngineInterface {
  prepare?: () => void | Promise<void>
  release?: () => void | Promise<void>
  clear: () => void | Promise<void>
  delete: (token: string) => void | Promise<void>
  get: (token: string) => Record<string, any> | Promise<Record<string, any>>
  getAll: (category: string) => Record<string, any> | Promise<Record<string, any>>
  set: (token: string, category: string, subject: Record<string, any>) => void | Promise<void>
}

export interface EngineInterfaceClass {
  new (...args: any[]): EngineInterface
}
