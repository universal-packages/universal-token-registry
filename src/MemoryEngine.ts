import { EngineInterface, MemoryRegistry } from './types'

export default class MemoryEngine implements EngineInterface {
  private readonly registry: MemoryRegistry = {}

  public set(token: string, subject: Record<string, any>): void {
    this.registry[token] = subject
  }

  public get(token: string): Record<string, any> {
    return this.registry[token]
  }

  public delete(token: string): void {
    delete this.registry[token]
  }
}
