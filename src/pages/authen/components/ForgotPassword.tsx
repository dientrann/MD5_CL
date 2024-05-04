import apis from "@/apis";
import { message } from "antd";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { useTranslation } from "react-i18next";

interface formValues {
    userName: string
}

export default function ForgotPassword({ handleClickForgotPassword = () => {}}) {

    const { t } = useTranslation()

    const handleForgotPassword = (values: formValues): Promise<string> => {
        return new Promise(async(resolve, reject) => {
            try{
                let resForgotPassword = await apis.userApi.forgotPassword(values.userName);
                console.log(resForgotPassword);

                if(resForgotPassword.status != 200){
                    throw {
                        message: "errror"
                    }
                }
                if(resForgotPassword.data.message == "Forgot Password Success"){
                    resolve("Forgot Password Success. New password is sent to your email")
                }
            }catch(err){
                console.log(err);
            }
        })
    }
    return (
        <>
            <div className="formInput">
                <div className="headerForm">
                    <h3>Forgot Password</h3>
                </div>
                <div className="bodyForm">
                    <Formik
                        initialValues={{
                            userName: ""
                        }}
                        validate={values => {
                            const errors: Partial<formValues> = {}
                            if (!values.userName) {
                                errors.userName = "* " + t('auth_Validate_Required');
                            }
                            else if (values.userName.length < 3) {
                                errors.userName = "* " + t('auth_Validate_Min3');
                            }
                            return errors;
                        }}
                        onSubmit={(values, { setSubmitting, setErrors }) => {
                            console.log(values);
                            //setButtonLoading(true)
                            
                            setSubmitting(true)
                            handleForgotPassword(values).then((res)=>{
                                message.success(res)
                                setSubmitting(false)
                                handleClickForgotPassword()
                            }).catch((err)=>{
                                console.log(err);
                                
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
                                    <div className="btnForm">
                                        <button type="submit" disabled={isSubmitting}>Reset Password</button>
                                    </div>
                                </Form>
                            )
                        }}
                    </Formik>

                    <div className="footerForm">
                        <div className="">
                            <span onClick={()=>{
                                handleClickForgotPassword()
                            }}>Back To Login</span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
