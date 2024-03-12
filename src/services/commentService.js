import axiosConfig from "../axiosConfig";
// đăng ký lớp
// lấy toàn bộ thông báo
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
// tạo thông báo
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
