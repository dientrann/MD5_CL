import { IoClose } from 'react-icons/io5';

import './modal.style.scss'
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { StoreType } from '@/stores';
import { message } from 'antd';
import apis from '@/apis';
import { cartAction } from '@/stores/slices/cart.slice';
import { billUserAction } from '@/stores/slices/billUser.slice';
import { Product } from '@/stores/slices/product.slice';

export default function ModalCreateBill({ handleIsModalCreate = () => { }, dataBill = { userId: 0, content: "", total: 0 } }) {
    const [dataContent, setDataContent] = useState<{ id: number, userId: number, productId: number, quantity: number, createdAt: string, updatedAt: string, total: number }[]>(JSON.parse(dataBill.content));
    //const productStore = useSelector((store: StoreType) => store.productStore)
    const dispatch = useDispatch()
    const [products, setProducts] = useState<Product[]>([]);
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                if (!dataContent) {
                    throw {
                        message: "Data is null"
                    }
                }
                const productPromises: Promise<any>[] = dataContent.map(async (item) => {
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
    }, [dataContent]);

    const findProduct = (id: number) => {
        return products.find((product) => product.id == id);
    }

    const handleCreateBill = async () => {
        try {
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
        } catch (err) {
            message.error((err as any).response.data.message ? (err as any).response.data.message.join(', ') : "Login failed")

        }
    }
    return (
        <div className="containerModal" onClick={(e) => {
            if ((e.target as any).className == "containerModal" || (e.target as any).className == "contentModal") {
                document.querySelector('.bodyModal')?.classList.add('close')
                setTimeout(() => {
                    handleIsModalCreate()
                }, 800)
            }
        }}>
            <div className='contentModal'>
                <div className="bodyModal">
                    <div className="headerModal">
                        <h3>Create Bill</h3>
                        <span onClick={() => {
                            document.querySelector('.bodyModal')?.classList.add('close')
                            setTimeout(() => {
                                handleIsModalCreate()
                            }, 800)
                        }}><IoClose></IoClose></span>
                    </div>
                    <div className="formModal">
                        <div>
                            {dataBill.content == '[]' ? <div>You have not selected a product yet</div> :
                                <div>
                                    <div>{dataContent.map((item, index) => {
                                        return (
                                            <div key={index}>
                                                <h4>{findProduct(item.productId)?.name}</h4>
                                                <div><span>Quantity: {item.quantity}</span></div>
                                            </div>
                                        )
                                    })}</div>

                                    <div>Total: {dataBill.total}</div>
                                </div>}

                        </div>
                        <div className="formBtn">
                            {dataBill.content == '[]' ? "" :
                                <button className="createBtn" onClick={() => {
                                    handleCreateBill()
                                    document.querySelector('.bodyModal')?.classList.add('close')
                                    setTimeout(() => {
                                        handleIsModalCreate()
                                    }, 800)
                                }}>Buy</button>}
                            <button className="cancelBtn" onClick={() => {
                                document.querySelector('.bodyModal')?.classList.add('close')
                                setTimeout(() => {
                                    handleIsModalCreate()
                                }, 800)
                            }}>Cancel</button>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}
