import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../AuthContext.jsx';

const Recommendation = () => {
  const { token } = useContext(AuthContext);
  const [favGenre, setFavGenre] = useState('');
  const [books, setBooks] = useState([]);

  useEffect(() => {
    if (!token) return;
    fetch('http://localhost:4000/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        query: `
          query {
            me {
              favoriteGenre
            }
          }
        `
      })
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.data.me) {
          setFavGenre(result.data.me.favoriteGenre);
        }
      })
      .catch((error) => console.error(error));
  }, [token]);

  useEffect(() => {
    if (favGenre === '') return;
    fetch('http://localhost:4000/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `
          query {
            allBooks {
              title
              published
              author { 
                name 
              }
              genres
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
  }, [favGenre]);

  const recommendedBooks = books.filter((book) =>
    book.genres.includes(favGenre)
  );

  if (!token) {
    return <div>Please log in to view recommendations.</div>;
  }

  return (
    <div>
      <h2>Recommendations</h2>
      <p>
        Books in your favorite genre: <strong>{favGenre}</strong>
      </p>
      {recommendedBooks.length === 0 ? (
        <div>No recommendations available.</div>
      ) : (
        <table>
          <tbody>
            <tr>
              <th>title</th>
              <th>author</th>
              <th>published</th>
            </tr>
            {recommendedBooks.map((b) => (
              <tr key={b.title}>
                <td>{b.title}</td>
                <td>{b.author.name}</td>
                <td>{b.published}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Recommendation;
