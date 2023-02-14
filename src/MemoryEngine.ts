import { EngineInterface } from './Registry.types'

export default class MemoryEngine implements EngineInterface {
  private registry: Record<string, Record<string, any>> = {}
  private categoryGroups: Record<string, string[]> = {}
  private tokenCategories: Record<string, string> = {}

  public clear(): void {
    this.registry = {}
    this.categoryGroups = {}
  }

  public delete(token: string): void {
    const category = this.tokenCategories[token]

    if (category) {
      const group = this.categoryGroups[category]
      const index = group.indexOf(token)

      if (index > -1) group.splice(index, 1)

      if (group.length === 0) delete this.categoryGroups[category]

      delete this.tokenCategories[token]
    }

    delete this.registry[token]
  }

  public get(token: string): Record<string, any> {
    return this.registry[token]
  }

  public getGroup(category: string): Record<string, any> {
    const tokens = this.categoryGroups[category]

    if (tokens) {
      return tokens.reduce((final: Record<string, any>, token: string): Record<string, any> => {
        final[token] = this.registry[token]

        return final
      }, {})
    }
  }

  public set(token: string, subject: Record<string, any>, category?: string): void {
    this.registry[token] = subject

    if (category) {
      this.categoryGroups[category] = this.categoryGroups[category] || []
      this.categoryGroups[category].push(token)
      this.tokenCategories[token] = category
    }
  }

  public listCategories(): string[] {
    return Object.keys(this.categoryGroups)
  }
}
