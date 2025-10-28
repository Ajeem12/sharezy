// UserRides.jsx
import React from 'react';

const UserRides = ({ rides }) => {
  if (!rides?.length) return <p>No ride data available.</p>;

  return (
    <div style={{ marginTop: 20 }}>
      <h3>Rides for User</h3>
      <ul>
        {rides.map((ride, index) => (
          <li key={index} style={{ background: '#f1f5f9', padding: 10, marginBottom: 8, borderRadius: 6 }}>
            <strong>From:</strong> {ride.from} — <strong>To:</strong> {ride.to} | 
            <strong> Seats Booked:</strong> {ride.seats} | 
            <strong> Date:</strong> {ride.date}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserRides;
