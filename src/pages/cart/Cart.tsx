import { StoreType, dispatchFetch } from "@/stores";
import { useEffect } from "react";
import { useSelector } from "react-redux";

export default function Cart() {
    useEffect(() => {
        dispatchFetch.fetchCart()
    }, [])
    const cartStore = useSelector((store: StoreType) => store.cartStore)
    const productStore = useSelector((store: StoreType) => store.productStore)
    const findProduct = (id: number) => {
        return productStore.data?.find((item) => item.id == id)
    }
    console.log(cartStore.data);

    return (
        <div>
            {
                cartStore.data?.map((item, index) => {
                    return (
                        <DataGrid
                            rows={rows}
                            columns={columns}
                            initialState={{
                                pagination: {
                                    paginationModel: { page: 0, pageSize: 5 },
                                },
                            }}
                            pageSizeOptions={[5, 10]}
                            checkboxSelection
                        />)
                })
            }
        </div>
    );
}
