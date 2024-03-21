import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { faCalendarAlt, faClock, faMapMarkerAlt, faShareAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Chatbot from './chatbot';
import '../css/events.css';

const EventDetails = () => {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [shareText, setShareText] = useState(''); 
  const navigate = useNavigate();

  const formatDate = (dateString) => {
    const options = { day: 'numeric', month: 'long' };
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', options);
  };

  const handleShare = () => {
    const eventUrl = new URL(window.location.href);
    const shareText = 'Check out this event!'; 

    // Append custom text to the URL
    eventUrl.searchParams.append('text', shareText);

    if (navigator.share) {
      // Share the URL with the custom text
      navigator.share({
        title: 'Check out this event!',
        url: eventUrl.toString()
      })
      .then(() => console.log('Shared successfully'))
      .catch((error) => console.error('Error sharing:', error));
    } else {
      // Fallback for browsers that don't support Web Share API
      alert(`Share this event: ${eventUrl.toString()}`);
    }
  };

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const eventResponse = await fetch(`http://localhost:3001/events/${eventId}`);
        if (!eventResponse.ok) {
          throw new Error(`Failed to fetch event details: ${eventResponse.statusText}`);
        }
        const eventData = await eventResponse.json();
        setEvent(eventData);

        const ticketResponse = await fetch(`http://localhost:3001/tickets?event_id=${eventId}`);
        if (!ticketResponse.ok) {
          throw new Error(`Failed to fetch tickets: ${ticketResponse.statusText}`);
        }
        const ticketData = await ticketResponse.json();
        setTickets(ticketData);

        setIsLoading(false);
      } catch (error) {
        setError(error.message);
        setIsLoading(false);
      }
    };

    // Extract the shared text from the URL query parameters
    const urlParams = new URLSearchParams(window.location.search);
    const sharedText = urlParams.get('text');
    if (sharedText) {
      setShareText(sharedText);
    }

    fetchEventDetails();
  }, [eventId]);

  if (isLoading) {
    return <div>Loading event details...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="event-details-container">
      <div className="event-image">
        <div className="share-option" onClick={handleShare}>
          <FontAwesomeIcon icon={faShareAlt} />
        </div>
        <img src={event.event_image} alt={event.event_name} />
        <h2>{event.event_name}</h2>
        {tickets.length > 0 && (
          <div className="ticket">
            <div className="ticket-price grey-box">
              <h4>${tickets.reduce((min, ticket) => (ticket.ticket_price < min ? ticket.ticket_price : min), tickets[0].ticket_price)}</h4>
              <p>onwards</p> {/* Display a label for clarity */}
            </div>
          </div>
        )}
        <p><FontAwesomeIcon icon={faCalendarAlt} /> {formatDate(event.event_date)}</p>
        <p><FontAwesomeIcon icon={faClock} /> {event.event_time}</p>
        <p><FontAwesomeIcon icon={faMapMarkerAlt} /> {event.event_city}</p>
      </div>

      <div className="event-description">
        <h3>ABOUT THIS EVENT</h3>
        <div className="description-border">
          <p>{event.event_description}</p>
        </div>
      </div>

      <div className="event-tickets">
        <h3>TICKETS AND INCLUSIONS</h3>
        <div className="tickets-container">
          {tickets.map(ticket => (
            <div key={ticket.id} className="ticket">
              <div className="ticket-info">
                <h4>{ticket.ticket_name}</h4>
                <p>{ticket.ticket_information}</p>
              </div>
              <div className="ticket-price">
                <h4>${ticket.ticket_price}</h4>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Display the shared text */}
      {shareText && (
        <div>
          <p>Shared Text: {shareText}</p>
        </div>
      )}

      {/* Book Tickets Button */}
      <div className="book-tickets-button">
        <button>Book Tickets</button>
      </div>
    </div>
    
  );
};

export default EventDetails;
