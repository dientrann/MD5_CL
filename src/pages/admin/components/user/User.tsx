import { StoreType, dispatchFetch } from "@/stores";
import { useEffect } from "react";
import { FaPlusCircle } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import { RxUpdate } from "react-icons/rx";
import { useSelector } from "react-redux";

export default function User() {
    useEffect(()=>{
        dispatchFetch.fetchListUser()
    }, [])

    const listUserStore = useSelector((store:StoreType )=> store.listUserStore)

  return (
    <div className="toolPage">
            <div className="headerTool">
                <h3>{`Category`}</h3>
                <button className="btnCreate" onClick={() => {
                    
                }}>Create <span><FaPlusCircle /></span></button>
            </div>
            <div className="bodyTool">
                <table>
                    <tr>
                        <th>STT</th>
                        <th>User Name</th>
                        <th>Email</th>
                        <th>Email Confirm</th>
                        <th>Role</th>
                        <th>Walet</th>
                        <th>Creation Time</th>
                        <th>Updated Time</th>
                        <th>Tool</th>
                    </tr>
                    {
                        listUserStore.data?.map((item, index) => {
                            return (
                                <tr key={index}>
                                    <td className="sttTool">{index + 1}</td>
                                    <td>{item.userName}</td>
                                    <td>{item.email}</td>
                                    <td>{item.emailConfirm? 'True': 'False'}</td>
                                    <td>{item.role}</td>
                                    <td>{item.walet}</td>
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
        </div>
  );
}
