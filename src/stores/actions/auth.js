import actionTypes from "./actionTypes";
import { apiLogin } from "../../services/authService";


export const login = (payload) => async (dispatch) => {
    try {
        const response = await apiLogin(payload)
        if(response?.data.err === 0) {
            dispatch({
                type:actionTypes.LOGIN_SUCCESS,
                data:response?.data
            })
        } else {
            dispatch({
                type:actionTypes.LOGIN_FAIL,
                data:response?.data
            })
        }
        return response
    } catch (error) {
        dispatch({
            type: actionTypes.LOGIN_FAIL,
            data: null
        })
    }
}


export const logout = () => ({
    type: actionTypes.LOGOUT
})