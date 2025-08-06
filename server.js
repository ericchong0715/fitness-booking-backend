const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000; // Allow dynamic port for Render

// Middleware
app.use(cors());
app.use(express.json());

// In-memory booking storage
let bookings = [];
let currentId = 1;

// Get all bookings
app.get("/bookings", (req, res) => {
  res.json(bookings);
});

// Add new booking
app.post("/bookings", (req, res) => {
  const newBooking = { id: currentId++, ...req.body };
  bookings.push(newBooking);
  res.status(201).json(newBooking);
});

// Update booking
app.put("/bookings/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = bookings.findIndex((b) => b.id === id);

  if (index !== -1) {
    bookings[index] = { ...bookings[index], ...req.body };
    res.json(bookings[index]);
  } else {
    res.status(404).json({ error: "Booking not found" });
  }
});

// Delete booking
app.delete("/bookings/:id", (req, res) => {
  const id = parseInt(req.params.id);
  bookings = bookings.filter((b) => b.id !== id);
  res.status(204).end();
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
