import React, {useState, useEffect}  from 'react';
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
import {useParams} from 'react-router-dom';
import Services from "../../../Services";

const validationSchema = function (values) {
    return Yup.object().shape({
        password: Yup.string()
            .min(6, `A senha deve ter pelo menos 6 caracteres!`)
            .matches(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/, 'A senha deve conter: números, letras maiúsculas e minúsculas')
            .required('Senha requerida'),
        confirmPassword: Yup.string()
            .oneOf([values.password], 'As senhas devem corresponder')
            .required('A confirmação da senha é necessária')
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
    password: "",
    confirmPassword: "",
};

const ResetPassword = props =>{
    const {token} = useParams();
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [notify, setNotify] = useState(null);

    useEffect(() =>{
        setLoading(true);
        Services.AuthService.getResetLink(token)
            .then(res =>{
                if(res.success){
                    setUser(res.user);
                }else{
                    setError(res.errorMsg);
                }
                setLoading(false);
            })
    }, []);

    const onSubmit = async (values, { setSubmitting, setErrors })  =>{
        user.password = values.password;
        setLoading(true);
        Services.AuthService.resetPassword(user)
            .then(res =>{
                setLoading(false);
                setSubmitting(false);
                if(res.success){
                    setNotify(`Senha redefinida com sucesso. Vá para o `);
                }else{
                    setError(res.errorMsg);
                }
            })
    };

    const load = () => <div className="animated fadeIn pt-1 text-center"><div className="sk-spinner sk-spinner-pulse"/></div>;

  return (
    <div className="app flex-row align-items-center">
      <Container>
        <Row className="justify-content-center">
          <Col md="9" lg="7" xl="6">
              {
                  loading
                      ?load()
                      :<Formik
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
                                              {
                                                  !user? <h2>{error}</h2>
                                                      : <div>
                                                          {notify?
                                                              <Alert color="success">
                                                                  {notify}
                                                                  <a href="/">login</a>
                                                              </Alert>:
                                                              <h1>Redefinir senha</h1>}
                                                          <p className="text-muted">Redefina sua senha</p>
                                                          <InputGroup className="mb-3">
                                                              <InputGroupAddon addonType="prepend">
                                                                  <InputGroupText>
                                                                      <i className="icon-lock"/>
                                                                  </InputGroupText>
                                                              </InputGroupAddon>
                                                              <Input type="password"
                                                                     placeholder="Senha"
                                                                     autoComplete="password"
                                                                     id="password"
                                                                     name="password"
                                                                     valid={!errors.password}
                                                                     invalid={touched.password && !!errors.password}
                                                                     required
                                                                     onChange={handleChange}
                                                                     onBlur={handleBlur}
                                                                     value={values.password}
                                                              />
                                                              <FormFeedback>{errors.password}</FormFeedback>
                                                          </InputGroup>
                                                          <InputGroup className="mb-4">
                                                              <InputGroupAddon addonType="prepend">
                                                                  <InputGroupText>
                                                                      <i className="icon-lock"/>
                                                                  </InputGroupText>
                                                              </InputGroupAddon>
                                                              <Input type="password"
                                                                     placeholder="Confirme a Senha"
                                                                     autoComplete="confirmPassword"
                                                                     id="confirmPassword"
                                                                     name="confirmPassword"
                                                                     valid={!errors.confirmPassword}
                                                                     invalid={touched.confirmPassword && !!errors.confirmPassword}
                                                                     required
                                                                     onChange={handleChange}
                                                                     onBlur={handleBlur}
                                                                     value={values.confirmPassword}
                                                              />
                                                              <FormFeedback>{errors.confirmPassword}</FormFeedback>
                                                          </InputGroup>
                                                          <Button type="submit" color="primary" block
                                                                  disabled={isSubmitting || !isValid}>
                                                              {isSubmitting ? 'Esperar...' : 'Redefina'}</Button>
                                                      </div>
                                              }
                                          </CardBody>
                                      </Card>
                                  </Form>
                              )}/>
              }
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ResetPassword;
