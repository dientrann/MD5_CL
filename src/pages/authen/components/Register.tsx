import apis from "@/apis";
import utils from "@/utils";
import { message } from "antd";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export default function Register({ handleClickForm = () => { } }) {

    const { t } = useTranslation()

    const [buttonLoading, setButtonLoading] = useState(false);

    const handleRegister = async (data: {
        userName: string,
        email: string,
        password: string,
        passwordConfirm: string
    }): Promise<string> => {
        return new Promise<string>(async (resolve, reject) => {
            try {
                let res = await apis.userApi.register(data)
                if (res.status != 200) {
                    throw {
                        message: "Register Fail"
                    }
                }
                setTimeout(() => {
                    resolve(t("auth_Register_Sucess"))
                }, 1000)

            } catch (err) {
                setTimeout(() => {
                    reject((err as any).response.data.message.join(', '))
                }, 1000)
                //message.error((err as any).response.data.message ? (err as any).response.data.message.join(', ') : "Register failed");
            }
        })
    }

    interface formValues {
        userName: string,
        email: string,
        password: string,
        passwordConfirm: string
    }

    return (
        <>
            <div className="formInput">
                <div className="headerForm">
                    <h3>{t('auth_Register')}</h3>
                </div>
                <div className="bodyForm">
                    <Formik
                        initialValues={{
                            userName: '',
                            email: '',
                            password: '',
                            passwordConfirm: ''
                        }}
                        validate={values => {
                            const errors: Partial<formValues> = {}
                            if (!values.userName) {
                                errors.userName = "* " + t('auth_Validate_Required');
                            }
                            else if (values.userName.length < 3) {
                                errors.userName = "* " + t('auth_Validate_Min3');
                            }
                            if (!values.email) {
                                errors.email = "* " + t('auth_Validate_Required');
                            }
                            else if (!utils.validate.isEmail(values.email)) {
                                errors.email = '* ' + t('auth_Email_Invalid');
                            }
                            if (!values.password) {
                                errors.password = "* " + t('auth_Validate_Required');
                            }
                            else if (values.password.length < 3) {
                                errors.password = "* " + t('auth_Validate_Min3');
                            }
                            if (!values.passwordConfirm) {
                                errors.passwordConfirm = "* " + t('auth_Validate_Required');
                            }
                            else if (values.passwordConfirm.length < 3) {
                                errors.passwordConfirm = "* " + t('auth_Validate_Min3');
                            }
                            else if (values.passwordConfirm !== values.password) {
                                errors.passwordConfirm = '* ' + t('auth_Password_Confirm');
                            }
                            return errors;
                        }}
                        onSubmit={(values, { setSubmitting, setErrors }) => {
                            setSubmitting(true)
                            setButtonLoading(true)
                            handleRegister(values).then((res) => {
                                setSubmitting(false);
                                message.success(res)
                                handleClickForm()

                            }).catch((err) => {
                                setSubmitting(false)
                                if (err == "UserName is already exist")
                                    setErrors({ userName: `* ${err}` || undefined })

                                if (err == "Email is already exist")
                                    setErrors({ email: `* ${err}` || undefined })
                            }).finally(() => {
                                setSubmitting(false)
                                setButtonLoading(false)
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
                                    <div className={`inputForm ${errors.email && touched.email ? 'error' : ''}`}>
                                        <Field type="text" name="email" id="email" placeholder="" />
                                        <label htmlFor="email">Email</label>
                                        <ErrorMessage name="email" component="div" className="errMessage" />
                                    </div>
                                    <div className={`inputForm ${errors.password && touched.password ? 'error' : ''}`}>
                                        <Field type="password" name="password" id="password" placeholder="" />
                                        <label htmlFor="password">{t('auth_Password')}</label>
                                        <ErrorMessage name="password" component="div" className="errMessage" />
                                    </div>
                                    <div className={`inputForm ${errors.passwordConfirm && touched.passwordConfirm ? 'error' : ''}`}>
                                        <Field type="password" name="passwordConfirm" id="passwordConfirm" placeholder="" />
                                        <label htmlFor="passwordConfirm">{t('auth_Confirm_Password')}</label>
                                        <ErrorMessage name="passwordConfirm" component="div" className="errMessage" />
                                    </div>
                                    <div className="btnForm">
                                        {
                                            buttonLoading ? <div className="fakeBtn"><div className="loaderBtn"></div></div> : <button type="submit" disabled={isSubmitting}>{t('auth_Signup')}</button>
                                        }
                                    </div>
                                </Form>
                            )
                        }}
                    </Formik>
                </div>
                <div className="footerForm">{t('auth_Acc_Already')}<span onClick={() => {
                    handleClickForm();
                }}>{t('auth_Login')}</span></div>
            </div>
        </>
    );
}
