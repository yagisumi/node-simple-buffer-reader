/**
 * Simple Buffer Reader
 */
export class SimpleBufferReader {
  readonly buf: ArrayBuffer
  readonly view: DataView
  littleEndian: boolean
  private pos = 0
  private limit = -1

  /**
   *
   * @param buf buffer to read
   * @param littleEndian littleEndian or not
   */
  constructor(buf: ArrayBuffer, littleEndian = true) {
    this.buf = buf
    this.view = new DataView(buf)
    this.littleEndian = littleEndian
  }

  /**
   * Restrict position to read.
   * @param limit Limit
   * @throws RangeError
   */
  setLimit(limit: number) {
    if (limit < 0 || this.buf.byteLength < limit) {
      throw new RangeError(
        `Position out of range of buffer. setLimit: ${{
          limit: limit,
          bufferLength: this.buf.byteLength,
        }}`
      )
    }

    this.limit = limit
    return this
  }

  /**
   * Reset Limit.
   */
  resetLimit() {
    this.limit = -1
    return this
  }

  /**
   * Get Limit.
   */
  getLimit() {
    if (this.limit >= 0) {
      return this.limit
    } else {
      return null
    }
  }

  /**
   * Return the current reading position.
   */
  getPos() {
    return this.pos
  }

  /**
   * Move the current reading position.
   * @param pos Position
   */
  seekPos(pos: number) {
    if (pos < 0 || this.buf.byteLength < pos) {
      throw new RangeError(
        `Position out of range of buffer. seekPos: ${JSON.stringify({
          pos: pos,
          bufferLength: this.buf.byteLength,
        })}`
      )
    }

    this.pos = pos
    return pos
  }

  private checkPos(readByte: number, method: string) {
    if (this.limit >= 0 && this.pos + readByte > this.limit) {
      throw new RangeError(
        `Position exceeds limit. ${method}: ${JSON.stringify({
          pos: this.pos,
          limit: this.limit,
          readByte: readByte,
        })}`
      )
    }

    if (this.pos + readByte > this.buf.byteLength) {
      throw new RangeError(
        `Position exceeds buffer length. ${method}: ${JSON.stringify({
          pos: this.pos,
          bufferLength: this.buf.byteLength,
          readByte: readByte,
        })}`
      )
    }
  }

  /**
   * Read as ASCII character string.
   * @param length Length to read
   */
  readString(length: number) {
    this.checkPos(length, "readString")
    const ary: Array<number> = []
    for (let i = 0; i < length; i++) {
      ary.push(this.view.getUint8(this.pos + i))
    }
    const r = String.fromCharCode(...ary)
    this.pos += length
    return r
  }

  /**
   * Peek as ASCII character string without moving the reading position.
   * @param length Length to read
   */
  peekString(length: number) {
    this.checkPos(length, "peekString")
    const ary: Array<number> = []
    for (let i = 0; i < length; i++) {
      ary.push(this.view.getUint8(this.pos + i))
    }
    return String.fromCharCode(...ary)
  }

  readInt8() {
    this.checkPos(1, "readInt8")
    const r = this.view.getInt8(this.pos)
    this.pos += 1
    return r
  }

  peekInt8() {
    this.checkPos(1, "peekInt8")
    return this.view.getInt8(this.pos)
  }

  readUint8() {
    this.checkPos(1, "readUint8")
    const r = this.view.getUint8(this.pos)
    this.pos += 1
    return r
  }

  peekUint8() {
    this.checkPos(1, "peekUint8")
    return this.view.getUint8(this.pos)
  }

  readInt16() {
    this.checkPos(2, "readInt16")
    const r = this.view.getInt16(this.pos, this.littleEndian)
    this.pos += 2
    return r
  }

  peekInt16() {
    this.checkPos(2, "peekInt16")
    return this.view.getInt16(this.pos, this.littleEndian)
  }

  readInt16LE() {
    this.checkPos(2, "readInt16LE")
    const r = this.view.getInt16(this.pos, true)
    this.pos += 2
    return r
  }

  peekInt16LE() {
    this.checkPos(2, "peekInt16LE")
    return this.view.getInt16(this.pos, true)
  }

  readInt16BE() {
    this.checkPos(2, "readInt16BE")
    const r = this.view.getInt16(this.pos, false)
    this.pos += 2
    return r
  }

  peekInt16BE() {
    this.checkPos(2, "peekInt16BE")
    return this.view.getInt16(this.pos, false)
  }

  readUint16() {
    this.checkPos(2, "readUint16")
    const r = this.view.getUint16(this.pos, this.littleEndian)
    this.pos += 2
    return r
  }

  peekUint16() {
    this.checkPos(2, "peekUint16")
    return this.view.getUint16(this.pos, this.littleEndian)
  }

  readUint16LE() {
    this.checkPos(2, "readUint16LE")
    const r = this.view.getUint16(this.pos, true)
    this.pos += 2
    return r
  }

  peekUint16LE() {
    this.checkPos(2, "peekUint16LE")
    return this.view.getUint16(this.pos, true)
  }

  readUint16BE() {
    this.checkPos(2, "readUint16BE")
    const r = this.view.getUint16(this.pos, false)
    this.pos += 2
    return r
  }

  peekUint16BE() {
    this.checkPos(2, "peekUint16BE")
    return this.view.getUint16(this.pos, false)
  }

  readInt32() {
    this.checkPos(4, "readInt32")
    const r = this.view.getInt32(this.pos, this.littleEndian)
    this.pos += 4
    return r
  }

  peekInt32() {
    this.checkPos(4, "peekInt32")
    return this.view.getInt32(this.pos, this.littleEndian)
  }

  readInt32LE() {
    this.checkPos(4, "readInt32LE")
    const r = this.view.getInt32(this.pos, true)
    this.pos += 4
    return r
  }

  peekInt32LE() {
    this.checkPos(4, "peekInt32LE")
    return this.view.getInt32(this.pos, true)
  }

  readInt32BE() {
    this.checkPos(4, "readInt32BE")
    const r = this.view.getInt32(this.pos, false)
    this.pos += 4
    return r
  }

  peekInt32BE() {
    this.checkPos(4, "peekInt32BE")
    return this.view.getInt32(this.pos, false)
  }

  readUint32() {
    this.checkPos(4, "readUint32")
    const r = this.view.getUint32(this.pos, this.littleEndian)
    this.pos += 4
    return r
  }

  peekUint32() {
    this.checkPos(4, "peekUint32")
    return this.view.getUint32(this.pos, this.littleEndian)
  }

  readUint32LE() {
    this.checkPos(4, "readUint32LE")
    const r = this.view.getUint32(this.pos, true)
    this.pos += 4
    return r
  }

  peekUint32LE() {
    this.checkPos(4, "peekUint32LE")
    return this.view.getUint32(this.pos, true)
  }

  readUint32BE() {
    this.checkPos(4, "readUint32BE")
    const r = this.view.getUint32(this.pos, false)
    this.pos += 4
    return r
  }

  peekUint32BE() {
    this.checkPos(4, "peekUint32BE")
    return this.view.getUint32(this.pos, false)
  }
}
