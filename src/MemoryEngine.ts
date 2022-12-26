import { EngineInterface, MemoryCategories, TokenRegistry } from './types'

export default class MemoryEngine implements EngineInterface {
  private registry: TokenRegistry = {}
  private categories: MemoryCategories = {}

  public clear(): void {
    this.registry = {}
    this.categories = {}
  }

  public set(token: string, subject: Record<string, any>, category?: string): void {
    this.registry[token] = { subject, category }

    if (category) {
      this.categories[category] = this.categories[category] || []
      this.categories[category].push(token)
    }
  }

  public get(token: string): Record<string, any> {
    return this.registry[token]?.subject
  }

  public delete(token: string): void {
    const entry = this.registry[token]

    if (entry) {
      if (entry.category) {
        const category = this.categories[entry.category]
        const index = category.indexOf(token)

        if (index > -1) category.splice(index, 1)

        if (category.length === 0) delete this.categories[entry.category]
      }

      delete this.registry[token]
    }
  }

  public getCategory(category: string): Record<string, any> {
    const tokens = this.categories[category]

    if (tokens) {
      return tokens.reduce((final: Record<string, any>, token: string): Record<string, any> => {
        final[token] = this.registry[token].subject

        return final
      }, {})
    }
  }

  public listCategories(): string[] {
    return Object.keys(this.categories)
  }
}
