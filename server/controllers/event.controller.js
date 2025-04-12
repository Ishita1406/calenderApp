import Event from "../models/event.model.js";

export const createEvent = async (req, res) => {
    try {
        const { title, date, time, description } = req.body;
        const mediaUrl = req.file?.path || "";
    
        const newEvent = new Event({ title, date, time, description, mediaUrl });
        await newEvent.save();
    
        res.status(201).json({ message: "Event created successfully", event: newEvent });
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error creating event" });
      }
}