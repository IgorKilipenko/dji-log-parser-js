import Record from './record';

class Osd extends Record {

    static TYPE_VALUE = 0x01;
    static TYPE_NAME = 'OSD';

    constructor(dataView, lineNum) {
        super(dataView, lineNum);
        this._initValues();
    }

    _initValues = () => {
        this._longitude = (this.dataView.getFloat64(0, true) * 180) / Math.PI;
        this._latitude = (this.dataView.getFloat64(8, true) * 180) / Math.PI;
        this._height = this.dataView.getInt16(16, true) / 10;
        this._xSpeed = this.dataView.getInt16(18, true) / 10;
        this._ySpeed = this.dataView.getInt16(20, true) / 10;
        this._zSpeed = this.dataView.getInt16(22, true) / 10;
        this._pitch = this.dataView.getInt16(24, true) / 10;
        this._rool = this.dataView.getInt16(26, true) / 10;
        this._yaw = this.dataView.getInt16(28, true) / 10;
        this._rcState = this.dataView.getSubByte(30, 0x80);
        this._flycState = this.dataView.getSubByte(30, 0x7f);
    };

    get longitude() {
        return this._longitude;
    }

    get latitude() {
        return this._latitude;
    }

    get height() {
        return this._height;
    }

    get xSpeed() {
        return this._xSpeed;
    }

    get ySpeed() {
        return this._ySpeed;
    }

    get zSpeed() {
        return this._zSpeed;
    }

    get pitch() {
        return this._pitch;
    }

    get rool() {
        return this._rool;
    }

    get yaw() {
        return this._yaw;
    }

    get rcState() {
        return this._rcState;
    }

    get flycState() {
        return this._flycState;
    }

    static get minLength(){
        return 53
    }
}

export default Osd;