const express = require('express');
const fs = require('fs');
const cors = require('cors');

const app = express();
const port = 3001;

// Enable CORS middleware
app.use(cors());

// Read JSON file
const jsonData = JSON.parse(fs.readFileSync('db.json', 'utf8'));

// Endpoint to get all events
// Endpoint to get all events
app.get('/events', (req, res) => {
  const { event_category, search } = req.query;

  let filteredEvents = jsonData.events;

  // Filter events based on the provided event_category parameter
  if (event_category !== undefined) {
    filteredEvents = filteredEvents.filter(event => event.event_category.includes(event_category));
  }

  // If search parameter is provided, further filter based on event_name and event_details
  if (search !== undefined) {
    const searchString = search.toLowerCase();
    filteredEvents = filteredEvents.filter(event =>
      (event.event_name && event.event_name.toLowerCase().includes(searchString)) ||
      (event.event_details && event.event_details.toLowerCase().includes(searchString))
    );
  }

  res.json(filteredEvents);
});




// Endpoint to get a specific event by ID
app.get('/events/:eventId', (req, res) => {
  const eventId = parseInt(req.params.eventId);
  const event = jsonData.events.find(event => event.id === eventId);
  
  if (event) {
    res.json(event);
  } else {
    res.status(404).json({ message: 'Event not found' });
  }
});

// Endpoint to get tickets associated with a specific event by ID

// Endpoint to get all tickets
app.get('/tickets/all', (req, res) => {
  res.json(jsonData.tickets);
});

app.get('/tickets', (req, res) => {
  const eventId = parseInt(req.query.event_id);
  const tickets = jsonData.tickets.filter(ticket => ticket.event_id === eventId);
  
  if (tickets.length > 0) {
    res.json(tickets);
  } else {
    res.status(404).json({ message: 'Tickets not found for the specified event' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
