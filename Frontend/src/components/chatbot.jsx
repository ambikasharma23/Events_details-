import React, { useState } from 'react';
// import './Chatbot.css'; // Import CSS styles for the chatbot interface

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (inputValue.trim() !== '') {
      // Add the user message to the chat
      setMessages([...messages, { text: inputValue, user: 'user' }]);
      // Here you would implement logic to process the user input and generate a response
      // For this example, let's just echo the user input as the bot's response
      setMessages([...messages, { text: inputValue, user: 'bot' }]);
      // Clear the input field after submitting
      setInputValue('');
    }
  };

  return (
    <div className="chatbot">
      <div className="chatbot-container">
        <div className="chatbot-messages">
          {messages.map((message, index) => (
            <div key={index} className={`message ${message.user}`}>
              {message.text}
            </div>
          ))}
        </div>
        <form onSubmit={handleSubmit} className="chatbot-form">
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            placeholder="Type a message..."
            className="chatbot-input"
          />
          <button type="submit" className="chatbot-send-button">
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chatbot;
