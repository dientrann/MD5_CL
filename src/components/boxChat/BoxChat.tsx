import { useState } from "react";
import { AiFillMessage } from "react-icons/ai";

import FormChat from "./components/FormChat";


import './boxChat.style.scss'
import { useSelector } from "react-redux";
import { StoreType } from "@/stores";
import { Modal, message } from "antd";
import { useNavigate } from "react-router-dom";

export default function BoxChat() {
    const [status, setStatus] = useState(false)
    const userStore = useSelector((store: StoreType) => store.userStore)
    const navigate = useNavigate()



    const handleStatus = () => {
        setStatus(!status)
    }
    return (
        <div className="boxChat">
            {status ? <FormChat handleStatus={handleStatus}></FormChat> : <div className="boxChat-icon" onClick={() => {
                if (!userStore.data) {
                    Modal.warning({
                        title: 'Login Warning',
                        content: 'You often log in to use this function',
                        onOk() {
                            navigate('/authen')
                        },
                        onCancel() {
                            console.log('Cancel');
                        },
                    })
                }
                else {
                    handleStatus()
                }
            }}><AiFillMessage fontSize={50} color="rgb(222 235 242)" /></div>}
        </div>
    );
}
