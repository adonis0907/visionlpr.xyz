import React, {useState, useEffect} from 'react';
import {Card, CardHeader, CardBody, Row, Col} from 'reactstrap';
import {useParams} from 'react-router-dom';
import {toast} from 'react-toastify';
import Services from '../../Services';
import ImageLoader from "react-loading-image/lib/index";
import './Spinners.scss';

const alertTypes = {
    0: 'Nenhum',
    1: 'Roubo',
    2: 'Licenciamento',
    3: 'Renajud',
    4: 'Envolvido na ocorrência',
    5: 'Investigado'
};

const colors = {
    "01":"AMARELA",
    "02": "AZUL",
    "03": "BEGE",
    "04": "BRANCA",
    "05": "CINZA",
    "06": "DOURADA",
    "07": "GRENA",
    "08": "LARANJA",
    "09": "MARROM",
    "10": "PRATA",
    "11": "PRETA",
    "12": "ROSA",
    "13": "ROXA",
    "14": "VERDE",
    "15": "VERMELHA",
    "16": "FANTASIA"
};

const VehicleDetail = props => {
    const {id} = useParams();
    const [res, setResponse] = useState(null);

    useEffect(() =>{
        Services.VehicleService.fetchOne(id)
            .then(res =>{
                if(res.success){
                    setResponse(res);
                }
                else{
                    toast.warn(res.errorMsg);
                }
            })
    }, []);

    return (
        !res?<div className="animated fadeIn pt-1 text-center"><div className="sk-spinner sk-spinner-pulse"/></div>:
        <div className="animated">
            <Card>
                <CardHeader>
                    <i className="icon-menu"/>Detalhe do veículo
                </CardHeader>
                <CardBody>
                    <Row className="mb-4">
                        <Col sm="6">
                            <div>Cidade: <strong>{res.station?res.station.city.city:''}-{res.station?res.station.city.state:''}</strong></div>
                            <div>Rua: <strong>{res.camera?res.camera.street : ''}</strong></div>
                            <div>Estação: <strong>{res.station?res.station.id: ""}</strong></div>
                            <div>Id da câmera: <strong>{res.camera?res.camera.cameraId : 'Câmera removida'}</strong></div>
                        </Col>
                        <Col sm="6">
                            <div>Licença: <strong>{res.vehicle.license}</strong></div>
                            <div>Alerta: <strong>{alertTypes[res.vehicle.alert]}</strong></div>
                            <div>Cor: <strong>{colors[res.vehicle.color]}</strong></div>
                            <div> Data: <strong>{res.vehicle.date}</strong></div>
                            <div> Hora: <strong>{res.vehicle.time}</strong></div>
                        </Col>
                    </Row>
                    <Row>
                        <Col sm="6">
                            <ImageLoader
                                style={{maxWidth: '90%'}}
                                src={`${process.env.REACT_APP_STORAGE_URL}/vehicle/${res.vehicle.vehicleImg}`}
                                loading={() => <div className="sk-circle">
                                    <div className="sk-circle1 sk-child"/>
                                    <div className="sk-circle2 sk-child"/>
                                    <div className="sk-circle3 sk-child"/>
                                    <div className="sk-circle4 sk-child"/>
                                    <div className="sk-circle5 sk-child"/>
                                    <div className="sk-circle6 sk-child"/>
                                    <div className="sk-circle7 sk-child"/>
                                    <div className="sk-circle8 sk-child"/>
                                    <div className="sk-circle9 sk-child"/>
                                    <div className="sk-circle10 sk-child"/>
                                    <div className="sk-circle11 sk-child"/>
                                    <div className="sk-circle12 sk-child"/>
                                </div>}
                                error={() =>  <div>Imagem não existe</div>}
                            />
                        </Col>
                        <Col sm="6">
                            <ImageLoader
                                style={{maxWidth: '95%'}}
                                src={`${process.env.REACT_APP_STORAGE_URL}/plate/${res.vehicle.plateImg}`}
                                loading={() => <div className="sk-circle">
                                    <div className="sk-circle1 sk-child"/>
                                    <div className="sk-circle2 sk-child"/>
                                    <div className="sk-circle3 sk-child"/>
                                    <div className="sk-circle4 sk-child"/>
                                    <div className="sk-circle5 sk-child"/>
                                    <div className="sk-circle6 sk-child"/>
                                    <div className="sk-circle7 sk-child"/>
                                    <div className="sk-circle8 sk-child"/>
                                    <div className="sk-circle9 sk-child"/>
                                    <div className="sk-circle10 sk-child"/>
                                    <div className="sk-circle11 sk-child"/>
                                    <div className="sk-circle12 sk-child"/>
                                </div>}
                                error={() => <div>Imagem não existe</div>}
                            />
                        </Col>
                    </Row>
                </CardBody>
            </Card>

        </div>
    );
};

export default VehicleDetail;