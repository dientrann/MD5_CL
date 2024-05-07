import { Outlet, useNavigate } from "react-router-dom";

import { RiMenuUnfoldLine, RiMenuFoldLine } from "react-icons/ri";
import { MdOutlineCategory, MdOutlineProductionQuantityLimits } from "react-icons/md";
import { FaRegMoneyBillAlt } from "react-icons/fa";


import './admin.style.scss'
import { useEffect, useState } from "react";
import { FaAngleRight } from "react-icons/fa";
import { LuUserCog2 } from "react-icons/lu";

export default function Admin() {
  const [isMenu, setIsMenu] = useState(false);
  const navigate = useNavigate();
  const menu = [
    {
      name: "User",
      icon: <LuUserCog2/>,
      path: "user",
    },
    {
      name: "Category",
      icon: <MdOutlineCategory />,
      path: "category",
    },
    {
      name: "Product",
      icon: <MdOutlineProductionQuantityLimits />,
      path: "product",
    },
    {
      name:"Bill",
      icon: <FaRegMoneyBillAlt/>,
      path: "bill"
    }
  ]
  useEffect(()=>{
    const currentUrl = window.location.href;
    const currentPath = currentUrl.split("/").pop();
    document.querySelector(`.${currentPath}`)?.classList.add("select");
  },[])
  return (
    <div className="pageAdmin">
      <div className="headerAdmin">
        <h2>Admin</h2>
        <button onClick={() => {
          navigate('/')
        }}>Go Home <FaAngleRight></FaAngleRight></button>
      </div>
      <div className="bodyAdmin">
        <div className="navAdmin">
          <div className="listMenu">
            {
              menu.map((item, index) => {
                return <div key={index} className={"itemMenu " + item.path} onClick={(e) => {
                  document.querySelectorAll('.itemMenu').forEach((el) => {
                    el.classList.remove('select');
                  });
                  (e.currentTarget as HTMLDivElement).classList.add('select');
                  navigate("/admin/" + item.path)
                }}><div className="icon">{item.icon}</div><span>{item.name}</span></div>
              })
            }
            <div className="divBtnMenu">
              <span className="btnMenu" onClick={() => {
                setIsMenu(!isMenu);
                if (!isMenu) {
                  document.querySelector('.navAdmin')?.classList.add('hidden')
                } else {
                  document.querySelector('.navAdmin')?.classList.remove('hidden')
                }
              }}>
                {isMenu ? <RiMenuUnfoldLine></RiMenuUnfoldLine> : <RiMenuFoldLine ></RiMenuFoldLine>}
              </span>
            </div>
          </div>
        </div>
        <div className="contentAdmin">
          <Outlet></Outlet>
        </div>
      </div>
      <div className="footedHeader">

      </div>
    </div>
  );
}
