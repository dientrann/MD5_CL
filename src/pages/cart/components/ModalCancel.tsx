import apis from "@/apis";
import { StoreType } from "@/stores";
import { billUserAction } from "@/stores/slices/billUser.slice";
import { message } from "antd";
import { useState } from "react";
import { IoClose } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";

export default function ModalCancel({ handleIsModalCancel = () => { }, dataCancel = { id: 0, userId: 0, status: "", content: "", total: 0, createAt: "", updateAt: "" } }) {
    const [dataContent, setDataContent] = useState<{ id: number, userId: number, productId: number, quantity: number, createdAt: string, updatedAt: string, total: number }[]>(JSON.parse(dataCancel.content));
    const productStore = useSelector((store: StoreType) => store.productStore)
    const dispatch = useDispatch()
    const findProduct = (id: number) => {
        return productStore.data?.find((item: any) => item.id == id);
    }

    const handleCancel = async (id: number) => {
        try {
            let resDelete = await apis.billApi.delete(localStorage.getItem("token"), id)
            if (resDelete.status != 200) {
                throw {
                    message: "Delete cart fail"
                }
            }
            dispatch(billUserAction.delete(resDelete.data.data.id))
            message.success("Cancle cart success")

        } catch (err) {
            console.log(err);

        }
    }
    return (
        <div className="containerModal" onClick={(e) => {
            if ((e.target as any).className == "containerModal" || (e.target as any).className == "contentModal") {
                document.querySelector('.bodyModal')?.classList.add('close')
                setTimeout(() => {
                    handleIsModalCancel()
                }, 800)
            }
        }}>
            <div className='contentModal'>
                <div className="bodyModal">
                    <div className="headerModal">
                        <h3>Delete Bill</h3>
                        <span onClick={() => {
                            document.querySelector('.bodyModal')?.classList.add('close')
                            setTimeout(() => {
                                handleIsModalCancel()
                            }, 800)
                        }}><IoClose></IoClose></span>
                    </div>
                    <div className="formModal">
                        <div>
                            <div>
                                <div>{dataContent.map((item, index) => {
                                    return (
                                        <div key={index}>
                                            <h4>{findProduct(item.productId)?.name}</h4>
                                            <div><span>Quantity: {item.quantity}</span></div>
                                        </div>
                                    )
                                })}</div>

                                <div>Total: {dataCancel.total}</div>
                            </div>

                        </div>
                        <div className="formBtn">
                            <button className="deleteBtn" onClick={() => {
                                handleCancel(dataCancel.id)
                                document.querySelector('.bodyModal')?.classList.add('close')
                                setTimeout(() => {
                                    handleIsModalCancel()
                                }, 800)
                            }}>Delete</button>
                            <button className="cancelBtn" onClick={() => {
                                document.querySelector('.bodyModal')?.classList.add('close')
                                setTimeout(() => {
                                    handleIsModalCancel()
                                }, 800)
                            }}>Cancel</button>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}
