import axios from "axios"

export default {
    getAll: async () => {
        return await axios.get(`${import.meta.env.VITE_CATEGORY_API}`)
    },
    create: async (
        token: string,
        data: {
            title: string,
            link: string
        }
    ) => {
        return await axios.post(`${import.meta.env.VITE_CATEGORY_API}`, { token, data })
    },
    delete: async (
        token: string | null,
        data: {
            title: string
        }
    ) => {
        return await axios.delete(`${import.meta.env.VITE_CATEGORY_API}${data.title}`, {
            headers: {
                Authorization: token ? `Bearer ${token}` : undefined
            }
        })
    },
    update: async (
        token: string | null,
        title: string,
        data: {
            title: string,
            link: string
        }
    )=>{
        return await axios.patch(`${import.meta.env.VITE_CATEGORY_API}${title}`,data, {
            headers: {
                Authorization: token ? `Bearer ${token}` : undefined
            }
        })
    }

}