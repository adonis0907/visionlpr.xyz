import React, {useState, useEffect} from 'react';
import Service from '../../Services';
import {
    Card,
    CardBody,
    Col,
    Row} from 'reactstrap';

const Dashboard = props =>{
    const [stations, setStations] = useState(0);
    const [cameras, setCameras] = useState(0);
    const [alerts, setAlerts] = useState(0);

    useEffect(() =>{
        Service.StationService.count()
            .then(res =>{
                setStations(res.total);
            });
        Service.CameraService.count()
            .then(res =>{
                setCameras(res.total);
            });
        Service.AlertService.count()
            .then(res =>{
                setAlerts(res.total);
            })
    }, []);

    return (
        <div className="animated fadeIn">
            <Row>

                <Col xs="12" sm="6" lg="4">
                    <Card className="text-white bg-primary">
                        <CardBody className="pb-0">
                            <div className="text-value">{stations}</div>
                            <h5>Estações Registradas</h5>
                            <div className="chart-wrapper mt-3" style={{ height: '70px' }}>
                            </div>
                        </CardBody>
                    </Card>
                </Col>

                <Col xs="12" sm="6" lg="4">
                    <Card className="text-white bg-warning">
                        <CardBody className="pb-0">
                            <div className="text-value">{cameras}</div>
                            <h5>Câmeras Registradas</h5>
                        </CardBody>
                        <div className="chart-wrapper mt-3" style={{ height: '70px' }}>
                        </div>
                    </Card>
                </Col>

                <Col xs="12" sm="6" lg="4">
                    <Card className="text-white bg-danger">
                        <CardBody className="pb-0">
                            <div className="text-value">{alerts}</div>
                            <h5>Alertas Registradas</h5>
                        </CardBody>
                        <div className="chart-wrapper mt-3 mx-3" style={{ height: '70px' }}>
                        </div>
                    </Card>
                </Col>
            </Row>
        </div>
    );

};

export default Dashboard;