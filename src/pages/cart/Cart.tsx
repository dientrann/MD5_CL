import { StoreType, dispatchFetch } from "@/stores";
import { useEffect, useState } from "react";
import { PiMinusCircle, PiPlusCircle } from "react-icons/pi";
import { useDispatch, useSelector } from "react-redux";

import './cart.style.scss'
import { cartAction } from "@/stores/slices/cart.slice";
import apis from "@/apis";
import { message } from "antd";
import { MdDeleteForever } from "react-icons/md";
import { FaRegMoneyBillAlt } from "react-icons/fa";
import { billUserAction } from "@/stores/slices/billUser.slice";
import { TiCancel } from "react-icons/ti";

export default function Cart() {
    useEffect(() => {
        if (userStore.data == null) {
            dispatchFetch.fetchUser()
        }
        if (productStore.data == null) {
            dispatchFetch.fetchProduct()
        }
        if(cartStore.data == null){
            dispatchFetch.fetchCart()
        }
        if(billUserStore.data == null){
            dispatchFetch.fetchBillUser()
        }
    }, [])
    const userStore = useSelector((store: StoreType) => store.userStore)
    const cartStore = useSelector((store: StoreType) => store.cartStore)
    const productStore = useSelector((store: StoreType) => store.productStore)
    const billUserStore = useSelector((store: StoreType) => store.billUserStore)

    const findProduct = (id: number) => {
        return productStore.data?.find((item) => item.id == id)
    }
    const [isCheckedAll, setIsCheckedAll] = useState(false);
    const dispatch = useDispatch()
    const handleCheckboxChangeAll = () => {
        setIsCheckedAll(!isCheckedAll);
        document.querySelectorAll('input[type="checkbox"]').forEach((checkbox) => {
            (checkbox as any).checked = !isCheckedAll;
        })
    };

    const handleBuy = async () => {
        try {
            let carts = new Array();
            document.querySelectorAll('input[type="checkbox"]').forEach((checkbox) => {
                if ((checkbox as any).checked) {
                    cartStore.data?.find((item) => {
                        if ((checkbox as any).value == item.id) {
                            const product = findProduct(item.productId)
                            carts.push({ ...item, total: product?.price as number * item.quantity })
                        }
                    })
                }
            })

            const dataBill = {
                userId: userStore.data?.id as number,
                content: JSON.stringify(carts),
                total: (carts.reduce((accumulator, item) => accumulator + item.total, 0)) as number
            }

            let resBill = await apis.billApi.create(dataBill)
            if (resBill.status != 200) {
                throw {
                    message: "Create bill fail"
                }
            }
            if (resBill.data.cartData) {
                resBill.data.cartData.map((item: any) => {
                    dispatch(cartAction.delete(item.id))
                })
            }
            message.success("Create bill success")
            dispatch(billUserAction.create(resBill.data.data))
        } catch (err: any) {
            message.error(err.message ? err.message : "Create bill fail")
        }
    }

    const handelDelete = async (id: number) => {
        console.log(id);
        try {
            let resDelete = await apis.cartApi.delete(id)
            if (resDelete.status != 200) {
                throw {
                    message: "Delete cart fail"
                }
            }
            dispatch(cartAction.delete(resDelete.data.data.id))
            message.success("Delete cart success")

        } catch (err) {
            message.error((err as any).response.data.message ? (err as any).response.data.message.join(', ') : "Login failed");
        }
    }

    const handleCancel = async (id: number) => {
        try {
            let resDelete = await apis.billApi.delete(localStorage.getItem("token"), id)
            if (resDelete.status != 200) {
                throw {
                    message: "Delete cart fail"
                }
            }
            console.log(resDelete);
            dispatch(billUserAction.delete(resDelete.data.data.id))
            message.success("Cancle cart success")

        } catch (err) {
            console.log(err);

        }
    }


    return (
        <div className="bodyCart">
            <h3>Cart</h3>
            <input type="checkbox" id="0" checked={isCheckedAll} onChange={() => {
                handleCheckboxChangeAll()
            }} />
            {
                cartStore.data?.map((item, index) => {
                    let product = findProduct(item.productId)
                    return (
                        <div className="cart-item" key={index}>
                            <div className="checkBox">
                                <input
                                    type="checkbox"
                                    id={String(item.id)}
                                    value={item.id}
                                />
                            </div>
                            <div className="rightContent">
                                <div className="nameCart">
                                    <h3>{product?.name}</h3>
                                </div>
                                <div className="contentCart">
                                    <div className="imgCart">
                                        <img src={`${import.meta.env.VITE_SERVER + product?.image}`} alt="" />
                                    </div>
                                    <div className="content">
                                        <div className="descriptionCart">
                                            <h5>{product?.describe}</h5>
                                        </div>
                                        <div className="priceCart">
                                            <h4>Price: {product?.price}</h4>
                                        </div>
                                        <div className="total">
                                            <div className="quantityCart">
                                                <h4> <span onClick={() => {
                                                    dispatch(cartAction.update({ ...item, quantity: item.quantity - 1 }))
                                                }}><PiMinusCircle /></span>{item.quantity}<span onClick={() => {
                                                    dispatch(cartAction.update({ ...item, quantity: item.quantity + 1 }))
                                                }}><PiPlusCircle /></span> </h4>
                                            </div>
                                            <div className="totalCart">
                                                <h3>Total: {product?.price as number * item.quantity}</h3>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="tool">
                                <button className="btnDelete" onClick={() => {
                                    handelDelete(item.id)
                                }}>Delete<span><MdDeleteForever></MdDeleteForever></span></button>
                            </div>
                        </div>
                    )
                })}

            <div className="btn"> <button className="buyBtn" onClick={() => {
                handleBuy()
            }}>Build <span><FaRegMoneyBillAlt /></span></button></div>
            <div className="Bill">
                <h3>Bill</h3>
                {
                    billUserStore.data?.map((item, index) => {
                        return (
                            <div className="itemBill" key={index}>
                                <div className="stt">{index + 1}</div>
                                <div className="product">{JSON.parse(item.content).map((itemContent: any, index2: any) => {
                                    return (
                                        <div key={index2}>{productStore.data?.find(itemProduct => itemProduct.id == itemContent.productId)?.name}</div>
                                    )
                                })}</div>
                                <div className="total">{item.total}</div>
                                <div className="status">{item.status == "PENDING" ? <button className="btn btnCancel" onClick={() => {
                                    handleCancel(item.id)
                                }}>Cancel <span><TiCancel /></span></button> : item.status}</div>
                            </div>
                        )
                    })
                }
            </div>
        </div >
    );
}
