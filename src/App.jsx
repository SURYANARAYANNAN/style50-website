    import React, { useState } from 'react';

    // Main App component for the Style50 Inspired web application
    const App = () => {
      // State to hold the user's input code
      const [code, setCode] = useState('');
      // State to hold the style feedback received from the AI model
      const [feedback, setFeedback] = useState('');
      // State to manage the loading status during API calls
      const [isLoading, setIsLoading] = useState(false);
      // State to hold any error messages
      const [error, setError] = useState('');
      // State to manage the visibility of the instruction modal
      const [showInstructions, setShowInstructions] = useState(false);


      // Handles changes in the code input textarea
      const handleCodeChange = (event) => {
        setCode(event.target.value);
        setFeedback(''); // Clear previous feedback when code is modified
        setError('');     // Clear any previous errors
      };

      // Function to fetch style feedback from the Gemini AI model
      const getStyleFeedback = async () => {
        // Basic validation: Check if the code input is empty
        if (!code.trim()) {
          setError('Please enter some code to get style feedback.');
          return;
        }

        setIsLoading(true); // Set loading state to true
        setFeedback('');    // Clear previous feedback
        setError('');       // Clear previous errors

        try {
          // Prepare the chat history for the AI model
          let chatHistory = [];
          chatHistory.push({
            role: "user",
            parts: [{ text: `Critique the style of the following code. Focus on readability, consistency, formatting, and common best practices for C or Python. Provide specific, actionable suggestions for improvement.
              \n\nCode:\n\`\`\`\n${code}\n\`\`\`` }]
          });

          // Construct the payload for the Gemini API request
          const payload = { contents: chatHistory };
          // IMPORTANT: Replace "YOUR_GEMINI_API_KEY_HERE" with your actual API key from Google AI Studio.
          // This key is required when running the app locally.
          const apiKey = import.meta.env.VITE_GEMINI_API_KEY; // Access the key from environment variables
          const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

          // Make the API call to Gemini
          const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });

          // Check if the API response was successful
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error?.message || 'Failed to fetch style feedback. Please try again.');
          }

          // Parse the JSON response from the API
          const result = await response.json();

          // Extract the text feedback from the AI response
          if (result.candidates && result.candidates.length > 0 &&
              result.candidates[0].content && result.candidates[0].content.parts &&
              result.candidates[0].content.parts.length > 0) {
            const text = result.candidates[0].content.parts[0].text;
            setFeedback(text); // Set the feedback state
          } else {
            setFeedback('No feedback received. The AI model might not have generated a response.');
          }
        } catch (err) {
          // Catch and display any errors during the API call
          console.error('Error fetching style feedback:', err);
          setError(`Error: ${err.message}. Please check your input or try again.`);
        } finally {
          setIsLoading(false); // Reset loading state
        }
      };

      return (
        <div className="min-h-screen-wrapper">
          {/* Abstract background shapes for visual interest */}
          <div className="absolute-blob blob-blue animate-blob"></div>
          <div className="absolute-blob blob-purple animate-blob animation-delay-2000"></div>
          <div className="absolute-blob blob-pink animate-blob animation-delay-4000"></div>

          <div className="app-container">
            {/* Header Section */}
            <div className="header-section">
              <h1 className="header-title">
                <span className="text-blue">Style</span>
                <span className="text-purple">50</span> <span className="text-gray">Inspired</span>
              </h1>
              <button
                onClick={() => setShowInstructions(true)}
                className="info-button"
                aria-label="Show Instructions"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
            </div>

            {/* Code Input Section */}
            <div className="code-input-section">
              <label htmlFor="code-input" className="code-input-label">
                Paste your C or Python code here:
              </label>
              <textarea
                id="code-input"
                className="code-textarea"
                value={code}
                onChange={handleCodeChange}
                placeholder={`// Example C Code:\n#include <stdio.h>\n\nint main(void)\n{\n    printf("hello, world\\n");\n    int    x=10;\n    if(x > 5) { // Unformatted line\n        printf("x is greater than 5\\n");\n    }\n    return    0;\n}\n\n// Example Python Code:\ndef my_function(  arg1, arg2):\n    if arg1 > 10 and arg2 < 5 :\n        print('This is a very long line that will definitely exceed the 79 character limit if not formatted by Black.')\n    \n    return arg1 + arg2\n`}
                rows="10"
              ></textarea>
            </div>

            {/* Action Button */}
            <button
              onClick={getStyleFeedback}
              className="action-button"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="loading-spinner-container">
                  <svg className="spinner" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Analyzing Style...
                </div>
              ) : (
                'Get Style Feedback'
              )}
            </button>

            {/* Error Message Display */}
            {error && (
              <div className="error-message">
                <p className="error-message-title">Error:</p>
                <p>{error}</p>
              </div>
            )}

            {/* Feedback Display Area */}
            {feedback && (
              <div className="feedback-area">
                <h2 className="feedback-title">Style Feedback:</h2>
                <div className="feedback-content">
                  {feedback}
                </div>
              </div>
            )}

            {/* Instructions Modal */}
            {showInstructions && (
              <div className="modal-overlay">
                <div className="modal-content">
                  <h2 className="modal-title">How to Use</h2>
                  <p className="modal-text">
                    This tool provides AI-powered style feedback for your C and Python code, inspired by CS50's `style50`.
                  </p>
                  <ul className="modal-list">
                    <li>Paste your C or Python code into the text area.</li>
                    <li>Click the "Get Style Feedback" button.</li>
                    <li>The AI will analyze your code for readability, consistency, formatting, and common best practices.</li>
                    <li>You'll receive specific suggestions for improvement in the feedback area below.</li>
                  </ul>
                  <button
                    onClick={() => setShowInstructions(false)}
                    className="modal-got-it-button"
                  >
                    Got It!
                  </button>
                  <button
                    onClick={() => setShowInstructions(false)}
                    className="modal-close-button"
                    aria-label="Close Instructions"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      );
    };

    export default App;
    