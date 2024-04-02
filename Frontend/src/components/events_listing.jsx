import React, { useState, useEffect } from 'react';
import { useNavigate,Link } from 'react-router-dom'; // Import useHistory hook
import EventCard from './cards'; // Import EventCard component
import '../css/listing.css'; // Import CSS file for styling

const EventListingPage = () => {
  const [events, setEvents] = useState([]); // Initialize events state as an empty array
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate(); // Initialize history object using useNavigate hook
  const [sortDropdownVisible, setSortDropdownVisible] = useState(false);
  const [sortOption, setSortOption] = useState('');

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
    navigate('./category');
  
    

    
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:3001/events?search=${searchQuery}`);
      if (!response.ok) {
        throw new Error('Failed to fetch events');
      }
      const eventData = await response.json();
      setEvents(eventData);
    } catch (error) {
      setError(error.message);
    }
  };
  
  
  // const fetchEventData = async (category) => {
  //   try {
  //     const response = await fetch(`http://localhost:3001/events?event_category=${category}`);
  //     if (!response.ok) {
  //       throw new Error('Failed to fetch events');
  //     }
  //     const eventData = await response.json();
  //     setEvents(eventData);
  //     setIsLoading(false);
  //   } catch (error) {
  //     setError(error.message);
  //     setIsLoading(false);
  //   }
  // };

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

    const toggleSortDropdown = () => {
      setSortDropdownVisible(!sortDropdownVisible);
      if (!sortDropdownVisible) {
        // Delay the calculation to ensure the dropdown is rendered
        setTimeout(() => {
          const button = document.querySelector('.sort-button');
          if (button) {
            const rect = button.getBoundingClientRect();
            const dropdownHeight = document.querySelector('.sort-dropdown').offsetHeight;
            const bottomOffset = window.innerHeight - rect.bottom;
            if (bottomOffset < dropdownHeight) {
              window.scrollBy({ top: dropdownHeight - bottomOffset, behavior: 'smooth' });
            }
          }
        }, 100); // Adjust the delay time as needed
      }
    };

    
  
    // Function to handle sort option selection
    const handleSortOptionSelect = (option) => {
      setSortOption(option);
      applySorting(option); // Apply sorting based on the selected option
      toggleSortDropdown(); // Close sort dropdown after selection
    };
  
    // Sort options for the dropdown
    const sortOptions = [
      { label: 'Popularity', value: 'popularity' },
      { label: 'Cost: Low to High', value: 'costLowToHigh' },
      { label: 'Cost: High to Low', value: 'costHighToLow' },
      { label: 'Distance: Low to High', value: 'distanceLowToHigh' },
      { label: 'Date', value: 'date' },
    ];
  
    // Function to apply sorting based on the selected option
   
   const applySorting = (option) => {
    switch (option) {
      case 'date':
        // Sort events based on the event date in ascending order
        const sortedEventsByDate = [...events].sort((a, b) => new Date(a.event_date) - new Date(b.event_date));
        setEvents(sortedEventsByDate);
        break;
      default:
        // Handle other sorting options if needed
        break;
    }
  };
  


  return (
    <div className="event-listing-container" style={{ backgroundColor: 'black' }}>
      
      <div style={{ position: 'relative', textAlign: 'center' }}>
        <img
          src="https://media4.giphy.com/media/4nMRkLtGQjq5W/giphy.gif"
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
            LIVE EVENTS
          </div>
          <div style={{ fontSize: '16px' }}>celebrate with EazyDiner</div>
        </div>
      </div>
      <form onSubmit={handleSearch}>
      <input
  type="text"
  placeholder="  Search events..."
  value={searchQuery}
  onChange={(e) => setSearchQuery(e.target.value)}
  onKeyPress={(e) => {
    if (e.key === 'Enter') {
      handleSearch(e);
    }
  }}
/>
    </form>

      <div style={{ textAlign: 'center', marginTop: '10px' }}>
        <p style={{ fontWeight: 'bold', color: 'grey' }}>WHAT ARE YOU LOOKING FOR</p>
      </div>
      {/* Category images */}

      {searchQuery === '' && (
  <>
      <div className="category-images">
        {/* Holi Image */}
        
        <div style={{ position: 'relative', display: 'inline-block', height: '200px', width: '150px', overflow: 'hidden' }}>
 
  <img
    src="https://i.pinimg.com/736x/a9/c4/d7/a9c4d70ea8b9c60f1a2d6a8ed2665077.jpg"
    alt="Holi"
    onClick={() => handleCategoryClick('holi')}
    style={{ height: '100%', width: 'auto' }}
  />
  <div style={{ position: 'absolute', top: 0, left: 0, fontFamily: "Misti's Fonts", fontSize: '18px', color: 'white', padding: '5px' }}>
    Holi
  </div>
  
</div>


        {/* Music Image */}
        <div style={{ position: 'relative', display: 'inline-block', height: '200px', width: '150px', overflow: 'hidden' }}>
  <img
    src="https://i.pinimg.com/originals/3a/f9/15/3af9153275f9ed5747718598c870904f.jpg"
    alt="music"
    onClick={() => handleCategoryClick('music')}
    style={{ height: '100%', width: 'auto' }}
  />
  <div style={{ position: 'absolute', top: 0, left: 0, fontFamily: "Misti's Fonts", fontSize: '18px', color: 'white', padding: '5px' }}>
    Music
  </div>
</div>


        {/* Art Image */}
        <div style={{ position: 'relative', display: 'inline-block', height: '200px', width: '150px', overflow: 'hidden' }}>
  <img
    src="https://media.architecturaldigest.com/photos/5aff319a55eb56087f0434ac/master/pass/pottery-making.jpg"
    alt="art"
    onClick={() => handleCategoryClick('art')}
    style={{ height: '100%', width: 'auto' }}
  />
  <div style={{ position: 'absolute', top: 0, left: 0, fontFamily: "Misti's Fonts", fontSize: '18px', color: 'white', padding: '5px' }}>
    Art
  </div>
</div>


    {/* Comedy Image */}
    <div style={{ position: 'relative', display: 'inline-block', height: '200px', width: '150px' }}>
  <img src="https://i.pinimg.com/originals/cb/15/4a/cb154a010fbce745a44537e1de4df662.jpg" alt="comedy" onClick={() => handleCategoryClick('comedy')} style={{ height: '100%', width: 'auto' }} />
  <div style={{ position: 'absolute', top: 0, left: 0, fontFamily: "Misti's Fonts", fontSize: '18px', color: 'white', padding: '5px' }}>
    Comedy
  </div>
</div>
</div>

{/* Best in Comedy Container */}
{/* <div style={{ textAlign: 'center', marginTop: '30px' }}>
  <p style={{ fontWeight: 'bold', color: 'grey' }}>BEST IN COMEDY</p>
  <div className="comedy-events">
   
    {filteredEvents.filter(event => event.event_category === 'comedy').map(event => (
      <EventCard key={event.id} event={event} />
    ))}
  </div>
</div> */}




 {/* Explore All Events */}
 <div style={{ textAlign: 'center', marginTop: '10px', clear: 'both' }}>
    <p style={{ fontWeight: 'bold', color: 'grey' }}>EXPLORE ALL EVENTS</p>
    </div>

  {/* Sort Button */}   
    <div style={{ display: 'flex', justifyContent: 'left', gap: '10px', overflowX: 'auto', padding: '10px 0' }}>
    <button className="sort-button" onClick={toggleSortDropdown} style={{ background: '#2c2b2b', color: 'white', borderRadius: '20px', padding: '10px 20px', marginLeft: '20px', position: 'relative' }}>
  {sortOption || 'Sort'}
  {sortOption && (
    <span style={{ position: 'absolute', right: '5px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer' }} onClick={() => setSortOption('')}>
      &#10006;
    </span>
  )}
</button>
          
{sortDropdownVisible && (
  <div className="sort-dropdown">
    {sortOptions.map((option) => (
      <label key={option.value}>
        <input
          type="radio"
          name="sortOption"
          value={option.value}
          onChange={() => handleSortOptionSelect(option.label)}
          checked={sortOption === option.label}
        />
        {option.label}
      </label>
    ))}
  </div>
)}


    <button className="sort-button" style={{ background: '#2c2b2b', color: 'white', borderRadius: '20px', padding: '10px 20px' }}>Under 10km</button>
    <button className="sort-button" style={{ background: '#2c2b2b', color: 'white', borderRadius: '20px', padding: '10px 20px' }}>Bestseller</button>
    <button className="sort-button" style={{ background: '#2c2b2b', color: 'white' , borderRadius: '20px', padding: '10px 20px'}}>DJ</button>
    <button className="sort-button" style={{ background: '#2c2b2b', color: 'white' , borderRadius: '20px', padding: '10px 20px'}}>Live Music</button>
    <button className="sort-button" style={{ background: '#2c2b2b', color: 'white' , borderRadius: '20px', padding: '10px 20px'}}>Trending</button>
    <button className="sort-button" style={{ background: '#2c2b2b', color: 'white', borderRadius: '20px', padding: '10px 20px' }}>Comedy</button>
    <button className="sort-button" style={{ background: '#2c2b2b', color: 'white', borderRadius: '20px', padding: '10px 20px' }}>Party</button>
  </div>
  </>)}

   
      <div className="event-list">
        {filteredEvents.map(event => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>

      <div style={{ textAlign: 'left', marginTop: '30px' }}>
  <p style={{ fontWeight: 'bold', color: 'white', fontSize: '28px', fontFamily: 'sans-serif' }}>Eazydiner</p>
</div>
    </div>

    
  );
};

export default EventListingPage;
