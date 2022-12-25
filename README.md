# Token Registry

[![npm version](https://badge.fury.io/js/@universal-packages%2Ftoken-registry.svg)](https://www.npmjs.com/package/@universal-packages/token-registry)
[![Testing](https://github.com/universal-packages/universal-token-registry/actions/workflows/testing.yml/badge.svg)](https://github.com/universal-packages/universal-token-registry/actions/workflows/testing.yml)
[![codecov](https://codecov.io/gh/universal-packages/universal-token-registry/branch/main/graph/badge.svg?token=CXPJSN8IGL)](https://codecov.io/gh/universal-packages/universal-token-registry)

Simple subject registry by token. You may use this to give a way a token that can be used later to retrieve actual information from the registry,

## Install

```shell
npm install @universal-packages/token-registry
```

## Registry

`Registry` is the main class interface to start registering subjects to be retrieved later by their associated token.

```js
import { Registry } from '@universal-packages/token-registry'

const registry = new Registry()

const token = await registry.register({ id: 4 })

const myData = await registry.retrieve(token)

await registry.dispose(token)
```

> By default a registry uses a memory engine to store data, this may not be suitable for production environments.

## Engine

To create an engine that suits your requirements you just need to implement a new class as the following:

```js
export default class MyEngine implements EngineInterface {
  set(token, subject) {
    // Store the subject using the token as key
    // You may need to serialize the subject manually
  }

  get(token) {
    return // retrieve the subject from your engine using the token
  }

  delete(token) {
    // delete the entry from your engine using the token
  }
}
```

### Engine Interface

If you are using TypeScript just can implement the `EngineInterface` to ensure the right implementation.

```ts
import { EngineInterface } from '@universal-packages/token-registry'

export default class MyEngine implements EngineInterface {}
```

## Typescript

This library is developed in TypeScript and shipped fully typed.

## Contributing

The development of this library happens in the open on GitHub, and we are grateful to the community for contributing bugfixes and improvements. Read below to learn how you can take part in improving this library.

- [Code of Conduct](./CODE_OF_CONDUCT.md)
- [Contributing Guide](./CONTRIBUTING.md)

### License

[MIT licensed](./LICENSE).
