import axios from "axios"

export default {
    getAll: async () => {
        return await axios.get(`${import.meta.env.VITE_PRODUCT_API}`)
    },
    create: async (image: File, dataCreate: {
        name: string,
        price: number,
        categoryId: number,
        content: string,
        describe: string,
    }) => {
        return await axios.post(`${import.meta.env.VITE_PRODUCT_API}`, { image, dataCreate }, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
    },
    update: async (id: number, image: File, dataUpdate: {
        name?: string;
        describe?: string;
        price?: number;
        categoryId?: number;
        content?: string;
    }) => {
        return await axios.patch(`${import.meta.env.VITE_PRODUCT_API}${id}`, { image, dataUpdate }, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
    },
    delete: async (id: number) => {
        return await axios.delete(`${import.meta.env.VITE_PRODUCT_API}${id}`)
    },
    getPage: async (
        categoryId: number,
        page: number

    ) => {
        return await axios.get(`${import.meta.env.VITE_PRODUCT_API}${categoryId}/${page}`)
    },
    search: async (search: string) => {
        return await axios.get(`${import.meta.env.VITE_PRODUCT_API}${search}`)
    },
    getProductHome: async () => {
        return await axios.get(`${import.meta.env.VITE_PRODUCT_API}homepage`)
    },
    getById: async (id: number) => {
        return await axios.get(`${import.meta.env.VITE_PRODUCT_API}get-one/${id}`)
    }

}
