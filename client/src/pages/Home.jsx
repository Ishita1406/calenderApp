import { useEffect, useRef, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import EventForm from "../components/EventForm";
import "../styles/Home.css";
import axiosInstance from "../utils/axiosInstance";
import DisplayEvent from "../components/DisplayEvent";
import Header from "../components/Header";
import { useNavigate } from "react-router-dom";
import { set } from "mongoose";

const Home = () => {
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [currentViewDate, setCurrentViewDate] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showEventsPopup, setShowEventsPopup] = useState(false);
  const [eventsForSelectedDate, setEventsForSelectedDate] = useState([]);
  const [isEditing, setIsEditing] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const navigate = useNavigate();

  const getEventDateTime = (eventDate, eventTime) => {
    const [year, month, day] = eventDate.split("-").map(Number); 
    const [hour, minute] = eventTime.split(":").map(Number);
  
    const eventDateTime = new Date(year, month - 1, day, hour, minute, 0);
  
    console.log("Parsed Date:", eventDateTime);
  
    if (isNaN(eventDateTime.getTime())) {
      console.error("Invalid event date-time with values:", { year, month, day, hour, minute });
      return null;
    }
  
    return eventDateTime;
  };
  
  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/server/event/get");
      
      if (response.data && response.data.events && Array.isArray(response.data.events)) {
        const eventsWithCorrectDateTime = response.data.events.map(event => {
          return {
            ...event,
            dateTime: getEventDateTime(event.date, event.time) 
          };
        });
        setEvents(eventsWithCorrectDateTime);
  
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

  const getUserInfo = async () => {
    const storedUserInfo = localStorage.getItem('userInfo');
    const accessToken = localStorage.getItem('access_token');
    
    if (storedUserInfo) {
      setUserInfo(JSON.parse(storedUserInfo));
      return;
    }

    if (!accessToken) {
      navigate('/login');
      return;
    }
    try {
      const response = await axiosInstance.get('server/auth/get');
      if (response.data && response.data.user) {
        setUserInfo(response.data.user);
        localStorage.setItem('userInfo', JSON.stringify(response.data.user));
      }
    } catch (error) {
      if (error.response.status === 401) {
        localStorage.clear();
        navigate('/login');
      }
    }
  };

  useEffect(() => {
    fetchEvents();
    if (Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    if (events.length > 0) {
      const now = new Date();
      const timeouts = []; 
  
      events.forEach((event) => {
        const eventDateTime = new Date(event.dateTime);
        const timeToEvent = eventDateTime - now;

        // console.log('timeToEvent:', timeToEvent);
  
        if (timeToEvent > 0) {
          const timeoutId = setTimeout(() => {
            showNotification(event);
          }, timeToEvent);
          timeouts.push(timeoutId); 
        }
      });
  
      return () => {
        timeouts.forEach((timeoutId) => clearTimeout(timeoutId));
      };
    }
  }, [events]); 

  useEffect(() => {
    getUserInfo();
    return () => {}
  }, []);
  
  const showNotification = (event) => {
  if (Notification.permission === "granted") {

    const notification = new Notification("Event Reminder", {
      body: `${event.title} at ${new Date(event.dateTime).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
      })}\nClick to snooze for 5 minutes`,
      requireInteraction: true
    });

    notification.onclick = () => {

      setTimeout(() => {
        showNotification({
          ...event,
          title: `Snoozed: ${event.title}`
        });
      }, 5 * 60 * 1000);
      notification.close(); 
    };

    notification.onclose = () => {
      console.log("Notification dismissed");
    };
  }
};


  const handleDateClick = (date) => {
    setCurrentViewDate(date);
    const selectedDateStr = date.toLocaleDateString('en-CA');
    const eventsOnDate = events.filter(event => {
      const eventDateStr = new Date(event.date).toLocaleDateString('en-CA');
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
      const tileDateStr = date.toLocaleDateString('en-CA');
      const hasEvent = events.some(event => {
        const eventDateStr = new Date(event.date).toLocaleDateString('en-CA');
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
      await axiosInstance.delete(
        `/server/event/delete/${eventId}`
      );  
      const updatedEvents = events.filter((event) => event._id !== eventId);
      setEvents(updatedEvents);
      if (currentViewDate) {
        const selectedDateStr = currentViewDate.toLocaleDateString('en-CA');
        const updatedEventsForDate = updatedEvents.filter((event) => {
          const eventDateStr = new Date(event.date).toLocaleDateString('en-CA');
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

  const editEvent = (event) => {
    setIsEditing(event);
    setShowForm(true);
    setShowEventsPopup(false);
  }
  
  return (
    <>
    <Header userInfo={userInfo}/>
    <div className="calendar-fullscreen">


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
                    onEdit={() => editEvent(event)}
                    onSnooze={() => snoozeEvent(event._id)}
                    onEventUpdated={() => {
                      const updatedEventsForSelectedDate = events.filter(event => {
                        const eventDateStr = new Date(event.date).toLocaleDateString('en-CA');
                        return eventDateStr === currentViewDate.toLocaleDateString('en-CA');
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
            existingEvent={isEditing}
            onClose={() => {
              setShowForm(false);
              setIsEditing(null);
              setShowEventsPopup(true);
              handleDateClick(currentViewDate);
            }}
            onSuccess={(newEvent) => {
              setEvents((prevEvents) => {
                let updatedEvents;
                if (isEditing) {
                  updatedEvents = prevEvents.map((event) =>
                    event._id === newEvent._id ? newEvent : event
                  );
                } else {
                  updatedEvents = [...prevEvents, newEvent];
                  const eventDateTime = new Date(newEvent.dateTime);
                  const now = new Date();
                  const timeToEvent = eventDateTime - now;
            
                  if (timeToEvent > 0) {
                    setTimeout(() => {
                      showNotification(newEvent);
                    }, timeToEvent);
                  }
                }
                return updatedEvents;
              });
              setShowForm(false);
              setIsEditing(null);
              setShowEventsPopup(false);
            }}
          />
        </div>
      )}
    </div>
    </>
  );
};

export default Home;