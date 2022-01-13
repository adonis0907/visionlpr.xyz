import React, {useState, useEffect} from 'react';
import {Card, CardHeader, CardBody} from 'reactstrap';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import 'react-bootstrap-table/dist//react-bootstrap-table-all.min.css';
import {toast} from 'react-toastify';
import Services from '../../Services';


const AlertTypes = props =>  {

    const [alertTypes, setAlertTypes] = useState([]);

    const fetchAlerts = ()=>{
        Services.AlertService.fetchType()
            .then(res =>{
                if(res.success){
                    setAlertTypes(res.alertTypes);
                }else{
                    toast.warn(res.errorMsg);
                }
            });
    };

    /**===============================
     *  fetch all alert types
     */
    useEffect(fetchAlerts,[]);

    const onDeleteRow = alertTypeIds =>{
        Services.AlertService.deleteTypes(alertTypeIds)
            .then(res => {
                if(res.success)
                    toast.success(`Successfully deleted ${res.count} alerts`);
            })
    };

    const options = {
        sortIndicator: true,
        hideSizePerPage: true,
        paginationSize: 5,
        hidePageListOnlyOnePage: true,
        clearSearch: false,
        alwaysShowAllBtns: false,
        withFirstAndLast: false,
        deleteRow: true,
        onDeleteRow: onDeleteRow
    };

    /**========================
     *  confirm before save
     * @param row
     * @param cellName
     * @param cellValue
     * @returns {boolean}
     */
    const onBeforeSaveCell = (row, cellName, cellValue) => {
        let label, value;
        if(typeof cellValue === 'object'){
            label = `${cellValue.city}-${cellValue.state}`;
            value = cellValue._id;
        }else{
            label = cellValue;
            value = cellValue;
            if(row[cellName] === cellValue) return false;
        }

        let userInput = window.confirm(`Are you really want to save field "${cellName}" as "${label}"?`);
        if(userInput)
            Services.AlertService.updateType({id: row._id, query: {[cellName]: value}}).then(res =>{
                if(res.success){
                    toast.success('Successfully updated');
                    return true;
                }else{
                    toast.warn(res.errorMsg);
                    fetchAlerts();
                    return false;
                }
            });
    };

    const DateFormatter = (props) =>{
        let date = new Date(props);
        return date.toDateString();
    };

    return (
        <div className="animated">
            <Card>
                <CardHeader>
                    <i className="icon-menu"/>Alerts
                </CardHeader>
                <CardBody>
                    <BootstrapTable
                        data={alertTypes}
                        version="4"
                        striped
                        hover
                        pagination
                        search
                        options={options}
                        selectRow={{mode: 'checkbox'} }
                        deleteRow={true}
                        cellEdit={{
                            mode: 'dbclick',
                            blurToSave: true,
                            beforeSaveCell: onBeforeSaveCell
                        }}>
                        <TableHeaderColumn dataField="type" dataSort>Alert Types</TableHeaderColumn>
                        <TableHeaderColumn  dataField="name" dataSort>Alert Names</TableHeaderColumn>
                        <TableHeaderColumn dataField="createdAt" dataFormat={DateFormatter} dataSort editable={false}>Created</TableHeaderColumn>
                        <TableHeaderColumn dataField="updatedAt" dataFormat={DateFormatter} dataSort editable={false}>Updated</TableHeaderColumn>
                        <TableHeaderColumn dataField='_id' isKey={true} hidden={true}>Action</TableHeaderColumn>
                    </BootstrapTable>
                </CardBody>
            </Card>
        </div>
    );
};

export default AlertTypes;