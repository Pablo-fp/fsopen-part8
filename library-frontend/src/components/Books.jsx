import { useState, useEffect } from 'react';

const Books = () => {
  const [books, setBooks] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState('');
  const [allGenres, setAllGenres] = useState([]);

  // Fetch unique genres just once on mount
  useEffect(() => {
    const query = `
      query {
        allBooks {
          genres
        }
      }
    `;
    fetch('http://localhost:4000/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query })
    })
      .then((res) => res.json())
      .then((result) => {
        const genres = Array.from(
          new Set(result.data.allBooks.flatMap((book) => book.genres))
        );
        setAllGenres(genres);
      })
      .catch((error) => console.error(error));
  }, []);

  // Fetch books based on the selected genre using GraphQL query
  useEffect(() => {
    const genreFilter = selectedGenre ? `(genre: "${selectedGenre}")` : '';
    const query = `
      query {
        allBooks${genreFilter} {
          title
          published
          author {
            name
          }
          genres
        }
      }
    `;

    fetch('http://localhost:4000/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query })
    })
      .then((res) => res.json())
      .then((result) => {
        setBooks(result.data.allBooks);
      })
      .catch((error) => console.error(error));
  }, [selectedGenre]);

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
                <td>{b.author.name}</td>
                <td>{b.published}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <nav style={{ marginTop: '1rem' }}>
        <span>Filter by genre: </span>
        <button onClick={() => setSelectedGenre('')}>all genres</button>
        {allGenres.map((genre) => (
          <button
            key={genre}
            onClick={() => setSelectedGenre(genre)}
            style={{
              marginLeft: '.5rem',
              backgroundColor: selectedGenre === genre ? '#ddd' : ''
            }}
          >
            {genre}
          </button>
        ))}
      </nav>
    </div>
  );
};

export default Books;
