/**
 * Simple Buffer Reader
 */
export class SimpleBufferReader {
  /**
   * Whether the endian is little endian when endian is not specified.
   */
  littleEndian: boolean
  private readonly buf: ArrayBuffer
  private readonly view: DataView
  private pos = 0
  private limit = -1

  /**
   *
   * @param buf buffer to read
   * @param littleEndian Whether the endian when endian is not specified is little endian
   */
  constructor(buf: ArrayBuffer, littleEndian = true) {
    this.buf = buf
    this.view = new DataView(buf)
    this.littleEndian = littleEndian
  }

  private stringify(obj: { [key: string]: number }) {
    const ary = []
    for (let key in obj) {
      ary.push(`${key}: ${obj[key]}`)
    }
    return `{ ${ary.join(", ")} }`
  }

  /**
   * Restrict position to read.
   * @param limit Limit
   * @throws RangeError
   */
  setLimit(limit: number) {
    if (limit < 0 || this.buf.byteLength < limit) {
      throw new RangeError(
        `Position out of range of buffer. setLimit: ${this.stringify({
          limit: limit,
          bufferLength: this.buf.byteLength,
        })}`
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
   * @throws RangeError
   */
  seek(pos: number) {
    if (pos < 0 || this.buf.byteLength < pos) {
      throw new RangeError(
        `Position out of range of buffer. seek: ${this.stringify({
          pos: pos,
          bufferLength: this.buf.byteLength,
        })}`
      )
    }

    this.pos = pos
    return this
  }

  /**
   * Skip a specific length
   * @param nByte skip length
   * @throws RangeError
   */
  skip(nByte: number) {
    this.checkPos(this.pos, nByte, "skip")
    this.pos += nByte
    return this
  }

  private checkPos(pos: number, readByte: number, method: string) {
    if (this.limit >= 0 && pos + readByte > this.limit) {
      throw new RangeError(
        `Position exceeds limit. ${method}: ${this.stringify({
          pos: pos,
          limit: this.limit,
          readByte: readByte,
        })}`
      )
    }

    if (pos + readByte > this.buf.byteLength) {
      throw new RangeError(
        `Position exceeds buffer length. ${method}: ${this.stringify({
          pos: pos,
          bufferLength: this.buf.byteLength,
          readByte: readByte,
        })}`
      )
    }
  }

  /**
   * Read as ASCII character string.
   * @param length Length to read
   * @throws RangeError
   */
  readString(length: number) {
    this.checkPos(this.pos, length, "readString")
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
   * @param pos Read start position
   * @throws RangeError
   */
  peekString(length: number, pos?: number) {
    const r_pos = pos == null ? this.pos : pos
    this.checkPos(r_pos, length, "peekString")
    const ary: Array<number> = []
    for (let i = 0; i < length; i++) {
      ary.push(this.view.getUint8(r_pos + i))
    }
    return String.fromCharCode(...ary)
  }

  /**
   * Slice buffer.
   * @param length Length to read
   * @throws RangeError
   */
  readBuffer(length: number) {
    this.checkPos(this.pos, length, "readBuffer")
    const r = this.buf.slice(this.pos, this.pos + length)
    this.pos += length
    return r
  }

  /**
   * Slice buffer without moving the reading position.
   * @param length Length to read
   * @param pos Read start position
   * @throws RangeError
   */
  peekBuffer(length: number, pos?: number) {
    const r_pos = pos == null ? this.pos : pos
    this.checkPos(r_pos, length, "peekBuffer")
    return this.buf.slice(r_pos, r_pos + length)
  }

  /**
   * @throws RangeError
   */
  readInt8() {
    this.checkPos(this.pos, 1, "readInt8")
    const r = this.view.getInt8(this.pos)
    this.pos += 1
    return r
  }

  /**
   * @param pos Read start position
   * @throws RangeError
   */
  peekInt8(pos?: number) {
    const r_pos = pos == null ? this.pos : pos
    this.checkPos(r_pos, 1, "peekInt8")
    return this.view.getInt8(r_pos)
  }

  /**
   * @throws RangeError
   */
  readUint8() {
    this.checkPos(this.pos, 1, "readUint8")
    const r = this.view.getUint8(this.pos)
    this.pos += 1
    return r
  }

  /**
   * @param pos Read start position
   * @throws RangeError
   */
  peekUint8(pos?: number) {
    const r_pos = pos == null ? this.pos : pos
    this.checkPos(r_pos, 1, "peekUint8")
    return this.view.getUint8(r_pos)
  }

  /**
   * @throws RangeError
   */
  readInt16() {
    this.checkPos(this.pos, 2, "readInt16")
    const r = this.view.getInt16(this.pos, this.littleEndian)
    this.pos += 2
    return r
  }

  /**
   * @param pos Read start position
   * @throws RangeError
   */
  peekInt16(pos?: number) {
    const r_pos = pos == null ? this.pos : pos
    this.checkPos(r_pos, 2, "peekInt16")
    return this.view.getInt16(r_pos, this.littleEndian)
  }

  /**
   * @throws RangeError
   */
  readInt16LE() {
    this.checkPos(this.pos, 2, "readInt16LE")
    const r = this.view.getInt16(this.pos, true)
    this.pos += 2
    return r
  }

  /**
   * @param pos Read start position
   * @throws RangeError
   */
  peekInt16LE(pos?: number) {
    const r_pos = pos == null ? this.pos : pos
    this.checkPos(r_pos, 2, "peekInt16LE")
    return this.view.getInt16(r_pos, true)
  }

  /**
   * @throws RangeError
   */
  readInt16BE() {
    this.checkPos(this.pos, 2, "readInt16BE")
    const r = this.view.getInt16(this.pos, false)
    this.pos += 2
    return r
  }

  /**
   * @param pos Read start position
   * @throws RangeError
   */
  peekInt16BE(pos?: number) {
    const r_pos = pos == null ? this.pos : pos
    this.checkPos(r_pos, 2, "peekInt16BE")
    return this.view.getInt16(r_pos, false)
  }

  /**
   * @throws RangeError
   */
  readUint16() {
    this.checkPos(this.pos, 2, "readUint16")
    const r = this.view.getUint16(this.pos, this.littleEndian)
    this.pos += 2
    return r
  }

  /**
   * @param pos Read start position
   * @throws RangeError
   */
  peekUint16(pos?: number) {
    const r_pos = pos == null ? this.pos : pos
    this.checkPos(r_pos, 2, "peekUint16")
    return this.view.getUint16(r_pos, this.littleEndian)
  }

  /**
   * @throws RangeError
   */
  readUint16LE() {
    this.checkPos(this.pos, 2, "readUint16LE")
    const r = this.view.getUint16(this.pos, true)
    this.pos += 2
    return r
  }

  /**
   * @param pos Read start position
   * @throws RangeError
   */
  peekUint16LE(pos?: number) {
    const r_pos = pos == null ? this.pos : pos
    this.checkPos(r_pos, 2, "peekUint16LE")
    return this.view.getUint16(r_pos, true)
  }

  /**
   * @throws RangeError
   */
  readUint16BE() {
    this.checkPos(this.pos, 2, "readUint16BE")
    const r = this.view.getUint16(this.pos, false)
    this.pos += 2
    return r
  }

  /**
   * @param pos Read start position
   * @throws RangeError
   */
  peekUint16BE(pos?: number) {
    const r_pos = pos == null ? this.pos : pos
    this.checkPos(r_pos, 2, "peekUint16BE")
    return this.view.getUint16(r_pos, false)
  }

  /**
   * @throws RangeError
   */
  readInt32() {
    this.checkPos(this.pos, 4, "readInt32")
    const r = this.view.getInt32(this.pos, this.littleEndian)
    this.pos += 4
    return r
  }

  /**
   * @param pos Read start position
   * @throws RangeError
   */
  peekInt32(pos?: number) {
    const r_pos = pos == null ? this.pos : pos
    this.checkPos(r_pos, 4, "peekInt32")
    return this.view.getInt32(r_pos, this.littleEndian)
  }

  /**
   * @throws RangeError
   */
  readInt32LE() {
    this.checkPos(this.pos, 4, "readInt32LE")
    const r = this.view.getInt32(this.pos, true)
    this.pos += 4
    return r
  }

  /**
   * @param pos Read start position
   * @throws RangeError
   */
  peekInt32LE(pos?: number) {
    const r_pos = pos == null ? this.pos : pos
    this.checkPos(r_pos, 4, "peekInt32LE")
    return this.view.getInt32(r_pos, true)
  }

  /**
   * @throws RangeError
   */
  readInt32BE() {
    this.checkPos(this.pos, 4, "readInt32BE")
    const r = this.view.getInt32(this.pos, false)
    this.pos += 4
    return r
  }

  /**
   * @param pos Read start position
   * @throws RangeError
   */
  peekInt32BE(pos?: number) {
    const r_pos = pos == null ? this.pos : pos
    this.checkPos(r_pos, 4, "peekInt32BE")
    return this.view.getInt32(r_pos, false)
  }

  /**
   * @throws RangeError
   */
  readUint32() {
    this.checkPos(this.pos, 4, "readUint32")
    const r = this.view.getUint32(this.pos, this.littleEndian)
    this.pos += 4
    return r
  }

  /**
   * @param pos Read start position
   * @throws RangeError
   */
  peekUint32(pos?: number) {
    const r_pos = pos == null ? this.pos : pos
    this.checkPos(r_pos, 4, "peekUint32")
    return this.view.getUint32(r_pos, this.littleEndian)
  }

  /**
   * @throws RangeError
   */
  readUint32LE() {
    this.checkPos(this.pos, 4, "readUint32LE")
    const r = this.view.getUint32(this.pos, true)
    this.pos += 4
    return r
  }

  /**
   * @param pos Read start position
   * @throws RangeError
   */
  peekUint32LE(pos?: number) {
    const r_pos = pos == null ? this.pos : pos
    this.checkPos(r_pos, 4, "peekUint32LE")
    return this.view.getUint32(r_pos, true)
  }

  /**
   * @throws RangeError
   */
  readUint32BE() {
    this.checkPos(this.pos, 4, "readUint32BE")
    const r = this.view.getUint32(this.pos, false)
    this.pos += 4
    return r
  }

  /**
   * @param pos Read start position
   * @throws RangeError
   */
  peekUint32BE(pos?: number) {
    const r_pos = pos == null ? this.pos : pos
    this.checkPos(r_pos, 4, "peekUint32BE")
    return this.view.getUint32(r_pos, false)
  }

  /**
   * @throws RangeError
   */
  readFloat32() {
    this.checkPos(this.pos, 4, "readFloat32")
    const r = this.view.getFloat32(this.pos, this.littleEndian)
    this.pos += 4
    return r
  }

  /**
   * @param pos Read start position
   * @throws RangeError
   */
  peekFloat32(pos?: number) {
    const r_pos = pos == null ? this.pos : pos
    this.checkPos(r_pos, 4, "peekFloat32")
    return this.view.getFloat32(r_pos, this.littleEndian)
  }

  /**
   * @throws RangeError
   */
  readFloat32LE() {
    this.checkPos(this.pos, 4, "readFloat32LE")
    const r = this.view.getFloat32(this.pos, true)
    this.pos += 4
    return r
  }

  /**
   * @param pos Read start position
   * @throws RangeError
   */
  peekFloat32LE(pos?: number) {
    const r_pos = pos == null ? this.pos : pos
    this.checkPos(r_pos, 4, "peekFloat32LE")
    return this.view.getFloat32(r_pos, true)
  }

  /**
   * @throws RangeError
   */
  readFloat32BE() {
    this.checkPos(this.pos, 4, "readFloat32BE")
    const r = this.view.getFloat32(this.pos, false)
    this.pos += 4
    return r
  }

  /**
   * @param pos Read start position
   * @throws RangeError
   */
  peekFloat32BE(pos?: number) {
    const r_pos = pos == null ? this.pos : pos
    this.checkPos(r_pos, 4, "peekFloat32BE")
    return this.view.getFloat32(r_pos, false)
  }

  /**
   * @throws RangeError
   */
  readFloat64() {
    this.checkPos(this.pos, 8, "readFloat64")
    const r = this.view.getFloat64(this.pos, this.littleEndian)
    this.pos += 8
    return r
  }

  /**
   * @param pos Read start position
   * @throws RangeError
   */
  peekFloat64(pos?: number) {
    const r_pos = pos == null ? this.pos : pos
    this.checkPos(r_pos, 8, "peekFloat64")
    return this.view.getFloat64(r_pos, this.littleEndian)
  }

  /**
   * @throws RangeError
   */
  readFloat64LE() {
    this.checkPos(this.pos, 8, "readFloat64LE")
    const r = this.view.getFloat64(this.pos, true)
    this.pos += 8
    return r
  }

  /**
   * @param pos Read start position
   * @throws RangeError
   */
  peekFloat64LE(pos?: number) {
    const r_pos = pos == null ? this.pos : pos
    this.checkPos(r_pos, 8, "peekFloat64LE")
    return this.view.getFloat64(r_pos, true)
  }

  /**
   * @throws RangeError
   */
  readFloat64BE() {
    this.checkPos(this.pos, 8, "readFloat64BE")
    const r = this.view.getFloat64(this.pos, false)
    this.pos += 8
    return r
  }

  /**
   * @param pos Read start position
   * @throws RangeError
   */
  peekFloat64BE(pos?: number) {
    const r_pos = pos == null ? this.pos : pos
    this.checkPos(r_pos, 8, "peekFloat64BE")
    return this.view.getFloat64(r_pos, false)
  }
}
