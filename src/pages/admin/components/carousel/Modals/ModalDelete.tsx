import apis from "@/apis";
import { carouselAction } from "@/stores/slices/carousel.slice";
import { message } from "antd";
import { IoClose } from "react-icons/io5";
import { useDispatch } from "react-redux";


export default function ModalDelete({ handleIsModalDelete = () => { }, dataDelete = { id: 0, image: "" } }) {

    const dispatch = useDispatch();
    const handleDelete = async () => {
        try {
            let resDelete = await apis.carouselApi.delete(dataDelete.id)
            console.log(resDelete);
            if (resDelete.status != 200) {
                throw {
                    message: "Delete Error"
                }
            }
            dispatch(carouselAction.delete(resDelete.data.data.id))


        } catch (err: any) {
            console.log(err);
            message.error(err.response.data.message ? err.response.data.message : "Delete Error")
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
                <div className="bodyModal carouselDelete">
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
                        <div className="formBody"><h4>Are you sure to delete?</h4><p>{dataDelete.id}</p></div>
                        <div className="carousel "><img src={`${import.meta.env.VITE_SERVER}${dataDelete.image}`} alt="" /></div>
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
