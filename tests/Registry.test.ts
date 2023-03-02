import { Registry, MemoryEngine, EngineInterface } from '../src'

describe('Registry', (): void => {
  it('calls the set engine right methods', async (): Promise<void> => {
    const mockEngine: EngineInterface = {
      initialize: jest.fn(),
      release: jest.fn(),
      clear: jest.fn(),
      delete: jest.fn(),
      get: jest.fn(),
      getGroup: jest.fn(),
      listCategories: jest.fn(),
      set: jest.fn()
    }

    const registry = new Registry({ engine: mockEngine })

    const token = await registry.register({ property: 'a' }, 'user:1')
    registry.initialize()
    registry.retrieve(token)
    registry.dispose(token)
    registry.categories()
    registry.groupBy('user:1')
    registry.clear()
    registry.release()

    expect(token).toEqual(expect.any(String))

    expect(mockEngine.initialize).toHaveBeenCalled()
    expect(mockEngine.set).toHaveBeenCalledWith(token, { property: 'a' }, 'user:1')
    expect(mockEngine.get).toHaveBeenCalledWith(token)
    expect(mockEngine.delete).toHaveBeenCalledWith(token)
    expect(mockEngine.listCategories).toHaveBeenCalled()
    expect(mockEngine.getGroup).toHaveBeenCalledWith('user:1')
    expect(mockEngine.clear).toHaveBeenCalled()
    expect(mockEngine.release).toHaveBeenCalled()
  })

  it('uses the memory engine by default', async (): Promise<void> => {
    const registry = new Registry()

    expect(registry).toMatchObject({ engine: expect.any(MemoryEngine) })

    const subject = { property: 'a' }
    const token = await registry.register(subject)

    expect(await registry.retrieve(token)).toEqual(subject)

    await registry.dispose(token)

    expect(await registry.retrieve(token)).toBeUndefined()

    const token1 = await registry.register(subject, 'user:1')
    const token2 = await registry.register(subject, 'user:2')
    const token3 = await registry.register(subject, 'user:2')

    await registry.update(token3, { ...subject, updated: true })

    expect(await registry.categories()).toEqual(['user:1', 'user:2'])
    expect(await registry.groupBy('user:1')).toEqual({ [token1]: subject })
    expect(await registry.groupBy('user:2')).toEqual({ [token2]: subject, [token3]: { ...subject, updated: true } })

    await registry.dispose(token2)
    expect(await registry.categories()).toEqual(['user:1', 'user:2'])
    expect(await registry.groupBy('user:1')).toEqual({ [token1]: subject })
    expect(await registry.groupBy('user:2')).toEqual({ [token3]: { ...subject, updated: true } })

    await registry.dispose(token1)
    expect(await registry.categories()).toEqual(['user:2'])
    expect(await registry.groupBy('user:1')).toBeUndefined()
    expect(await registry.groupBy('user:2')).toEqual({ [token3]: { ...subject, updated: true } })

    await registry.dispose(token3)
    expect(await registry.categories()).toEqual([])
    expect(await registry.groupBy('user:1')).toBeUndefined()
    expect(await registry.groupBy('user:2')).toBeUndefined()

    const token4 = await registry.register(subject, 'user:1')

    await registry.clear()

    expect(await registry.categories()).toEqual([])
    expect(await registry.retrieve(token4)).toBeUndefined()
  })

  it('Sets adapters from string', async (): Promise<void> => {
    const registry = new Registry({ engine: 'memory' })

    expect(registry).toMatchObject({ engine: expect.any(MemoryEngine) })
  })

  it('Sets adapters from objects', async (): Promise<void> => {
    const engine = new MemoryEngine()
    const registry = new Registry({ engine })

    expect(registry).toMatchObject({ engine })
  })
})
