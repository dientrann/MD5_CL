import { StoreType, dispatchFetch } from "@/stores";
import { useEffect } from "react";
import { RxUpdate } from "react-icons/rx";
import { useSelector } from "react-redux";
import '../category/Modals/modal.style.scss'
import apis from "@/apis";

export default function User() {
    useEffect(()=>{
        dispatchFetch.fetchListUser()
    }, [])

    const listUserStore = useSelector((store:StoreType )=> store.listUserStore)
    const handleUpdate = async(userName: string)=>{
        try{
            let resUpdate = await apis.userApi.updateRole(localStorage.getItem('token') as string, {userName})
            console.log("res", resUpdate);
            
        }catch(err){

        }
    }
  return (
    <div className="toolPage">
            <div className="headerTool">
                <h3>User</h3>
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
                                            handleUpdate(item.userName)
                                        }}>{item.role == "ADMIN" ? "Member": "Admin"}<span><RxUpdate></RxUpdate></span></button>
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
