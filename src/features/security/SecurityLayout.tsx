import { Outlet } from 'react-router-dom';
import SecuritySidebar from './SecuritySidebar';
import './security.css';

export default function SecurityLayout() {
    return (
        <div className="security-layout">
            <SecuritySidebar />
            <div className="security-content-wrapper">
                <div className="security-content-container">
                    <Outlet />
                </div>
            </div>
        </div>
    );
}
