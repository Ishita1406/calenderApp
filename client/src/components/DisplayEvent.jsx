import React from "react";
import "../styles/DisplayEvent.css";

const DisplayEvent = ({ event }) => {
  return (
    <div className="event-card">
      <h3>{event.title}</h3>
      <p>{event.date} at {event.time}</p>
      {event.description && <p>{event.description}</p>}
      {event.mediaUrl && (
        event.mediaUrl.endsWith(".mp4") ? (
          <video width="250" controls>
            <source src={event.mediaUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        ) : (
          <img src={event.mediaUrl} alt="event-media" width="250" />
        )
      )}
    </div>
  );
};

export default DisplayEvent;