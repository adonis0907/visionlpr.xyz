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
        model: Yup.string()
            .required('Camera model is required'),
        brand: Yup.string()
            .required('Camera brand is required'),
        latitude: Yup.number()
            .min(-90, 'O valor mínimo é -90')
            .max(90, 'O valor máximo é 90')
            .typeError('Latitude must be a number')
            .required("Latitude is required"),
        longitude: Yup.number()
            .min(-180, 'O valor mínimo é -180')
            .max(180, 'O valor máximo é 180')
            .typeError('Longitude must be a number')
            .required('Longitude is required'),
        street: Yup.string()
            .required('Street is required'),
        neighborhood: Yup.string()
            .required('Neighborhood is required'),
        serialNumber: Yup.string()
            .required('Serial Number is required')
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
    model:"",
    brand:"",
    latitude:"",
    longitude:"",
    street: "",
    neighborhood: "",
    serialNumber:"",
    note:""
};


const  CreateCamera = props => {
    const [city, setCity] = useState(null);
    const [cities, setCities] = useState([]);
    const [station, setStation] = useState(null);
    const [stations, setStations] = useState([]);

    /**===========================
     *  fetch all cities and stations for dropdown
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

                    setCities(cities)
                }else{
                    toast.warn(res.errorMsg);
                }
            });
        Services.StationService.fetchAll()
            .then(res =>{
                if(res.success){
                    let stations = [];
                    for(let station of res.stations){
                        stations.push({
                            value: station._id,
                            label: station.id
                        })
                    }
                    setStations(stations);
                }else{
                    toast.warn(res.errorMsg);
                }
            });
    },[]);

    const onSubmit = async (values, { setSubmitting, setErrors })  =>{
        if(!station){
            setSubmitting(false);
            return toast.warn("Station is required");
        }
        if(!city){
            setSubmitting(false);
            return toast.warn("City is required");
        }
        let camera = {
            brand: values.brand,
            model: values.model,
            location:{
                type: 'Point',
                coordinates:[values.latitude, values.longitude]
            },
            neighborhood: values.neighborhood,
            serialNumber: values.serialNumber,
            street: values.street,
            station: station.value,
            city: city.value,
            note: values.note
        };
        Services.CameraService.create(camera)
            .then(res =>{
                if(res.success)
                    toast.success("Success!");
                else
                    toast.warn(res.errorMsg);
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
                            <i className="fa fa-video-camera"/><strong>Criar Câmera</strong>
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
                                                               name="model"
                                                               id="model"
                                                               placeholder="Câmera Modelo"
                                                               valid={!errors.model}
                                                               invalid={touched.model && !!errors.model}
                                                               required
                                                               onChange={handleChange}
                                                               onBlur={handleBlur}
                                                               value={values.model} />
                                                        <FormFeedback>{errors.model}</FormFeedback>
                                                    </FormGroup>
                                                    <FormGroup>
                                                        <Input type="text"
                                                               name="brand"
                                                               id="brand"
                                                               placeholder="Câmera Marca"
                                                               valid={!errors.brand}
                                                               invalid={touched.brand && !!errors.brand}
                                                               required
                                                               onChange={handleChange}
                                                               onBlur={handleBlur}
                                                               value={values.brand} />
                                                        <FormFeedback>{errors.brand}</FormFeedback>
                                                    </FormGroup>
                                                    <FormGroup>
                                                        <Input type="number"
                                                               name="latitude"
                                                               id="latitude"
                                                               min="-90"
                                                               max="90"
                                                               placeholder="Latitude"
                                                               valid={!errors.latitude}
                                                               invalid={touched.latitude && !!errors.latitude}
                                                               required
                                                               onChange={handleChange}
                                                               onBlur={handleBlur}
                                                               value={values.latitude} />
                                                        <FormFeedback>{errors.latitude}</FormFeedback>
                                                    </FormGroup>
                                                    <FormGroup>
                                                        <Input type="number"
                                                               name="longitude"
                                                               id="longitude"
                                                               placeholder="Longitude"
                                                               valid={!errors.longitude}
                                                               invalid={touched.longitude && !!errors.longitude}
                                                               required
                                                               onChange={handleChange}
                                                               onBlur={handleBlur}
                                                               value={values.longitude} />
                                                        <FormFeedback>{errors.longitude}</FormFeedback>
                                                    </FormGroup>
                                                    <FormGroup>
                                                        <Input type="text"
                                                               name="street"
                                                               id="street"
                                                               placeholder="Rua"
                                                               valid={!errors.street}
                                                               invalid={touched.street && !!errors.street}
                                                               required
                                                               onChange={handleChange}
                                                               onBlur={handleBlur}
                                                               value={values.street} />
                                                        <FormFeedback>{errors.street}</FormFeedback>
                                                    </FormGroup>
                                                    <FormGroup>
                                                        <Input type="text"
                                                               name="neighborhood"
                                                               id="neighborhood"
                                                               placeholder="Vizinhança"
                                                               valid={!errors.neighborhood}
                                                               invalid={touched.neighborhood && !!errors.neighborhood}
                                                               required
                                                               onChange={handleChange}
                                                               onBlur={handleBlur}
                                                               value={values.neighborhood} />
                                                        <FormFeedback>{errors.neighborhood}</FormFeedback>
                                                    </FormGroup>
                                                    <FormGroup>
                                                        <Input type="text"
                                                               name="serialNumber"
                                                               id="serialNumber"
                                                               placeholder="Número de série"
                                                               valid={!errors.serialNumber}
                                                               invalid={touched.serialNumber && !!errors.serialNumber}
                                                               required
                                                               onChange={handleChange}
                                                               onBlur={handleBlur}
                                                               value={values.serialNumber} />
                                                        <FormFeedback>{errors.serialNumber}</FormFeedback>
                                                    </FormGroup>
                                                    <FormGroup>
                                                        <Select
                                                            name="station"
                                                            id="station"
                                                            placeholder="Estação"
                                                            value={station}
                                                            options={stations}
                                                            onBlur={handleBlur}
                                                            onChange={setStation}
                                                            style={{textAlign:'left'}}
                                                        />
                                                    </FormGroup>
                                                    <FormGroup>
                                                        <Select
                                                            name="city"
                                                            id="city"
                                                            value={city}
                                                            options={cities}
                                                            placeholder="Cidade"
                                                            onBlur={handleBlur}
                                                            onChange={setCity}
                                                            style={{textAlign:'left'}}
                                                        />
                                                        <FormFeedback>{errors.city}</FormFeedback>
                                                    </FormGroup>
                                                    <FormGroup>
                                                        <Input type="text"
                                                               name="note"
                                                               id="note"
                                                               placeholder="Nota"
                                                               required
                                                               onChange={handleChange}
                                                               onBlur={handleBlur}
                                                               value={values.note} />
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

export default CreateCamera;