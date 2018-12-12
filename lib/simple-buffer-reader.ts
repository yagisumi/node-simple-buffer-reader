export class SimpleBufferReader {
  readonly buf: ArrayBuffer
  readonly view: DataView
  littleEndian: boolean
  private pos = 0
  private limit = -1

  constructor(buf: ArrayBuffer, littleEndian = true) {
    this.buf = buf
    this.view = new DataView(buf)
    this.littleEndian = littleEndian
  }

  setLimit(limit: number) {
    if (limit >= 0) {
      this.limit = limit
    }
    return this
  }

  resetLimit() {
    this.limit = -1
    return this
  }

  checkPos(readByte: number, method: string) {
    if (this.limit >= 0 && this.pos + readByte > this.limit) {
      throw new Error(
        `Position exceeds limit. ${method}: ${{
          pos: this.pos,
          limit: this.limit,
          readByte: readByte,
        }}`
      )
    }

    if (this.pos + readByte > this.buf.byteLength) {
      throw new Error(
        `Position exceeds buffer length. ${method}: ${{
          pos: this.pos,
          bufferLength: this.buf.byteLength,
          readByte: readByte,
        }}`
      )
    }
  }

  readString(length: number) {
    this.checkPos(length, "getString")
    const ary: Array<number> = []
    for (let i = 0; i < length; i++) {
      ary.push(this.view.getUint8(this.pos + i))
    }
    const r = String.fromCharCode(...ary)
    this.pos += length
    return r
  }

  peekString(length: number) {
    this.checkPos(length, "peekString")
    const ary: Array<number> = []
    for (let i = 0; i < length; i++) {
      ary.push(this.view.getUint8(this.pos + i))
    }
    return String.fromCharCode(...ary)
  }

  readInt8() {
    this.checkPos(1, "getInt8")
    const r = this.view.getInt8(this.pos)
    this.pos += 1
    return r
  }

  peekInt8() {
    this.checkPos(1, "getInt8")
    return this.view.getInt8(this.pos)
  }

  readInt16() {
    this.checkPos(2, "getInt16")
    const r = this.view.getInt16(this.pos, this.littleEndian)
    this.pos += 2
    return r
  }

  peekInt16() {
    this.checkPos(2, "peekInt16")
    return this.view.getInt16(this.pos, this.littleEndian)
  }

  readInt16LE() {
    this.checkPos(2, "getInt16LE")
    const r = this.view.getInt16(this.pos)
    this.pos += 2
    return r
  }

  peekInt16LE() {
    this.checkPos(2, "peekInt16LE")
    return this.view.getInt16(this.pos)
  }

  readInt16BE() {
    this.checkPos(2, "getInt16BE")
    const r = this.view.getInt16(this.pos, false)
    this.pos += 2
    return r
  }

  peekInt16BE() {
    this.checkPos(2, "peekInt16BE")
    return this.view.getInt16(this.pos, false)
  }

  readInt32() {
    this.checkPos(4, "getInt32")
    const r = this.view.getInt32(this.pos, this.littleEndian)
    this.pos += 4
    return r
  }

  peekInt32() {
    this.checkPos(4, "peekInt32")
    return this.view.getInt32(this.pos, this.littleEndian)
  }

  readInt32LE() {
    this.checkPos(4, "getInt32LE")
    const r = this.view.getInt32(this.pos)
    this.pos += 4
    return r
  }

  peekInt32LE() {
    this.checkPos(4, "peekInt32LE")
    return this.view.getInt32(this.pos)
  }

  readInt32BE() {
    this.checkPos(4, "getInt32BE")
    const r = this.view.getInt32(this.pos, false)
    this.pos += 4
    return r
  }

  peekInt32BE() {
    this.checkPos(4, "peekInt32BE")
    return this.view.getInt32(this.pos, false)
  }
}
