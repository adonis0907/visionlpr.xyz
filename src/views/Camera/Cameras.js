import React, {useState, useEffect} from 'react';
import {Card, CardHeader, CardBody, Button, Input, FormGroup, Form, Row, Col, FormFeedback} from 'reactstrap';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import Select from 'react-select';
import 'react-bootstrap-table/dist//react-bootstrap-table-all.min.css';
import {toast} from 'react-toastify';
import Services from '../../Services';
import * as Yup from "yup";
import {Formik} from "formik";

const initialParams = {
    page: 1,
    sizePerPage: 10,
    sort:{
        cameraId: 'desc'
    },
    filterObj:{
        active: true
    }
};

const Cameras = props => {

    const [cities, setCities] = useState({});
    const [citiesForFilter, setCitiesForFilter] = useState({});
    const [stations, setStations] = useState({});
    const [stationsForFilter, setStationsForFilter] = useState({});
    const [dataTotalSize, setDataTotalSize] = useState(0);
    const [params, setParams] = useState(initialParams);
    const [cameras, setCameras] = useState([]);

    /**========================
     *  Fetch cities and stations
     */
    useEffect(() =>{
        Services.CityService.fetchAll()
            .then(res =>{
                if(res.success){
                    let cities = {};
                    let citiesForFilter = {};
                    for(let city of res.cities){
                        cities[city._id] = city;
                        citiesForFilter[city._id] = `${city.city}-${city.state}`;
                    }
                    setCities(cities);
                    setCitiesForFilter(citiesForFilter);
                }else{
                    toast.warn(res.errorMsg);
                }
            });
        Services.StationService.fetchAll()
            .then(res =>{
                if(res.success){
                    let stations = {};
                    let stationsForFilter = {};
                    for(let station of res.stations){
                        stations[station._id] = station;
                        stationsForFilter[station._id] = station.id;
                    }
                    setStations(stations);
                    setStationsForFilter(stationsForFilter);
                }else{
                    toast.warn(res.errorMsg);
                }
            });
    }, []);

    /** ========================
     *  Fetch records with given params
     */
    useEffect(()=>{
        Services.CameraService.fetchAll(params)
            .then(res =>{
                if(res.success){
                    setCameras(res.cameras);
                    setDataTotalSize(res.total);
                }else{
                    toast.warn(res.errorMsg);
                }
            });
    },[params]);

    // /** ==========================
    //  *  Delete event handler
    //  * @param cameraIds: record _id from mongodb
    //  */
    // const onDeleteRow = cameraIds =>{
    //     Services.CameraService.deleteCameras(cameraIds)
    //         .then(res => {
    //             if(res.success){
    //                 let newCams = cameras.filter(camera =>{
    //                     return cameraIds.indexOf(camera._id) === -1;
    //                 });
    //                 setCameras(newCams);
    //                 toast.success(`Excluiu ${res.count} câmeras com sucesso.`);
    //             }
    //             else{
    //                 toast.warn(res.errorMsg);
    //             }
    //         })
    // };

    /**============================
     *  Page change event handler
     * @param page: current page
     * @param sizePerPage: records number per page
     */
    const onPageChange = (page, sizePerPage) =>{
        let tmp = {...params};
        tmp.page = page;
        tmp.sizePerPage = sizePerPage;
        setParams(tmp);
    };

    /**===========================
     *   Size per page change event handler
     * @param sizePerPage
     */
    const onSizePerPageList = sizePerPage =>{
        let tmp = {...params};
        tmp.sizePerPage = sizePerPage;
        setParams(tmp);
    };

    /**=========================
     *  Column sort event handler
     * @param sortName: column(field) name
     * @param sortOrder: sort order. 'asc' or 'desc
     */
    const onSortChange = (sortName, sortOrder) =>{
        let tmp = {...params};
        tmp.sort = {[sortName]: sortOrder};
        setParams(tmp);
    };

    /**=======================
     *  Column filter event handler.
     * @param filterObj
     */
    const onFilterChange = filterObj =>{
        let tmp = {...params};
        for (let [key, value] of Object.entries(filterObj)){
            if(key === 'station' || key === 'city')
                tmp.filterObj[key] = value.value;
            else
                tmp.filterObj[key] = {$regex: `.*${value.value}.*`};
        }
        setParams(tmp);
    };

    /**=======================
     *  City column formatter
     * @param city
     * @returns {string}
     * @constructor
     */
    const CityFormatter = city =>{
        return `${city.city}-${city.state}`;
    };

    /**========================
     *  Station column formatter
     * @param station
     * @returns {*}
     * @constructor
     */
    const StationFormatter = station =>{
        if(station)
        return station.id;
        else return station;
    };

    const locationFormatter = location =>{
        return `${location.coordinates[0]}, ${location.coordinates[1]}`;
    };

    /**=======================
     *  City column custom sort function
     * @param a: first record object(whole row data)
     * @param b: second record object (whole row data)
     * @param order =>'asc' or 'desc'
     * @returns {number}
     */
    const citySort = (a, b, order) => {
        if (order === 'desc') {
            return a.city.city.localeCompare(b.city.city);
        } else {
            return b.city.city.localeCompare(a.city.city);
        }
    };

    /**=======================
     *  Station column custom sort function
     * @param a: first record object(whole row data)
     * @param b: second record object(whole row data)
     * @param order=>'asc' or 'desc'
     * @returns {number}
     */
    const stationSort = (a, b, order) =>{
        if (order === 'desc') {
            return a.station.id.localeCompare(b.station.id);
        } else {
            return b.station.id.localeCompare(a.station.id);
        }
    };

    /**=====================
     *  Datatable option
     * @type {{searchDelayTime: number,
     * sortIndicator: boolean,
     * page: number,
     * sizePerPage: number,
     * hideSizePerPage: boolean,
     * paginationSize: number,
     * hidePageListOnlyOnePage: boolean,
     * alwaysShowAllBtns: boolean,
     * withFirstAndLast: boolean,
     * deleteRow: boolean,
     * onDeleteRow: onDeleteRow,
     * onPageChange: onPageChange,
     * onSizePerPageList: onSizePerPageList,
     * onSortChange: onSortChange,
     * onFilterChange: onFilterChange}}
     */
    const options = {
        searchDelayTime: 1500,
        sortIndicator: true,
        page: params.page,
        sizePerPage: params.sizePerPage,
        hideSizePerPage: false,
        paginationSize: 5,
        hidePageListOnlyOnePage: false,
        alwaysShowAllBtns: false,
        withFirstAndLast: false,
        // deleteRow: true,
        // onDeleteRow: onDeleteRow,
        onPageChange: onPageChange,
        onSizePerPageList: onSizePerPageList,
        onSortChange: onSortChange,
        onFilterChange: onFilterChange,
    };

    /**==============================
     * Custom Station Editor
     * @param onUpdate
     * @param props
     * @returns {*}
     */
    const createStationEditor = (onUpdate, props) => (<StationEditor onUpdate={onUpdate}{...props}/>);

    const createCityEditor = (onUpdate, props) => (<CityEditor onUpdate={onUpdate}{...props}/>);

    const createCoordinateEditor = (onUpdate, props) =>(<CoordinateEditor onUpdate={onUpdate}{...props}/>);

    /**============================
     *  Confirm cell edit
     * @param row: whole row data
     * @param cellName: field name
     * @param cellValue: new value
     * @returns {boolean}
     */
    const onBeforeSaveCell = (row, cellName, cellValue) => {
        let label, value, newProperty;
        if(typeof cellValue === 'object'){
            if(cellName === 'station'){
                label = cellValue.id;
                value = cellValue._id;
                newProperty = stations[value];
            }
            else if(cellName === 'city'){
                label = `${cellValue.city}-${cellValue.state}`;
                value = cellValue._id;
                newProperty = cities[value];
            }else if(cellName === 'location'){
                label = `${cellValue.coordinates[0]}, ${cellValue.coordinates[1]}`;
                value = cellValue;
                newProperty = cellValue;
            }
        }else{
            label = cellValue;
            value = cellValue;
            newProperty = cellValue;
            if(row[cellName] === cellValue) return false;
        }
        let userInput = window.confirm(`Tem certeza de que deseja salvar o campo "${cellName}" como "${label}"?`);
        if(userInput)
            Services.CameraService.update({id: row._id, query: {[cellName]: value}}).then(res =>{
                if(res.success){
                    let cam = [...cameras];
                    let index = cam.findIndex((element)=> element._id === row._id);
                    cam[index][cellName] = newProperty;
                    setCameras(cam);
                    toast.success('Atualizado com sucesso');
                    return true;
                }else{
                    toast.warn(res.errorMsg);
                    return false;
                }
            });
    };

    return (
        <div className="animated">
            <Card>
                <CardHeader>
                    <i className="icon-menu"/>Câmeras
                </CardHeader>
                <CardBody>
                    <BootstrapTable
                        remote={true}
                        data={cameras}
                        version="4"
                        striped
                        hover
                        cellEdit={{
                            mode: 'dbclick',
                            blurToSave: true,
                            beforeSaveCell: onBeforeSaveCell
                        }}
                        pagination={true}
                        fetchInfo={{dataTotalSize: dataTotalSize}}
                        options={options}>

                        <TableHeaderColumn dataField="cameraId" dataSort filter={{type:'TextFilter'}} editable={false} width="150">Id</TableHeaderColumn>
                        <TableHeaderColumn dataField="model" dataSort filter={{type:'TextFilter'}} width="150">Modelo</TableHeaderColumn>
                        <TableHeaderColumn dataField="brand" dataSort filter={{type:'TextFilter'}} width="150">Marca</TableHeaderColumn>
                        <TableHeaderColumn dataField='station'
                                           dataSort sortFunc={stationSort} width="150"
                                           dataFormat={StationFormatter} filterFormatted
                                           customEditor={ { getElement: createStationEditor, customEditorParameters: { stations: stations}}}
                                            filter={ { type: 'SelectFilter', options: stationsForFilter } }>Estação</TableHeaderColumn>
                        <TableHeaderColumn  dataField="city" dataSort sortFunc={citySort}
                                            dataFormat={CityFormatter} filterFormatted
                                            filter={ { type: 'SelectFilter', options: citiesForFilter }}
                                            customEditor={ { getElement: createCityEditor, customEditorParameters: { cities: cities}} } width="200">Cidade</TableHeaderColumn>
                        <TableHeaderColumn  dataField="street" dataSort filter={{type:'TextFilter'}} width="150">Street</TableHeaderColumn>
                        <TableHeaderColumn  dataField="neighborhood" dataSort filter={{type:'TextFilter'}} width="150">Vizinhança</TableHeaderColumn>
                        <TableHeaderColumn  dataField="serialNumber" dataSort filter={{type:'TextFilter'}} width="200">Número de série</TableHeaderColumn>
                        <TableHeaderColumn  dataField="location" width="250" dataFormat={locationFormatter} customEditor={{ getElement: createCoordinateEditor}}>Coordenada</TableHeaderColumn>
                        <TableHeaderColumn dataField='_id' isKey={true} hidden={true}>_id</TableHeaderColumn>
                    </BootstrapTable>
                </CardBody>
            </Card>
        </div>
    );
};

class StationEditor extends React.Component {
    constructor(props) {
        super(props);
        this.updateData = this.updateData.bind(this);
        this.formatter = this.formatter.bind(this);
        this.onChange = this.onChange.bind(this);
        this.state = {
            option:  {value: props.defaultValue._id, label: props.defaultValue.id}
        }
    }

    updateData() {
        if(this.props.defaultValue._id === this.state.option.value){
            this.props.onUpdate(null);
        }
        else{
            this.props.onUpdate({_id: this.state.option.value, id: this.state.option.label});
        }
    }

    onChange(option){
        this.setState({option: option})
    }

    formatter(){
        let options = [];
        for(let station in this.props.stations){
            options.push({value:station, label: this.props.stations[station].id})
        }
        return options;
    }

    render() {
        return (
            <div>
                <Select
                    placeholder="Station"
                    value={this.state.option}
                    options={this.formatter()}
                    onChange={this.onChange}
                />
                <button
                    className='btn-info btn-xs'
                    onClick={ this.updateData }>
                  save
                </button>
                <button
                    className='btn-info btn-xs'
                    onClick={ () =>this.props.onUpdate(null) }>
                  cancel
                </button>
            </div>
        );
    }
}

class CityEditor extends React.Component {
    constructor(props) {
        super(props);
        this.updateData = this.updateData.bind(this);
        this.formatter = this.formatter.bind(this);
        this.onChange = this.onChange.bind(this);
        this.state = {
            option:  {value: props.defaultValue._id, label: props.defaultValue.city, state: props.defaultValue.state}
        }
    }

    updateData() {
        if(this.props.defaultValue._id === this.state.option.value){
            this.props.onUpdate(null);
        }
        else{
            this.props.onUpdate({_id: this.state.option.value, city: this.state.option.label, state: this.state.option.state});
        }
    }

    onChange(option){
        this.setState({option: option})
    }

    formatter(){
        let options = [];
        for(let key in this.props.cities){
            options.push({value:key, label: this.props.cities[key].city, state: this.props.cities[key].state});
        }
        return options;
    }

    render() {
        return (
            <div>
                <Select
                    placeholder="city"
                    value={this.state.option}
                    options={this.formatter()}
                    onChange={this.onChange}
                />
                <button
                    className='btn-info btn-xs'
                    onClick={ this.updateData }>
                    save
                </button>
                <button
                    className='btn-info btn-xs'
                    onClick={ () =>this.props.onUpdate(null) }>
                    cancel
                </button>
            </div>
        );
    }
}

class CoordinateEditor extends React.Component{
    constructor(props){
        super(props);
        this.onSubmit = this.onSubmit.bind(this);
        this.state = props.defaultValue
    }

    validationSchema(values){
        return Yup.object().shape({
            latitude: Yup.number()
                .min(-90, 'O valor mínimo é -90')
                .max(90, 'O valor máximo é 90')
                .typeError('Latitude must be a number')
                .required("Latitude is required"),
            longitude: Yup.number()
                .min(-180, 'O valor mínimo é -180')
                .max(180, 'O valor máximo é 180')
                .typeError('Longitude must be a number')
                .required('Longitude is required')
        });
    }

    validate (getValidationSchema) {
        return (values) => {
            const validationSchema = getValidationSchema(values);
            try {
                validationSchema.validateSync(values, { abortEarly: false });
                return {}
            } catch (error) {
                return this.getErrorsFromValidationError(error)
            }
        }
    };

    getErrorsFromValidationError  (validationError)  {
        const FIRST_ERROR = 0;
        return validationError.inner.reduce((errors, error) => {
            return {
                ...errors,
                [error.path]: error.errors[FIRST_ERROR],
            }
        }, {})
    };

    onSubmit(values, { setSubmitting, setErrors }){
        this.props.onUpdate({coordinates: [values.latitude, values.longitude], type: "Point"});
    }

    render(){
        return (
            <div>
                <Formik
                    initialValues={{latitude: this.state.coordinates[0], longitude: this.state.coordinates[1]}}
                    validate={this.validate(this.validationSchema)}
                    onSubmit={this.onSubmit}
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
                                        <FormGroup className="text-center">
                                            <Button type="button" color="warning"
                                                    className="mr-1"
                                                    onClick={ () =>this.props.onUpdate(null)}
                                                    disabled={isSubmitting}>
                                                Cancelar
                                            </Button>
                                            <Button type="submit" color="primary"
                                                    className="mr-1"
                                                    disabled={isSubmitting || !isValid}>
                                                {isSubmitting ? 'Esperar...' : 'Atualizar'}
                                            </Button>
                                        </FormGroup>
                                    </Form>
                                </Col>
                            </Row>
                        )} />
        </div>);
    }
}

export default Cameras;