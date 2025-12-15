import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

export default function PersonDetail() {
  const { id } = useParams();
  const [person, setPerson] = useState(null);
  const [credits, setCredits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const appToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IjIzXzMxIiwicm9sZSI6InVzZXIiLCJhcGlfYWNjZXNzIjp0cnVlLCJpYXQiOjE3NjUzNjE3NjgsImV4cCI6MTc3MDU0NTc2OH0.O4I48nov3NLaKDSBhrPe9rKZtNs9q2Tkv4yK0uMthoo";

  useEffect(() => {
    const fetchPerson = async () => {
      try {
        const res = await fetch(`/api/api/persons/${id}`, {
          headers: {
            'Content-Type': 'application/json',
            'x-app-token': appToken
          }
        });

        if (!res.ok) throw new Error('Not found');

        const result = await res.json();
        const personData = result.data || result;

        setPerson(personData);
        setCredits(personData.known_for || []);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    if (id) fetchPerson();
  }, [id]);

  const getImage = (path) => {
    if (!path || path === 'string')
      return 'https://placehold.co/300x450?text=No+Image';

    if (path.startsWith('http')) return path;

    return `https://image.tmdb.org/t/p/original${path.startsWith('/') ? '' : '/'}${path}`;
  };

  if (loading) {
    return <div style={{ padding: 40, textAlign: 'center' }}>Loading...</div>;
  }

  if (error || !person) {
    return (
      <div style={{ padding: 40, textAlign: 'center' }}>
        <h2>Person not found</h2>
        <Link to="/">Back to Home</Link>
      </div>
    );
  }

  
}
