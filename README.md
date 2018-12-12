# @yagisumi/simple-buffer-reader

Welcome

[![NPM version][npm-image]][npm-url] [![install size][packagephobia-image]][packagephobia-url] [![DefinitelyTyped][dts-image]][dts-url]  
[![Build Status][travis-image]][travis-url] [![Coverage percentage][coveralls-image]][coveralls-url]

## Installation

```sh
$ npm i @yagisumi/simple-buffer-reader
```

## Usage

- javascript

```js
const SimpleBufferReader = require('@yagisumi/simple-buffer-reader').SimpleBufferReader;

const binary = Uint8Array.of(0, 1, 2, 3, 4, 5, 6, 7);
const reader = new SimpleBufferReader(binary.buffer);
try {
  console.log(reader.readInt32())
  console.log(reader.readInt32())
} catch(err) {
  throw err
}
```

- typescript

```ts
import { SimpleBufferReader } from '@yagisumi/simple-buffer-reader';

// ....
```

## Reference

https://yagisumi.github.io/node-simple-buffer-reader/

## License

[MIT License](https://opensource.org/licenses/MIT)

[npm-image]: https://img.shields.io/npm/v/@yagisumi/simple-buffer-reader.svg?style=flat-square
[npm-url]: https://npmjs.org/package/@yagisumi/simple-buffer-reader
[packagephobia-image]: https://flat.badgen.net/packagephobia/install/@yagisumi/simple-buffer-reader
[packagephobia-url]: https://packagephobia.now.sh/result?p=@yagisumi/simple-buffer-reader
[travis-image]: https://img.shields.io/travis/yagisumi/node-simple-buffer-reader.svg?style=flat-square
[travis-url]: https://travis-ci.org/yagisumi/node-simple-buffer-reader
[coveralls-image]: https://img.shields.io/coveralls/yagisumi/node-simple-buffer-reader.svg?style=flat-square
[coveralls-url]: https://coveralls.io/github/yagisumi/node-simple-buffer-reader?branch=master
[dts-image]: https://img.shields.io/badge/DefinitelyTyped-.d.ts-blue.svg?style=flat-square
[dts-url]: http://definitelytyped.org
