# @yagisumi/simple-buffer-reader

simple buffer reader

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

// ...
```

- typescript

```ts
import { SimpleBufferReader } from '@yagisumi/simple-buffer-reader';

// ....
```

- web browser

```html
<script src='https://unpkg.com/@yagisumi/simple-buffer-reader'></script>
```

## Example
```js
const SimpleBufferReader = require('@yagisumi/simple-buffer-reader').SimpleBufferReader;

const binary = Uint8Array.of(0, 1, 2, 3, 4, 5, 6, 7);
const reader = new SimpleBufferReader(binary.buffer);
try {
  console.log(reader.peekUint8()); //=> 0
  console.log(reader.readInt32LE().toString(16)); //=> "3020100"
  // position moved
  console.log(reader.peekUint8()); //=> 4
  console.log(reader.peekUint8(1)); //=> 1 peek with position
  console.log(reader.skip(2).readInt16BE().toString(16)); //=> "607"
  reader.seek(6) // position 8 -> 6
  reader.readInt32LE() //=> throw RangeError
} catch(err) {
  throw err;
}
```

## Documentation

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
