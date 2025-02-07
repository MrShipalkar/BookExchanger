import React, { useState } from "react";
import "./Profile.css";

const Profile = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [profile, setProfile] = useState({
        profilePic: "https://via.placeholder.com/100", // Default image
        name: "John Doe",
        email: "johndoe@example.com",
        phone: "123-456-7890",
        shopName: "Doe's Bookstore",
        shopAddress: "123 Main St, City",
        sellerType: "Shop Owner",
        joinedDate: "2023-01-15",
        password: "",
        newPassword: "",
        confirmNewPassword: "",
        notifications: true,
        showContact: true,
        allowMessages: false,
    });

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setProfile({
            ...profile,
            [name]: type === "checkbox" ? checked : value,
        });
    };

    const handleProfileUpdate = () => {
        alert("Profile updated successfully!");
        setIsEditing(false);
    };

    const handlePasswordUpdate = () => {
        if (profile.newPassword !== profile.confirmNewPassword) {
            alert("New passwords do not match!");
            return;
        }
        alert("Password updated successfully!");
        setProfile({ ...profile, password: "", newPassword: "", confirmNewPassword: "" });
    };

    const handleDeleteAccount = () => {
        if (window.confirm("Are you sure you want to delete your account?")) {
            alert("Account deleted!");
        }
    };

    return (
        <div className="seller-profile">
            {/* Profile Picture Section */}
            <div className="profile-header">
                <img src={profile.profilePic} alt="Profile" className="profile-pic" />
                <div>
                    <h2>{profile.name}</h2>
                    <p>Joined on: {profile.joinedDate}</p>
                </div>
            </div>

            {/* Editable Profile Information */}
            <div className="profile-section">
                <h3>Seller Information</h3>
                <input type="text" name="name" value={profile.name} onChange={handleInputChange} disabled={!isEditing} />
                <input type="email" name="email" value={profile.email} disabled />
                <input type="text" name="phone" value={profile.phone} onChange={handleInputChange} disabled={!isEditing} />
                <input type="text" name="shopName" value={profile.shopName} onChange={handleInputChange} disabled={!isEditing} />
                <input type="text" name="shopAddress" value={profile.shopAddress} onChange={handleInputChange} disabled={!isEditing} />
                <select name="sellerType" value={profile.sellerType} onChange={handleInputChange} disabled={!isEditing}>
                    <option value="Shop Owner">Shop Owner</option>
                    <option value="Individual Seller">Individual Seller</option>
                </select>
                <button className="btn-primary" onClick={() => setIsEditing(!isEditing)}>
                    {isEditing ? "Save Changes" : "Edit Profile"}
                </button>
                {isEditing && <button className="btn-secondary" onClick={handleProfileUpdate}>Update Profile</button>}
            </div>

            {/* Change Password Section */}
            <div className="profile-section">
                <h3>Change Password</h3>
                <input type="password" name="password" placeholder="Current Password" onChange={handleInputChange} />
                <input type="password" name="newPassword" placeholder="New Password" onChange={handleInputChange} />
                <input type="password" name="confirmNewPassword" placeholder="Confirm New Password" onChange={handleInputChange} />
                <button className="btn-secondary" onClick={handlePasswordUpdate}>Update Password</button>
            </div>

            {/* Seller Preferences */}
            <div className="profile-section">
                <h3>Preferences</h3>
                <label>
                    <input type="checkbox" name="notifications" checked={profile.notifications} onChange={handleInputChange} />
                    Enable Notifications
                </label>
                <label>
                    <input type="checkbox" name="showContact" checked={profile.showContact} onChange={handleInputChange} />
                    Show Contact Info
                </label>
                <label>
                    <input type="checkbox" name="allowMessages" checked={profile.allowMessages} onChange={handleInputChange} />
                    Allow Buyer Messages
                </label>
            </div>

            {/* Delete Account Section */}
            <div className="profile-section danger">
                <h3>Danger Zone</h3>
                <button className="btn-danger" onClick={handleDeleteAccount}>Delete Account</button>
            </div>
        </div>
    );
};

export default Profile;
