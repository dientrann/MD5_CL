import apis from "@/apis";
import services from "@/services";
import { message } from "antd";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";
import { FaGooglePlus, FaFacebook } from "react-icons/fa";
import { GrLanguage } from "react-icons/gr";

export default function Login({ handleClickForm = () => { } , handleClickForgotPassword = () => { }}) {
    const [buttonLoading, setButtonLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [locales, setLocales] = useState(localStorage.getItem("locales") || 'en')

    const navigate = useNavigate()
    const { t, i18n } = useTranslation();
    const handleLogin = async (values: formValues): Promise<string> => {
        return new Promise(async (resolve, reject) => {
            try {
                let dataLogin = {
                    userName: values.userName,
                    password: values.password
                }

                let res = await apis.userApi.login(dataLogin);
                if (res.status != 200) {
                    throw {
                        message: "Login failed",
                    }
                }
                localStorage.setItem("token", res.data.token);
                setTimeout(() => {
                    resolve(t('auth_Login_Sucess'));
                }, 1000);
            } catch (err) {
                setTimeout(() => {
                    reject((err as any).response.data.message ? (err as any).response.data.message.join(', ') : "Login failed");
                }, 1000);
            }
        })
    }
    interface formValues {
        userName: string,
        password: string
    }
    const handleLoginWithGoogle = async () => {
        try {
            let resGoogle = await services.firebaseService.loginWithGoogle()
            if (!resGoogle.user.email) {
                throw {
                    message: "Login failed",
                }
            }

            let resUser = await apis.userApi.getDataByEmail(resGoogle.user.email).then(async (res) => {
                let resLogin = await apis.userApi.login({
                    userName: res.data.data.userName,
                    password: "qwe@123"
                })
                if (resLogin.status != 200) {
                    throw {
                        message: "Login failed",
                    }
                }
                localStorage.setItem("token", resLogin.data.token);
                message.success(t('auth_Login_Sucess'));
                navigate("/");
            }).catch(async (err) => {
                let dataUser = {
                    userName: String(Date.now() * Math.random()),
                    email: resGoogle.user.email as string,
                    password: "qwe@123",
                    passwordConfirm: "qwe@123"
                }
                if (err.response.data.message.includes('Email not found')) {
                    let resRegister = await apis.userApi.register(dataUser)
                    if (resRegister.status != 200) {
                        throw {
                            message: "Login failed"
                        }
                    }
                    let resLogin = await apis.userApi.login({
                        userName: resRegister.data.data.userName,
                        password: "qwe@123"
                    })
                    if (resLogin.status != 200) {
                        throw {
                            message: "Login failed",
                        }
                    }
                    localStorage.setItem("token", resLogin.data.token);
                    message.success(t('auth_Login_Sucess'));
                    navigate("/");
                }

            })
        } catch (err) {
            console.log("err", err);
        }
    }
    let handleLoginWithFB = async () => {
        let res = await services.firebaseService.loginWithFB()
        console.log("res", res);

    }
    return (
        <>
            <div className="formInput">
                <div className="headerForm">
                    <h3>{t('auth_Login')}</h3>
                </div>
                <div className="bodyForm">
                    <Formik
                        initialValues={{
                            userName: "",
                            password: ""
                        }}
                        validate={values => {
                            const errors: Partial<formValues> = {}
                            if (!values.userName) {
                                errors.userName = "* " + t('auth_Validate_Required');
                            }
                            else if (values.userName.length < 3) {
                                errors.userName = "* " + t('auth_Validate_Min3');
                            }
                            if (!values.password)
                                errors.password = "* " + t('auth_Validate_Required');
                            else if (values.password.length < 3) {
                                errors.password = "* " + t('auth_Validate_Min3');
                            }
                            return errors;
                        }}
                        onSubmit={(values, { setSubmitting, setErrors }) => {
                            setButtonLoading(true)
                            setSubmitting(true)
                            handleLogin(values).then((res) => {
                                setSubmitting(false)
                                setButtonLoading(false)
                                message.success(res)
                                navigate('/')
                            }).catch((err) => {
                                setSubmitting(false)
                                setButtonLoading(false)
                                if (err == 'User not found') {
                                    setErrors({ userName: '* ' + t('auth_User_Not_Found') })
                                }
                                if (err == 'Password Wrong') {
                                    setErrors({ password: '* ' + t('auth_Password_Wrong') })
                                }
                            }).finally(() => {
                                setButtonLoading(false)
                                setSubmitting(false)
                            })

                        }}
                    >
                        {({ isSubmitting, errors, touched }) => {
                            return (
                                <Form>
                                    <div className={`inputForm ${errors.userName && touched.userName ? 'error' : ''}`}>
                                        <Field type="text" name="userName" id="userName" placeholder="" />
                                        <label htmlFor="userName">{t('auth_User_Name')}</label>
                                        <ErrorMessage name="userName" component="div" className="errMessage" />
                                    </div>
                                    <div className={`inputForm ${errors.password && touched.password ? 'error' : ''}`}>
                                        <Field type={showPassword ? "text" : "password"} name="password" id="password" placeholder="" />
                                        <label htmlFor="password">{t('auth_Password')}</label>
                                        <span onClick={() => {
                                            setShowPassword(!showPassword)
                                        }} className="eye">
                                            {
                                                showPassword ? <IoEyeOffOutline></IoEyeOffOutline> : <IoEyeOutline ></IoEyeOutline>
                                            }
                                        </span>
                                        <ErrorMessage name="password" component="div" className="errMessage" />
                                    </div>
                                    <div className="forgotPassword">
                                        <span onClick={()=>{
                                            handleClickForgotPassword()
                                        }}>{t('auth_Forgot_Password')}</span>
                                    </div>
                                    <div className="btnForm">
                                        {
                                            buttonLoading ? <div className="fakeBtn"><div className="loaderBtn"></div></div> : <button type="submit" disabled={isSubmitting}>{t('auth_Signin')}</button>
                                        }
                                    </div>
                                </Form>
                            )
                        }}
                    </Formik>
                    <div className="orJoin">
                        <h4>{t('auth_Or_Join')}</h4>
                        <div className="listIcon">
                            <span onClick={() => {
                                handleLoginWithGoogle()
                            }}><FaGooglePlus></FaGooglePlus></span>
                            <span onClick={() => {
                                handleLoginWithFB()
                            }}><FaFacebook></FaFacebook></span>
                        </div>
                    </div>
                </div>

                <div className="footerForm">
                    <p>{t('auth_Acc')}</p>
                    <span onClick={() => {
                        handleClickForm();
                    }}> {t('auth_Register')}</span>
                    <div className="lang">
                        <div onClick={() => {
                            if (localStorage.getItem('locales') === 'en') {
                                localStorage.setItem('locales', 'vi')
                                setLocales('vi')
                                i18n.changeLanguage("vi")
                            } else {
                                localStorage.setItem('locales', 'en')
                                setLocales('en')
                                i18n.changeLanguage("en")
                            }
                        }}><GrLanguage></GrLanguage></div>
                        <p>{locales}</p>
                    </div>
                </div>
            </div>
        </>
    );
}
