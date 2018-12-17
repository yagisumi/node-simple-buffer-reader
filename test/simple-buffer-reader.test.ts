import { SimpleBufferReader } from "../lib/simple-buffer-reader"

describe("SimpleBufferReader", () => {
  const bin8 = Uint8Array.of(0, 1, 2, 3, 4, 5, 6, 7)
  const bin8ff = Uint8Array.of(0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff)

  test("new SimpleBufferReader(buf)", () => {
    const buf = new ArrayBuffer(8)
    const r = new SimpleBufferReader(buf)
    expect(r).toBeInstanceOf(SimpleBufferReader)
  })

  test("new SimpleBufferReader(buf)", () => {
    const buf = new ArrayBuffer(8)
    const r = new SimpleBufferReader(buf, true)
    expect(r).toBeInstanceOf(SimpleBufferReader)
  })

  test("littleEndian", () => {
    const r = new SimpleBufferReader(bin8.buffer)
    expect(r.littleEndian).toBe(true)
    expect(r.peekInt16()).toBe(0x0100)
    r.littleEndian = false
    expect(r.peekInt16()).toBe(0x0001)

    const r2 = new SimpleBufferReader(bin8.buffer, false)
    expect(r2.littleEndian).toBe(false)
  })

  test("pos", () => {
    const buf = new ArrayBuffer(8)
    const r = new SimpleBufferReader(buf)
    expect(r.getPos()).toBe(0)
    expect(r.seekPos(1)).toBe(1)
    expect(() => r.seekPos(buf.byteLength)).not.toThrow()
    expect(() => r.seekPos(9)).toThrow(/seekPos/)
  })

  test("skip()", () => {
    const r = new SimpleBufferReader(bin8.buffer)
    expect(r.readInt8()).toBe(0)
    expect(r.skip(4)).toBeInstanceOf(SimpleBufferReader)
    expect(r.readInt8()).toBe(5)
    expect(() => r.skip(4)).toThrow(/skip/)
  })

  test("limit", () => {
    const buf = new ArrayBuffer(8)
    const r = new SimpleBufferReader(buf)
    expect(r.getLimit()).toBeNull()
    expect(() => r.setLimit(-100)).toThrow(/setLimit/)
    expect(() => r.setLimit(-100)).toThrow(RangeError)
    expect(r.setLimit(8)).toEqual(r)
    expect(r.resetLimit()).toEqual(r)
    expect(r.getLimit()).toBeNull()
    expect(r.setLimit(4)).toEqual(r)
    expect(r.getLimit()).toBe(4)
    r.seekPos(2)
    expect(() => r.readInt32()).toThrow(/readInt32/)
  })

  test("readString(), peekString()", () => {
    const ary = Uint8Array.of(0x41, 0x42, 0x43, 0x44, 0x45, 0x46, 0x47, 0x48)
    const r = new SimpleBufferReader(ary.buffer)
    expect(r.peekString(4)).toBe("ABCD")
    expect(r.readString(4)).toBe("ABCD")
    expect(r.peekString(4)).toBe("EFGH")
    expect(r.readString(4)).toBe("EFGH")
    expect(() => r.peekString(4)).toThrow(/peekString/)
    expect(() => r.readString(4)).toThrow(/readString/)
  })

  test("readBuffer(), peekBuffer()", () => {
    const r = new SimpleBufferReader(bin8.buffer)

    const buf1 = r.peekBuffer(4)
    expect(buf1.byteLength).toBe(4)
    expect(r.getPos()).toBe(0)
    const view1 = new DataView(buf1)
    expect(view1.getInt32(0, true)).toBe(0x03020100)

    const buf2 = r.readBuffer(4)
    expect(buf2.byteLength).toBe(4)
    expect(r.getPos()).toBe(4)
    const view2 = new DataView(buf2)
    expect(view2.getInt32(0, true)).toBe(0x03020100)

    r.readBuffer(4)
    expect(r.getPos()).toBe(8)
    expect(() => r.peekBuffer(4)).toThrow(/peekBuffer/)
    expect(() => r.readBuffer(4)).toThrow(/readBuffer/)
  })

  function testPeekAndRead(
    bin: Uint8Array,
    littleEndian: boolean,
    nums: Array<number>,
    peekName: keyof Record<keyof SimpleBufferReader, (() => number)>,
    readName: keyof Record<keyof SimpleBufferReader, (() => number)>
  ) {
    const r = new SimpleBufferReader(bin.buffer, littleEndian)

    for (const num of nums) {
      expect((r[peekName] as () => number)()).toBe(num)
      expect((r[readName] as () => number)()).toBe(num)
    }
    expect(() => (r[peekName] as () => number)()).toThrow(new RegExp(peekName))
    expect(() => (r[readName] as () => number)()).toThrow(new RegExp(readName))
  }

  const table: Array<[string, Parameters<typeof testPeekAndRead>]> = [
    // int8
    ["int8 +", [bin8, true, [0, 1, 2, 3, 4, 5, 6, 7], "peekInt8", "readInt8"]],
    ["int8 -", [bin8ff, true, [-1, -1, -1, -1, -1, -1, -1, -1], "peekInt8", "readInt8"]],
    // uint8
    ["uint8 +", [bin8, true, [0, 1, 2, 3, 4, 5, 6, 7], "peekUint8", "readUint8"]],
    ["uint8 -", [bin8ff, true, [0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff], "peekUint8", "readUint8"]],
    // int16 LE
    ["int16 LE +", [bin8, true, [0x0100, 0x0302, 0x0504, 0x0706], "peekInt16", "readInt16"]],
    ["int16LE +", [bin8, false, [0x0100, 0x0302, 0x0504, 0x0706], "peekInt16LE", "readInt16LE"]],
    ["int16 LE -", [bin8ff, true, [-1, -1, -1, -1], "peekInt16", "readInt16"]],
    ["int16LE ", [bin8ff, false, [-1, -1, -1, -1], "peekInt16LE", "readInt16LE"]],
    // int16 BE
    ["int16 BE +", [bin8, false, [0x0001, 0x0203, 0x0405, 0x0607], "peekInt16", "readInt16"]],
    ["int16BE +", [bin8, true, [0x0001, 0x0203, 0x0405, 0x0607], "peekInt16BE", "readInt16BE"]],
    ["int16 BE -", [bin8ff, false, [-1, -1, -1, -1], "peekInt16", "readInt16"]],
    ["int16BE -", [bin8ff, true, [-1, -1, -1, -1], "peekInt16BE", "readInt16BE"]],
    // uint16 LE
    ["uint16 LE +", [bin8, true, [0x0100, 0x0302, 0x0504, 0x0706], "peekUint16", "readUint16"]],
    ["uint16LE +", [bin8, false, [0x0100, 0x0302, 0x0504, 0x0706], "peekUint16LE", "readUint16LE"]],
    ["uint16 LE -", [bin8ff, true, [0xffff, 0xffff, 0xffff, 0xffff], "peekUint16", "readUint16"]],
    ["uint16LE ", [bin8ff, false, [0xffff, 0xffff, 0xffff, 0xffff], "peekUint16LE", "readUint16LE"]],
    // uint16 BE
    ["uint16 BE +", [bin8, false, [0x0001, 0x0203, 0x0405, 0x0607], "peekUint16", "readUint16"]],
    ["uint16BE +", [bin8, true, [0x0001, 0x0203, 0x0405, 0x0607], "peekUint16BE", "readUint16BE"]],
    ["uint16 BE -", [bin8ff, false, [0xffff, 0xffff, 0xffff, 0xffff], "peekUint16", "readUint16"]],
    ["uint16BE -", [bin8ff, true, [0xffff, 0xffff, 0xffff, 0xffff], "peekUint16BE", "readUint16BE"]],
    // int32 LE
    ["int32 LE +", [bin8, true, [0x03020100, 0x07060504], "peekInt32", "readInt32"]],
    ["int32LE +", [bin8, false, [0x03020100, 0x07060504], "peekInt32LE", "readInt32LE"]],
    ["int32 LE -", [bin8ff, true, [-1, -1], "peekInt32", "readInt32"]],
    ["int32LE ", [bin8ff, false, [-1, -1], "peekInt32LE", "readInt32LE"]],
    // int32 BE
    ["int32 BE +", [bin8, false, [0x00010203, 0x04050607], "peekInt32", "readInt32"]],
    ["int32BE +", [bin8, true, [0x00010203, 0x04050607], "peekInt32BE", "readInt32BE"]],
    ["int32 BE -", [bin8ff, false, [-1, -1], "peekInt32", "readInt32"]],
    ["int32BE -", [bin8ff, true, [-1, -1], "peekInt32BE", "readInt32BE"]],
    // uint32 LE
    ["uint32 LE +", [bin8, true, [0x03020100, 0x07060504], "peekUint32", "readUint32"]],
    ["uint32LE +", [bin8, false, [0x03020100, 0x07060504], "peekUint32LE", "readUint32LE"]],
    ["uint32 LE -", [bin8ff, true, [0xffffffff, 0xffffffff], "peekUint32", "readUint32"]],
    ["uint32LE ", [bin8ff, false, [0xffffffff, 0xffffffff], "peekUint32LE", "readUint32LE"]],
    // uint32 BE
    ["uint32 BE +", [bin8, false, [0x00010203, 0x04050607], "peekUint32", "readUint32"]],
    ["uint32BE +", [bin8, true, [0x00010203, 0x04050607], "peekUint32BE", "readUint32BE"]],
    ["uint32 BE -", [bin8ff, false, [0xffffffff, 0xffffffff], "peekUint32", "readUint32"]],
    ["uint32BE -", [bin8ff, true, [0xffffffff, 0xffffffff], "peekUint32BE", "readUint32BE"]],
  ]

  for (const args of table) {
    test(args[0], () => {
      testPeekAndRead(...args[1])
    })
  }
})
