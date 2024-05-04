import { StoreType, dispatchFetch } from "@/stores";
import { useEffect, useState } from "react";
import { FaPlusCircle } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import { RxUpdate } from "react-icons/rx";
import { useSelector } from "react-redux";
import ModalCreateStep1 from "./Modals/ModalCreateStep1";

export default function Product() {
    const [isModalCreate, setIsModalCreate] = useState(false)

    const handleIsModalCreate = () => {
        setIsModalCreate(!isModalCreate)
    }

    const productStore = useSelector((store: StoreType) => store.productStore)
    const categoryStore = useSelector((store: StoreType) => store.categoryStore)
    useEffect(() => {
        dispatchFetch.fetchProduct()
    },[])

  return (
    <div className="toolPage">
            <div className="headerTool">
                <h3>{`Product`}</h3>
                <button className="btnCreate" onClick={() => {
                    handleIsModalCreate()
                }}>Create <span><FaPlusCircle /></span></button>
            </div>
            <div className="bodyTool">
                <table>
                    <tr>
                        <th>STT</th>
                        <th>Name</th>
                        <th>Image</th>
                        <th>Category</th>
                        <th>Describe</th>
                        <th>Creation Time</th>
                        <th>Updated Time</th>
                        <th>Tool</th>
                    </tr>
                    {
                        productStore.data?.map((item, index) => {
                            return (
                                <tr key={index}>
                                    <td className="sttTool">{index + 1}</td>
                                    <td>{item.name}</td>
                                    <td className="imgProduct"><img src={`${import.meta.env.VITE_SERVER}${item.image}`} alt="" /></td>
                                    <td>{categoryStore.data?.find(itemCtegory => itemCtegory.id == item.id)?.title}</td>
                                    <td>{item.describe}</td>
                                    <td>{item.createdAt}</td>
                                    <td>{item.updatedAt}</td>
                                    <td className="tdTool">
                                        <button type="button" className="btnUpdate" onClick={()=>{
                                        }}>Update <span><RxUpdate></RxUpdate></span></button>
                                        <button type="button" className="btnDelete" onClick={() => {
                                            
                                        }}>Delete <span><MdDeleteForever></MdDeleteForever></span></button>
                                    </td>
                                </tr>
                            )
                        })
                    }
                </table>
            </div>
            {
                isModalCreate && <ModalCreateStep1 handleIsModalCreate={handleIsModalCreate}></ModalCreateStep1>
            }
        </div>
  );
}
