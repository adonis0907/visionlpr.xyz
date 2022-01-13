import React, {useState, useEffect} from 'react';
import {Card, CardHeader, CardBody} from 'reactstrap';
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

const Logs = props =>  {

    const [logs, setLogs] = useState([]);
    const [dataTotalSize, setDataTotalSize] = useState(0);
    const [params, setParams] = useState(initialParams);

    /**===============================
     *  fetch all cities
     */

    useEffect(()=>{
        Services.LogService(params)
            .then(res =>{
                if(res.success){
                    setLogs(res.logs);
                    setDataTotalSize(res.total)
                }else{
                    toast.warn(res.errorMsg);
                }
            });
    },[params]);

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

    // const onFilterChange = filterObj =>{
    //     let tmp = {...params};
    //     let filter = {};
    //     for (let [key, value] of Object.entries(filterObj)){
    //         if(key === 'alert' || key === 'color')
    //             filter[key] = value.value;
    //         else
    //             filter[key] = {$regex: `.*${value.value}.*`};
    //     }
    //     tmp.filterObj = filter;
    //     setParams(tmp);
    // };

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
        // onFilterChange: onFilterChange,
        noDataText: "Não há dados"
    };

    const DateFormatter = (props) =>{
        let date = new Date(props);
        return date.toDateString();
    };

    const UserFormatter = user=> user.name;

    return (
        <div className="animated">
            <Card>
                <CardHeader>
                    <i className="icon-menu"/>Cidades
                </CardHeader>
                <CardBody>
                    <BootstrapTable
                        remote={true}
                        data={logs}
                        version="4"
                        striped
                        hover
                        pagination={true}
                        fetchInfo={{dataTotalSize: dataTotalSize}}
                        options={options}
                        cellEdit={{
                            mode: 'dbclick',
                            blurToSave: true,
                        }}>
                        <TableHeaderColumn dataField="action" dataSort width="200" editable={false}>Açao</TableHeaderColumn>
                        <TableHeaderColumn  dataField="description" width="200" editable={false}>Descrição</TableHeaderColumn>
                        <TableHeaderColumn  dataField="user" width="200" dataFormat={UserFormatter} editable={false}>Usuário</TableHeaderColumn>
                        <TableHeaderColumn dataField="createdAt" dataFormat={DateFormatter} dataSort editable={false} width="200">Criado</TableHeaderColumn>
                        <TableHeaderColumn dataField='_id' isKey={true} hidden={true}>Action</TableHeaderColumn>
                    </BootstrapTable>
                </CardBody>
            </Card>
        </div>
    );
};

export default Logs;