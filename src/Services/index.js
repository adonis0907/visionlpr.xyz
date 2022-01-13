import AuthService from "./AuthService";
import CityApi from './CityApi';
import StationApi from "./StationApi";
import CameraApi from './CameraApi';
import AlertApi from './AlertApi';
import GroupApi from './GroupApi';
import PermissionApi from './PermissionApi';
import VehicleApi from './Vehicles';
import Notification from './NotificationApi';
import LogApi from './LogApi';

export default {
    AuthService: AuthService,
    CityService: CityApi,
    StationService: StationApi,
    CameraService: CameraApi,
    AlertService: AlertApi,
    GroupService: GroupApi,
    PermissionService: PermissionApi,
    VehicleService: VehicleApi,
    NotificationService: Notification,
    LogService: LogApi
}