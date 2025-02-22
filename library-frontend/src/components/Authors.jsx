import { useState, useEffect } from 'react';

const Authors = () => {
  const [authors, setAuthors] = useState([]);

  useEffect(() => {
    fetch('http://localhost:4000/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `
          query {
            allAuthors {
              name
              born
              bookCount
            }
          }
        `
      })
    })
      .then((res) => res.json())
      .then((result) => {
        setAuthors(result.data.allAuthors);
      })
      .catch((error) => console.error(error));
  }, []);

  return (
    <div>
      <h2>authors</h2>
      {authors.length === 0 ? (
        <div>Loading...</div>
      ) : (
        <table>
          <tbody>
            <tr>
              <th>name</th>
              <th>born</th>
              <th>books</th>
            </tr>
            {authors.map((a) => (
              <tr key={a.name}>
                <td>{a.name}</td>
                <td>{a.born || 'N/A'}</td>
                <td>{a.bookCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Authors;
