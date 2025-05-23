import Event from "../models/event.model.js";

export const createEvent = async (req, res) => {
    try {
        const { title, date, time, description } = req.body;
        const user = req.user;
        if (!req.user) {
          return res.status(401).json({ message: "Unauthorized: User information is missing" });
      }
        const mediaUrl = req.file?.path || "";
    
        const newEvent = new Event({ title, date, time, description, mediaUrl, userId: user._id, });
        await newEvent.save();
    
        res.status(201).json({ message: "Event created successfully", event: newEvent });
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error creating event" });
      }
}

export const getAllEvents = async (req, res) => {
    const user = req.user;
    
    try {
      const events = await Event.find({ userId: user._id });
      return res.json({
        error: false,
        events,
        message: "Events fetched successfully",
      });
    } catch (error) {
      return res.status(500).json({
        error: true,
        message: "Server error",
    });
  }
}

export const deleteEvent = async (req, res) => {
  const eventId = req.params.id;
  const user = req.user;

  try {
    const event = await Event.findOne({ _id: eventId, userId: user._id });
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    await Event.deleteOne({ _id: eventId, userId: user._id });
    res.status(200).json({ message: "Event deleted successfully" });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Server error",
    });
  }
}

export const editEvent = async (req, res) => {
  const eventId = req.params.id;
  const user = req.user;
  const { title, date, time, description, mediaUrl } = req.body;

  try {
    const event = await Event.findOne({ _id: eventId, userId: user._id });
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    if (title) event.title = title;
    if (date) event.date = date;
    if (time) event.time = time;
    if (description) event.description = description;
    if (req.file?.path) {
      event.mediaUrl = req.file.path;
    }
    await event.save();
    return res.status(200).json({
      error: false,
      message: "Event updated successfully",
      event,
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Server error",
    });
  }
}