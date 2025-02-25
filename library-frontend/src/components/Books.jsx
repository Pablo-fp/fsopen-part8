import { useState, useEffect } from 'react';

const Books = () => {
  const [books, setBooks] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState('');

  useEffect(() => {
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
  }, []);

  // Filter books based on selected genre
  const filteredBooks = selectedGenre
    ? books.filter((b) => b.genres.includes(selectedGenre))
    : books;

  // Get unique genres from books
  const genres = Array.from(new Set(books.flatMap((book) => book.genres)));

  return (
    <div>
      <h2>books</h2>
      {filteredBooks.length === 0 ? (
        <div>Loading...</div>
      ) : (
        <table>
          <tbody>
            <tr>
              <th>title</th>
              <th>author</th>
              <th>published</th>
            </tr>
            {filteredBooks.map((b) => (
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
        {genres.map((genre) => (
          <button
            key={genre}
            onClick={() => setSelectedGenre(genre)}
            style={{
              marginLeft: '0.5rem',
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
