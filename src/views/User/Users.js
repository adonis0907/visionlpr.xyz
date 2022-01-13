import React, {useState, useEffect} from 'react';
import {Card, CardHeader, CardBody, Button} from 'reactstrap';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import { AppSwitch } from '@coreui/react'
import 'react-bootstrap-table/dist//react-bootstrap-table-all.min.css';
import {toast} from 'react-toastify';
import Services from '../../Services';

const initialParams = {
    page: 1,
    sizePerPage: 10,
    sort:{
        cameraId: 'desc'
    },
    filterObj:{}
};

const Users = props => {

    const [dataTotalSize, setDataTotalSize] = useState(0);
    const [params, setParams] = useState(initialParams);

    const [cities, setCities] = useState({});
    const [users, setUsers] = useState([]);
    const [groups, setGroups] = useState({});

    /** ========================
     *  Fetch records with given params
     */
    useEffect(()=>{
        Services.AuthService.users(params)
            .then(res =>{
                if(res.success){
                    setUsers(res.users);
                    setDataTotalSize(res.total);
                }else {
                    toast.warn(res.errorMsg)
                }
            });
    },[params]);

    useEffect(()=>{
        Services.CityService.fetchAll()
            .then(res =>{
                if(res.success){
                    let cities = {};
                    for(let city of res.cities){
                        cities[city._id] = `${city.city}-${city.state}`;
                    }
                    setCities(cities);
                }else{
                    toast.warn(res.errorMsg);
                }
            });
        Services.GroupService.fetchAll()
            .then(res =>{
                if(res.success){
                    let groups = {};
                    for(let group of res.groups){
                        groups[group._id] = group.name;
                    }
                    setGroups(groups);
                }else{
                    toast.warn(res.errorMsg);
                }
            });
    }, []);

    /** ==========================
     *  Delete event handler
     * @param userIds: record _id from mongodb
     */
    const onDeleteRow = userIds =>{
        Services.AuthService.deleteUser(users)
            .then(res => {
                if(res.success){
                    let newUsers = users.filter(user =>{
                        return userIds.indexOf(user._id) === -1;
                    });
                    setUsers(newUsers);
                    toast.success(`Usuários ${res.count} excluídos com sucesso`);
                }
            });
    };

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
        let filter = {};
        for (let [key, value] of Object.entries(filterObj)){
            if(key === 'city' || key === 'group')
                filter[key] = value.value;
            else
                filter[key] = {$regex: `.*${value.value}.*`};
        }
        tmp.filterObj = filter;
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

    const GroupFormatter = group => group.name;

    const groupSort = (a, b, order) =>{
        if (order === 'desc') {
            return a.name.localeCompare(b.name);
        } else {
            return b.name.localeCompare(a.name);
        }
    };

    const boolFormatter = value =>{
        return <AppSwitch className={'mx-1'} variant={'3d'} outline={'alt'} color={'primary'} checked={value} label disabled/>;
    };

    const actionFormatter = id =>{
        return <Button  color="primary" className="btn-sm" onClick={() => props.history.replace(`/user/profile/${id}`)}>Editar</Button>;
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
        deleteRow: true,
        onDeleteRow: onDeleteRow,
        onPageChange: onPageChange,
        onSizePerPageList: onSizePerPageList,
        onSortChange: onSortChange,
        onFilterChange: onFilterChange,
    };

    return (
        <div className="animated">
            <Card>
                <CardHeader>
                    <i className="icon-menu"/>Usuários
                </CardHeader>
                <CardBody>
                    <BootstrapTable
                        remote={true}
                        data={users}
                        version="4"
                        striped
                        hover
                        pagination={true}
                        fetchInfo={{dataTotalSize: dataTotalSize}}
                        options={options}
                        selectRow={{mode: 'checkbox'}}
                        deleteRow={true}>

                        <TableHeaderColumn dataField="name" dataSort filter={{type:'TextFilter'}} width="150">Nome</TableHeaderColumn>
                        <TableHeaderColumn dataField="cpf" dataSort filter={{type:'TextFilter'}} width="150">CPF</TableHeaderColumn>
                        <TableHeaderColumn dataField="organization" dataSort filter={{type:'TextFilter'}} width="200">Organização</TableHeaderColumn>
                        <TableHeaderColumn dataField="email" dataSort filter={{type:'TextFilter'}} width="200">Email</TableHeaderColumn>
                        <TableHeaderColumn dataField="whatsApp" dataSort filter={{type:'TextFilter'}}>WhatsApp</TableHeaderColumn>
                        <TableHeaderColumn dataField="mobile" dataSort filter={{type:'TextFilter'}} width="150">Móvel</TableHeaderColumn>
                        <TableHeaderColumn dataField="role" dataSort filter={{type:'TextFilter'}} width="150">Função</TableHeaderColumn>
                        <TableHeaderColumn dataField="city" dataSort
                                           sortFunc={citySort}
                                           filter={ { type: 'SelectFilter', options: cities}}
                                           width="200" dataFormat={CityFormatter} filterFormatted>Cidade</TableHeaderColumn>
                        <TableHeaderColumn dataField="group" dataSort
                                           sortFunc={groupSort}
                                           filter={ { type: 'SelectFilter', options: groups}}
                                           width="150" dataFormat={GroupFormatter}>Grupo</TableHeaderColumn>
                        <TableHeaderColumn dataField="sms" width="150"
                                           dataFormat={boolFormatter}>SMS(alerta)</TableHeaderColumn>
                        <TableHeaderColumn dataField="whatsAppMessage" dataSort
                                           width="150" dataFormat={boolFormatter}>WhatsApp(alerta)</TableHeaderColumn>
                        <TableHeaderColumn dataField="mail" width="150"
                                           dataFormat={boolFormatter}>Email(alerta)</TableHeaderColumn>
                        <TableHeaderColumn dataField='_id' isKey={true} dataFormat={actionFormatter} width="100">Açao</TableHeaderColumn>
                    </BootstrapTable>
                </CardBody>
            </Card>
        </div>
    );
};

export default Users;