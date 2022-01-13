import React, {Suspense, useContext} from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { Container } from 'reactstrap';

import {
    AppAside,
    AppBreadcrumb,
    AppFooter,
    AppHeader,
} from '@coreui/react';
import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AppSidebar from "@coreui/react/es/Sidebar";
import AppSidebarHeader from "@coreui/react/es/SidebarHeader";
import AppSidebarNav from "@coreui/react/es/SidebarNav";
import AppSidebarFooter from "@coreui/react/es/SidebarFooter";
import AppSidebarMinimizer from "@coreui/react/es/SidebarMinimizer";
import {AdminRoute, UserRoute} from '../../routes';
import {adminNav, userNav} from '../../_nav';
import Context from "../../Context";
import Services from "../../Services";
import DefaultFooter from './DefaultFooter';
const DefaultAside = React.lazy(() => import('./DefaultAside'));
const DefaultHeader = React.lazy(() => import('./DefaultHeader'));


const DefaultLayout = (props) => {
    let routes;

    const {user, setUser, setIsAuthenticated} = useContext(Context.AuthContext);
    user.role === 'admin'? routes = AdminRoute:routes = UserRoute;

    const loading = () => <div className="animated fadeIn pt-1 text-center"><div className="sk-spinner sk-spinner-pulse"/></div>;

    const signOut = async (e) => {
        Services.AuthService.logout()
            .then(data =>{
                if(data.success){
                    setUser({});
                    setIsAuthenticated(false);
                }
            });
    };

    return (
        <div className="app">
            <ToastContainer position="top-right" autoClose={5000} style={{zIndex: 1999}}/>
            <AppHeader fixed>
                <Suspense fallback={loading()}>
                    <DefaultHeader onLogout={(event) => signOut(event)} history={props.history}/>
                </Suspense>
            </AppHeader>
            <div className="app-body">
                <AppSidebar fixed display="lg">
                    <AppSidebarHeader />
                    <Suspense>
                        <AppSidebarNav navConfig={user.role === 'admin'?adminNav:userNav} {...props} />
                    </Suspense>
                    <AppSidebarFooter />
                    <AppSidebarMinimizer />
                </AppSidebar>
                <main className="main">
                    <AppBreadcrumb appRoutes={routes}/>
                    <Container fluid>
                        <Suspense fallback={loading()}>
                            <Switch>
                                {routes.map((route, idx) => {
                                    return route.component ? (
                                        <Route
                                            key={idx}
                                            path={route.path}
                                            exact={route.exact}
                                            name={route.name}
                                            render={props => (
                                                <route.component {...props} />
                                            )} />
                                    ) : (null);
                                })}
                                <Redirect from="/" to="/dashboard" />
                            </Switch>
                        </Suspense>
                    </Container>
                </main>
                <AppAside fixed>
                    <Suspense fallback={loading()}>
                        <DefaultAside />
                    </Suspense>
                </AppAside>
            </div>
            <AppFooter>
                <DefaultFooter />
            </AppFooter>
        </div>
    );
};

export default DefaultLayout;