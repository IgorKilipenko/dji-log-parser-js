import Record from './record';
import RECORD_TYPES from './recordTypes';

class Rc extends Record {
    static get TYPE_VALUE() {
        return 0x04;
    }
    static get TYPE_NAME() {
        return RECORD_TYPES[Rс.TYPE_VALUE];
    }

    static get minLength() {
        return 14; // previously, clarify later
    }

    constructor(dataView, lineNum) {
        super(dataView, lineNum);
        this._initValues();
    }

    _initValues = () => {
        this._aileron = this.dataView.getInt16(0, true);
        this._elevator = this.dataView.getInt16(2, true);
        this._throttle = this.dataView.getInt16(2, true);
    };

    get aileron(){
        return this._aileron;
    }

    get elevator(){
        return this._elevator;
    }

    get throttle(){
        return this._throttle;
    }

    get rudder
}

export default Rc;