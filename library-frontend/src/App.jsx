import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { useContext } from 'react';
import { useSubscription } from '@apollo/client';
import Authors from './components/Authors';
import Books from './components/Books';
import NewBook from './components/NewBook';
import Login from './components/Login';
import Recommendation from './components/Recommendation';
import { AuthContext } from './AuthContext.jsx';
import { BOOK_ADDED } from './queries.js';

const App = () => {
  const { token, logout } = useContext(AuthContext);

  useSubscription(BOOK_ADDED, {
    skip: !token,
    onSubscriptionData: ({ subscriptionData }) => {
      const addedBook = subscriptionData?.data?.bookAdded;
      if (addedBook) {
        window.alert(
          `New book added: ${addedBook.title} by ${addedBook.author.name}`
        );
      }
    },
    onError: (error) => {
      console.error('Subscription error:', error);
    }
  });

  return (
    <BrowserRouter>
      <div>
        <nav>
          <Link to="/authors">
            <button>authors</button>
          </Link>
          <Link to="/books">
            <button>books</button>
          </Link>
          {token ? (
            <>
              <Link to="/add">
                <button>add book</button>
              </Link>
              <Link to="/recommend">
                <button>recommend</button>
              </Link>
              <button onClick={logout}>logout</button>
            </>
          ) : (
            <Link to="/login">
              <button>login</button>
            </Link>
          )}
        </nav>

        <Routes>
          <Route path="/authors" element={<Authors />} />
          <Route path="/books" element={<Books />} />
          <Route path="/add" element={<NewBook />} />
          <Route path="/login" element={<Login />} />
          <Route path="/recommend" element={<Recommendation />} />
          <Route path="/" element={<Authors />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;
