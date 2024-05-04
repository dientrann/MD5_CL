import axios from "axios"

export default {
    login: async (data: {
        userName: string,
        password: string,
    }) => {
        return await axios.post(`${import.meta.env.VITE_USER_API}login`, data)
    },
    getData: async (token: string | null) => {
        return await axios.post(`${import.meta.env.VITE_USER_API}get-data`, { token })
    },
    register: async (data: {
        userName: string,
        password: string,
        email: string,
        passwordConfirm: string,
    }) => {
        return await axios.post(`${import.meta.env.VITE_USER_API}register`, data)
    },
    update: async (
        token: string,
        data: {
            password?: string,
            email?: string,
            emailConfirm?: boolean
            walet?: number
        }) => {
        return await axios.patch(`${import.meta.env.VITE_USER_API}update`, {token, data})
    },
    getDataByEmail: async (email: string)=>{
        return await axios.post(`${import.meta.env.VITE_USER_API}get-data-email`, {email})
    },
    forgotPassword: async (userName: string)=>{
        return await axios.post(`${import.meta.env.VITE_USER_API}forgot-password`, {userName})
    },
    getAll: async (token: string | null)=>{
        return await axios.get(`${import.meta.env.VITE_USER_API}`, {
            headers: {
                Authorization: token ? `Bearer ${token}` : undefined
            }
        })
    }
}