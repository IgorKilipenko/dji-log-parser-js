import { EventEmitter } from 'events';
import KEYS from './keys';
import { Custom, Osd } from './records';

const OLD_HEADER_SIZE = 12;
const NEW_HEADER_SIZE = 100;
const MIN_RECORD_SIZE = 3; // type+0-length+FF

const RECORD_TYPES = {
    0x01: 'OSD',
    0x02: 'HOME',
    0x03: 'GIMBAL',
    0x04: 'RC',
    0x05: 'CUSTOM',
    0x06: 'DEFORM',
    0x07: 'CENTER_BATTERY',
    0x08: 'SMART_BATTERY',
    0x09: 'APP_TIP',
    0x0a: 'APP_WARN',
    0x0b: 'RC_GPS',
    0x0c: 'RC_DEBUG',
    0x0d: 'RECOVER',
    0x0e: 'APP_GPS',
    0x0f: 'FIRMWARE',
    0x10: 'OFDM_DEBUG',
    0x11: 'VISION_GROUP',
    0x12: 'VISION_WARN',
    0x13: 'MC_PARAM',
    0x14: 'APP_OPERATION',
    0x18: 'APP_SER_WARN',
    0x39: 'JPEG',
    0xfe: 'OTHER',
    0xff: 'END'
};

class Binary extends EventEmitter {
    constructor() {
        super();
    }

    parse = buffer => {
        return new Promise(async (reslove, reject) => {
            console.debug('Start parsing');
            if (!buffer) {
                const err = {
                    type: 'error',
                    msg: 'Buffer is empty',
                    info: { buffer }
                };
                this.emit('error', err);
                reject(err);
            } else if (typeof buffer === 'string') {
                console.debug('Buffer is string');
                try {
                    buffer = await Binary.loadFile(buffer);
                } catch (err) {
                    this.emit('error', err);
                    reject(err);
                }
            } else if (!(buffer instanceof ArrayBuffer)) {
                const err = {
                    type: 'error',
                    msg: 'Input buffer error, buffer not instainseof ArrayBuffer and not url string',
                    info: {
                        buffer
                    }
                };
                this.emit('error', err);
                reject(err);
            }

            const buildTable = () => {
                return {
                    fileInfo: {},
                    records: Object.keys(RECORD_TYPES).reduce((obj, val) => {
                        obj[val] = { count: 0 };
                        return obj;
                    }, {})
                };
            };

            const statTable = buildTable();

            console.debug({ bufferType: typeof buffer });

            const dataView = new DataView(buffer);
            const detailsAddress = dataView.getUint64(0, true);
            const versionNumber = dataView.getUint32(8, false);
            const encryptedObs = dataView.getInt8(10, true);

            //console.assert(detailsAddress, 'Details address not found', {
            //    detailsAddress: detailsAddress
            //});

            let headerSize;
            let encrypted;

            if ((versionNumber & 0x0000ff00) < 0x00000600) {
                headerSize = OLD_HEADER_SIZE;
                encrypted = false;
            } else {
                headerSize = NEW_HEADER_SIZE;
                encrypted = true;
            }

            statTable.fileInfo = {
                ...statTable.fileInfo,
                headerSize,
                encrypted,
                detailsAddress: detailsAddress,
                versionNumber: versionNumber
            };

            console.debug('[FELE INFO]', { statTable });

            const minFileSize = headerSize + MIN_RECORD_SIZE;
            if (detailsAddress < minFileSize || detailsAddress > dataView.byteLength) {
                const err = {
                    type: 'error',
                    msg: 'Bed file size',
                    info: {
                        minFileSize,
                        detailsAddress: detailsAddress,
                        fileLength: dataView.byteLength
                    }
                };
                this.emit('error', err);
                reject(err);
            }

            /* Parsing all of the records in the file */
            let offset = headerSize;
            const endRecordArea = detailsAddress;
            while (offset < endRecordArea) {
                let frameInfo = this._isRecordSet(offset, dataView, detailsAddress, encrypted);
                if (frameInfo) {
                    offset = this.parseRecord(frameInfo, statTable);
                } else {
                    offset++;
                }
            }

            console.debug({ statTable });
            this.emit('parseend', statTable);
            reslove(statTable);
        });
    };

    _isImage = (offset, dataView) => {
        if (offset + 4 >= dataView.byteLength) {
            this.emit('error', 'offset > bytes length', {
                offset,
                byteLength: tdataView.byteLength
            });
            return false;
        }
        const header = dataView.getUint32(offset, true);
        return header == 3774863615;
    };

    _isRecordSet = (offset, dataView, detailsAddress, encrypted = true) => {
        let key = null;
        const recTypeId = dataView.getUint8(offset++);
        const length = dataView.getUint8(offset++);

        if (offset + length + 1 > detailsAddress) {
            return false;
        }
        const end = dataView.getUint8(offset + length);

        if (recTypeId == 0 || end != 0xff) {
            return false;
        } else {
            const type = RECORD_TYPES[recTypeId];
            if (!type) {
                this.emit('warn', 'Id is not in types range', {
                    id: recTypeId,
                    offset
                });
                return false;
            }

            let frameInfo = {};

            if (encrypted) {
                const bytekey = dataView.getUint8(offset++);
                const tableIndex = ((recTypeId - 1) << 8) | bytekey;
                if (tableIndex >= KEYS.length) {
                    this.emit('warn', 'Key ID not in range of encrypted keys table', {
                        tableIndex,
                        offset
                    });
                    return false;
                } else {
                    frameInfo = {
                        bytekey,
                        tableIndex
                    };
                }
            }

            frameInfo = {
                ...frameInfo,
                recTypeId,
                type,
                recordStart: offset,
                recordLimit: encrypted ? offset + length - 1 : offset + length, // position of the 0xFF 'End of record' byte,
                encrypted,
                dataView
            };

            return frameInfo;
        }
    };

    parseRecord = (frameInfo, statTable) => {
        const {
            recTypeId,
            type,
            bytekey,
            tableIndex,
            recordStart,
            recordLimit, // position of the 0xFF 'End of record' byte
            encrypted,
            dataView,
            ...other
        } = frameInfo;

        const encryptedKey = KEYS[tableIndex];

        console.assert(recordLimit < dataView.byteLength, 'End of payload block > byteLength', {
            recordLimit,
            recordStart,
            byteLength: dataView.byteLength
        });

        let bytes = new Uint8Array(dataView.buffer.slice(recordStart, recordLimit));
        const length = recordLimit - recordStart;

        if (encrypted) {
            bytes = bytes.map((byte, i) => byte ^ encryptedKey[i % 8]);
        }

        const payloadView = new DataView(bytes.buffer);
        let nextRecordAddress = recordStart + 1;

        let data = null;
        try {
            data = this.createRecordAt(recTypeId, payloadView, statTable);
        } catch (err) {
            console.error(`Parsing error [${RECORD_TYPES[recTypeId]}]`, {
                err,
                type: RECORD_TYPES[recTypeId],
                recTypeId,
                recordStart,
                recordLimit,
                recordLength: payloadView.byteLength,
                payloadView
            });
        }

        if (data != null) {
            this.emit(type.toLowerCase(), { data, frameInfo });
            const calcSumAvg = (prevAvg, val, count) => {
                return prevAvg + (val - prevAvg) / count;
            };
            let statRec = statTable.records[recTypeId];
            if (statRec) {
                const recOffset = recordStart - statTable.fileInfo.headerSize - 1;
                statRec.count++;
                statRec.minLength = statRec.minLength ? Math.min(statRec.minLength, length) : length;
                statRec.maxLength = statRec.maxLength ? Math.max(statRec.maxLength, length) : length;
                statRec.avgLength = statRec.avgLength ? calcSumAvg(statRec.avgLength, length, statRec.count) : length;
                statRec.offsetDif = statRec.offsetDif ? calcSumAvg(statRec.offsetDif, recOffset - statRec.recordNetOffset, statRec.count) : recOffset;
                statRec.recordNetOffset = recOffset;
                statTable.records[recTypeId] = statRec;
            }
            nextRecordAddress = recordLimit + 1;
        }

        return nextRecordAddress;
    };

    createRecordAt = (recTypeId, payloadView, statTable) => {
        let data = null;
        const checkLength = minLen => {
            if (payloadView.byteLength >= minLen) {
                return true;
            }
            return false;
        };
        const count = statTable.records[recTypeId] ? statTable.records[recTypeId].count : 0;

        switch (recTypeId) {
            case Osd.TYPE_VALUE:
                if (!checkLength(Osd.minLength)) {
                    break;
                }
                data = new Osd(payloadView, count + 1);
                break;
            case Custom.TYPE_VALUE:
                if (!checkLength(Custom.minLength)) {
                    break;
                }
                data = new Custom(payloadView, count + 1);
                break;
        }
        return data;
    };

    _parseImage = (offset, dataView, detailsAddress) => {
        const start = offset;
        while (offset < detailsAddress) {
            if (dataView.getUint16 == 55807) {
                // End JFIF marker 0xFF 0xD9
                offset += 2;
                this.emit('image', {
                    offset: start,
                    buffer: dataView.slice(start, offset)
                });
                break;
            }
            offset++;
        }
        console.assert(offset > start, '[In extractImage]: offset test warn, start offset === end offset', { start, offset });
        if (offset === start) {
            this.emit('warn', `Extract image warn, error parsing image block. start offset === end offset`, { start, offset });
            offset++;
        }
        return offset;
    };

    static loadFile = url => {
        return new Promise((reslove, reject) => {
            console.debug('Start load file');
            const xhr = new XMLHttpRequest();

            console.debug({ url });

            xhr.addEventListener('error', e => {
                reject({ msg: 'File load error', e });
            });

            xhr.addEventListener(
                'load',
                e => {
                    console.debug({ xhr, e });
                    if (xhr.status === 200 && e.loaded > 0) {
                        console.debug('File loaded', { e });
                        reslove(xhr.response);
                    } else {
                        reject({ msg: 'File load err', status: xhr.status, e });
                    }
                },
                false
            );

            xhr.open('GET', url, true);
            xhr.responseType = 'arraybuffer';
            xhr.send(null);
        });
    };
}

export default Binary;
