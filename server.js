import express from "express";
import cors from "cors";
import fs from "fs";

const app = express();
const PORT = 3000;
const DATA_FILE = "bookings.json";

app.use(cors());
app.use(express.json());

// Load bookings from file
function loadBookings() {
  try {
    const data = fs.readFileSync(DATA_FILE, "utf8");
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
}

// Save bookings to file
function saveBookings(bookings) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(bookings, null, 2));
}

// GET all bookings
app.get("/bookings", (req, res) => {
  const bookings = loadBookings();
  res.json(bookings);
});

// POST new booking
app.post("/bookings", (req, res) => {
  const bookings = loadBookings();
  const newBooking = {
    id: bookings.length > 0 ? bookings[bookings.length - 1].id + 1 : 1,
    ...req.body,
  };
  bookings.push(newBooking);
  saveBookings(bookings);
  res.status(201).json(newBooking);
});

// PUT update booking by ID
app.put("/bookings/:id", (req, res) => {
  const bookings = loadBookings();
  const id = parseInt(req.params.id);
  const index = bookings.findIndex((b) => b.id === id);

  if (index !== -1) {
    bookings[index] = { ...bookings[index], ...req.body };
    saveBookings(bookings);
    res.json(bookings[index]);
  } else {
    res.status(404).json({ error: "Booking not found" });
  }
});

// DELETE booking by ID
app.delete("/bookings/:id", (req, res) => {
  let bookings = loadBookings();
  const id = parseInt(req.params.id);
  bookings = bookings.filter((b) => b.id !== id);
  saveBookings(bookings);
  res.status(204).end();
});

// Start server
app.listen(PORT, () => {
  console.log(`API running at http://localhost:${PORT}`);
});
