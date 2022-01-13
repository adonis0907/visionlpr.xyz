import React, { useContext} from 'react';
import { Nav } from 'reactstrap';
import PropTypes from 'prop-types';

import {AppNavbarBrand, AppSidebarToggler } from '@coreui/react';
import DefaultHeaderDropdown  from './DefaultHeaderDropdown'
import sygnet from '../../assets/img/sygnet.png';
import logo from '../../assets/img/logo.png';
import Context from "../../Context";

const propTypes = {
    children: PropTypes.node,
};

const defaultProps = {};

const DefaultHeader = props => {
    const {user, notifications} = useContext(Context.AuthContext);
    return (
        <React.Fragment>
            <AppSidebarToggler className="d-lg-none" display="md" mobile />
            <AppNavbarBrand
                full={{ src: logo, width: 120, height: 40, alt: 'Logo' }}
                minimized={{ src: sygnet, width: 30, height: 30, alt: 'Logo' }}
            />
            <AppSidebarToggler className="d-md-down-none" display="lg" />
            <Nav className="ml-auto" navbar>
                <DefaultHeaderDropdown notif notifications={notifications} history={props.history}/>
                <DefaultHeaderDropdown onLogout={props.onLogout} accnt user={user} history={props.history}/>
            </Nav>
            <div style={{width: '20px'}}/>
        </React.Fragment>
    );
};

DefaultHeader.propTypes = propTypes;
DefaultHeader.defaultProps = defaultProps;

export default DefaultHeader;