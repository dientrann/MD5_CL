import { StoreType, dispatchFetch } from "@/stores";
import { useEffect, useState } from "react";
import { PiMinusCircle, PiPlusCircle } from "react-icons/pi";
import { useDispatch, useSelector } from "react-redux";

import './cart.style.scss'
import { cartAction } from "@/stores/slices/cart.slice";
import apis from "@/apis";
import { Pagination, PaginationProps, message } from "antd";
import { MdDeleteForever } from "react-icons/md";
import { FaRegMoneyBillAlt } from "react-icons/fa";
import { Bill, billUserAction } from "@/stores/slices/billUser.slice";
import { TiCancel } from "react-icons/ti";
import ModalCreateBill from "./components/ModalCreateBill";
import ModalCancel from "./components/ModalCancel";
import { Product } from "@/stores/slices/product.slice";

export default function Cart() {
    useEffect(() => {
        if (userStore.data == null) {
            dispatchFetch.fetchUser()
        }
        // if (productStore.data == null) {
        //     dispatchFetch.fetchProduct()
        // }
        if (cartStore.data == null) {
            dispatchFetch.fetchCart()
        }
        if (billUserStore.data == null) {
            dispatchFetch.fetchBillUser()
        }
    }, [])
    const userStore = useSelector((store: StoreType) => store.userStore)
    const cartStore = useSelector((store: StoreType) => store.cartStore)
    const productStore = useSelector((store: StoreType) => store.productStore)
    const billUserStore = useSelector((store: StoreType) => store.billUserStore)
    console.log(billUserStore.data);


    const [isCheckedAll, setIsCheckedAll] = useState(false);

    const [products, setProducts] = useState<Product[]>([]);
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                if (!cartStore.data) {
                    throw {
                        message: "Cart is null"
                    }
                }
                const productPromises: Promise<any>[] = cartStore.data?.map(async (item) => {
                    const resFind = await apis.productApi.getById(item.productId);
                    return resFind.data.data;
                });

                const productsData = await Promise.all(productPromises);
                setProducts(productsData);
            } catch (error) {
                console.error("Error fetching products:", error);
            }
        };

        fetchProducts();
    }, [cartStore.data]);

    const findProduct = (id: number) => {
        return products.find((product) => product.id == id);
    }
    const dispatch = useDispatch()
    const handleCheckboxChangeAll = () => {
        setIsCheckedAll(!isCheckedAll);
        document.querySelectorAll('input[type="checkbox"]').forEach((checkbox) => {
            (checkbox as any).checked = !isCheckedAll;
        })
    };
    const [isModalCreate, setIsModalCreate] = useState(false)

    const handleIsModalCreate = () => {
        setIsModalCreate(!isModalCreate)
    }
    const [dataBill, setDataBill] = useState<{ userId: number, content: string, total: number }>()
    const handleBuy = async () => {
        try {
            let carts = new Array();
            document.querySelectorAll('input[type="checkbox"]').forEach((checkbox) => {
                if ((checkbox as any).checked) {
                    cartStore.data?.find((item) => {
                        if ((checkbox as any).value == item.id) {
                            const product = findProduct(item.productId)
                            carts.push({ ...item, ...product, total: product?.price as number * item.quantity })
                        }
                    })
                }
            })
            const dataBill = {
                userId: userStore.data?.id as number,
                content: JSON.stringify(carts),
                total: (carts.reduce((accumulator, item) => accumulator + item.total, 0)) as number
            }

            setDataBill(dataBill)
        } catch (err: any) {
            message.error(err.message ? err.message : "Create bill fail")
        }
    }

    const [isModalCancel, setIsModalCancel] = useState(false)
    const handleIsModalCancel = () => {
        setIsModalCancel(!isModalCancel)
    }
    const [dataCancel, setDataCancel] = useState<Bill>()

    const handelDelete = async (id: number) => {
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

    const [current, setCurrent] = useState(1);
    const onChange: PaginationProps['onChange'] = (page) => {
        setCurrent(page)
    };

    useEffect(() => {
        setBillUser(billUserStore.data)
        setTotal(billUserStore.data?.length)
    }, [billUserStore.data, billUserStore.loading])


    const [total, setTotal] = useState(billUserStore.data?.length);
    const [billsUser, setBillUser] = useState(billUserStore.data)
    const handleUpdateQuantity = async (id: number, quantity: number) => {
        try {
            let resUpdate = await apis.cartApi.update(id, { quantity: quantity })
            dispatch(cartAction.update(resUpdate.data.data))
        } catch (err) {
            console.log(err);
        }
    }
    //const [productsBill, setProductsBill] = useState<Product[][]>([]);
    const [productsBill, setProductsBill] = useState<any[]>([]);
    useEffect(() => {
        const fetchProductBills = async () => {
            try {
                if (!billUserStore.data) {
                    throw {
                        message: "Data is null"
                    }
                }
                const productPromises: Promise<any>[] = billUserStore.data.map(async (item) => {
                    const dataProduct = JSON.parse(item.content);
                    const product = dataProduct.map(async (itemDataProduct: any) => {
                        const resFind = await apis.productApi.getById(itemDataProduct.productId);
                        return resFind.data.data;
                    })
                    const productBill = await Promise.all(product);
                    return productBill;
                });
                const productBills = await Promise.all(productPromises);
                console.log("productbills", productBills);


                setProductsBill(productBills);
                console.log("productbill", productsBill);
            } catch (error) {
                console.error("Error fetching products:", error);
            }
        };

        fetchProductBills();
    }, [billUserStore.data]);

    // const findProductBill = (id: number) => {
    //     return productsBill.find((product) => product.id == id);
    // }

    useEffect(() => {
        console.log("productsBill", productsBill);
    }, [productsBill])
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
                                                    if (item.quantity <= 1) {
                                                        message.error('Number Must Be Greater Than 1')
                                                    } else {
                                                        handleUpdateQuantity(item.id, (item.quantity - 1))
                                                    }
                                                    //dispatch(cartAction.update({ ...item, quantity: item.quantity - 1 }))
                                                }}><PiMinusCircle /></span>{item.quantity}<span onClick={() => {
                                                    handleUpdateQuantity(item.id, (item.quantity + 1))
                                                    //dispatch(cartAction.update({ ...item, quantity: item.quantity + 1 }))
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
                                <button className="btnDelete Button" onClick={() => {
                                    handelDelete(item.id)
                                }}>Delete<span><MdDeleteForever></MdDeleteForever></span></button>
                            </div>
                        </div>
                    )
                })}

            <div className="btn"> <button className="buyBtn Button" onClick={() => {
                handleBuy()
                handleIsModalCreate()
            }}>Build <span><FaRegMoneyBillAlt /></span></button></div>
            <div className="Bill">
                <h3>Bill</h3>
                {
                    billsUser?.slice(((current - 1) * 5), (current * 5)).map((item, index) => {
                        return (
                            <div className="itemBill" key={index}>
                                <div className="stt">{(index + 1) + ((current - 1) * 5)}</div>
                                <div>
                                    {
                                        JSON.parse(item.content).map((itemProduct: any, indexProduct: number) => {
                                          return (
                                            <div>{itemProduct.name}</div>
                                          )  
                                        })
                                    }
                                </div>
                                {/* <div className="product">{
                                    productsBill[index]?.map((itemProduct: any, indexProduct: number) => {
                                        return (
                                            <div className="itemProduct" key={indexProduct}>{itemProduct.name}</div>)
                                    })}</div> */}
                                <div className="total">{item.total}</div>
                                <div className="status">{item.status == "PENDING" ? <button className="btn btnCancel" onClick={() => {
                                    // handleCancel(item.id)
                                    handleIsModalCancel()
                                    setDataCancel(item)
                                }}>Cancel <span><TiCancel /></span></button> : item.status}</div>
                            </div>
                        )
                    })
                }

            </div>
            {
                isModalCreate && <ModalCreateBill handleIsModalCreate={handleIsModalCreate} dataBill={dataBill}></ModalCreateBill>
            }
            {
                isModalCancel && <ModalCancel handleIsModalCancel={handleIsModalCancel} dataCancel={dataCancel}></ModalCancel>
            }
            <div className='pagination'><Pagination defaultCurrent={1} total={total} pageSize={5} onChange={onChange} /></div>
        </div >
    );
}
