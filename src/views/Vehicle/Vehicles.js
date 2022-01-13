import React, {useState, useEffect} from 'react';
import {Card, CardHeader, CardBody, Button} from 'reactstrap';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import 'react-bootstrap-table/dist//react-bootstrap-table-all.min.css';
import {toast} from 'react-toastify';
import Services from '../../Services';

const initialParams = {
    page: 1,
    sizePerPage: 10,
    sort:{
        createdAt: 'desc'
    },
    filterObj:{}
};

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

const Vehicles = props => {

    const [vehicles, setVehicles] = useState([]);
    const [popover, setPopOver] = useState(false);
    const [popup, setPopup] = useState({});

    const [dataTotalSize, setDataTotalSize] = useState(0);
    const [params, setParams] = useState(initialParams);

    const fetchVehicles = (params) =>{
        Services.VehicleService.fetchVehicles(params)
            .then(res =>{
                if(res.success){
                    setVehicles(res.vehicles);
                    setDataTotalSize(res.total);
                }else{
                    toast.warn(res.errorMsg);
                }
            });
};

    useEffect(() =>{
        fetchVehicles(params)
    }, [params]);

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

    const onFilterChange = filterObj =>{
        let tmp = {...params};
        let filter = {};
        for (let [key, value] of Object.entries(filterObj)){
            if(key === 'alert' || key === 'color')
                filter[key] = value.value;
            else
                filter[key] = {$regex: `.*${value.value}.*`};
        }
        tmp.filterObj = filter;
        setParams(tmp);
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
     * onSortChange: onSortChange}}
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
        onPageChange: onPageChange,
        onSizePerPageList: onSizePerPageList,
        onSortChange: onSortChange,
        onFilterChange: onFilterChange,
        noDataText: "Não há dados"
    };

    const licenseFormatter = (license, row) =>{
        return <span onMouseEnter={() => openPopUp(row.vehicleImg, 'vehicle')}
                     onMouseLeave={()=>setPopOver(false)}>{license}</span>
    };

    const alertFormatter = (alert, row) =>{
        return <span onMouseEnter={() => openPopUp(row.plateImg, 'plate')}
                     onMouseLeave={()=>setPopOver(false)}
                     className={alert === 0?"badge badge-success":"badge badge-danger"}>{alertTypes[alert]}</span>;
    };

    const colorFormatter = color =>{
        return colors[color];
    };

    const openPopUp = (img, path) =>{
        setPopup({
            imgName: path,
            imgUrl: `${path}/${img}`
        });
        setPopOver(true);
    };

    const idFormatter = id =>{
        return <Button color="primary" onClick={() => props.history.push(`/vehicle/detail/${id}`)}>Ver Detalhes</Button>
    };

    const onBeforeSaveCell = (row, cellName, cellValue) => {
        let userInput = window.confirm(`Tem certeza de que deseja salvar o campo "${cellName}" como "${cellValue}"?`);
        if(userInput){
            Services.VehicleService.update({id: row._id, query: {[cellName]: cellValue}}).then(res =>{
                if(res.success){
                    fetchVehicles(params);
                    toast.success('Atualizado com sucesso');
                    return true;
                }else{
                    toast.warn(res.errorMsg);
                    return false;
                }
            });
        }
    };

    return (
        <div className="animated">
            <Card>
                <CardHeader>
                    <i className="icon-menu"/>Veículos
                </CardHeader>
                <CardBody>
                    <BootstrapTable
                        remote={true}
                        data={vehicles}
                        version="4"
                        striped
                        cellEdit={{
                            mode: 'dbclick',
                            blurToSave: true,
                            beforeSaveCell: onBeforeSaveCell
                        }}
                        pagination={true}
                        fetchInfo={{dataTotalSize: dataTotalSize}}
                        options={options}>

                        <TableHeaderColumn dataField="license" dataSort
                                           editable={true} width="100"
                                           filter={{type:'TextFilter'}} dataFormat={licenseFormatter}>Licença</TableHeaderColumn>
                        <TableHeaderColumn dataField='alert' dataSort width="150"
                                           editable={false} filter={ { type: 'SelectFilter', options: alertTypes}}
                                           dataFormat={alertFormatter}>Tipo de Alerta</TableHeaderColumn>
                        <TableHeaderColumn dataField='camera' dataSort width="100" editable={false} filter={{type:'TextFilter'}}>Câmera</TableHeaderColumn>
                        <TableHeaderColumn dataField='station' dataSort editable={false} width="100" filter={{type:'TextFilter'}}>Estação</TableHeaderColumn>
                        <TableHeaderColumn dataField='color' dataSort editable={false}
                                           width="100" dataFormat={colorFormatter}
                                           filter={ { type: 'SelectFilter', options: colors}}>Cor</TableHeaderColumn>
                        <TableHeaderColumn dataField='originColor' editable={false} width="100" dataFormat={colorFormatter}>Cor de origem</TableHeaderColumn>
                        <TableHeaderColumn dataField='date' dataSort editable={false} width="100">Data</TableHeaderColumn>
                        <TableHeaderColumn dataField='time' dataSort editable={false} width="100">Hora</TableHeaderColumn>
                        <TableHeaderColumn dataField='_id' isKey={true} dataFormat={idFormatter} width="150">Açao</TableHeaderColumn>
                    </BootstrapTable>
                </CardBody>
                <div style={{position: 'absolute', display: popover?"block":"none", right: '0'}}>
                    <Card>
                        <CardHeader>
                            {popup.imgName}
                        </CardHeader>
                        <CardBody>
                            <img
                                style={{maxWidth: '400px'}}
                                src={`${process.env.REACT_APP_STORAGE_URL}/${popup.imgUrl}`}
                                alt={popup.imgName}/>
                        </CardBody>
                    </Card>
                </div>
            </Card>

        </div>
    );
};

export default Vehicles;