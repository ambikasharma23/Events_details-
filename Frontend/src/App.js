import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import EventDetails from './components/event-deatils'; // Import your EventDetails component


const App = () => {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/events/:eventId" element={<EventDetails />} />
        {/* Define other routes as needed */}
        {/* For example:
        <Route path="/other" element={<OtherComponent />} />
        */}
      </Routes>
    </Router>
  );
};

export default App;
