import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useHistory hook
import EventCard from './cards'; // Import EventCard component
import '../css/listing.css'; // Import CSS file for styling

const EventListingPage = () => {
  const [events, setEvents] = useState([]); // Initialize events state as an empty array
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const navigate = useNavigate(); // Initialize history object using useNavigate hook

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const eventsResponse = await fetch('http://localhost:3001/events');
        const ticketsResponse = await fetch('http://localhost:3001/tickets/all');
        
        if (!eventsResponse.ok || !ticketsResponse.ok) {
          throw new Error('Failed to fetch events or tickets');
        }
        
        const eventData = await eventsResponse.json();
        const ticketData = await ticketsResponse.json();
        
        // Combine events and tickets based on event IDs
        const combinedData = eventData.map(event => {
          const eventTickets = ticketData.filter(ticket => ticket.event_id === event.id);
          const minTicketPrice = Math.min(...eventTickets.map(ticket => ticket.price));
          return { ...event, minTicketPrice };
        });
        
        setEvents(combinedData);
        setIsLoading(false);
      } catch (error) {
        setError(error.message);
        setIsLoading(false);
      }
    };
  
    fetchEvents();
  }, []);
  
  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  
    // Navigate to the new URL
    navigate(`/events?event_category=${category}`)
      // After navigation, fetch data from the backend based on the selected category
      fetchEventData(category);

    
  };
  
  const fetchEventData = async (category) => {
    try {
      const response = await fetch(`http://localhost:3001/events?event_category=${category}`);
      if (!response.ok) {
        throw new Error('Failed to fetch events');
      }
      const eventData = await response.json();
      setEvents(eventData);
      setIsLoading(false);
    } catch (error) {
      setError(error.message);
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div>Loading events...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  // Filter events based on selected category
  const filteredEvents = selectedCategory
    ? events.filter((event) => event.category === selectedCategory)
    : events;

  return (
    <div className="event-listing-container" style={{ backgroundColor: 'black' }}>
      
      <div style={{ position: 'relative', textAlign: 'center' }}>
        <img
          src="https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExdzhuZmFnODdwcDdkYWFndTFtNm5xdnl0YndlOXZnMXFvb3Y3NmlxeCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/xTiTniuHdUjpOlNo1q/giphy.gif"
          alt="Loading GIF"
        />
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            color: 'white',
            fontSize: '24px',
            textAlign: 'center',
          }}
        >
          <div style={{ fontFamily: 'brittany', fontStyle: 'italic' }}>Get ready for</div>
          <div style={{ fontWeight: 'bold', fontSize: '36px', lineHeight: '1.5', textShadow: '2px 2px pink', textDecoration: 'underline' }}>
            Holi
          </div>
          <div style={{ fontSize: '16px' }}>celebrate with EazyDiner</div>
        </div>
      </div>
      <input type="text" placeholder="  Search events..." />
      <div style={{ textAlign: 'center', marginTop: '10px' }}>
        <p style={{ fontWeight: 'bold', color: 'grey' }}>WHAT ARE YOU LOOKING FOR</p>
      </div>
      {/* Category images */}
      <div className="category-images">
        {/* Holi Image */}
        <div style={{ display: 'inline-block', height: '200px', width: '150px', overflow: 'hidden' }}>
          <img
            src="https://i.pinimg.com/originals/22/8d/d2/228dd2b75e24386f01df8ab25a5df452.jpg"
            alt="Holi"
            onClick={() => handleCategoryClick('holi')}
            style={{ height: '100%', width: 'auto', marginTop: '-1px' }}
          />
        </div>

        {/* Music Image */}
        <div style={{ display: 'inline-block', height: '200px', width: '150px', overflow: 'hidden' }}>
          <img
            src="https://thumbs.dreamstime.com/b/live-music-background-25110450.jpg"
            alt="music"
            onClick={() => handleCategoryClick('music')}
            style={{ height: '100%', width: 'auto', marginTop: '-1px' }}
          />
        </div>

        {/* Art Image */}
        <div style={{ display: 'inline-block', height: '200px', width: '150px', overflow: 'hidden' }}>
          <img
            src="https://www.shutterstock.com/image-photo/woman-hands-working-on-pottery-260nw-1377692564.jpg"
            alt="art"
            onClick={() => handleCategoryClick('art')}
            style={{
 height: '100%', width: 'auto' }} />
    </div>

    {/* Comedy Image */}
    <div style={{ display: 'inline-block', height: '200px', width: '150px' }}>
      <img src="https://img.freepik.com/free-vector/stand-up-comedy-banner-with-red-curtain-background_1308-77625.jpg" alt="comedy" onClick={() => handleCategoryClick('comedy')} style={{ height: '100%', width: 'auto' }} />
    </div>
  </div>


      <div className="event-list">
        {filteredEvents.map(event => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </div>
  );
};

export default EventListingPage;
