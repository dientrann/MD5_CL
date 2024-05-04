
import apis from "@/apis";
import { categoryAction } from "@/stores/slices/category.slice";
import { message } from "antd";
import { IoClose } from "react-icons/io5";
import { useDispatch } from "react-redux";
export default function ModalDelete({ handleIsModalDelete = () => { }, title = "" }) {
    const dispatch = useDispatch();
    const handleDelete = async (title: string) => {
        try {
            let resDelete = await apis.categoryApi.delete(localStorage.getItem("token") as string, { title: title })
            console.log("resDelete", resDelete);

            if (resDelete.status != 200) {
                throw {
                    message: "Delete failed"
                }
            }
            message.success(resDelete.data.message)
            dispatch(categoryAction.delete(resDelete.data.data.title))

        } catch (err: any) {
            message.error(err.response.data.message? err.response.data.message.join(', ') : "Error Create Category")
        }
    }
    return (
        <div className="containerModal" onClick={(e) => {
            console.log(e.target, (e.target as any).className == "containerModal");
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
                        <div className="formBody"><h4>Are you sure to delete?</h4><p>{title}</p></div>
                        <div className="formBtn">
                            <button className="deleteBtn" onClick={() => {
                                handleDelete(title)
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
