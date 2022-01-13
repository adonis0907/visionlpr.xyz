import React, {useState, useEffect} from 'react';
import {Card, CardHeader, CardBody, Button, Input, FormGroup, Form, Row,Col, Label} from 'reactstrap';
import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';
import './react_dates_overrides.css';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import 'react-bootstrap-table/dist//react-bootstrap-table-all.min.css';
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
    sizePerPage: 50,
};

const Companion = props => {

    const [plate, setPlate] = useState('');

    const [params, setParams] = useState(initialParams);
    const [dataTotalSize, setDataTotalSize] = useState(0);
    const [vehicles, setVehicles] = useState([]);

    const [cameras, setCameras] = useState([]);

    const [popup, setPopup] = useState(null);
    const [target, setTarget] = useState(null);

    useEffect(() =>{
        Services.CameraService.fetch()
            .then(res =>{
                if(res.success){
                    setCameras(res.cameras);
                }else{
                    toast.warn(res.errorMsg);
                }
            });
    }, []);

    const submit = () =>{
        let body = {...initialParams};
        body.plate = plate;
        Services.VehicleService.companion(body)
            .then(res => {
                if(res.success){
                    setTarget(res.target);
                    setVehicles(res.vehicles);
                    setDataTotalSize(res.total);
                }else{
                    toast.warn(res.errorMsg);
                }
            });
    };

    const openPopUp = row =>{
        setPopup({
            license: row.license,
            plate: row.plateImg,
            vehicle: row.vehicleImg
        });
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
        if(ss.length > 0)
            return ss[0].value;
        else return "";
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
        return <a color="primary"
                  href={`/#/vehicle/detail/${row._id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onMouseEnter={() => openPopUp(row)}
                  onMouseLeave={()=>setPopup(null)}
        >{license}</a>
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
                                <Button
                                    type="button"
                                    color="primary"
                                    className="px-4"
                                    onClick={submit}
                                >Submit</Button>
                            </FormGroup>
                        </Form>
                        {target && <Card className='bg-secondary'>
                            <CardBody style={{minHeight: '400px'}}>
                                    <React.Fragment>
                                        <Row>
                                            <Col style={{padding: '10px'}}>
                                                <img
                                                    style={{maxWidth: '150px'}}
                                                    src={`${process.env.REACT_APP_STORAGE_URL}/plate/${target.plateImg}`}
                                                    alt="Imagem da placa"/>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col style={{padding: '10px'}}>
                                                <img
                                                    style={{maxWidth: '300px'}}
                                                    src={`${process.env.REACT_APP_STORAGE_URL}/vehicle/${target.vehicleImg}`}
                                                    alt="Imagem da placa"/>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col>
                                                <div>Placa: <strong>{target.license}</strong></div>
                                                <div>Marca: <strong>{target.model}</strong></div>
                                                <div>Proprietário: <strong>{target.owner}</strong></div>
                                                <div>Renavam: <strong>{target.renavam}</strong></div>
                                                <div>Link Consulta: <a
                                                    href={`https://consultas.detrannet.sc.gov.br/servicos/consultaveiculo.asp?placa=${target.license}&renavam=${target.renavam}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer">https://consultas.detrannet.sc.gov.br/servicos/consultaveiculo.asp?placa={target.license}&renavam={target.renavam}</a></div>
                                            </Col>
                                        </Row>
                                    </React.Fragment>
                            </CardBody>
                        </Card>}
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
                            <TableHeaderColumn dataField='camera' dataFormat={cameraFormatter} width="150">Câmera</TableHeaderColumn>
                            <TableHeaderColumn dataField='model'  width="250">Marca/Modelo</TableHeaderColumn>
                            <TableHeaderColumn dataField='color' dataFormat={colorFormatter} width="100">Cor</TableHeaderColumn>
                            <TableHeaderColumn dataField='originColor' dataFormat={colorFormatter} width="100">Cor de origem</TableHeaderColumn>
                            <TableHeaderColumn dataField='_id' hidden isKey={true}>Açao</TableHeaderColumn>
                        </BootstrapTable>
                    </CardBody>
                    {
                        popup?<div style={{position: 'absolute', right: '0'}}>
                            <Card>
                                <CardHeader>
                                    {popup.license}
                                </CardHeader>
                                <CardBody>
                                    <div>
                                        <img
                                            style={{maxWidth: '400px', marginBottom: '10px'}}
                                            src={`${process.env.REACT_APP_STORAGE_URL}/plate/${popup.plate}`}
                                            alt={popup.plate}/>
                                    </div>
                                    <div>
                                        <img
                                            style={{maxWidth: '400px'}}
                                            src={`${process.env.REACT_APP_STORAGE_URL}/vehicle/${popup.vehicle}`}
                                            alt={popup.vehicle}/>
                                    </div>
                                </CardBody>
                            </Card>
                        </div>:<div/>
                    }
                </Card>
            </Col>
        </div>
    );
};

export default Companion;