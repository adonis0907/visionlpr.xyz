import React, {useEffect, useState} from 'react';
import { withScriptjs, withGoogleMap, GoogleMap, Marker, InfoWindow } from "react-google-maps";
import { compose, withProps } from "recompose";
import MarkerClusterer from "react-google-maps/lib/components/addons/MarkerClusterer";
import 'react-select/dist/react-select.min.css';
import Services from '../../Services';
import {toast} from "react-toastify";
import ImageLoader from "react-loading-image/lib/index";


const MapWithAMarkerClusterer = compose(
    withProps({
        googleMapURL: "https://maps.googleapis.com/maps/api/js?key=AIzaSyBli0L8vtKG4nUwAwMyMEmNhX6gEsfrIkg&v=3.exp&libraries=geometry,drawing,places",
        loadingElement: <div style={{ height: `100%` }} />,
        containerElement: <div style={{ height: `750px` }} />,
        mapElement: <div style={{ height: `100%` }} />,
    }),
    withScriptjs,
    withGoogleMap
)(props => {

    const [camera, setCamera] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
    const [alerts, setAlerts] = useState([]);

    const openInfoWindow = cam =>{
        setCamera(cam);
        setIsOpen(true);
        Services.VehicleService.lastAlertForCamera({station: cam.station.id, cameraId: cam.cameraId})
            .then(res =>{
                if(res.success){
                    setAlerts(res.vehicles);
                }else{
                    toast.warn(res.errorMsg);
                }
            })
    };

    return(<GoogleMap
            defaultZoom={5}
            defaultCenter={{lat: -27.59973,  lng: -48.5928236}}
        >
        <MarkerClusterer
            enableRetinaIcons
            gridSize={60}
        >
            {props.markers.map(marker => (
                <Marker
                    key={marker._id}
                    icon='/assets/img/marker.png'
                    position={{lat: marker.latitude, lng: marker.longitude}}
                    onClick={() => openInfoWindow(marker)}
                >
                </Marker>
            ))}
        </MarkerClusterer>
        {isOpen
            ?<InfoWindow
                position={{lat: camera.latitude,  lng: camera.longitude}}
                onCloseClick={() => setIsOpen(false)}
                options={{pixelOffset: {
                    width: 0,
                        height: -50
                    },
                minWidth: 300}}
            >
                <div className='row'>
                    <div className='md-5'>
                        <div style={{ opacity: 0.75, padding: `20px`, minWidth: '200px'}}>
                            <div style={{ fontSize: `13px`, fontColor: `#08233B` }}>
                                <p> Id da câmera: <strong>{camera.cameraId}</strong></p>
                                <p> Marca: <strong>{camera.brand}</strong></p>
                            </div>
                            <div style={{ fontSize: `13px`, fontColor: `#08233B` }}>
                                <p> Modelo: <strong>{camera.model}</strong></p>
                                <p> Número de série: <strong>{camera.serialNumber}</strong></p>
                            </div>
                            <div style={{ fontSize: `13px`, fontColor: `#08233B` }}>
                                <p> Estação: <strong>{camera.station.id}</strong></p>
                                <p> Rua: <strong>{camera.street}</strong></p>
                            </div>
                            <div style={{ fontSize: `13px`, fontColor: `#08233B` }}>
                                <p> Vizinhança: <strong>{camera.neighborhood}</strong></p>
                                <p> Cidade: <strong>{camera.city.city}-{camera.city.state}</strong></p>
                            </div>
                        </div>
                    </div>
                    <div className="md-7">
                        <div>
                            {
                                alerts.length > 0
                                ?<ImageLoader
                                        style={{width: '100px'}}
                                        src={`${process.env.REACT_APP_STORAGE_URL}/plate/${alerts[0].plateImg}`}
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
                                    :<div>No Alert vehicles for this camera</div>
                            }
                        </div>
                        <div style={{marginTop: '10px', width: '300px'}}>
                            {
                                alerts.length > 0
                                    ?<ImageLoader
                                        style={{width: '300px', height: '200px'}}
                                        src={`${process.env.REACT_APP_STORAGE_URL}/vehicle/${alerts[0].vehicleImg}`}
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
                                    :<div>No Alert vehicles for this camera</div>
                            }
                        </div>
                    </div>
                </div>
            </InfoWindow>
            :<div/>}
        </GoogleMap>);
    }
);

const CameraMap = props => {
    const [cameras, setCameras] = useState([]);

    useEffect(() =>{
        Services.CameraService.fetch()
            .then(res =>{
                if(res.success){
                    let cams = [];
                    for(let camera of res.cameras){
                        camera.latitude = camera.location.coordinates[0];
                        camera.longitude = camera.location.coordinates[1];
                        cams.push(camera);
                    }
                    setCameras(cams);
                }else{
                    toast.warn(res.errorMsg);
                }
            })
    }, []);
    return (
    <MapWithAMarkerClusterer markers={cameras}/>);
};

export default CameraMap;