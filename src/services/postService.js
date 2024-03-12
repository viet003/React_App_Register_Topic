import axiosConfig from "../axiosConfig";
// lấy thông tin bài đăng
export const apiGetPost = (payload) => new Promise((resolve, reject) => {
    try {
        const response = axiosConfig({
            method: 'get',
            url: 'api/auth/getpost',
            data: payload
        })
        resolve(response)
    } catch (error) {
        reject(error)
    }
})
// thêm thông tin bài đăng
export const apiCreatePost = (payload) => new Promise((resolve, reject) => {
    try {
        const response = axiosConfig({
            method: 'post',
            url: 'api/auth/createpost',
            data: payload
        })
        resolve(response)
    } catch (error) {
        reject(error)
    }
})
// xóa thông tin bài đăng
export const apiDeletePost = (payload) => new Promise((resolve, reject) => {
    try {
        const response = axiosConfig({
            method: 'delete',
            url: 'api/auth/deletepost',
            data: payload
        })
        resolve(response)
    } catch (error) {
        reject(error)
    }
})