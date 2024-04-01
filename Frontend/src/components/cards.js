// EventCard.js
import React from 'react';
import { Link } from 'react-router-dom';
import '../css/cards.css';

const formatDate = (dateString) => {
  const options = { day: 'numeric', month: 'long' };
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.toLocaleDateString('en-US', { month: 'long' });
  return `${day} ${month}`;
};

const EventCard = ({ event }) => {
  return (
    <div className="event-card">
      <img src={event.event_image} alt={event.event_name} className="event-image" />
      <div className="event-details">
        <h2>{event.event_name}</h2>
        <p>{formatDate(event.event_date)}</p>
        <Link to={`/events/${event.id}`}>
          <button className="book-now-button">Book Now</button>
        </Link>
      </div>
    </div>
  );
};

export default EventCard;
