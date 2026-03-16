import { Outlet } from 'react-router-dom';
import SettingsSidebar from './SettingsSidebar';
import './settings.css';

export default function SettingsLayout() {
    return (
        <div className="settings-layout">
            <SettingsSidebar />
            <div className="settings-content-wrapper">
                <div className="settings-content-container">
                    <Outlet />
                </div>
            </div>
        </div>
    );
}
