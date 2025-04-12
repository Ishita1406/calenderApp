import React from "react";
import "../styles/DisplayEvent.css";
import { MdCreate, MdDelete } from 'react-icons/md'

const DisplayEvent = ({ event, onDelete, onEdit }) => {
  return (
    <div className="event-card">
      <div className="event-details">
        <div className="event-content">
          <h3>{event.title}</h3>
          <p>At {event.time}</p>
          {event.description && <p>{event.description}</p>}
        </div>
        <div className="event-media">
        {event.mediaUrl && (
          event.mediaUrl.endsWith(".mp4") ? (
            <video width="250" controls>
              <source src={event.mediaUrl} type="video/mp4"/>
              Your browser does not support the video tag.
            </video>
          ) : (
            <img src={event.mediaUrl} alt="event-media" className="event-image"/>
          )
        )}
        </div>
      </div>
      <div className="event-actions">
        <button className="edit-button">
          <MdCreate onClick={() => {onEdit(event)}}/>
        </button>
        <button className="delete-button">
          <MdDelete onClick={() => {onDelete(event)}}/>
        </button>
        </div>
    </div>
  );
};

export default DisplayEvent;