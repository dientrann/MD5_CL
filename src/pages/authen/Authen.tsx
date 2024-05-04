import { useState } from "react";
import { IoIosArrowBack } from "react-icons/io";
import { useTranslation } from "react-i18next";

import './authen.style.scss'
import ForgotPassword from "./components/ForgotPassword";
import Login from "./components/Login";
import Register from "./components/Register";

export default function Authen() {
  const { t } = useTranslation()
  const [isLogin, setIsLogin] = useState(true);
  const [isFogotPassword, setIsForgotPassword] = useState(false);

  const handleClickForm = () => {
    setIsLogin(!isLogin)
  }

  const handleClickForgotPassword = () => {
    setIsForgotPassword(!isFogotPassword)
  }

  return (
    <div className="authenPage">
      <div className="btnHome"> <IoIosArrowBack></IoIosArrowBack> {t('auth_Home')}</div>

      {isFogotPassword ? <ForgotPassword handleClickForgotPassword={handleClickForgotPassword}></ForgotPassword> : isLogin ? <Login handleClickForm={handleClickForm} handleClickForgotPassword={handleClickForgotPassword}></Login> : <Register handleClickForm={handleClickForm}></Register>}
    </div>
  );
}
