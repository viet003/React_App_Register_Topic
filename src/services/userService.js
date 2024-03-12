import axiosConfig from "../axiosConfig";
// lấy thông tin người dùng
export const apiGetUser = (payload) => new Promise((resolve, reject) => {
    try {
        const response = axiosConfig({
            method: 'post',
            url: 'api/auth/getuser',
            data: payload
        })
        //console.log(payload)
        resolve(response)
    } catch (error) {
        reject(error)
    }
})
// thêm thông tin người dùng
export const apiCreateUser = (payload) => new Promise((resolve, reject) => {
    try {
        const response = axiosConfig({
            method: 'post',
            url: 'api/auth/createuser',
            data: payload
        })
        resolve(response)
    } catch (error) {
        reject(error)
    }
})
// xóa thông tin người dùng
export const apiDeleteUser = (payload) => new Promise((resolve, reject) => {
    try {
        const response = axiosConfig({
            method: 'delete',
            url: 'api/auth/deleteuser',
            data: payload
        })
        resolve(response)
    } catch (error) {
        reject(error)
    }
})
// Sửa thông tin người dùng
export const apiUpdateUser = (payload) => new Promise((resolve, reject) => {
    try {
        const response = axiosConfig({
            method: 'put',
            url: 'api/auth/updateuser',
            data: payload
        })
        resolve(response)
    } catch (error) {
        reject(error)
    }
})