import Record from './record';
import RECORD_TYPES from './recordTypes';

class Gimbal extends Record {
    static TYPE_VALUE = 0x03;
    static get TYPE_NAME() {
        return RECORD_TYPES[Gimbal.TYPE_VALUE]
    }

    static get minLength() {
        return 12;
    }

    constructor(dataView, lineNum) {
        super(dataView, lineNum);
        this._initValues();
    }

    _initValues = () => {
        this._pitch = this.dataView.getInt16(0, true) / 10;
        this._rool = this.dataView.getInt16(2, true) / 10;
        this._yaw = this.dataView.getInt16(4, true) / 10;
        this._mode = this.dataView.getSubByte(6, 0xc0);
        this._rollAdjust = this.dataView.getInt16(4, true) / 10;
    };

    get pitch() {
        return this._pitch;
    }

    get rool() {
        return this._rool;
    }

    get yaw() {
        return this._yaw;
    }

    get mode() {
        return this._mode;
    }

    get rollAdjust() {
        return this._rollAdjust;
    }
}

export default Gimbal;
