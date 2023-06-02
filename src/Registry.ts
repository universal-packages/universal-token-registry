import { resolveAdapter } from '@universal-packages/adapter-resolver'
import { generateToken } from '@universal-packages/crypto-utils'

import MemoryEngine from './MemoryEngine'
import { EngineInterface, EngineInterfaceClass, RegistryOptions } from './Registry.types'

export default class Registry<S = Record<string, any>> {
  public readonly options: RegistryOptions
  public readonly engine: EngineInterface

  public constructor(options?: RegistryOptions) {
    this.options = { engine: 'memory', seed: generateToken({ format: 'hex' }), ...options }
    this.engine = this.generateEngine()
  }

  public async initialize(): Promise<void> {
    if (this.engine.initialize) await this.engine.initialize()
  }

  public async release(): Promise<void> {
    if (this.engine.release) await this.engine.release()
  }

  public async clear(): Promise<void> {
    await this.engine.clear()
  }

  public async dispose(token: string): Promise<void> {
    await this.engine.delete(token)
  }

  public async register(token: string, subject: S, category?: string): Promise<string>
  public async register(subject: S, category?: string): Promise<string>
  public async register(tokenOrSubject: S | string, subjectOrCategory?: S | string, category: string = 'any'): Promise<string> {
    const actualToken = typeof tokenOrSubject === 'string' ? tokenOrSubject : generateToken({ byteSize: 128, concern: 'registry', seed: this.options.seed })
    const actualSubject = typeof tokenOrSubject === 'string' ? (subjectOrCategory as S) : tokenOrSubject
    const actualCategory = typeof tokenOrSubject === 'string' ? category : (subjectOrCategory as string) || 'any'

    await this.engine.set(actualToken, actualCategory, actualSubject)

    return actualToken
  }

  public async retrieve(token: string): Promise<S> {
    return (await this.engine.get(token)) as S
  }

  public async retrieveAll(category: string = 'any'): Promise<Record<string, any>> {
    return await this.engine.getAll(category)
  }

  private generateEngine(): EngineInterface {
    if (typeof this.options.engine === 'string') {
      const AdapterModule = resolveAdapter<EngineInterfaceClass>(this.options.engine, {
        domain: 'token-registry',
        type: 'engine',
        internal: { memory: MemoryEngine }
      })
      return new AdapterModule(this.options.engineOptions)
    } else {
      return this.options.engine
    }
  }
}
