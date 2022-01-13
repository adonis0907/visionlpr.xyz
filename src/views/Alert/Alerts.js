import React, {useState, useEffect, useContext} from 'react';
import {Card, CardHeader, CardBody, Input} from 'reactstrap';
import { AppSwitch } from '@coreui/react';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import 'react-bootstrap-table/dist//react-bootstrap-table-all.min.css';
import {toast} from 'react-toastify';
import Services from '../../Services';
import Context from "../../Context";

const initialParams = {
    page: 1,
    sizePerPage: 10,
    sort:{
        cameraId: 'desc'
    },
    filterObj:{}
};

const alertTypes = [
    'Roubo',
    'Licenciamento',
    'Renajud',
    'Envolvido na ocorrência',
    'Investigado'
];

const Alerts = props => {
    const {user} = useContext(Context.AuthContext);

    const [alerts, setAlerts] = useState([]);

    const [dataTotalSize, setDataTotalSize] = useState(0);
    const [params, setParams] = useState(initialParams);

    const fetchAlerts = param =>{
        Services.AlertService.fetchAlerts(param)
            .then(res =>{
                if(res.success){
                    setAlerts(res.alerts);
                    setDataTotalSize(res.total);
                }else{
                    toast.warn(res.errorMsg);
                }
            });
    };

    useEffect(() =>{
        fetchAlerts(params);
    }, [params]);

    // /** ==========================
    //  *  Delete event handler
    //  * @param alertIds: record _id from mongodb
    //  */
    // const onDeleteRow = alertIds =>{
    //     Services.AlertService.deleteAlerts(alertIds)
    //         .then(res => {
    //             if(res.success){
    //                 let newAlerts = alerts.filter(camera =>{
    //                     return alertIds.indexOf(camera._id) === -1;
    //                 });
    //                 setAlerts(newAlerts);
    //                 toast.success(`${res.count} alertas excluídos com sucesso.`);
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

    const onSearchChange = (searchText, colInfos, multiColumnSearch) =>{
        let tmp = {...params};
        tmp.filterObj = {plate: {$regex: `.*${searchText}.*`}};
        setParams(tmp);
    };

    /**========================
     *  type column formatter
     * @param type
     * @returns {*}
     * @constructor
     */
    const typeFormatter = type =>{
        return alertTypes[type -1];
    };

    const userFormatter = user =>{
        return user.name;
    };

    const updateState = (id, value, element) =>{
        Services.AlertService.updateAlert({id: id, query: {active: value}})
            .then(res =>{
                if(res.success){
                    toast.success("Sucesso!");
                }else{
                    toast.warn(res.errorMsg);
                    element.checked = !value;
                }
            })
    };

    const boolFormatter = (value, row) =>{
        return <AppSwitch
            className={'mx-1'}
            variant={'3d'}
            outline={'alt'}
            color={'primary'}
            checked={value}
            disabled={user._id !== row._id && user.role !== 'admin'}
            onChange={event=> updateState(row._id, event.target.checked, event.target)}
            label/>;
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
        // deleteRow: true,
        // onDeleteRow: onDeleteRow,
        onPageChange: onPageChange,
        onSizePerPageList: onSizePerPageList,
        onSortChange: onSortChange,
        onSearchChange: onSearchChange,
        noDataText: "Não há dados"
    };

    /**==============================
     * Custom Station Editor
     * @param onUpdate
     * @param props
     * @returns {*}
     */
    const createAlertTypeEditor = (onUpdate, props) => (<AlertTypeEditor onUpdate={onUpdate}{...props}/>);

    /**============================
     *  Confirm cell edit
     * @param row: whole row data
     * @param cellName: field name
     * @param cellValue: new value
     * @returns {boolean}
     */
    const onBeforeSaveCell = (row, cellName, cellValue) => {
        if(row[cellName] === cellValue) return false;
        let userInput = window.confirm(`Deseja realmente atualizar "${cellName}"?`);
        if(userInput)
            Services.AlertService.updateAlert({id: row._id, query: {[cellName]: cellValue}}).then(res =>{
                if(res.success){
                    let tmp = [...alerts];
                    let index = tmp.findIndex((element)=> element._id === row._id);
                    tmp[index][cellName] = cellValue;

                    setAlerts(tmp);
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
                    <i className="icon-menu"/>Alertas
                </CardHeader>
                <CardBody>
                    <BootstrapTable
                        remote={true}
                        data={alerts}
                        version="4"
                        striped
                        hover
                        search
                        searchPlaceholder='Insira a licença aqui...'
                        cellEdit={{
                            mode: 'dbclick',
                            blurToSave: true,
                            beforeSaveCell: onBeforeSaveCell
                        }}
                        pagination={true}
                        fetchInfo={{dataTotalSize: dataTotalSize}}
                        options={options}>

                        <TableHeaderColumn dataField="plate" dataSort editable={false} width="200">Licença</TableHeaderColumn>
                        <TableHeaderColumn dataField='type' dataSort
                                           dataFormat={typeFormatter} width="200"
                                           customEditor={{ getElement: createAlertTypeEditor}}>Tipo de Alerta</TableHeaderColumn>
                        <TableHeaderColumn dataField='note' dataSort width="200">Nota</TableHeaderColumn>
                        <TableHeaderColumn dataField='createdBy' dataSort editable={false} dataFormat={userFormatter} width="200">Criado por</TableHeaderColumn>
                        <TableHeaderColumn dataField='active' width="200" dataFormat={boolFormatter} editable={false}>Ativo</TableHeaderColumn>
                        <TableHeaderColumn dataField='_id' isKey={true} hidden={true}>_id</TableHeaderColumn>
                    </BootstrapTable>
                </CardBody>
            </Card>
        </div>
    );
};

class AlertTypeEditor extends React.Component {
    constructor(props) {
        super(props);
        this.updateData = this.updateData.bind(this);
        this.onChange = this.onChange.bind(this);
        this.state = {
            value: this.props.defaultValue
        }
    }

    updateData() {
        if(!this.state.value){
            this.props.onUpdate(null);
        }else
            this.props.onUpdate(this.state.value);
    }

    onChange(event){
        let value = event.target.value;
        this.setState({value: value})
    }

    render() {
        return (
            <div>
                <Input type="select"
                       name="type"
                       id="type"
                       value={this.state.value}
                       onChange={this.onChange}
                       required>
                    <option value="">Selecione um tipo de alerta</option>
                    <option value="1">Roubo</option>
                    <option value="2"> Licenciamento</option>
                    <option value="3">Renajud</option>
                    <option value="4">Envolvido na ocorrência</option>
                    <option value="5">Investigado </option>
                </Input>
                <button
                    className='btn-info btn-xs'
                    onClick={ this.updateData }>
                    Salvar
                </button>
                <button
                    className='btn-info btn-xs'
                    onClick={ () =>this.props.onUpdate(null) }>
                    Cancelar
                </button>
            </div>
        );
    }
}

export default Alerts;