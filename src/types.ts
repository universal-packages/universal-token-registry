export interface RegistryOptions {
  engine?: EngineInterface
  seed?: string
}

export interface EngineInterface {
  clear: () => void | Promise<void>
  delete: (token: string) => void | Promise<void>
  get: (token: string) => Record<string, any> | Promise<Record<string, any>>
  getGroup: (category: string) => Record<string, any> | Promise<Record<string, any>>
  listCategories: () => string[] | Promise<string[]>
  set: (token: string, subject: Record<string, any>, category?: string) => void | Promise<void>
}
