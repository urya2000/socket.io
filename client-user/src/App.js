import React, { useState } from "react";
import Chat from "./Chat";

function App() {
  const [currentUser, setCurrentUser] = useState("user2") ;

  return (
    <div>
      <h1>User Chat</h1>
      <Chat currentUser={currentUser} />
    </div>
  );
}

export default App;
