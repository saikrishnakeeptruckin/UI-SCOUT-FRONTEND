// src/App.js

import React from 'react';
import { AppProvider } from './context/AppContext';
import ImageUploader from './components/ImageUploader';
import ImageList from './components/ImageList';
import ResultsDisplay from './components/ResultsDisplay';
import './App.css';

function App() {
  return (
    <AppProvider>
      <div className="App">
        <header className="App-header">
          <h1>UI Scout AI</h1>
          <p>Find similar UI components using AI analysis.</p>
        </header>

        <main>
          <ImageList />
          <ImageUploader />
          <ResultsDisplay />
        </main>

      </div>
    </AppProvider>
  );
}

export default App;