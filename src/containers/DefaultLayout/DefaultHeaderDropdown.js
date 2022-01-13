import React, {useContext, useState} from 'react';
import PropTypes from 'prop-types';
import { Badge, Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from 'reactstrap';
import Services from '../../Services';
import Context from "../../Context";

const propTypes = {
  notif: PropTypes.bool,
  accnt: PropTypes.bool,
};
const defaultProps = {
  notif: false,
  accnt: false,
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

const DefaultHeaderDropdown = props =>{

    const { notif, accnt} = props;

    const {setNotifications} = useContext(Context.AuthContext);

  const [dropdownOpen, setDropdownOpen] = useState(false);

  const onNotificationClick = (id, vehicleId) =>{
      Services.NotificationService.read(id)
          .then(res =>{
              let ss = props.notifications.notifications.filter(notification => notification._id !== id);
              setNotifications({
                  total: props.notifications.total - 1,
                  notifications: ss
              });
              props.history.replace(`/vehicle/detail/${vehicleId}`)
          })
  };

  const dropNotif = ()=> {
    return (
      <Dropdown nav className="d-md-down-none" isOpen={dropdownOpen} toggle={() => setDropdownOpen(!dropdownOpen)}>
        <DropdownToggle nav>
          <i className="icon-bell"/>{props.notifications.total !== 0?<Badge pill color="danger">{props.notifications.total > 99?'99+':props.notifications.total}</Badge>:""}
        </DropdownToggle>
        <DropdownMenu right style={{maxHeight: '500px', overflowY: 'scroll'}}>
          <DropdownItem header tag="div" className="text-center"><strong>Você tem {props.notifications.total} notificações</strong></DropdownItem>
            {
              props.notifications.notifications.map(
                  notification =>(<DropdownItem key={notification._id} onClick={() => onNotificationClick(notification._id, notification.vehicle._id)}>
                      <i className="fa fa-automobile text-danger"/>{notification.vehicle.license} : {alertTypes[notification.vehicle.alert]}</DropdownItem>))
            }
        </DropdownMenu>
      </Dropdown>
    );
  };

  const dropAccnt = ()=> {
    return (
      <Dropdown nav isOpen={dropdownOpen} toggle={() => setDropdownOpen(!dropdownOpen)}>
        <DropdownToggle nav>
          <span>{props.user.name}</span>
        </DropdownToggle>
        <DropdownMenu right>
          <DropdownItem header tag="div" className="text-center"><strong>Conta</strong></DropdownItem>
          {/*<DropdownItem onClick={() => this.props.history.replace(`/user/profile/${this.props.user._id}`)}><i className="fa fa-user"/> Perfil</DropdownItem>*/}
          <DropdownItem onClick={() => props.history.push(`/reset`)}><i className="icon-lock"/> Redefinir senha</DropdownItem>
          <DropdownItem onClick={props.onLogout}><i className="fa fa-lock"/> Sair</DropdownItem>
        </DropdownMenu>
      </Dropdown>
    );
  };

    return (
        notif ? dropNotif() :
          accnt ? dropAccnt() :null
    );

};

DefaultHeaderDropdown.propTypes = propTypes;
DefaultHeaderDropdown.defaultProps = defaultProps;

export default DefaultHeaderDropdown;
