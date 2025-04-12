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