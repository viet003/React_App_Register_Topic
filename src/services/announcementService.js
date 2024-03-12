import axiosConfig from "../axiosConfig";
// đăng ký lớp
// lấy toàn bộ thông báo
export const apiGetAllAnnouncements = (payload) => new Promise((resolve, reject) => {
    try {
        const response = axiosConfig({
            method: 'post',
            url: 'api/auth/getannouncements',
            data: payload
        })
        resolve(response)
    } catch (error) {
        reject(error)
    }
})
// tạo thông báo
export const apiCreateAnnouncement = (payload) => new Promise((resolve, reject) => {
    try {
        const response = axiosConfig({
            method: 'post',
            url: 'api/auth/createannouncement',
            data: payload
        })
        resolve(response)
    } catch (error) {
        reject(error)
    }
})
// sửa thông báo
export const apiEditAnnouncement = (payload) => new Promise((resolve, reject) => {
    try {
        const response = axiosConfig({
            method: 'put',
            url: 'api/auth/editannouncement',
            data: payload
        })
        resolve(response)
    } catch (error) {
        reject(error)
    }
})
// xoas
export const apiDeleteAnnouncement = (payload) => new Promise((resolve, reject) => {
    try {
        const response = axiosConfig({
            method: 'delete',
            url: 'api/auth/deleteannouncement',
            data: payload
        })
        resolve(response)
    } catch (error) {
        reject(error)
    }
})