import { ErrorMessage, Field, Form, Formik } from 'formik';
import './modal.style.scss'

import { IoClose } from "react-icons/io5";
import apis from '@/apis';
import { message } from 'antd';
import { useDispatch } from 'react-redux';
import { categoryAction } from '@/stores/slices/category.slice';
export default function ModalCreate({ handleIsModalCreate = () => { } }) {
    const dispatch = useDispatch()
    const handleCreate = (values: formValues): Promise<string> => {
        return new Promise(async (resolve, reject) => {
            try {
                const resCreate = await apis.categoryApi.create(localStorage.getItem("token") as string, values)
                console.log(resCreate);
                if (resCreate.status != 200) {
                    throw {
                        message: "Error Create Category"
                    }
                }
                resolve(resCreate.data.message)
                dispatch(categoryAction.create(resCreate.data.data))
            } catch (err: any) {
                reject(err.response.data.message ? err.response.data.message.join(', ') : "Error Create Category")
            }
        })
    }
    interface formValues {
        title: string,
        link: string
    }
    return (
        <div className="containerModal" onClick={(e) => {
            console.log(e.target, (e.target as any).className == "containerModal");
            if ((e.target as any).className == "containerModal" || (e.target as any).className == "contentModal") {
                document.querySelector('.bodyModal')?.classList.add('close')
                setTimeout(() => {
                    handleIsModalCreate()
                }, 800)
            }

        }}>
            <div className='contentModal'>
                <div className="bodyModal">
                    <div className="headerModal">
                        <h3>Create Category</h3>
                        <span onClick={() => {
                            document.querySelector('.bodyModal')?.classList.add('close')
                            setTimeout(() => {
                                handleIsModalCreate()
                            }, 800)
                        }}><IoClose></IoClose></span>
                    </div>
                    <div className="formModal">
                        <Formik
                            initialValues={{
                                title: "",
                                link: ""
                            }}
                            validate={values => {
                                const errors: Partial<formValues> = {};
                                if (typeof values.title != "string") {
                                    errors.title = "* Title is String"
                                }
                                if (!values.title) {
                                    errors.title = "* Title is required"
                                }
                                if (values.title.length > 50) {
                                    errors.title = "* Title is max 50 characters"
                                }
                                if (typeof values.link != "string") {
                                    errors.link = "* Link is String"
                                }
                                if (!values.link) {
                                    errors.link = "* Link is required"
                                }
                                if (values.link.length > 50) {
                                    errors.link = "* Link is max 50 characters"
                                }
                                return errors;
                            }}
                            onSubmit={(values, { setSubmitting }) => {
                                setSubmitting(true);
                                handleCreate(values).then(res => {
                                    message.success(res);
                                    setSubmitting(false)
                                    document.querySelector('.bodyModal')?.classList.add('close')
                                    setTimeout(() => {
                                        handleIsModalCreate()
                                    }, 800)
                                }).catch(err => {
                                    setSubmitting(false)
                                    message.error(err)
                                }).finally(() => {
                                    setSubmitting(false);
                                })

                            }}

                        >
                            {({ isSubmitting, errors, touched }) => {
                                return (
                                    <Form>
                                        <div className={`formInput ${errors.title && touched.title ? 'error' : ''}`}>
                                            <label htmlFor="title">Title:</label>
                                            <Field type="text" name="title" id="title"></Field>
                                            <ErrorMessage name="title" component="div" className="errMessage" />
                                        </div>
                                        <div className={`formInput ${errors.link && touched.link ? 'error' : ''}`}>
                                            <label htmlFor="link">Link:</label>
                                            <Field type="text" name="link" id="link"></Field>
                                            <ErrorMessage name="link" component="div" className="errMessage" />
                                        </div>
                                        <div className="formBtn">
                                            <button className="createBtn" type="submit" disabled={isSubmitting}>Create</button>
                                            <button type='button' className="cancelBtn" onClick={() => {
                                                document.querySelector('.bodyModal')?.classList.add('close')
                                                setTimeout(() => {
                                                    handleIsModalCreate()
                                                }, 800)
                                            }}>Cancel</button>
                                        </div>
                                    </Form>
                                )
                            }}
                        </Formik>
                    </div>
                </div>
            </div>
        </div>
    );
}
