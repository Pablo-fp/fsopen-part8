import { useContext } from 'react';
import { AuthContext } from '../AuthContext.jsx';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { ADD_BOOK, ALL_BOOKS } from '../queries.js';

const NewBook = () => {
  const { token } = useContext(AuthContext);
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [published, setPublished] = useState('');
  const [genre, setGenre] = useState('');
  const [genres, setGenres] = useState([]);
  const navigate = useNavigate();

  const [addBook] = useMutation(ADD_BOOK, {
    refetchQueries: [{ query: ALL_BOOKS }],
    onError: (error) => {
      console.error(error);
    }
  });

  const submit = async (event) => {
    event.preventDefault();

    const publishedInt = parseInt(published);
    addBook({
      variables: { title, author, published: publishedInt, genres }
    });

    setTitle('');
    setAuthor('');
    setPublished('');
    setGenres([]);
    setGenre('');
    navigate('/books');
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
