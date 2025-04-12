import { useEffect, useState } from 'react';

function App() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('/api/message')
      .then(res => res.json())
      .then(data => setMessage(data.message));
  }, []);

  useEffect(() => {
    fetch('/api/ingredients')
      .then(res => res.json())
      .then(data => setMessage(JSON.stringify(data.ingredients)));
  }, []);

  return (
    <div style={{ padding: '2rem' }}>
      <h1>React + Express App</h1>
      <p>{message}</p>
    </div>
  );
}

export default App;
