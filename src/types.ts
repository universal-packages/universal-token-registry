export interface TokenRegistry {
  [token: string]: {
    category: string
    subject: Record<string, any>
  }
}

export interface MemoryCategories {
  [category: string]: string[]
}

export interface EngineInterface {
  clear: () => void | Promise<void>
  set: (token: string, subject: Record<string, any>, category?: string) => void | Promise<void>
  get: (token: string) => Record<string, any> | Promise<Record<string, any>>
  delete: (token: string) => void | Promise<void>
  getCategory: (category: string) => Record<string, any> | Promise<Record<string, any>[]>
  listCategories: () => string[] | Promise<string[]>
}
