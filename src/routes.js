import DashBoard from './views/Dashboard';
import AdminDashBoard from './views/Dashboard/AdminDashboard';
import CreateCity from './views/City/CreateCity';
import Cities from './views/City/Cities';
import CreateStation from './views/Station/CreateStation';
import Stations from './views/Station/Stations';
import CreateCamera from './views/Camera/CreateCamera';
import Cameras from './views/Camera/Cameras';
import CreateAlert from './views/Alert/CreateAlert';
import Alerts from './views/Alert/Alerts';
import CreateUser from './views/User/CreateUser';
import User from './views/User/Users';
import Profile from "./views/User/Profile";
import Vehicles from './views/Vehicle/Vehicles';
import VehicleDetail from './views/Vehicle/VehicleDetail';
import RealTime from './views/Vehicle/RealTime';
import CameraMap from './views/Map/Cameras';
import Search from './views/Search';
import Companion from './views/Companion';
import Logs from './views/Log';

export const AdminRoute = [
    { path: '/dashboard', name: 'Dashboard', component: AdminDashBoard, exact: true },
    { path: '/city/create', name: 'Criar Cidade', component: CreateCity, exact: true },
    { path: '/city/all', name: 'Cidades', component: Cities, exact: true },
    { path: '/station/create', name: 'Criar Estação', component: CreateStation, exact: true },
    { path: '/station/all', name: 'Estaçãos', component: Stations, exact: true },
    { path: '/camera/create', name: 'Criar Câmera', component: CreateCamera, exact: true },
    { path: '/camera/all', name: 'Câmeras', component: Cameras, exact: true },
    { path: '/alert/create', name: 'Criar Alerta', component: CreateAlert, exact: true },
    { path: '/alert/all', name: 'Alertas', component: Alerts, exact: true },
    {path: '/user/create', name: 'Criar usuário', component: CreateUser, exact: true},
    {path: '/user/all', name: 'Usuários', component: User, exact: true},
    {path: '/user/profile/:id', name: 'Perfil', component: Profile},
    {path: '/vehicle/all', name: 'Veículos', component: Vehicles, exact: true},
    {path: '/vehicle/detail/:id', name: 'Detalhe do veículo', component: VehicleDetail},
    {path: '/realtime', name: 'TEMPO REAL', component: RealTime, exact: true},
    {path: '/map/camera', name: 'Câmeras no mapa', component: CameraMap, exact: true},
    {path: '/search', name: 'Parâmetros de Pesquisa', component: Search, exact: true},
    {path: '/companion', name: 'Companheiro', component: Companion, exact: true},
    {path: '/log', name: 'Histórico', component: Logs, exact: true},
    // {path: '*',  component: Page404, exact: true},
];

export const UserRoute = [
    { path: '/dashboard', name: 'Dashboard', component: DashBoard, exact: true },
    { path: '/city/create', name: 'Criar Cidade', component: CreateCity, exact: true },
    { path: '/city/all', name: 'Cidades', component: Cities, exact: true },
    { path: '/station/create', name: 'Criar Estação', component: CreateStation, exact: true },
    { path: '/station/all', name: 'Estaçãos', component: Stations, exact: true },
    { path: '/camera/create', name: 'Criar Câmera', component: CreateCamera, exact: true },
    { path: '/camera/all', name: 'Câmeras', component: Cameras, exact: true },
    { path: '/alert/create', name: 'Criar Alerta', component: CreateAlert, exact: true },
    { path: '/alert/all', name: 'Alertas', component: Alerts, exact: true },
    {path: '/vehicle/all', name: 'Veículos', component: Vehicles},
    {path: '/vehicle/detail/:id', name: 'Detalhe do veículo', component: VehicleDetail},
    {path: '/realtime', name: 'TEMPO REAL', component: RealTime, exact: true},
    {path: '/map/camera', name: 'Câmeras no mapa', component: CameraMap, exact: true},
    {path: '/search', name: 'Parâmetros de Pesquisa', component: Search, exact: true},
    {path: '/companion', name: 'Companheiro', component: Companion, exact: true},
    // {path: '*', component: Page404, exact: true},
];