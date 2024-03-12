import CryptoJS from 'crypto-js';

const key = CryptoJS.enc.Utf8.parse(process.env.REACT_APP_CRYPT_KEY);
const iv = CryptoJS.enc.Utf8.parse(process.env.REACT_APP_CRYPT_IV);

export const encrypted = (data) => {
    if(!data) {
        return ''
    }
    const encryptedData = CryptoJS.AES.encrypt(
        data,
        key,
        {
            iv: iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        }
    );
    // Trả về dữ liệu mã hóa dưới dạng base64
    return encryptedData.toString();
}

export const decrypted = (data) => {
    if(!data) {
        return ''
    }
    const decryptedData = CryptoJS.AES.decrypt(
        data,
        key,
        {
            iv: iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        }
    );
    // Trả về dữ liệu giải mã dưới dạng UTF-8
    return decryptedData.toString(CryptoJS.enc.Utf8);
}
