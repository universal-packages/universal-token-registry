import { Registry, MemoryEngine } from '../src'

describe('Registry', (): void => {
  it('calls the set engine right methods', async (): Promise<void> => {
    const mockEngine = { set: jest.fn(), get: jest.fn, delete: jest.fn() }

    const registry = new Registry(mockEngine)

    const token = await registry.register({ property: 'a' })
    registry.retrieve(token)
    registry.dispose(token)

    expect(token).toEqual(expect.any(String))
  })

  it('uses the memory engine by default', async (): Promise<void> => {
    const registry = new Registry()
    const subject = { property: 'a' }
    const token = await registry.register(subject)

    expect(registry.engine).toEqual(expect.any(MemoryEngine))

    expect(await registry.retrieve(token)).toEqual(subject)

    await registry.dispose(token)

    expect(await registry.retrieve(token)).toBeUndefined()
  })
})
