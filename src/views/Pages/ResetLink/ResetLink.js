import React, {useState}  from 'react';
import { Button,
    Card,
    CardBody,
    Col,
    Container,
    Form,
    Input,
    InputGroup,
    InputGroupAddon,
    InputGroupText,
    Row,
    Alert,
    FormFeedback } from 'reactstrap';
import * as Yup from "yup";
import { Formik } from 'formik';
import Services from "../../../Services";

const validationSchema = function (values) {
    return Yup.object().shape({
        email: Yup.string()
            .required('Email é obrigatório')
            .email('Email inválido'),
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
    email: ""
};

const ResetLink = props =>{

    const [res, setRes] = useState(null);

    const onSubmit = async (values, { setSubmitting, setErrors })  =>{
        Services.AuthService.resetLink(values)
            .then(res =>{
                if(res.success){
                    setRes({success: true, message: "Enviamos um link de redefinição de senha para o seu email.Vai expirar em 1 horas."});
                }else{
                    setRes({success: false, message: res.errorMsg});
                }
                setSubmitting(false);
            })
    };

    return (
        <div className="app flex-row align-items-center">
            <Container>
                <Row className="justify-content-center">
                    <Col md="9" lg="7" xl="6">
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
                                    <Form onSubmit={handleSubmit} noValidate name='simpleForm'>
                                        <Card className="mx-4">
                                            <CardBody className="p-4">
                                                {res && res.success?
                                                    <Alert color="success">
                                                        {res.message}
                                                        <h5>Não se esqueça de verificar o spam</h5>
                                                    </Alert>
                                                    :res && !res.success
                                                        ?<Alert color="warning">
                                                            {res.message}
                                                        </Alert>:""}
                                                <h1>Redefinir senha</h1>
                                                <p className="text-muted">Enviaremos um link de redefinição de senha para o seu e-mail</p>
                                                <InputGroup className="mb-3">
                                                    <InputGroupAddon addonType="prepend">
                                                        <InputGroupText>@</InputGroupText>
                                                    </InputGroupAddon>
                                                    <Input type="text"
                                                           placeholder="Email"
                                                           autoComplete="email"
                                                           id="email"
                                                           name="email"
                                                           valid={!errors.email}
                                                           invalid={touched.email && !!errors.email}
                                                           required
                                                           onChange={handleChange}
                                                           onBlur={handleBlur}
                                                           value={values.email}
                                                    />
                                                    <FormFeedback>{errors.email}</FormFeedback>
                                                </InputGroup>
                                                <Button type="submit" color="primary" block disabled={isSubmitting || !isValid}>
                                                    {isSubmitting ? 'Esperar...' : res?'Envie novamente':'Enviar Link'}</Button>
                                            </CardBody>
                                        </Card>
                                    </Form>
                                )}/>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default ResetLink;
