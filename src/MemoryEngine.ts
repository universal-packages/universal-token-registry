import { EngineInterface } from './Registry.types'

export default class MemoryEngine implements EngineInterface {
  private registry: Record<string, Record<string, any>> = {}
  private categoryGroups: Record<string, Set<string>> = {}
  private tokenCategories: Record<string, string> = {}

  public clear(): void {
    this.registry = {}
    this.categoryGroups = {}
  }

  public delete(token: string): void {
    const category = this.tokenCategories[token]

    if (category) {
      const group = this.categoryGroups[category]

      group.delete(token)

      if (group.size === 0) delete this.categoryGroups[category]

      delete this.tokenCategories[token]
    }

    delete this.registry[token]
  }

  public get(token: string): Record<string, any> {
    return this.registry[token]
  }

  public getAll(category: string): Record<string, any> {
    const tokens = this.categoryGroups[category]

    if (tokens) {
      return Array.from(tokens).reduce((final: Record<string, any>, token: string): Record<string, any> => {
        final[token] = this.registry[token]

        return final
      }, {})
    }

    return {}
  }

  public set(token: string, category: string, subject: Record<string, any>): void {
    this.registry[token] = subject
    this.categoryGroups[category] = this.categoryGroups[category] || new Set()
    this.categoryGroups[category].add(token)
    this.tokenCategories[token] = category
  }
}
