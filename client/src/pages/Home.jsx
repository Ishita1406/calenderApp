import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import EventForm from "../components/EventForm";
import "../styles/Home.css";
import axiosInstance from "../utils/axiosInstance";
import DisplayEvent from "../components/DisplayEvent";

const Home = () => {
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [currentViewDate, setCurrentViewDate] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [events, setEvents] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showEventsPopup, setShowEventsPopup] = useState(false);
  const [eventsForSelectedDate, setEventsForSelectedDate] = useState([]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/server/event/get");
      
      if (response.data && response.data.events && Array.isArray(response.data.events)) {
        setEvents(response.data.events);
      } else {
        setEvents([]);
        console.warn("Unexpected response format:", response);
      }
    } catch (error) {
      console.error("Error fetching events:", error);
      setError(error.message);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);
  

  const handleDateClick = (date) => {
    setCurrentViewDate(date);
    const selectedDateStr = date.toISOString().split("T")[0];
    const eventsOnDate = events.filter(event => {
      const eventDateStr = new Date(event.date).toISOString().split("T")[0];
      return eventDateStr === selectedDateStr;
    });
    setEventsForSelectedDate(eventsOnDate);
    setShowEventsPopup(true);
  };

  const handleAddNewEvent = () => {
    setShowForm(true);
    setShowEventsPopup(false);
  };

  const tileContent = ({ date, view }) => {
    if (view === 'month') {
      const tileDateStr = date.toISOString().split("T")[0];
      const hasEvent = events.some(event => {
        const eventDateStr = new Date(event.date).toISOString().split("T")[0];
        return eventDateStr === tileDateStr;
      });
      
      return hasEvent ? <div className="event-marker">•</div> : null;
      // 
    }
    return null;
  };

  const closeAllPopups = () => {
    setShowEventsPopup(false);
    setShowForm(false);
  };

  const deleteEvent = async (eventDetails) => {
    try {
      if (!eventDetails?._id) {
        throw new Error("Event ID is missing");
      }
      const eventId = eventDetails._id;  
      const response = await axiosInstance.delete(
        `/server/event/delete/${eventId}`
      );  
      const updatedEvents = events.filter((event) => event._id !== eventId);
      setEvents(updatedEvents);
      if (currentViewDate) {
        const selectedDateStr = currentViewDate.toISOString().split("T")[0];
        const updatedEventsForDate = updatedEvents.filter((event) => {
          const eventDateStr = new Date(event.date).toISOString().split("T")[0];
          return eventDateStr === selectedDateStr;
        });
        setEventsForSelectedDate(updatedEventsForDate);
      }
    } catch (error) {
      console.error("Error deleting event:", error);
      setError(
        `Failed to delete event: ${error.response?.data?.message || error.message}`
      );
    }
  };
  
  return (
    <div className="calendar-fullscreen">
      <h1 className="calendar-title">My Calendar</h1>

      <div className="calendar-container">
        <Calendar
          onClickDay={handleDateClick}
          value={calendarDate}
          onChange={setCalendarDate}
          className="fullscreen-calendar"
          tileContent={tileContent}
        />
      </div>

      {showEventsPopup && currentViewDate && (
        <div className="events-popup-overlay">
          <div className="events-popup">
            <h2>Events on {currentViewDate.toDateString()}</h2>
            <button 
              className="close-popup" 
              onClick={closeAllPopups}
            >
              ×
            </button>
            
            <div className="events-list">
              {eventsForSelectedDate.length === 0 ? (
                <p>No events scheduled for this day</p>
              ) : (
                eventsForSelectedDate.map((event) => (
                  <DisplayEvent 
                    key={event._id} 
                    event={event} 
                    onDelete={deleteEvent}
                    onEventUpdated={() => {
                      const updatedEventsForSelectedDate = events.filter(event => {
                        const eventDateStr = new Date(event.date).toISOString().split("T")[0];
                        return eventDateStr === currentViewDate.toISOString().split("T")[0];
                      });
                      setEventsForSelectedDate(updatedEventsForSelectedDate);
                    }}
                  />
                ))
              )}
            </div>
            
            <div className="popup-actions">
              <button 
                className="add-event-btn"
                onClick={handleAddNewEvent}
              >
                Add New Event
              </button>
            </div>
          </div>
        </div>
      )}

      {showForm && currentViewDate && (
        <div className="form-popup-overlay">
          <EventForm
            selectedDate={currentViewDate}
            onClose={() => {
              setShowForm(false);
              setShowEventsPopup(true);
              handleDateClick(currentViewDate);
            }}
            onSuccess={(newEvent) => {
              setEvents((prevEvents) => {
                const updatedEvents = [...prevEvents, newEvent];
                setEventsForSelectedDate(updatedEvents.filter(event => {
                  const eventDateStr = new Date(event.date).toISOString().split("T")[0];
                  return eventDateStr === currentViewDate.toISOString().split("T")[0];
                }));
                return updatedEvents;
              });
              setShowForm(false);
            }}
          />
        </div>
      )}
    </div>
  );
};

export default Home;