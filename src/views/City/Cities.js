import React, {useState, useEffect} from 'react';
import {Card, CardHeader, CardBody} from 'reactstrap';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import 'react-bootstrap-table/dist//react-bootstrap-table-all.min.css';
import {toast} from 'react-toastify';
import Services from '../../Services';


const Cities = props =>  {

     const [cities, setCities] = useState([]);

    /**===============================
     *  fetch all cities
     */
    useEffect(()=>{
        Services.CityService.fetchAll()
            .then(res =>{
                if(res.success){
                    setCities(res.cities);
                }else{
                    toast.warn(res.errorMsg);
                }
            });
    },[]);

    // const onDeleteRow = cityIds =>{
    //     Services.CityService.deleteCity(cityIds)
    //         .then(res => {
    //             if(res.success){
    //                 let newCities = cities.filter(city =>{
    //                     return cityIds.indexOf(city._id) === -1;
    //                 });
    //                 setCities(newCities);
    //                 toast.success(`Excluiu ${res.count} cidades com sucesso`);
    //             }
    //         })
    // };

        const options = {
            sortIndicator: true,
            hideSizePerPage: true,
            paginationSize: 5,
            hidePageListOnlyOnePage: true,
            clearSearch: false,
            alwaysShowAllBtns: false,
            withFirstAndLast: false,
            // deleteRow: true,
            // onDeleteRow: onDeleteRow
        };

    const onAfterSaveCell =(row, cellName, cellValue) =>{
        Services.CityService.update(row).then(res =>{
            if(res.success){
                toast.success('Atualizado com sucesso');
            }else{
                toast.warn(res.errorMsg);
            }
        });

    };

    const onBeforeSaveCell = (row, cellName, cellValue) => {
        return window.confirm(`Tem certeza que deseja salvar a célula "${cellName}" com o valor "${cellValue}"?`);
    };

    const DateFormatter = (props) =>{
        let date = new Date(props);
        return date.toDateString();
    };

        return (
            <div className="animated">
                <Card>
                    <CardHeader>
                        <i className="icon-menu"/>Cidades
                    </CardHeader>
                    <CardBody>
                        <BootstrapTable
                            data={cities}
                            version="4"
                            striped
                            hover
                            pagination
                            search
                            options={options}
                            cellEdit={{
                                mode: 'dbclick',
                                blurToSave: true,
                                beforeSaveCell: onBeforeSaveCell,
                                afterSaveCell: onAfterSaveCell,
                            }}>
                            <TableHeaderColumn dataField="city" dataSort width="200">Cidade</TableHeaderColumn>
                            <TableHeaderColumn  dataField="state" width="200">Estadual</TableHeaderColumn>
                            <TableHeaderColumn dataField="createdAt" dataFormat={DateFormatter} dataSort editable={false} width="200">Criado</TableHeaderColumn>
                            <TableHeaderColumn dataField="updatedAt" dataFormat={DateFormatter} dataSort editable={false} width="200">Atualizado</TableHeaderColumn>
                            <TableHeaderColumn dataField='_id' isKey={true} hidden={true}>Action</TableHeaderColumn>
                        </BootstrapTable>
                    </CardBody>
                </Card>
            </div>
        );
};

export default Cities;