import axiosConfig from "../axiosConfig";


// lấy thông tin bài đăng
export const apiGetTopic = (payload) => new Promise((resolve, reject) => {
    try {
        const response = axiosConfig({
            method: 'post',
            url: 'api/auth/gettopic',
            data: payload
        })
        resolve(response)
    } catch (error) {
        reject(error)
    }
})
//
// thêm thông tin bài đăng
export const apiCreateTopic = (payload) => new Promise((resolve, reject) => {
    try {
        const response = axiosConfig({
            method: 'post',
            url: 'api/auth/createtopic',
            data: payload
        })
        resolve(response)
    } catch (error) {
        reject(error)
    }
})
// xóa thông tin bài đăng
export const apiDeleteTopic = (payload) => new Promise((resolve, reject) => {
    try {
        const response = axiosConfig({
            method: 'delete',
            url: 'api/auth/deletetopic',
            data: payload
        })
        resolve(response)
    } catch (error) {
        reject(error)
    }
})
// edit thông tin topic
export const apiEditTopic = (payload) => new Promise((resolve, reject) => {
    try {
        const response = axiosConfig({
            method: 'put',
            url: 'api/auth/edittopic',
            data: payload
        })
        resolve(response)
    } catch (error) {
        reject(error)
    }
})
// lấy thông tin topic
export const apiGetTopicInfor = (payload) => new Promise((resolve, reject) => {
    try {
        const response = axiosConfig({
            method: 'post',
            url: 'api/auth/gettopicinfor',
            data: payload
        })
        resolve(response)
    } catch (error) {
        reject(error)
    }
})