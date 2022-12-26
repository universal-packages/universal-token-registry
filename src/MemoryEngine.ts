import { CategoryGroups, EngineInterface, TokenRegistry } from './types'

export default class MemoryEngine implements EngineInterface {
  private registry: TokenRegistry = {}
  private categoryGroups: CategoryGroups = {}

  public clear(): void {
    this.registry = {}
    this.categoryGroups = {}
  }

  public delete(token: string): void {
    const entry = this.registry[token]

    if (entry) {
      if (entry.category) {
        const group = this.categoryGroups[entry.category]
        const index = group.indexOf(token)

        if (index > -1) group.splice(index, 1)

        if (group.length === 0) delete this.categoryGroups[entry.category]
      }

      delete this.registry[token]
    }
  }

  public get(token: string): Record<string, any> {
    return this.registry[token]?.subject
  }

  public getGroup(category: string): Record<string, any> {
    const tokens = this.categoryGroups[category]

    if (tokens) {
      return tokens.reduce((final: Record<string, any>, token: string): Record<string, any> => {
        final[token] = this.registry[token].subject

        return final
      }, {})
    }
  }

  public set(token: string, subject: Record<string, any>, category?: string): void {
    this.registry[token] = { subject, category }

    if (category) {
      this.categoryGroups[category] = this.categoryGroups[category] || []
      this.categoryGroups[category].push(token)
    }
  }

  public listCategories(): string[] {
    return Object.keys(this.categoryGroups)
  }
}
