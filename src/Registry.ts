import { generateToken } from '@universal-packages/crypto-utils'
import MemoryEngine from './MemoryEngine'
import { RegistryOptions } from './types'

export default class Registry<S = Record<string, any>> {
  public readonly options: RegistryOptions

  public constructor(options?: RegistryOptions) {
    this.options = { engine: new MemoryEngine(), seed: generateToken({ format: 'hex' }), ...options }
  }

  public async clear(): Promise<void> {
    await this.options.engine.clear()
  }

  public async categories(): Promise<string[]> {
    return await this.options.engine.listCategories()
  }

  public async dispose(token: string): Promise<void> {
    await this.options.engine.delete(token)
  }

  public async groupBy(category: string): Promise<S[]> {
    return (await this.options.engine.getGroup(category)) as any
  }

  public async register(subject: S, category?: string): Promise<string> {
    const token = generateToken({ byteSize: 128, concern: 'registry', seed: this.options.seed })

    await this.options.engine.set(token, subject, category)

    return token
  }

  public async retrieve(token: string): Promise<S> {
    return (await this.options.engine.get(token)) as S
  }

  public async update(token: string, subject: S): Promise<void> {
    await this.options.engine.set(token, subject)
  }
}
