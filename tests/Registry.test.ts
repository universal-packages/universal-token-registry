import { Registry, MemoryEngine, EngineInterface } from '../src'

describe('Registry', (): void => {
  it('calls the set engine right methods', async (): Promise<void> => {
    const mockEngine: EngineInterface = {
      initialize: jest.fn(),
      release: jest.fn(),
      clear: jest.fn(),
      delete: jest.fn(),
      get: jest.fn(),
      getAll: jest.fn(),
      set: jest.fn()
    }

    const registry = new Registry({ engine: mockEngine })

    const token = await registry.register({ property: 'a' }, 'user:1')
    registry.initialize()
    registry.retrieve(token)
    registry.dispose(token)
    registry.retrieveAll('user:1')
    registry.clear()
    registry.release()

    expect(token).toEqual(expect.any(String))

    expect(mockEngine.initialize).toHaveBeenCalled()
    expect(mockEngine.set).toHaveBeenCalledWith(token, 'user:1', { property: 'a' })
    expect(mockEngine.get).toHaveBeenCalledWith(token)
    expect(mockEngine.delete).toHaveBeenCalledWith(token)
    expect(mockEngine.getAll).toHaveBeenCalledWith('user:1')
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

    await registry.register(token3, { ...subject, updated: true }, 'user:2')

    expect(await registry.retrieveAll('user:1')).toEqual({ [token1]: subject })
    expect(await registry.retrieveAll('user:2')).toEqual({ [token2]: subject, [token3]: { ...subject, updated: true } })

    await registry.dispose(token2)
    expect(await registry.retrieveAll('user:1')).toEqual({ [token1]: subject })
    expect(await registry.retrieveAll('user:2')).toEqual({ [token3]: { ...subject, updated: true } })

    await registry.dispose(token1)
    expect(await registry.retrieveAll('user:1')).toEqual({})
    expect(await registry.retrieveAll('user:2')).toEqual({ [token3]: { ...subject, updated: true } })

    await registry.dispose(token3)
    expect(await registry.retrieveAll('user:1')).toEqual({})
    expect(await registry.retrieveAll('user:2')).toEqual({})

    const token4 = await registry.register(subject, 'user:1')

    await registry.clear()

    expect(await registry.retrieve(token4)).toEqual(undefined)
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
