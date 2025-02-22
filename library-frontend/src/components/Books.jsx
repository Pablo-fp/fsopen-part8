import { useState, useEffect } from 'react';

const Books = () => {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    fetch('http://localhost:4000/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `
          query {
            allBooks {
              title
              author
              published
            }
          }
        `
      })
    })
      .then((res) => res.json())
      .then((result) => {
        setBooks(result.data.allBooks);
      })
      .catch((error) => console.error(error));
  }, []);

  return (
    <div>
      <h2>books</h2>
      {books.length === 0 ? (
        <div>Loading...</div>
      ) : (
        <table>
          <tbody>
            <tr>
              <th>title</th>
              <th>author</th>
              <th>published</th>
            </tr>
            {books.map((b) => (
              <tr key={b.title}>
                <td>{b.title}</td>
                <td>{b.author}</td>
                <td>{b.published}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Books;
