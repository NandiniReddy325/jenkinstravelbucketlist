import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./style.css";
import config from './config.js';

const TravelBucketManager = () => {
  const [places, setPlaces] = useState([]);
  const [place, setPlace] = useState({
    id: '',
    destination: '',
    country: '',
    notes: '',
    visited: 'NO'
  });
  const [idToFetch, setIdToFetch] = useState('');
  const [fetchedPlace, setFetchedPlace] = useState(null);
  const [message, setMessage] = useState('');
  const [editMode, setEditMode] = useState(false);

  // ✅ baseUrl matches Spring Boot RequestMapping
  const baseUrl = `${config.url}/travelapi`;

  useEffect(() => {
    fetchAllPlaces();
  }, []);

  const fetchAllPlaces = async () => {
    try {
      const res = await axios.get(`${baseUrl}/all`);
      setPlaces(res.data);
    } catch (error) {
      setMessage('Failed to fetch travel destinations.');
    }
  };

  const handleChange = (e) => {
    setPlace({ ...place, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    if (!place.destination || !place.country) {
      setMessage('⚠ Please fill required fields: Destination & Country');
      return false;
    }
    return true;
  };

  const addPlace = async () => {
    if (!validateForm()) return;
    try {
      const payload = {
        destination: place.destination,
        country: place.country,
        notes: place.notes,
        visited: place.visited
      };
      await axios.post(`${baseUrl}/add`, payload);
      setMessage('✅ Destination added successfully!');
      fetchAllPlaces();
      resetForm();
    } catch (error) {
      console.error("Add error:", error);
      setMessage('❌ Error adding destination');
    }
  };

  const updatePlace = async () => {
    if (!place.id) {
      setMessage('⚠ ID is required to update');
      return;
    }
    if (!validateForm()) return;
    try {
      await axios.put(`${baseUrl}/update`, place);
      setMessage('✅ Destination updated successfully!');
      fetchAllPlaces();
      resetForm();
    } catch (error) {
      console.error("Update error:", error);
      setMessage('❌ Error updating destination');
    }
  };

  const deletePlace = async (id) => {
    try {
      const res = await axios.delete(`${baseUrl}/delete/${id}`);
      setMessage(res.data || '✅ Destination deleted successfully!');
      fetchAllPlaces();
    } catch (error) {
      console.error("Delete error:", error);
      setMessage('❌ Error deleting destination');
    }
  };

  const getPlaceById = async () => {
    if (!idToFetch) {
      setMessage('⚠ Enter an ID to fetch');
      return;
    }
    try {
      const res = await axios.get(`${baseUrl}/get/${idToFetch}`);
      setFetchedPlace(res.data);
      setMessage('');
    } catch (error) {
      setFetchedPlace(null);
      setMessage('Destination not found.');
    }
  };

  const handleEdit = (p) => {
    setPlace(p);
    setEditMode(true);
    setMessage(`Editing destination with ID ${p.id}`);
  };

  const resetForm = () => {
    setPlace({
      id: '',
      destination: '',
      country: '',
      notes: '',
      visited: 'NO'
    });
    setEditMode(false);
  };

  return (
    <div className="travel-container">
      {message && (
        <div
          className={`message-banner ${
            message.includes('❌') || message.includes('⚠') ? 'error' : 'success'
          }`}
        >
          {message}
        </div>
      )}

      <h2>🌍 Travel Bucket List Manager</h2>

      <div>
        <h3>{editMode ? 'Edit Destination' : 'Add Destination'}</h3>
        <div className="form-grid">
          <input type="text" name="destination" placeholder="Destination" value={place.destination} onChange={handleChange} />
          <input type="text" name="country" placeholder="Country" value={place.country} onChange={handleChange} />
          <input type="text" name="notes" placeholder="Notes" value={place.notes} onChange={handleChange} />
          <select name="visited" value={place.visited} onChange={handleChange}>
            <option value="NO">Not Visited</option>
            <option value="YES">Visited</option>
          </select>
        </div>

        <div className="btn-group">
          {!editMode ? (
            <button className="btn-blue" onClick={addPlace}>➕ Add Destination</button>
          ) : (
            <>
              <button className="btn-green" onClick={updatePlace}>✏ Update Destination</button>
              <button className="btn-gray" onClick={resetForm}>Cancel</button>
            </>
          )}
        </div>
      </div>

      <div>
        <h3>Get Destination By ID</h3>
        <input
          type="number"
          value={idToFetch}
          onChange={(e) => setIdToFetch(e.target.value)}
          placeholder="Enter ID"
        />
        <button className="btn-blue" onClick={getPlaceById}>Fetch</button>

        {fetchedPlace && (
          <div>
            <h4>Destination Found:</h4>
            <pre>{JSON.stringify(fetchedPlace, null, 2)}</pre>
          </div>
        )}
      </div>

      <div>
        <h3>All Destinations</h3>
        {places.length === 0 ? (
          <p>No destinations found.</p>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  {Object.keys(place).map((key) => (
                    <th key={key}>{key}</th>
                  ))}
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {places.map((p) => (
                  <tr key={p.id}>
                    {Object.keys(place).map((key) => (
                      <td key={key}>{p[key]}</td>
                    ))}
                    <td>
                      <div className="action-buttons">
                        <button className="btn-green" onClick={() => handleEdit(p)}>Edit</button>
                        <button className="btn-red" onClick={() => deletePlace(p.id)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default TravelBucketManager;
