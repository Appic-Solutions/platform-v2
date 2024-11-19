"use client";
import { useEffect, useState } from "react";

const PlaygroundPage = () => {
  const [userData, setUserData] = useState(null);

  const fetchUsers = async () => {
    const res = await fetch(`https://jsonplaceholder.typicode.com/users/10`, {
      cache: 'force-cache' // This will cache the response
    });
    const data = await res.json();
    setUserData(data);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div>
      <h1>PlaygroundPage</h1>
      {userData && (
        <pre>
          {JSON.stringify(userData, null, 2)}
        </pre>
      )}
    </div>
  );
};

export default PlaygroundPage;
