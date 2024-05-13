import { StoreType } from "@/stores";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import './detail.style.scss'
import { cartAction } from "@/stores/slices/cart.slice";
import { message } from "antd";
import { FaCartPlus } from "react-icons/fa";
import apis from "@/apis";
import { useEffect, useState } from "react";
import { Product } from "@/stores/slices/product.slice";

export default function Detail() {
    const { id } = useParams();
    const productStore = useSelector((store: StoreType) => store.productStore)
    const cartStore = useSelector((store: StoreType) => store.cartStore)
    const dispatch = useDispatch()

    const findProduct = productStore.data?.find((item) => item.id == Number(id))
    const userStore = useSelector((store: StoreType) => store.userStore)
    const [productDetail, setProductDetail] = useState<Product>()

   useEffect(()=>{
    const getProduct = async () => {
        try{
            let resProduct = await apis.productApi.getById(Number(id))
            setProductDetail(resProduct.data.data)

        }catch(err){
            console.log(err);
        }
    }
    getProduct()
   },[])

    const handleCreateCart = async (dataCreate: {
        productId: number,
        quantity: number,
        userId: number,
    }) => {
        try {
            if (!userStore.data) {
                message.error("Please login to create cart")
                return
            }
            let resCreateCart = await apis.cartApi.create(dataCreate);

            if (resCreateCart.status != 200) {
                throw {
                    message: "Create Cart Error"
                }
            }

            if (cartStore.data?.find(item => item.productId == resCreateCart.data.data.productId)) {
                dispatch(cartAction.update(resCreateCart.data.data))
            } else {
                dispatch(cartAction.create(resCreateCart.data.data))
            }
            message.success("Create Cart Success")

        } catch (err) {
            message.error("Create Cart Error")
        }
    }


    return (
        <>
            <div className="headerDetail">
                <h3>Detail Product: {productDetail?.name}</h3>
            </div>
            <div className="detailContent">
                <div className="leftContent">
                    <img src={`http://localhost:3000/${productDetail?.image}`} alt="" />
                </div>
                <div className="rightContent">
                    <h1>{productDetail?.name}</h1>
                    <h4>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(productDetail?.price as number)}</h4>
                    <p>{productDetail?.describe}</p>

                    <div className="btnProduct">
                        <button className="btn btnBuy" onClick={() => {
                            handleCreateCart({
                                userId: userStore.data?.id as number,
                                productId: Number(id),
                                quantity: 1
                            })

                        }}>Buy <span><FaCartPlus></FaCartPlus></span></button>
                    </div>
                </div>
            </div>
            <div dangerouslySetInnerHTML={{ __html: productDetail?.content as string }}>
            </div>
        </>


    );
}
