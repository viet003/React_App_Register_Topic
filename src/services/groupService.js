import axiosConfig from "../axiosConfig";
// đăng ký lớp
export const apiAddToGroup = (payload) => new Promise((resolve, reject) => {
    try {
        const response = axiosConfig({
            method: 'post',
            url: 'api/auth/addtogroup',
            data: payload
        })
        resolve(response)
    } catch (error) {
        reject(error)
    }
})
// chấp nhận
export const apiAcceptToGroup = (payload) => new Promise((resolve, reject) => {
    try {
        const response = axiosConfig({
            method: 'put',
            url: 'api/auth/accepttogroup',
            data: payload
        })
        resolve(response)
    } catch (error) {
        reject(error)
    }
})
// từ chối
export const apiRemoveFromGroup = (payload) => new Promise((resolve, reject) => {
    try {
        const response = axiosConfig({
            method: 'delete',
            url: 'api/auth/removefromgroup',
            data: payload
        })
        resolve(response)
    } catch (error) {
        reject(error)
    }
})
// lấy thông tin lớp
export const apiGetGroup = (payload) => new Promise((resolve, reject) => {
    try {
        const response = axiosConfig({
            method: 'post',
            url: 'api/auth/getgroup',
            data: payload
        })
        resolve(response)
    } catch (error) {
        reject(error)
    }
})
// lấy thông tin sinh viên
export const apiStudentGroup = (payload) => new Promise((resolve, reject) => {
    try {
        const response = axiosConfig({
            method: 'post',
            url: 'api/auth/getstudent',
            data: payload
        })
        resolve(response)
    } catch (error) {
        reject(error)
    }
})