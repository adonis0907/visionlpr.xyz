import React, {createContext, useState, useEffect} from 'react';
import {io} from 'socket.io-client';
import Services from '../Services';

export const AuthContext = createContext();

export default ({children}) =>{
    const [user, setUser] = useState(null);
    const [notifications, setNotifications] = useState({total: 0, notifications: []});
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() =>{
        Services.AuthService.isAuthenticated()
            .then(data =>{
                setUser(data.user);
                setIsAuthenticated(data.isAuthenticated);
            });

    },[]);

    useEffect(()=>{
        if(isAuthenticated){
            Services.NotificationService.get()
                .then(data =>{
                    setNotifications({
                        total: data.total,
                        notifications: data.notifications
                    })
                });

            const socket = io(process.env.SOCKET_SERVER,{
                enableLogging: true,
                upgrade: false
            });

            socket.on("notification", data =>{
                if(data.users.indexOf(user._id) !== -1){
                    setNotifications(prev =>{
                        let ss = {...prev};
                        ss.total ++;
                        ss.notifications.unshift(data.vehicles[user._id]);
                        return ss;
                    });
                }
            });

            return () => {socket.disconnect();}
        }
    }, [isAuthenticated]);

    return (
        <AuthContext.Provider value={{user, setUser, isAuthenticated, setIsAuthenticated, notifications, setNotifications}}>
            {children}
        </AuthContext.Provider>);
}