import { Outlet } from 'react-router-dom';
import StaffSidebar from './StaffSidebar';
import './staff.css';

export default function StaffLayout() {
    return (
        <div className="staff-layout">
            <StaffSidebar />
            <div className="staff-content-wrapper">
                <div className="staff-content-container">
                    <Outlet />
                </div>
            </div>
        </div>
    );
}
