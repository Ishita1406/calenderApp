import { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import EventForm from "../components/EventForm";
import "../styles/Home.css";

export default function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const handleDateClick = (date) => {
    setSelectedDate(date);
    setShowForm(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-6 text-indigo-600">My Calendar</h1>

      <div className="bg-white rounded-2xl shadow-lg p-4 w-full max-w-4xl">
        <Calendar
          onClickDay={handleDateClick}
          className="w-full border-none calendar-custom"
        />
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <EventForm
            selectedDate={selectedDate}
            onClose={() => setShowForm(false)}
          />
        </div>
      )}
    </div>
  );
}
