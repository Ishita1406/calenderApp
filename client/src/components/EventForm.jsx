import React, { useEffect, useState } from "react";
import "../styles/EventForm.css";
import axiosInstance from "../utils/axiosInstance";


const EventForm = ({ selectedDate, onClose, onSuccess, existingEvent }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [time, setTime] = useState("");
  const [mediaUrl, setMediaUrl] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (existingEvent) {
      setTitle(existingEvent.title || "");
      setDescription(existingEvent.description || "");
      setTime(existingEvent.time || "");
      setMediaUrl(existingEvent.mediaUrl || null);
    }
    else {
      setTitle("");
      setDescription("");
      setTime("");
      setMediaUrl(null);
    }
  }, [existingEvent]);

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
        let response;
        if (existingEvent) {
          response = await axiosInstance.put(`/server/event/edit/${existingEvent._id}`, eventData, {
            headers: { "Content-Type": "multipart/form-data" },
          });
        } else {
          response = await axiosInstance.post("server/event/create", eventData, {
            headers: { "Content-Type": "multipart/form-data" },
          });
        }
        if (response.data && response.data.error) {
            setError(response.data.message);
            return;
        }
        const newEvent = response.data.event;
        onClose(); 
        onSuccess(newEvent)
    } catch (error) {
        if (error.response && error.response.data && error.response.data.message) {
            setError(error.response.data.message);
        }
        else {
            setError('Something went wrong. Please try again later.');
        }
    }

    
    console.log("Event Submitted:", Object.fromEntries(eventData));

    
  };

  return (
    <div className="event-form-container">
      <form className="event-form" onSubmit={handleSubmit}>
      <h2>{existingEvent ? `Edit Event` : `Create Event`} for {selectedDate.toDateString()}</h2>

        <label>Title:</label>
        <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} />

        <label>Description:</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} />

        <label>Time:</label>
        <input type="time" required value={time} onChange={(e) => setTime(e.target.value)} />

        <label>Media (Image/Video):</label>
        <input type="file" accept="image/*,video/*" onChange={(e) => setMediaUrl(e.target.files[0])} />

        <div className="form-buttons">
        <button type="submit">{existingEvent ? "Update Event" : "Add Event"}</button>
          <button type="button" onClick={onClose}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default EventForm;
