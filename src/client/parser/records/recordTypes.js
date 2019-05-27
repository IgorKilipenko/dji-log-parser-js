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

export default RECORD_TYPES;