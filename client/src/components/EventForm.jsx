import React, { useState } from "react";
import "../styles/EventForm.css";
import axiosInstance from "../utils/axiosInstance";


const EventForm = ({ selectedDate, onClose }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [time, setTime] = useState("");
  const [mediaUrl, setMediaUrl] = useState(null);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const eventData = new FormData();
    eventData.append("title", title);
    eventData.append("date", selectedDate.toISOString().split("T")[0]);
    eventData.append("time", time);
    if (description) eventData.append("description", description);
    if (mediaUrl) eventData.append("mediaUrl", mediaUrl);

    try {
        const response = await axiosInstance.post('server/event/create', eventData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        if (response.data && response.data.error) {
            setError(response.data.message);
            return;
        }
    } catch (error) {
        if (error.response && error.response.data && error.response.data.message) {
            setError(error.response.data.message);
        }
        else {
            setError('Something went wrong. Please try again later.');
        }
    }

    console.log("Event Submitted:", Object.fromEntries(eventData));

    onClose(); 
  };

  return (
    <div className="event-form-container">
      <form className="event-form" onSubmit={handleSubmit}>
        <h2>Create Event for {selectedDate.toDateString()}</h2>

        <label>Title:</label>
        <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} />

        <label>Description:</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} />

        <label>Time:</label>
        <input type="time" required value={time} onChange={(e) => setTime(e.target.value)} />

        <label>Media (Image/Video):</label>
        <input type="file" accept="image/*,video/*" onChange={(e) => setMediaUrl(e.target.files[0])} />

        <div className="form-buttons">
          <button type="submit">Add Event</button>
          <button type="button" onClick={onClose}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default EventForm;
