import axiosConfig from "../axiosConfig";
// đăng nhập
export const apiLogin = (payload) => new Promise((resolve, reject) => {
    try {
        const response = axiosConfig({
            method: 'post',
            url: 'api/auth/login',
            data: payload
        })
        resolve(response)
    } catch (error) {
        reject(error)
    }
})
// tạo tài khoản
export const apiRegister = (payload) => new Promise((resolve, reject) => {
    try {
        const response = axiosConfig({
            method: 'post',
            url: 'api/auth/register',
            data: payload
        })
        resolve(response)
    } catch (error) {
        reject(error)
    }
})
// lấy lại mật khẩu
export const apiGetPass = (payload) => new Promise((resolve, reject) => {
    try {
        const response = axiosConfig({
            method: 'post',
            url: 'api/auth/getpass',
            data: payload
        })
        resolve(response)
    } catch (error) {
        reject(error)
    }
})
// đổi mật khẩu
export const apiChangePass = (payload) => new Promise((resolve, reject) => {
    try {
        const response = axiosConfig({
            method: 'put',
            url: 'api/auth/changepass',
            data: payload
        })
        resolve(response)
    } catch (error) {
        reject(error)
    }
})
// lấy toàn bộ tài khoản
export const apiGetAccount = (payload) => new Promise((resolve, reject) => {
    try {
        const response = axiosConfig({
            method: 'post',
            url: 'api/auth/getaccount',
            data: payload
        })
        resolve(response)
    } catch (error) {
        reject(error)
    }
})
// xóa tài khoản
export const apiDeleteAccount = (payload) => new Promise((resolve, reject) => {
    try {
        const response = axiosConfig({
            method: 'delete',
            url: 'api/auth/deleteaccount',
            data: payload
        })
        resolve(response)
    } catch (error) {
        reject(error)
    }
})