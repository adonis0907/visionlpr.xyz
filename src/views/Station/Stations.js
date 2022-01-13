import React, {useState, useEffect} from 'react';
import {Card, CardHeader, CardBody} from 'reactstrap';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import Select from 'react-select';
import 'react-bootstrap-table/dist//react-bootstrap-table-all.min.css';
import {toast} from 'react-toastify';
import Services from '../../Services';


const Stations = props =>  {

    const [cities, setCities] = useState({});
    const [stations, setStations] = useState([]);

    useEffect(()=>{
        Services.StationService.fetchAll()
            .then(res =>{
                if(res.success){
                    setStations(res.stations);
                }else{
                    toast.warn(res.errorMsg);
                }
            });
        Services.CityService.fetchAll()
            .then(res =>{
                if(res.success){
                    let cities = {};
                    for(let city of res.cities){
                        cities[city._id] = city;
                    }
                    setCities(cities);
                }else{
                    toast.warn(res.errorMsg);
                }
            });
    },[]);

    // const onDeleteRow = stations =>{
    //     Services.StationService.deleteStation(stations)
    //         .then(res => {
    //             if(res.success){
    //                 toast.success(`Excluiu ${res.count} estação(s) com sucesso`);
    //                 return true
    //             }
    //             else{
    //                 toast.warn(res.errorMsg);
    //                 return false;
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

        let userInput = window.confirm(`Tem certeza de que deseja salvar o campo "${cellName}" como "${label}"?`);
        if(userInput)
            Services.StationService.update({id: row._id, query: {[cellName]: value}}).then(res =>{
                if(res.success){
                    toast.success('Atualizado com sucesso');
                    return true;
                }else{
                    toast.warn(res.errorMsg);
                    return false;
                }
            });
    };

    /**=======================
     *  Datetime formatter
     * @param time
     * @returns {string}
     * @constructor
     */
    const DateFormatter = (time) =>{
        let date = new Date(time);
        return date.toDateString();
    };

    /**=======================
     *  City object formatter to cell
     * @param city: city object
     * @returns {string}
     * @constructor
     */
    const CityFormatter = city =>{
        return `${city.city}-${city.state}`
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

    const createCityEditor = (onUpdate, props) => (<CityEditor onUpdate={onUpdate}{...props}/>);

    return (
        <div className="animated">
            <Card>
                <CardHeader>
                    <i className="icon-menu"/>Estaçãos
                </CardHeader>
                <CardBody>
                    <BootstrapTable
                        data={stations}
                        version="4"
                        striped
                        hover
                        pagination
                        options={options}
                        cellEdit={{
                            mode: 'dbclick',
                            blurToSave: true,
                            beforeSaveCell: onBeforeSaveCell,
                            // afterSaveCell: onAfterSaveCell
                        }}>
                        <TableHeaderColumn dataField="id" dataSort  filter={{type:'TextFilter'}} width="200">Id</TableHeaderColumn>
                        <TableHeaderColumn  dataField="city" dataFormat={CityFormatter}
                                            dataSort sortFunc={citySort} width="200"
                                            filter={{type:'TextFilter'}} filterFormatted
                                            customEditor={ { getElement: createCityEditor, customEditorParameters: { cities: cities}}}>Cidade</TableHeaderColumn>
                        <TableHeaderColumn dataField="createdAt" dataFormat={DateFormatter}
                                           dataSort editable={false} filter={{type:'TextFilter'}}
                                           filterFormatted width="200">Criado</TableHeaderColumn>
                        <TableHeaderColumn dataField="updatedAt" dataFormat={DateFormatter}
                                           dataSort editable={false} filter={{type:'TextFilter'}}
                                           filterFormatted width="200">Atualizado</TableHeaderColumn>
                        <TableHeaderColumn dataField='_id' isKey={true} hidden={true}>Action</TableHeaderColumn>
                    </BootstrapTable>
                </CardBody>
            </Card>
        </div>
    );
};

class CityEditor extends React.Component {
    constructor(props) {
        super(props);
        this.updateData = this.updateData.bind(this);
        this.formatter = this.formatter.bind(this);
        this.onChange = this.onChange.bind(this);
        this.state = {
            option:  {value: props.defaultValue._id, label: props.defaultValue.city, state: props.defaultValue.state}
        }
    }

    updateData() {
        if(this.props.defaultValue._id === this.state.option.value){
            this.props.onUpdate(null);
        }
        else{
            this.props.onUpdate({_id: this.state.option.value, city: this.state.option.label, state: this.state.option.state});
        }
    }

    onChange(option){
        this.setState({option: option})
    }

    formatter(){
        let options = [];
        for(let key in this.props.cities){
            options.push({value:key, label: this.props.cities[key].city, state: this.props.cities[key].state});
        }
        return options;
    }

    render() {
        return (
            <div>
                <Select
                    placeholder="city"
                    value={this.state.option}
                    options={this.formatter()}
                    onChange={this.onChange}
                />
                <button
                    className='btn-info btn-xs'
                    onClick={ this.updateData }>
                    Salve
                </button>
                <button
                    className='btn-info btn-xs'
                    onClick={ () =>this.props.onUpdate(null) }>
                    cancelar
                </button>
            </div>
        );
    }
}

export default Stations;