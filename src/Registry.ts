import { generateToken } from '@universal-packages/crypto-utils'
import MemoryEngine from './MemoryEngine'
import { EngineInterface } from './types'

export default class Registry<S = Record<string, any>> {
  public readonly engine: EngineInterface
  public readonly id: string

  public constructor(engine?: EngineInterface, id?: string) {
    this.engine = engine || new MemoryEngine()
    this.id = id || generateToken({ format: 'hex' })
  }

  public async clear(): Promise<void> {
    await this.engine.clear()
  }

  public async categories(): Promise<string[]> {
    return await this.engine.listCategories()
  }

  public async dispose(token: string): Promise<void> {
    await this.engine.delete(token)
  }

  public async groupBy(category: string): Promise<S[]> {
    return (await this.engine.getGroup(category)) as any
  }

  public async register(subject: S, category?: string): Promise<string> {
    const token = generateToken({ byteSize: 128, concern: 'registry', seed: this.id })

    await this.engine.set(token, subject, category)

    return token
  }

  public async retrieve(token: string): Promise<S> {
    return (await this.engine.get(token)) as S
  }
}
