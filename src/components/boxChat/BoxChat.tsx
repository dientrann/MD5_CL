import { useState } from "react";
import { AiFillMessage } from "react-icons/ai";

import FormChat from "./components/FormChat";


import './boxChat.style.scss'

export default function BoxChat() {
    const [status, setStatus] = useState(false)



    const handleStatus = () => {
        setStatus(!status)
    }
    return (
        <div className="boxChat">
            {status ? <FormChat handleStatus={handleStatus}></FormChat> : <div className="boxChat-icon" onClick={() => {
                handleStatus()
            }}><AiFillMessage fontSize={50} color="rgb(222 235 242)" /></div>}
        </div>
    );
}
