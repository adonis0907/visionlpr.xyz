import React from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
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
        plate: Yup.string()
            .min(5, 'Número da placa inválido')
            .max(7, 'Número da placa inválido')
            .required('Licença é necessária'),
        type: Yup.string()
            .required('Alerta é necessário'),
        note: Yup.string()
            .min(5, 'A nota deve ter pelo menos 5 caracteres')
            .required('Nota é necessária')
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
    plate: "",
    type:"",
    note:""
};


const  CreateAlert = props => {

    const onSubmit = (values, { setSubmitting, setErrors })  =>{
        let alert = {...values};

        Services.AlertService.createAlert(alert)
            .then(res =>{
                setSubmitting(false);
                if(res.success){
                    toast.success('Sucesso');
                }else{
                    toast.warn(res.errorMsg);
                }
            });
    };

    return (
        <div className="animated fadeIn">
            <Row>
                <Col md={4}/>
                <Col md={4}>
                    <Card>
                        <CardHeader>
                            <i className="icon-bell"/><strong>Adicionar Alerta</strong>
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
                                                               name="plate"
                                                               id="plate"
                                                               placeholder="Placa do veículo"
                                                               autoComplete="plate"
                                                               valid={!errors.plate}
                                                               invalid={touched.plate && !!errors.plate}
                                                               required
                                                               onChange={handleChange}
                                                               onBlur={handleBlur}
                                                               value={values.plate} />
                                                        <FormFeedback>{errors.plate}</FormFeedback>
                                                    </FormGroup>
                                                    <FormGroup>
                                                        <Input type="select"
                                                               name="type"
                                                               id="type"
                                                               valid={!errors.type}
                                                               invalid={touched.type && !!errors.type}
                                                               required
                                                               onChange={handleChange}
                                                               onBlur={handleBlur}
                                                               value={values.type}>
                                                            <option value="">Selecione um tipo de alerta</option>
                                                            <option value="1">Roubo</option>
                                                            <option value="2"> Licenciamento</option>
                                                            <option value="3">Renajud</option>
                                                            <option value="4">Envolvido na ocorrência</option>
                                                            <option value="5">Investigado </option>
                                                        </Input>
                                                        <FormFeedback>{errors.type}</FormFeedback>
                                                    </FormGroup>
                                                    <FormGroup>
                                                        <Input type="text"
                                                               name="note"
                                                               id="note"
                                                               placeholder="Nota"
                                                               valid={!errors.note}
                                                               invalid={touched.note && !!errors.note}
                                                               required
                                                               onChange={handleChange}
                                                               onBlur={handleBlur}
                                                               value={values.note} />
                                                        <FormFeedback>{errors.note}</FormFeedback>
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

export default CreateAlert;