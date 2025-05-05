// src/App.js - Changes shown with comments

import React from 'react';
import { AppProvider } from './context/AppContext';
import ImageUploader from './components/ImageUploader';
import ImageList from './components/ImageList'; // <<<--- 1. Import the new component
import AnalysisForm from './components/AnalysisForm';
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
          <ImageUploader />
          <ImageList /> {/* <<<--- 2. Add the ImageList component here */}
          <AnalysisForm />
          <ResultsDisplay />
        </main>

      </div>
    </AppProvider>
  );
}

export default App;