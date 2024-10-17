import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function Modaluser({ showModal, handleClose, user, onUpdate }) {
  const apiUrl = process.env.REACT_APP_API_URL;
  const [EditUser, setEditUser] = useState({
    username: '',
    phone: '',
    email: '',
    address: {
      city: '',
      street: '',
      zipcode: '',
    },
  });

  useEffect(() => {
    if (user) {
      setEditUser({
        username: user.username || '',
        phone: user.phone || '',
        email: user.email || '',
        address: {
          city: user.address?.city || '',
          street: user.address?.street || '',
          zipcode: user.address?.zipcode || '',
        },
      });
    }
  }, [user]);

  const handleUpdateUser = async (id, updatedUser) => {
    try {
      await axios.put(`${apiUrl}/users/${id}`, updatedUser);

      onUpdate(); // Call the onUpdate function to refresh user data
      handleClose(); // Close the modal after successful update
    } catch (error) {
      console.error('Error updating user:', error);

    }
  };

  const handleSaveChanges = () => {
    if (user) {
      handleUpdateUser(user.id, EditUser);
    }
  };

  return (
    <div>
      <div
        className={`modal fade ${showModal ? 'show' : ''}`}
        style={{ display: showModal ? 'block' : 'none' }}
        id="exampleModal"
        aria-labelledby="exampleModalLabel"
        aria-hidden={!showModal}
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">Edit User</h1>
              <button type="button" className="btn-close" onClick={handleClose} aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <form>
                <div className="mb-3">
                  <label htmlFor="username" className="form-label">Username</label>
                  <input
                    type="text"
                    className="form-control"
                    id="username"
                    value={EditUser.username}
                    onChange={(e) => setEditUser({ ...EditUser, username: e.target.value })}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="phone" className="form-label">Phone</label>
                  <input
                    type="text"
                    className="form-control"
                    id="phone"
                    value={EditUser.phone}
                    onChange={(e) => setEditUser({ ...EditUser, phone: e.target.value })}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    value={EditUser.email}
                    onChange={(e) => setEditUser({ ...EditUser, email: e.target.value })}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="city" className="form-label">City</label>
                  <input
                    type="text"
                    className="form-control"
                    id="city"
                    value={EditUser.address.city}
                    onChange={(e) => setEditUser({ ...EditUser, address: { ...EditUser.address, city: e.target.value } })}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="street" className="form-label">Street</label>
                  <input
                    type="text"
                    className="form-control"
                    id="street"
                    value={EditUser.address.street}
                    onChange={(e) => setEditUser({ ...EditUser, address: { ...EditUser.address, street: e.target.value } })}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="zipcode" className="form-label">Zipcode</label>
                  <input
                    type="text"
                    className="form-control"
                    id="zipcode"
                    value={EditUser.address.zipcode}
                    onChange={(e) => setEditUser({ ...EditUser, address: { ...EditUser.address, zipcode: e.target.value } })}
                  />
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={handleClose}>Anuller</button>
              <button type="button" className="btn btn-primary" onClick={handleSaveChanges}>Enregister</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
