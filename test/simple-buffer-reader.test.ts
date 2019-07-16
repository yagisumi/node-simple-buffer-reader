import { SimpleBufferReader } from "../src/simple-buffer-reader"

describe("SimpleBufferReader", () => {
  const bin8 = Uint8Array.of(0, 1, 2, 3, 4, 5, 6, 7)
  const bin8ff = Uint8Array.of(0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff)
  const bin_f32le = Uint8Array.of(43, 82, 154, 68, 81, 6, 158, 63)
  const bin_f32be = Uint8Array.of(68, 154, 82, 43, 63, 158, 6, 81)
  const bin_f64le = Uint8Array.of(173, 250, 92, 109, 69, 74, 147, 64, 93, 29, 91, 42, 202, 192, 243, 63)
  const bin_f64be = Uint8Array.of(64, 147, 74, 69, 109, 92, 250, 173, 63, 243, 192, 202, 42, 91, 29, 93)

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
    expect(r.seek(1)).toBeInstanceOf(SimpleBufferReader)
    expect(r.getPos()).toBe(1)
    expect(() => r.seek(buf.byteLength)).not.toThrow()
    expect(() => r.seek(9)).toThrow(/seek/)
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
    r.seek(2)
    expect(() => r.readInt32()).toThrow(/readInt32/)
  })

  test("readString(), peekString()", () => {
    const ary = Uint8Array.of(0x41, 0x42, 0x43, 0x44, 0x45, 0x46, 0x47, 0x48)
    const r = new SimpleBufferReader(ary.buffer)
    expect(r.peekString(4)).toBe("ABCD")
    expect(r.readString(4)).toBe("ABCD")
    expect(r.peekString(4)).toBe("EFGH")
    expect(r.readString(4)).toBe("EFGH")
    expect(r.getPos()).toBe(8)
    expect(() => r.peekString(4)).toThrow(/peekString/)
    expect(() => r.readString(4)).toThrow(/readString/)
    expect(r.peekString(4, 0)).toBe("ABCD")
    expect(r.getPos()).toBe(8)
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

    const buf3 = r.peekBuffer(4, 0)
    expect(buf3.byteLength).toBe(4)
    const view3 = new DataView(buf3)
    expect(view1.getInt32(0, true)).toBe(0x03020100)
    expect(r.getPos()).toBe(8)
  })

  function testPeekAndRead(
    bin: Uint8Array,
    littleEndian: boolean,
    nums: Array<number>,
    peekName: keyof Record<keyof SimpleBufferReader, ((pos?: number) => number)>,
    readName: keyof Record<keyof SimpleBufferReader, ((pos?: number) => number)>,
    isFloat: boolean
  ) {
    const r = new SimpleBufferReader(bin.buffer, littleEndian)

    for (const num of nums) {
      if (isFloat) {
        expect((r[peekName] as () => number)()).toBeCloseTo(num)
        expect((r[readName] as () => number)()).toBeCloseTo(num)
      } else {
        expect((r[peekName] as () => number)()).toBe(num)
        expect((r[readName] as () => number)()).toBe(num)
      }
    }
    expect(() => (r[peekName] as () => number)()).toThrow(new RegExp(peekName))
    expect(() => (r[readName] as () => number)()).toThrow(new RegExp(readName))

    if (isFloat) {
      expect((r[peekName] as (pos?: number) => number)(0)).toBeCloseTo(nums[0])
    } else {
      expect((r[peekName] as (pos?: number) => number)(0)).toBe(nums[0])
    }
  }

  const table: Array<[string, Parameters<typeof testPeekAndRead>]> = [
    // int8
    ["int8 +", [bin8, true, [0, 1, 2, 3, 4, 5, 6, 7], "peekInt8", "readInt8", false]],
    ["int8 -", [bin8ff, true, [-1, -1, -1, -1, -1, -1, -1, -1], "peekInt8", "readInt8", false]],
    // uint8
    ["uint8 +", [bin8, true, [0, 1, 2, 3, 4, 5, 6, 7], "peekUint8", "readUint8", false]],
    ["uint8 -", [bin8ff, true, [0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff], "peekUint8", "readUint8", false]],
    // int16 LE
    ["int16 LE +", [bin8, true, [0x0100, 0x0302, 0x0504, 0x0706], "peekInt16", "readInt16", false]],
    ["int16LE +", [bin8, false, [0x0100, 0x0302, 0x0504, 0x0706], "peekInt16LE", "readInt16LE", false]],
    ["int16 LE -", [bin8ff, true, [-1, -1, -1, -1], "peekInt16", "readInt16", false]],
    ["int16LE ", [bin8ff, false, [-1, -1, -1, -1], "peekInt16LE", "readInt16LE", false]],
    // int16 BE
    ["int16 BE +", [bin8, false, [0x0001, 0x0203, 0x0405, 0x0607], "peekInt16", "readInt16", false]],
    ["int16BE +", [bin8, true, [0x0001, 0x0203, 0x0405, 0x0607], "peekInt16BE", "readInt16BE", false]],
    ["int16 BE -", [bin8ff, false, [-1, -1, -1, -1], "peekInt16", "readInt16", false]],
    ["int16BE -", [bin8ff, true, [-1, -1, -1, -1], "peekInt16BE", "readInt16BE", false]],
    // uint16 LE
    ["uint16 LE +", [bin8, true, [0x0100, 0x0302, 0x0504, 0x0706], "peekUint16", "readUint16", false]],
    ["uint16LE +", [bin8, false, [0x0100, 0x0302, 0x0504, 0x0706], "peekUint16LE", "readUint16LE", false]],
    ["uint16 LE -", [bin8ff, true, [0xffff, 0xffff, 0xffff, 0xffff], "peekUint16", "readUint16", false]],
    ["uint16LE ", [bin8ff, false, [0xffff, 0xffff, 0xffff, 0xffff], "peekUint16LE", "readUint16LE", false]],
    // uint16 BE
    ["uint16 BE +", [bin8, false, [0x0001, 0x0203, 0x0405, 0x0607], "peekUint16", "readUint16", false]],
    ["uint16BE +", [bin8, true, [0x0001, 0x0203, 0x0405, 0x0607], "peekUint16BE", "readUint16BE", false]],
    ["uint16 BE -", [bin8ff, false, [0xffff, 0xffff, 0xffff, 0xffff], "peekUint16", "readUint16", false]],
    ["uint16BE -", [bin8ff, true, [0xffff, 0xffff, 0xffff, 0xffff], "peekUint16BE", "readUint16BE", false]],
    // int32 LE
    ["int32 LE +", [bin8, true, [0x03020100, 0x07060504], "peekInt32", "readInt32", false]],
    ["int32LE +", [bin8, false, [0x03020100, 0x07060504], "peekInt32LE", "readInt32LE", false]],
    ["int32 LE -", [bin8ff, true, [-1, -1], "peekInt32", "readInt32", false]],
    ["int32LE ", [bin8ff, false, [-1, -1], "peekInt32LE", "readInt32LE", false]],
    // int32 BE
    ["int32 BE +", [bin8, false, [0x00010203, 0x04050607], "peekInt32", "readInt32", false]],
    ["int32BE +", [bin8, true, [0x00010203, 0x04050607], "peekInt32BE", "readInt32BE", false]],
    ["int32 BE -", [bin8ff, false, [-1, -1], "peekInt32", "readInt32", false]],
    ["int32BE -", [bin8ff, true, [-1, -1], "peekInt32BE", "readInt32BE", false]],
    // uint32 LE
    ["uint32 LE +", [bin8, true, [0x03020100, 0x07060504], "peekUint32", "readUint32", false]],
    ["uint32LE +", [bin8, false, [0x03020100, 0x07060504], "peekUint32LE", "readUint32LE", false]],
    ["uint32 LE -", [bin8ff, true, [0xffffffff, 0xffffffff], "peekUint32", "readUint32", false]],
    ["uint32LE ", [bin8ff, false, [0xffffffff, 0xffffffff], "peekUint32LE", "readUint32LE", false]],
    // uint32 BE
    ["uint32 BE +", [bin8, false, [0x00010203, 0x04050607], "peekUint32", "readUint32", false]],
    ["uint32BE +", [bin8, true, [0x00010203, 0x04050607], "peekUint32BE", "readUint32BE", false]],
    ["uint32 BE -", [bin8ff, false, [0xffffffff, 0xffffffff], "peekUint32", "readUint32", false]],
    ["uint32BE -", [bin8ff, true, [0xffffffff, 0xffffffff], "peekUint32BE", "readUint32BE", false]],
    // Float32 LE
    ["float32 LE", [bin_f32le, true, [1234.5678, 1.2345678], "peekFloat32", "readFloat32", true]],
    ["float32LE", [bin_f32le, false, [1234.5678, 1.2345678], "peekFloat32LE", "readFloat32LE", true]],
    // Float32 BE
    ["float32 BE", [bin_f32be, false, [1234.5678, 1.2345678], "peekFloat32", "readFloat32", true]],
    ["float32BE", [bin_f32be, true, [1234.5678, 1.2345678], "peekFloat32BE", "readFloat32BE", true]],
    // Float64 LE
    ["float64 LE", [bin_f64le, true, [1234.5678, 1.2345678], "peekFloat64", "readFloat64", true]],
    ["float64LE", [bin_f64le, false, [1234.5678, 1.2345678], "peekFloat64LE", "readFloat64LE", true]],
    // Float64 BE
    ["float64 BE", [bin_f64be, false, [1234.5678, 1.2345678], "peekFloat64", "readFloat64", true]],
    ["float64BE", [bin_f64be, true, [1234.5678, 1.2345678], "peekFloat64BE", "readFloat64BE", true]],
  ]

  for (const args of table) {
    test(args[0], () => {
      testPeekAndRead(...args[1])
    })
  }
})
