import { Outlet } from 'react-router-dom';
import AlertsSidebar from './AlertsSidebar';
import './alerts.css';

export default function AlertsLayout() {
    return (
        <div className="alerts-layout">
            <AlertsSidebar />
            <div className="alerts-content-wrapper">
                <div className="alerts-content-container">
                    <Outlet />
                </div>
            </div>
        </div>
    );
}
