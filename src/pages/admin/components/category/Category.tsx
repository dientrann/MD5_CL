import { StoreType } from "@/stores";
import { useSelector } from "react-redux";

import { FaPlusCircle } from "react-icons/fa";
import { RxUpdate } from "react-icons/rx";
import { MdDeleteForever } from "react-icons/md";
import { useState } from "react";
import ModalCreate from "./Modals/ModalCreate";
import ModalDelete from "./Modals/ModalDelete";
import ModalUpdate from "./Modals/ModalUpdate";

export default function Category() {
    const [isModalCreate, setIsModalCreate] = useState(false)
    const [isModalUpdate, setIsModalUpdate] = useState(false)
    const [isModalDelete, setIsModalDelete] = useState(false)
    const [title, setTitle] = useState('')
    const categoryStore = useSelector((store: StoreType) => store.categoryStore)

    const handleIsModalCreate = () => {
        setIsModalCreate(!isModalCreate)
    }
    const handleIsModalDelete = () =>{
        setIsModalDelete(!isModalDelete)
    }
    const handleIsModalUpdate = () =>{
        setIsModalUpdate(!isModalUpdate)
    }

    return (
        <div className="toolPage">
            <div className="headerTool">
                <h3>{`Category`}</h3>
                <button className="btnCreate" onClick={() => {
                    handleIsModalCreate()
                }}>Create <span><FaPlusCircle /></span></button>
            </div>
            <div className="bodyTool">
                <table>
                    <tr>
                        <th>STT</th>
                        <th>Title</th>
                        <th>Link</th>
                        <th>Creation Time</th>
                        <th>Updated Time</th>
                        <th>Tool</th>
                    </tr>
                    {
                        categoryStore.data?.map((item, index) => {
                            return (
                                <tr>
                                    <td className="sttTool">{index + 1}</td>
                                    <td>{item.title}</td>
                                    <td>{item.link}</td>
                                    <td>{item.createdAt}</td>
                                    <td>{item.updatedAt}</td>
                                    <td className="tdTool">
                                        <button type="button" className="btnUpdate" onClick={()=>{
                                            setTitle(item.title)
                                            handleIsModalUpdate()
                                        }}>Update <span><RxUpdate></RxUpdate></span></button>
                                        <button type="button" className="btnDelete" onClick={() => {
                                            setTitle(item.title)
                                            handleIsModalDelete()
                                        }}>Delete <span><MdDeleteForever></MdDeleteForever></span></button>
                                    </td>
                                </tr>
                            )
                        })
                    }
                </table>
            </div>
            {
                isModalCreate && <ModalCreate handleIsModalCreate={handleIsModalCreate}></ModalCreate>
            }
            {
                isModalDelete && <ModalDelete handleIsModalDelete={handleIsModalDelete} title={title}></ModalDelete>
            }
            {
                isModalUpdate && <ModalUpdate handleIsModalUpdate={handleIsModalUpdate} title={title}></ModalUpdate>
            }
        </div>
    );
}
