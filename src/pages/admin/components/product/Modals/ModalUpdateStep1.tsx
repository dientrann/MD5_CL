import { StoreType } from '@/stores';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { useState } from 'react';
import { IoClose } from 'react-icons/io5';
import { useSelector } from 'react-redux';

import './modalCreate.style.scss'
import ModalUpdateStep2 from './ModalUpdateStep2';

export interface dataStep1 { name: string, describe: string, price: number, categoryId: number }

export default function ModalUpdateStep1({ handleIsModalUpdate = () => { }, idUpdate = 0 }) {
    const productStore = useSelector((store: StoreType) => store.productStore)
    const categoryStore = useSelector((store: StoreType) => store.categoryStore)
    const findProduct = productStore.data?.find(item => item.id === idUpdate)

    const [dataUpdateStep1, setDataUpdateStep1] = useState<{ id: number, name: string, describe: string, price: number, categoryId: number }>()
    const [isStep2, setIsStep2] = useState(false)
    interface errorsFormValues {
        name: string
        describe: string
        price: string
        categoryId: string
    }
    return (
        <div className="containerModal" onClick={(e) => {
            if ((e.target as any).className == "containerModal" || (e.target as any).className == "contentModal") {
                document.querySelector('.bodyModal')?.classList.add('close')
                setTimeout(() => {
                    handleIsModalUpdate()
                }, 800)
            }
        }}>
            <div className='contentModal'>
                <div className="bodyModal">
                    <div className="headerModal">
                        <h3>Update Category</h3>
                        <span onClick={() => {
                            document.querySelector('.bodyModal')?.classList.add('close')
                            setTimeout(() => {
                                handleIsModalUpdate()
                            }, 800)
                        }}><IoClose></IoClose></span>
                    </div>
                    <div className="formModal">
                        {isStep2 ? <ModalUpdateStep2 handleIsModalUpdate={handleIsModalUpdate} dataUpdateStep1={dataUpdateStep1}></ModalUpdateStep2> : <Formik
                            initialValues={{
                                name: findProduct ? findProduct.name : "",
                                describe: findProduct ? findProduct.describe : "",
                                price: findProduct ? findProduct.price : 0,
                                categoryId: findProduct ? findProduct.categoryId : 0,
                            }}
                            validate={values => {
                                const errors: Partial<errorsFormValues> = {};
                                if (typeof values.name != "string") {
                                    errors.name = "* Name is String"
                                }
                                if (!values.name) {
                                    errors.name = "* Name is required"
                                }
                                if (values.name.length > 100) {
                                    errors.name = "* Name is max 100 characters"
                                }
                                if (!values.price) {
                                    errors.price = "* Price is required"
                                }
                                if (values.price <= 0) {
                                    errors.price = "* Price is greater than 0"
                                }
                                if (!values.describe) {
                                    errors.describe = "* Describe is required"
                                }
                                if (values.categoryId == 0) {
                                    errors.categoryId = "* Category is required"
                                }
                                return errors;
                            }}
                            onSubmit={(values, { setSubmitting }) => {
                                setSubmitting(true);
                                document.querySelector('.contentModal')?.classList.add('step2')
                                setDataUpdateStep1({ id: idUpdate, ...values })
                                setIsStep2(!isStep2)
                            }}

                        >
                            {({ isSubmitting, errors, touched, handleChange, handleBlur, values }) => {
                                return (
                                    <Form>
                                        <div className={`formInput ${errors.name && touched.name ? 'error' : ''}`}>
                                            <label htmlFor="name">Name:</label>
                                            <Field type="text" name="name" id="name" value={values.name} onChange={handleChange} onBlur={handleBlur}></Field>
                                            <ErrorMessage name="name" component="div" className="errMessage" />
                                        </div>
                                        <div className={`formInput ${errors.describe && touched.describe ? 'error' : ''}`}>
                                            <label htmlFor="describe">Describe:</label>
                                            <Field type="text" name="describe" id="describe" value={values.describe} onChange={handleChange} onBlur={handleBlur} ></Field>
                                            <ErrorMessage name="describe" component="div" className="errMessage" />
                                        </div>
                                        <div className={`formInput ${errors.price && touched.price ? 'error' : ''}`}>
                                            <label htmlFor="price">Price:</label>
                                            <Field type="number" name="price" id="price" value={values.price} onChange={handleChange}></Field>
                                            <ErrorMessage name="price" component="div" className="errMessage" />
                                        </div>
                                        <div className={`formInput ${errors.categoryId && touched.categoryId ? 'error' : ''}`}>
                                            <label htmlFor="category">Category:</label>
                                            <Field as="select" name="categoryId" id="category" value={values.categoryId} onChange={handleChange}>
                                                <option value="0">Select a category</option>
                                                {
                                                    categoryStore.data?.map((category) => (
                                                        <option key={category.id} value={category.id}>
                                                            {category.title}
                                                        </option>
                                                    ))}
                                            </Field>
                                            <ErrorMessage name="categoryId" component="div" className="errMessage" />
                                        </div>
                                        <div className="formBtn">
                                            <button className="updateBtn" type="submit" disabled={isSubmitting}>Update</button>
                                            <button type='button' className="cancelBtn" onClick={() => {
                                                document.querySelector('.bodyModal')?.classList.add('close')
                                                setTimeout(() => {
                                                    handleIsModalUpdate()
                                                }, 800)
                                            }}>Cancel</button>
                                        </div>
                                    </Form>
                                )
                            }}
                        </Formik>}
                    </div>
                </div>
            </div>
        </div >
    );
}
