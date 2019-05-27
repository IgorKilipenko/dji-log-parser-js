import Record from './record';

class Custom extends Record {
    constructor(dataView) {
        super(dataView);
        this._initValues();
    }

    static TYPE_VALUE = 0x05;
    static TYPE_NAME = 'CUSTOM';

    _initValues = () => {
        this._isPhoto = this.dataView.getUint8(0) ? true : false;
        this._isVideo = this.dataView.getUint8(1) ? true : false;
        this._hSpeed = this.dataView.getFloat32(2, true);
        this._distance = this.dataView.getFloat32(6, true);
        this._dateTime = new Date(
            parseInt(this.dataView.getUint64(10, true))
        ).toISOString();

        //console.debug('[From Custom frame], Init valuse done', {Custom:this});
    };

    get distance() {
        return this._distance;
    }

    get hSpeed() {
        return this._hSpeed;
    }

    get isPhoto() {
        return this._isPhoto;
    }

    get isVideo() {
        return this._isVideo;
    }

    get dateTime() {
        return this._dateTime;
    }

    static get minLength() {
        return 19;
    }
}

export default Custom;
