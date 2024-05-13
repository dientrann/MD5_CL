import axios from "axios"

export default {
    create: async (image: File) => {
        return await axios.post(`${import.meta.env.VITE_CAROUSEL_API}`, { image }, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
    },
    getAll: async () => {
        return await axios.get(`${import.meta.env.VITE_CAROUSEL_API}`)
    },
    delete: async (id: number) => {
        return await axios.delete(`${import.meta.env.VITE_CAROUSEL_API}${id}`)
    },
    update: async (id: number, image: File) => {
        return await axios.patch(`${import.meta.env.VITE_CAROUSEL_API}${id}`, { image }, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
    }
}