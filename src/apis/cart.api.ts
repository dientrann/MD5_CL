import axios from "axios"

export default {
    getAll: async (id: number) => {
        return await axios.get(`${import.meta.env.VITE_CART_API}${id}`)
    },
    create: async (data: {
        userId: number,
        productId: number,
        quantity: number,
    }) =>{
        return await axios.post(`${import.meta.env.VITE_CART_API}`, data)
    }
}