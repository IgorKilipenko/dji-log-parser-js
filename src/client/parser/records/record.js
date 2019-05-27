DataView.prototype.getUint64 = function(byteOffset, littleEndian = true) {
    // split 64-bit number into two 32-bit parts
    const left = this.getUint32(byteOffset, littleEndian);
    const right = this.getUint32(byteOffset + 4, littleEndian);

    // combine the two 32-bit values
    const combined = littleEndian
        ? left + 2 ** 32 * right
        : 2 ** 32 * left + right;

    if (!Number.isSafeInteger(combined))
        console.warn(
            combined,
            'exceeds MAX_SAFE_INTEGER. Precision may be lost'
        );

    return combined;
};

DataView.prototype.getSubByte = function(byteOffset, mask) {
    let byte = this.getUint8(byteOffset);
    byte &= mask;
    while (mask != 0x00 && (mask & 0x01) == 0) {
        byte >>= 1;
        mask >>= 1;
    }
    return byte;
};

class Record {
    constructor(dataView, lineNum = null) {
        this._dataView = dataView;
        this._lineNum = lineNum;
    }

    get dataView(){
        return this._dataView;
    }

    get lineNum(){
        return this._lineNum;
    }
}

export default Record;
