import React from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup'
import {
    Button,
    Card,
    CardHeader,
    CardBody,
    Col,
    Row,
    Form,
    FormFeedback,
    FormGroup,
    Input
} from 'reactstrap';
import {toast} from 'react-toastify';
import Services from '../../Services';


const validationSchema = function (values) {
    return Yup.object().shape({
        type: Yup.number()
            .min(1, 'Min 1')
            .max(20, 'Max 20')
            .required('Alert Type is required')
            .typeError('Type should be number'),
        name: Yup.string()
            .required('Alert Name is required'),
    })
};

const validate = (getValidationSchema) => {
    return (values) => {
        const validationSchema = getValidationSchema(values);
        try {
            validationSchema.validateSync(values, { abortEarly: false });
            return {}
        } catch (error) {
            return getErrorsFromValidationError(error)
        }
    }
};

const getErrorsFromValidationError = (validationError) => {
    const FIRST_ERROR = 0;
    return validationError.inner.reduce((errors, error) => {
        return {
            ...errors,
            [error.path]: error.errors[FIRST_ERROR],
        }
    }, {})
};

const initialValues = {
    type: "",
    name: "",
};


const  RegisterAlertType = props => {

    const onSubmit = async (values, { setSubmitting, setErrors })  =>{
        Services.AlertService.createType(values)
            .then(res =>{
                if(res.success){
                    toast.success("Successfully created!");
                    props.history.replace('/alert/types');
                }else {
                    setErrors({state: res.errorMsg});
                    toast.warn(res.errorMsg);
                }
            });
        setSubmitting(false)
    };

    return (
        <div className="animated fadeIn">
            <Row>
                <Col md={4}/>
                <Col md={4} className="text-center">
                    <Card>
                        <CardHeader>
                            <i className="icon-bell"/><strong>Register Alert Type</strong>
                        </CardHeader>
                        <CardBody>
                            <hr />
                            <Formik
                                initialValues={initialValues}
                                validate={validate(validationSchema)}
                                onSubmit={onSubmit}
                                render={
                                    ({
                                         values,
                                         errors,
                                         touched,
                                         status,
                                         dirty,
                                         handleChange,
                                         handleBlur,
                                         handleSubmit,
                                         isSubmitting,
                                         isValid,
                                     }) => (
                                        <Row>
                                            <Col>
                                                <Form onSubmit={handleSubmit} noValidate name='simpleForm'>
                                                    <FormGroup>
                                                        <Input type="text"
                                                               name="type"
                                                               id="type"
                                                               placeholder="Alert Type"
                                                               valid={!errors.type}
                                                               invalid={touched.type && !!errors.type}
                                                               required
                                                               onChange={handleChange}
                                                               onBlur={handleBlur}
                                                               value={values.type} />
                                                        <FormFeedback>{errors.type}</FormFeedback>
                                                    </FormGroup>
                                                    <FormGroup>
                                                        <Input type="text"
                                                               name="name"
                                                               id="name"
                                                               placeholder="Alert Name"
                                                               valid={!errors.name}
                                                               invalid={touched.name && !!errors.name}
                                                               required
                                                               onChange={handleChange}
                                                               onBlur={handleBlur}
                                                               value={values.name} />
                                                        <FormFeedback>{errors.name}</FormFeedback>
                                                    </FormGroup>
                                                    <FormGroup>
                                                        <Button type="submit" color="primary" className="mr-1" disabled={isSubmitting || !isValid}>{isSubmitting ? 'Wait...' : 'Create'}</Button>
                                                    </FormGroup>
                                                </Form>
                                            </Col>
                                        </Row>
                                    )} />
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </div>
    );

};

export default RegisterAlertType;