import { useState } from 'react';
import { QrCodeIcon } from '@heroicons/react/24/outline';

export default function BillConfiguration() {
    const [showToast, setShowToast] = useState(false);

    const handleSave = () => {
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
    };

    return (
        <div className="settings-section relative">
            <div className="settings-section-header">
                <h1 className="settings-section-title">Bill Configuration</h1>
                <p className="settings-section-subtitle">Customize the header and footer of your printed receipts.</p>
            </div>

            <div className="settings-card">
                <div className="settings-card-header">
                    <h2 className="settings-card-title">Bill Settings</h2>
                </div>

                <div className="toggle-row">
                    <div className="toggle-info">
                        <div className="toggle-title">Show Logo on Bill</div>
                        <div className="toggle-desc">Print your restaurant logo at the top of every receipt.</div>
                    </div>
                    <label className="toggle-switch">
                        <input type="checkbox" defaultChecked />
                        <span className="toggle-slider"></span>
                    </label>
                </div>

                <div className="toggle-row">
                    <div className="toggle-info">
                        <div className="toggle-title">Show QR Code on Bill</div>
                        <div className="toggle-desc">Include a UPI payment QR code at the bottom.</div>
                    </div>
                    <label className="toggle-switch">
                        <input type="checkbox" defaultChecked />
                        <span className="toggle-slider"></span>
                    </label>
                </div>
            </div>

            <div className="settings-card">
                <div className="settings-card-header">
                    <h2 className="settings-card-title">Bill Header Config</h2>
                    <p className="settings-card-description">Choose what details appear at the top.</p>
                </div>

                <div className="settings-form-grid">
                    <div className="settings-form-group">
                        <label className="settings-label">Restaurant Name</label>
                        <input type="text" className="settings-input" defaultValue="The Spice Symphony" />
                    </div>

                    <div className="settings-form-group">
                        <label className="settings-label">GSTIN</label>
                        <input type="text" className="settings-input" defaultValue="27AADCB2230M1Z2" />
                    </div>

                    <div className="settings-form-group">
                        <label className="settings-label">FSSAI License</label>
                        <input type="text" className="settings-input" defaultValue="11520034000123" />
                    </div>

                    <div className="settings-form-group">
                        <label className="settings-label">Phone Number</label>
                        <input type="tel" className="settings-input" defaultValue="+91 98765 43210" />
                    </div>

                    <div className="settings-form-group full-width">
                        <label className="settings-label">Address</label>
                        <textarea className="settings-textarea" defaultValue="123, Flavor Street, culinary Avenue" style={{ minHeight: '60px' }} />
                    </div>
                </div>
            </div>

            <div className="settings-card">
                <div className="settings-card-header">
                    <h2 className="settings-card-title">Bill Footer Message</h2>
                    <p className="settings-card-description">Custom text message at the bottom of the bill.</p>
                </div>

                <div className="settings-form-grid">
                    <div className="settings-form-group full-width">
                        <label className="settings-label">Footer Text Message</label>
                        <textarea className="settings-textarea" defaultValue="Thank you for dining with us. Visit again." />
                    </div>
                </div>
            </div>

            <div className="settings-save-button">
                <button className="btn btn-primary btn-lg" onClick={handleSave}>Save Bill Settings</button>
            </div>

            {showToast && (
                <div className="settings-toast">
                    <svg className="w-5 h-5 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Bill configuration saved successfully.
                </div>
            )}
        </div>
    );
}
