import React, {useEffect, useState} from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import Select from 'react-select';
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
import 'react-select/dist/react-select.min.css';
import Services from '../../Services';

const validationSchema = function (values) {
    return Yup.object().shape({
        id: Yup.string()
            .required('O id da estação é obrigatório'),

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
    id: "",
    city: null,
};


const  CreateStation = props => {
    const [option, setOption] = useState(null);
    const [options, setOptions] = useState([]);

    /**==========================
     *  fetch all cities for dropdown
     */
    useEffect(()=>{
        Services.CityService.fetchAll()
            .then(res =>{
                if(res.success){
                    let cities = [];
                    for(let city of res.cities){
                        cities.push({
                            value: city._id,
                            label: `${city.city} - ${city.state}`
                        })
                    }

                    setOptions(cities)
                }else{
                    toast.warn(res.errorMsg);
                }
            });
    },[]);

    const onSubmit = async (values, { setSubmitting, setErrors })  =>{
        if(!option){
            setSubmitting(false);
            return toast.warn("Cidade é necessária");
        }
        Services.StationService.create({id:values.id, city: option.value})
            .then(res =>{
                if(res.success){
                    toast.success("Criado com sucesso!");
                    props.history.replace('/station/all');
                }
                else{
                    if(res.errorCode)
                        setErrors({id: res.errorMsg});
                    toast.warn(res.errorMsg);
                }

            });
        setSubmitting(false)
    };

    return (
        <div className="animated fadeIn">
            <Row>
                <Col md={4}/>
                <Col md={4}>
                    <Card>
                        <CardHeader>
                            <i className="fa fa-map-pin"/><strong>Criar Estação</strong>
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
                                                               name="id"
                                                               id="id"
                                                               placeholder="Estação Id"
                                                               valid={!errors.id}
                                                               invalid={touched.id && !!errors.id}
                                                               required
                                                               onChange={handleChange}
                                                               onBlur={handleBlur}
                                                               value={values.id} />
                                                        <FormFeedback>{errors.id}</FormFeedback>
                                                    </FormGroup>
                                                    <FormGroup>
                                                        <Select
                                                            name="city"
                                                            id="city"
                                                            value={option}
                                                            options={options}
                                                            valid={!errors.city}
                                                            invalid={touched.city && !!errors.city}
                                                            onBlur={handleBlur}
                                                            onChange={setOption}
                                                            style={{textAlign:'left'}}
                                                        />
                                                        <FormFeedback>{errors.city}</FormFeedback>
                                                    </FormGroup>

                                                    <FormGroup className="text-center">
                                                        <Button type="submit" color="primary"
                                                                className="mr-1"
                                                                disabled={isSubmitting || !isValid}>
                                                            {isSubmitting ? 'Esperar...' : 'Criar'}
                                                            </Button>
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

export default CreateStation;