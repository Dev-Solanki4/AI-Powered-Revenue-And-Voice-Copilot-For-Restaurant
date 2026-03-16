import { useState } from 'react';
import { PhotoIcon } from '@heroicons/react/24/outline';

export default function RestaurantProfile() {
    const [showToast, setShowToast] = useState(false);

    const handleSave = () => {
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
    };

    return (
        <div className="settings-section relative">
            <div className="settings-section-header">
                <h1 className="settings-section-title">Restaurant Profile</h1>
                <p className="settings-section-subtitle">Update your public business information and registration details.</p>
            </div>

            <div className="settings-card">
                <div className="settings-card-header">
                    <h2 className="settings-card-title">Brand Identity</h2>
                    <p className="settings-card-description">This logo will appear on your application and generated bills.</p>
                </div>

                <div className="flex items-center gap-6 mb-8">
                    <div className="w-24 h-24 rounded-lg bg-gray-100 dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center text-gray-400">
                        <PhotoIcon className="w-8 h-8" />
                    </div>
                    <div>
                        <button className="btn btn-secondary mb-2">Upload New Logo</button>
                        <p className="text-xs text-secondary">Recommended size: 256x256px. Max 2MB.</p>
                    </div>
                </div>

                <div className="settings-form-grid">
                    <div className="settings-form-group">
                        <label className="settings-label">Restaurant Name</label>
                        <input type="text" className="settings-input" defaultValue="The Spice Symphony" />
                    </div>

                    <div className="settings-form-group">
                        <label className="settings-label">Brand Name (Short)</label>
                        <input type="text" className="settings-input" defaultValue="Spice Symphony" />
                    </div>

                    <div className="settings-form-group">
                        <label className="settings-label">Restaurant Type</label>
                        <select className="settings-select" defaultValue="restaurant">
                            <option value="cafe">Cafe</option>
                            <option value="restaurant">Fine Dining Restaurant</option>
                            <option value="cloud">Cloud Kitchen</option>
                            <option value="foodtruck">Food Truck</option>
                        </select>
                    </div>

                    <div className="settings-form-group">
                        <label className="settings-label">Owner Name</label>
                        <input type="text" className="settings-input" defaultValue="Rahul Sharma" />
                    </div>
                </div>
            </div>

            <div className="settings-card">
                <div className="settings-card-header">
                    <h2 className="settings-card-title">Legal & Contact</h2>
                    <p className="settings-card-description">Official contact and registration records.</p>
                </div>

                <div className="settings-form-grid">
                    <div className="settings-form-group">
                        <label className="settings-label">GSTIN Number</label>
                        <input type="text" className="settings-input" defaultValue="27AADCB2230M1Z2" />
                    </div>

                    <div className="settings-form-group">
                        <label className="settings-label">FSSAI License Number</label>
                        <input type="text" className="settings-input" defaultValue="11520034000123" />
                    </div>

                    <div className="settings-form-group">
                        <label className="settings-label">Email Address</label>
                        <input type="email" className="settings-input" defaultValue="contact@spicesymphony.com" />
                    </div>

                    <div className="settings-form-group">
                        <label className="settings-label">Phone Number</label>
                        <input type="tel" className="settings-input" defaultValue="+91 98765 43210" />
                    </div>

                    <div className="settings-form-group full-width">
                        <label className="settings-label">Restaurant Address</label>
                        <textarea className="settings-textarea" defaultValue="123, Flavor Street, culinary Avenue, Mumbai, Maharashtra 400001" />
                    </div>

                    <div className="settings-form-group full-width">
                        <label className="settings-label">Google Maps Link</label>
                        <input type="text" className="settings-input" defaultValue="https://maps.google.com/?q=..." placeholder="Paste Google Maps URL here" />
                    </div>
                </div>
            </div>

            <div className="settings-save-button">
                <button className="btn btn-primary btn-lg" onClick={handleSave}>Save Changes</button>
            </div>

            {showToast && (
                <div className="settings-toast">
                    <svg className="w-5 h-5 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Profile settings saved successfully.
                </div>
            )}
        </div>
    );
}
