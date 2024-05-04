import { useEffect } from 'react';
import './loading.style.scss'
import { useNavigate } from 'react-router-dom';


export default function Loading({url = ''}) {
    const navigate = useNavigate();
    useEffect(() => {
       if(url != ''){
            navigate(url);
       }   
    },[])
    return (
        <div className='pageLoading'>
            <div className="loader"></div>
        </div>
    );
}
