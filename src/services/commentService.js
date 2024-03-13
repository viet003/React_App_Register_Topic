import axiosConfig from "../axiosConfig";
// đăng ký lớp
// lấy toàn bộ comment
export const apiGetAllComments = (payload) => new Promise((resolve, reject) => {
    try {
        const response = axiosConfig({
            method: 'post',
            url: 'api/auth/getcomments',
            data: payload
        })
        resolve(response)
    } catch (error) {
        reject(error)
    }
})
// tạo comment
export const apiCreateComment = (payload) => new Promise((resolve, reject) => {
    try {
        const response = axiosConfig({
            method: 'post',
            url: 'api/auth/createcomment',
            data: payload
        })
        resolve(response)
    } catch (error) {
        reject(error)
    }
})
// xóa comment
export const apiDeleteComment = (payload) => new Promise((resolve, reject) => {
    try {
        const response = axiosConfig({
            method: 'delete',
            url: 'api/auth/deletecomment',
            data: payload
        })
        resolve(response)
    } catch (error) {
        reject(error)
    }
})