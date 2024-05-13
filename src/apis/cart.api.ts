import axios from "axios"

export default {
    getByUser: async (id: number) => {
        return await axios.get(`${import.meta.env.VITE_CART_API}${id}`)
    },
    create: async (data: {
        userId: number,
        productId: number,
        quantity: number,
    }) => {
        return await axios.post(`${import.meta.env.VITE_CART_API}`, data)
    },
    delete: async (id: number) => {
        return await axios.delete(`${import.meta.env.VITE_CART_API}${id}`)
    },
    update: async (id: number, data: {
        quantity: number
    }) => {
        return await axios.patch(`${import.meta.env.VITE_CART_API}${id}`, data)
    }

}