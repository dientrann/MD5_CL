
import apis from "@/apis";
import { StoreType } from "@/stores";
import { productAction } from "@/stores/slices/product.slice";
import { message } from "antd";
import { IoClose } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
export default function ModalDelete({ handleIsModalDelete = () => { }, idDelete = 0 }) {
    const productStore = useSelector((store: StoreType) => store.productStore);
    const product = productStore.data?.find(item => item.id == idDelete)
    const dispatch = useDispatch();
    const handleDelete = async () => {
        try {
            let resDelete = await apis.productApi.delete(idDelete)
            console.log("resDelete", resDelete);

            if (resDelete.status != 200) {
                throw {
                    message: "Delete failed"
                }
            }
            message.success(resDelete.data.message)
            dispatch(productAction.delete(resDelete.data.data.id))

        } catch (err: any) {
            message.error(err.response.data.message ? err.response.data.message.join(', ') : "Error Create Category")
        }
    }
    return (
        <div className="containerModal" onClick={(e) => {
            if ((e.target as any).className == "containerModal" || (e.target as any).className == "contentModal") {
                document.querySelector('.bodyModal')?.classList.add('close')
                setTimeout(() => {
                    handleIsModalDelete()
                }, 800)
            }

        }}>
            <div className='contentModal'>
                <div className="bodyModal">
                    <div className="headerModal">
                        <h3>Delete Category</h3>
                        <span onClick={() => {
                            document.querySelector('.bodyModal')?.classList.add('close')
                            setTimeout(() => {
                                handleIsModalDelete()
                            }, 800)
                        }}><IoClose></IoClose></span>
                    </div>
                    <div className="formModal">
                        <div className="formBody">
                            <h4>Are you sure to delete?</h4>
                            <div className="nameProduct">{product?.name}</div>
                            <div className="productInfo">
                                <div className="imgProduct">
                                    <img src={`${import.meta.env.VITE_SERVER}${product?.image}`} alt="" />
                                </div>
                                <div className="infoProduct">
                                    <h4>Price:{product?.price}</h4>
                                    <h5>Describe:{product?.describe}</h5>
                                </div>
                            </div>
                        </div>
                        <div className="formBtn">
                            <button className="deleteBtn" onClick={() => {
                                handleDelete()
                                document.querySelector('.bodyModal')?.classList.add('close')
                                setTimeout(() => {
                                    handleIsModalDelete()
                                }, 800)
                            }}>Delete</button>
                            <button className="cancelBtn" onClick={() => {
                                document.querySelector('.bodyModal')?.classList.add('close')
                                setTimeout(() => {
                                    handleIsModalDelete()
                                }, 800)
                            }}>Cancel</button>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}
