import { StoreType } from "@/stores"
import { useState } from "react"
import { FaPlusCircle } from "react-icons/fa"
import { MdDeleteForever } from "react-icons/md"
import { RxUpdate } from "react-icons/rx"
import { useSelector } from "react-redux"
import ModalCreate from "./Modals/ModalCreate"
import '../category/Modals/modal.style.scss'
import ModalDelete from "./Modals/ModalDelete"
import ModalUpdate from "./Modals/ModalUpdate"

export default function Carousel() {
    const [isModalCreate, setIsModalCreate] = useState(false)
    const [isModalUpdate, setIsModalUpdate] = useState(false)
    const [isModalDelete, setIsModalDelete] = useState(false)
    const carouselStore = useSelector((store: StoreType) => store.carouselStore)
    const [dataDelete, setDataDelete] = useState<{ id: number, image: string }>()
    const [dataUpdate, setDataUpdate] = useState<{ id: number, image: string }>()

    const handleIsModalCreate = () => {
        setIsModalCreate(!isModalCreate)
    }
    const handleIsModalDelete = () => {
        setIsModalDelete(!isModalDelete)
    }
    const handleIsModalUpdate = () => {
        setIsModalUpdate(!isModalUpdate)
    }

    return (

        <div className="toolPage">
            <div className="headerTool">
                <h3>Carousel</h3>
                <button className="btnCreate" onClick={() => {
                    handleIsModalCreate()
                }}>Create <span><FaPlusCircle /></span></button>
            </div>
            <div className="bodyTool">
                <table>
                    <thead>
                        <tr>
                            <th>STT</th>
                            <th>Image</th>
                            <th>Tool</th>
                        </tr>
                    </thead>
                    <tbody>

                        {
                            carouselStore.data?.map((item, index) => {
                                return (
                                    <tr key={index}>
                                        <td className="sttTool">{index + 1}</td>
                                        <td className="carouselImg"><img src={`${import.meta.env.VITE_SERVER}${item.image}`} alt="" /></td>
                                        <td className="tdTool">
                                            <button type="button" className="btnUpdate" onClick={() => {
                                                setDataUpdate({ id: item.id, image: item.image })
                                                handleIsModalUpdate()
                                            }}>Update <span><RxUpdate></RxUpdate></span></button>
                                            <button type="button" className="btnDelete" onClick={() => {
                                                setDataDelete({ id: item.id, image: item.image })
                                                handleIsModalDelete()
                                            }}>Delete <span><MdDeleteForever></MdDeleteForever></span></button>
                                        </td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>
            </div>
            {
                isModalCreate && <ModalCreate handleIsModalCreate={handleIsModalCreate}></ModalCreate>
            }
            {
                isModalDelete && <ModalDelete handleIsModalDelete={handleIsModalDelete} dataDelete={dataDelete}></ModalDelete>
            }
            {
                isModalUpdate && <ModalUpdate handleIsModalUpdate={handleIsModalUpdate} dataUpdate={dataUpdate}></ModalUpdate>
            }
        </div>
    );
}
