import axios from "axios"

export default {
    getAll: async () => {
        return await axios.get(`${import.meta.env.VITE_PRODUCT_API}`)
    },
    create: async (image: File, dataCreate:{
        name: string,
        price: number,
        categoryId: number,
        content: string,
        describe: string,
    }) =>{
        return await axios.post(`${import.meta.env.VITE_PRODUCT_API}`, {image, dataCreate}, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
    }
}