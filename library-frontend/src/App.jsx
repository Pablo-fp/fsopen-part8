import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { useContext } from 'react';
import Authors from './components/Authors';
import Books from './components/Books';
import NewBook from './components/NewBook';
import Login from './components/Login';
import { AuthContext } from './AuthContext.jsx';

const App = () => {
  const { token, logout } = useContext(AuthContext);

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
          <Route path="/" element={<Authors />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;
