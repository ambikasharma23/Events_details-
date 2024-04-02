import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import Header from './components/Header';
import EventDetails from './components/event-deatils'; // Import your EventDetails component
import EventListing from './components/events_listing';
import EventCategoryPage from './components/category';

const App = () => {
  return (
    <Router>
      {/* <Header /> */}
      <Routes>
      <Route path="/events" element={<EventListing />} />
        <Route path="/events/:eventId" element={<EventDetails />} />
        <Route path="/events/:category" element={<EventCategoryPage />}/>
        {/* Define other routes as needed */}
        {/* For example:
        <Route path="/other" element={<OtherComponent />} />
        */}
        
      </Routes>
    </Router>
  );
};

export default App;
