import React, {useState, useEffect} from 'react';
import {Card, CardHeader, CardBody, Button, Input, FormGroup, Form, Col, Label} from 'reactstrap';
import Select from 'react-select';
import 'react-dates/initialize';
import { DateRangePicker } from 'react-dates';
import 'react-dates/lib/css/_datepicker.css';
import './react_dates_overrides.css';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import 'react-bootstrap-table/dist//react-bootstrap-table-all.min.css';
import 'react-select/dist/react-select.min.css';
import {toast} from 'react-toastify';
import Services from '../../Services';

const colors = [
    {key:"01", value:"AMARELA"},
    {key: "02", value: "AZUL"},
    {key: "03", value: "BEGE"},
    {key: "04", value: "BRANCA"},
    {key: "05", value: "CINZA"},
    {key: "06", value: "DOURADA"},
    {key: "07", value: "GRENA"},
    {key: "08", value: "LARANJA"},
    {key: "09", value: "MARROM"},
    {key: "10", value: "PRATA"},
    {key: "11", value: "PRETA"},
    {key: "12", value: "ROSA"},
    {key: "13", value: "ROXA"},
    {key: "14", value: "VERDE"},
    {key: "15", value: "VERMELHA"},
    {key: "16", value: "FANTASIA"},
];

const initialParams = {
    page: 1,
    sizePerPage: 25,
};

const Cameras = props => {

    const [plate, setPlate] = useState('');
    const [model, setModel] = useState('');
    const [brand, setBrand] = useState('');
    const [color, setColor] = useState('');
    const [originColor, setOriginColor] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [startMoment, setStartMoment] = useState(null);
    const [endMoment, setEndMoment] = useState(null);
    const [focusedInput, setFocusedInput] = useState(null);

    const [params, setParams] = useState(initialParams);
    const [dataTotalSize, setDataTotalSize] = useState(0);
    const [vehicles, setVehicles] = useState([]);

    const [cameras, setCameras] = useState([]);
    const [camera, setCamera] = useState(null);
    const [cities, setCities] = useState([]);
    const [city, setCity] = useState(null);

    useEffect(()=>{
        Services.CameraService.fetch()
            .then(res =>{
                if(res.success){
                    let cams;
                    if(city)
                        cams = res.cameras.filter(element => element.city._id === city.value);
                    else
                        cams = res.cameras;
                    let formatted = [];
                    for (let item of cams){
                        formatted.push({
                            value: item._id,
                            label: item.street,
                            id: item.cameraId
                        });
                    }
                    setCameras(formatted);
                    setCamera(null);
                }else{
                    toast.warn(res.errorMsg);
                }
            });
    }, [city]);

    useEffect(() =>{
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
                    setCities(cities);
                }else{
                    toast.warn(res.errorMsg);
                }
            });
    }, []);

    useEffect(() =>{
        let body = {...params};
        body.plate = plate;
        body.model = model;
        body.brand = brand;
        body.color = color;
        body.originColor = originColor;
        body.startDate = startDate;
        body.endDate = endDate;
        Services.VehicleService.search(body)
            .then(res => {
                if(res.success){
                    setVehicles(res.vehicles);
                    setDataTotalSize(res.total);
                }else{
                    toast.warn(res.errorMsg);
                }
            });
    }, [params]);

    const updateDateRangePicker = (start, end) =>{
        setStartMoment(start);
        setEndMoment(end);
        if(start) setStartDate(start._d);
        if(end) setEndDate(end._d);
    };

    const submit = () =>{
        let body = {...initialParams};
        body.plate = plate;
        body.model = model;
        body.brand = brand;
        body.color = color;
        body.originColor = originColor;
        body.startDate = startDate;
        body.endDate = endDate;
        if(city) body.city = city.value;
        if(camera) body.camera = camera.id;
        Services.VehicleService.search(body)
            .then(res => {
                if(res.success){
                    setVehicles(res.vehicles);
                    setDataTotalSize(res.total);
                }else{
                    toast.warn(res.errorMsg);
                }
            });
    };

    const clear = () =>{
        setPlate('');
        setModel('');
        setBrand('');
        setColor('');
        setOriginColor('');
        setStartDate('');
        setEndDate('');
        setStartMoment(null);
        setEndMoment(null);
    };

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

    const colorFormatter = color =>{
        let ss = colors.filter(cor => cor.key === color);
        if(ss.length < 1) return '';
        else return ss[0].value;
    };

    const dateFormatter = datetime =>{
        let options = {
            year: 'numeric', month: 'numeric', day: 'numeric',
            hour: 'numeric', minute: 'numeric', second: 'numeric',
            hour12: false
        };
        let date = new Date(Date.parse(datetime));
        return new Intl.DateTimeFormat('en-US', options).format(date);
    };

    const cameraFormatter = (a, b) =>{
        let camera = cameras.filter(element => element.cameraId === a && element.station.id === b.station);
        if(camera[0]){
            return camera[0].street;
        }else{
            return 'Câmera removida'
        }

    };

    const licenseFormatter = (license, row) =>{
        return <a color="primary" href={`/#/vehicle/detail/${row._id}`} target="_blank" rel="noopener noreferrer">{license}</a>
    };

    const options ={
        searchDelayTime: 1500,
        sortIndicator: true,
        page: params.page,
        sizePerPage: params.sizePerPage,
        hideSizePerPage: false,
        paginationSize: 1,
        hidePageListOnlyOnePage: false,
        alwaysShowAllBtns: false,
        withFirstAndLast: false,
        onPageChange: onPageChange,
        onSizePerPageList: onSizePerPageList,
        onSortChange: onSortChange,
        noDataText: "Não há dados",
    };

    return (
        <div className="animated row">
            <Col md={4} sm={12} xs={12}>
                <Card>
                    <CardHeader>
                        <i className="icon-menu"/>Pesquisa
                    </CardHeader>
                    <CardBody>
                        <Form>
                            <Label><strong>Procurar por</strong></Label>
                            <FormGroup>
                                <Input type="text"
                                       name="plate"
                                       id="plate"
                                       value={plate}
                                       placeholder="Placas"
                                       onChange={event => setPlate(event.target.value)}
                                       autoComplete="plate"/>
                            </FormGroup>
                            <FormGroup>
                                <Input type="text"
                                       name="model"
                                       id="model"
                                       value={model}
                                       onChange={event => setModel(event.target.value)}
                                       placeholder="Modelo"
                                       autoComplete="model"/>
                            </FormGroup>
                            <FormGroup>
                                <Input type="text"
                                       name="brand"
                                       id="brand"
                                       value={brand}
                                       placeholder="Marca"
                                       onChange={event => setBrand(event.target.value)}
                                       autoComplete="brand"/>
                            </FormGroup>
                            <FormGroup>
                                <Input type="select"
                                       name="color"
                                       value={color}
                                       onChange={event => setColor(event.target.value)}
                                       id="color">
                                    <option value="">Qualquer cor</option>
                                    {
                                        colors.map(color => (<option value={color.key} key={color.key}>{color.value}</option>))
                                    }
                                </Input>
                            </FormGroup>
                            <FormGroup>
                                <Input type="select"
                                       name="originColor"
                                       value={originColor}
                                       onChange={event => setOriginColor(event.target.value)}
                                       id="originColor">
                                    <option value="">Cor de origem</option>
                                    {
                                        colors.map(color => (<option value={color.key} key={color.key}>{color.value}</option>))
                                    }
                                </Input>
                            </FormGroup>
                            <FormGroup>
                                <Select
                                    name="city"
                                    id="city"
                                    value={city}
                                    options={cities}
                                    placeholder="Cidade"
                                    style={{textAlign:'left'}}
                                    onChange={setCity}
                                />
                            </FormGroup>
                            <FormGroup>
                                <Select
                                    name="camera"
                                    id="camera"
                                    value={camera}
                                    options={cameras}
                                    placeholder="Camera"
                                    style={{textAlign:'left'}}
                                    onChange={setCamera}
                                />
                            </FormGroup>
                            <FormGroup>
                                <DateRangePicker
                                    startDatePlaceholderText="Início"
                                    endDatePlaceholderText="Fim"
                                    startDate={startMoment}
                                    startDateId="startDate"
                                    endDate={endMoment}
                                    endDateId="endDate"
                                    onDatesChange={({startDate, endDate}) => updateDateRangePicker(startDate, endDate)}
                                    focusedInput={focusedInput}
                                    onFocusChange={focusedInput => setFocusedInput(focusedInput)}
                                    orientation='horizontal'
                                    openDirection='down'
                                    isOutsideRange={() => false}
                                />
                            </FormGroup>
                            <FormGroup>
                                <Button
                                    type="button"
                                    color="primary"
                                    className="px-4"
                                    onClick={submit}
                                >Submit</Button>
                                &nbsp;&nbsp;
                                <Button
                                    type="button"
                                    color="warning"
                                    className="px-4"
                                    onClick={clear}
                                >Clear</Button>
                            </FormGroup>
                        </Form>
                    </CardBody>
                </Card>
            </Col>
            <Col md={8} sm={12} xs={12}>
                <Card>
                    <CardHeader>
                        <i className="icon-menu"/>Resultados
                    </CardHeader>
                    <CardBody>
                        <BootstrapTable
                            remote={true}
                            data={vehicles}
                            version="4"
                            striped
                            pagination={true}
                            fetchInfo={{dataTotalSize: dataTotalSize}}
                            options={options}>

                            <TableHeaderColumn dataField="license" width="100" dataFormat={licenseFormatter}>Placa</TableHeaderColumn>
                            <TableHeaderColumn dataField="createdAt" width="150" dataFormat={dateFormatter}>Lido em: </TableHeaderColumn>
                            <TableHeaderColumn dataField='camera' dataFormat={cameraFormatter}>Câmera</TableHeaderColumn>
                            <TableHeaderColumn dataField='model'  width="250">Marca/Modelo</TableHeaderColumn>
                            <TableHeaderColumn dataField='color' dataFormat={colorFormatter} width="100">Cor</TableHeaderColumn>
                            <TableHeaderColumn dataField='originColor' dataFormat={colorFormatter} width="100">Cor de origem</TableHeaderColumn>
                            <TableHeaderColumn dataField='_id' hidden isKey={true}>Açao</TableHeaderColumn>
                        </BootstrapTable>
                    </CardBody>
                </Card>
            </Col>
        </div>
    );
};

export default Cameras;