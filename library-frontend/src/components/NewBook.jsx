import { useContext } from 'react';
import { AuthContext } from '../AuthContext.jsx';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const NewBook = () => {
  const { token } = useContext(AuthContext);
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [published, setPublished] = useState('');
  const [genre, setGenre] = useState('');
  const [genres, setGenres] = useState([]);
  const navigate = useNavigate();

  const submit = async (event) => {
    event.preventDefault();

    const publishedInt = parseInt(published);
    const mutation = `
  mutation {
    addBook(
      title: "${title}",
      author: "${author}",
      published: ${publishedInt},
      genres: [${genres.map((g) => `"${g}"`).join(', ')}]
    ) {
      title
      published
      genres
      author {
        name
      }
    }
  }
`;

    try {
      const response = await fetch('http://localhost:4000/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` })
        },
        body: JSON.stringify({ query: mutation })
      });
      const result = await response.json();
      if (result.errors) {
        console.error(result.errors);
      } else {
        // Optionally, you can log the added book:
        console.log('Added book:', result.data.addBook);
        // Clear the form fields
        setTitle('');
        setAuthor('');
        setPublished('');
        setGenres([]);
        setGenre('');
        // Navigate to books view so it refetches the list.
        navigate('/books');
      }
    } catch (error) {
      console.error('Error adding book:', error);
    }
  };

  const addGenre = () => {
    setGenres(genres.concat(genre));
    setGenre('');
  };

  return (
    <div>
      <form onSubmit={submit}>
        <div>
          title
          <input
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          author
          <input
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          published
          <input
            type="number"
            value={published}
            onChange={({ target }) => setPublished(target.value)}
          />
        </div>
        <div>
          <input
            value={genre}
            onChange={({ target }) => setGenre(target.value)}
          />
          <button onClick={addGenre} type="button">
            add genre
          </button>
        </div>
        <div>genres: {genres.join(' ')}</div>
        <button type="submit">create book</button>
      </form>
    </div>
  );
};

export default NewBook;
