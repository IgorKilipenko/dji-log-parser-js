import Record from './record';

class Home extends Record {
    static TYPE_VALUE = 0x02;
    static TYPE_NAME = 'HOME';

    static get minLength(){
        return 46;
    }

    constructor(dataView, lineNum){
        super(dataView, lineNum);
        this._initValues();
    }

    _initValues = () => {
        this._longitude = (this.dataView.getFloat64(0, true) * 180) / Math.PI;
        this._latitude = (this.dataView.getFloat64(8, true) * 180) / Math.PI;
        this._height = this.dataView.getInt16(16, true) / 10;
    }


    get longitude() {
        return this._longitude;
    }

    get latitude() {
        return this._latitude;
    }

    get height() {
        return this._height;
    }
}

export default Home;