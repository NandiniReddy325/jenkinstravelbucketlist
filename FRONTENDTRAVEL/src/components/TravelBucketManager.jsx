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

  const baseUrl = `${config.url}/travelapi`;

  useEffect(() => {
    fetchAllPlaces();
  }, []);

  const fetchAllPlaces = async () => {
    try {
      const res = await axios.get(`${baseUrl}/all`);
      setPlaces(res.data);
    } catch (error) {
      setMessage('Failed to fetch travel journeys.');
    }
  };

  const handleChange = (e) => {
    setPlace({ ...place, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    if (!place.destination || !place.country) {
      setMessage('⚠ Please fill required fields: From (State / Country) & To (Travel Destination)');
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
      setMessage('✅ Travel journey added successfully!');
      fetchAllPlaces();
      resetForm();
    } catch (error) {
      console.error("Add error:", error);
      setMessage('❌ Error adding travel journey');
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
      setMessage('✅ Travel journey updated successfully!');
      fetchAllPlaces();
      resetForm();
    } catch (error) {
      console.error("Update error:", error);
      setMessage('❌ Error updating travel journey');
    }
  };

  const deletePlace = async (id) => {
    try {
      const res = await axios.delete(`${baseUrl}/delete/${id}`);
      setMessage(res.data || '✅ Travel journey deleted successfully!');
      fetchAllPlaces();
    } catch (error) {
      console.error("Delete error:", error);
      setMessage('❌ Error deleting travel journey');
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
      setMessage('Travel journey not found.');
    }
  };

  const handleEdit = (p) => {
    setPlace(p);
    setEditMode(true);
    setMessage(`Editing travel journey with ID ${p.id}`);
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
        <h3>{editMode ? 'Edit Travel Journey' : 'Add Travel Journey'}</h3>
        <div className="form-grid">
          <input
            type="text"
            name="country"
            placeholder="From (State / Country)"
            value={place.country}
            onChange={handleChange}
          />
          <input
            type="text"
            name="destination"
            placeholder="To (Travel Destination)"
            value={place.destination}
            onChange={handleChange}
          />
          <input
            type="text"
            name="notes"
            placeholder="Notes"
            value={place.notes}
            onChange={handleChange}
          />
          <select name="visited" value={place.visited} onChange={handleChange}>
            <option value="NO">Not Visited</option>
            <option value="YES">Visited</option>
          </select>
        </div>

        <div className="btn-group">
          {!editMode ? (
            <button className="btn-blue" onClick={addPlace}>➕ Add Travel Journey</button>
          ) : (
            <>
              <button className="btn-green" onClick={updatePlace}>✏ Update Travel Journey</button>
              <button className="btn-gray" onClick={resetForm}>Cancel</button>
            </>
          )}
        </div>
      </div>

      <div className="fetch-wrapper">
        <h3>Get Travel Journey By ID</h3>
        <input
          type="number"
          value={idToFetch}
          onChange={(e) => setIdToFetch(e.target.value)}
          placeholder="Enter ID"
        />
        <button className="btn-blue" onClick={getPlaceById}>Fetch</button>

        {fetchedPlace && (
          <div>
            <h4>Travel Journey Found:</h4>
            <pre>{JSON.stringify(fetchedPlace, null, 2)}</pre>
          </div>
        )}
      </div>

      <div>
        <h3>All Travel Journeys</h3>
        {places.length === 0 ? (
          <p>No travel journeys found.</p>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>From (State / Country)</th>
                  <th>To (Travel Destination)</th>
                  <th>Notes</th>
                  <th>Visited</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {places.map((p) => (
                  <tr key={p.id}>
                    <td>{p.id}</td>
                    <td>{p.country}</td>
                    <td>{p.destination}</td>
                    <td>{p.notes}</td>
                    <td>{p.visited}</td>
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
