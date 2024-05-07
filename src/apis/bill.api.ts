import axios from "axios"

export default {
    getAll: async (token: string | null) => {
        return await axios.get(`${import.meta.env.VITE_BILL_API}`, {
            headers: {
                Authorization: token ? `Bearer ${token}` : undefined
            }
        })
    },
    create: async (data: {
        userId: number,
        content: string,
        total: number,
    }) => {
        return await axios.post(`${import.meta.env.VITE_BILL_API}`, data)
    },
    getByUserId: async (userId: number) => {
        return await axios.get(`${import.meta.env.VITE_BILL_API}${userId}`)
    },
    updateStatus: async (id: number) => {
        return await axios.patch(`${import.meta.env.VITE_BILL_API}status`, { id })
    },
    delete: async (token: string | null, id: number) => {
        return await axios.delete(`${import.meta.env.VITE_BILL_API}${id}`, {
            headers: {
                Authorization: token ? `Bearer ${token}` : undefined
            }
        })
    }
}