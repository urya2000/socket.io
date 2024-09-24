import React, { useState } from 'react';
import Chat from './Chat';

function App() {
  const [currentUser, setCurrentUser] = useState('admin'); // Admin user

  return (
    <div>
      <h1>Admin Chat</h1>
      <Chat currentUser={currentUser} />
    </div>
  );
}

export default App;
