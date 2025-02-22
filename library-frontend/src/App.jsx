import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Authors from './components/Authors';
import Books from './components/Books';
import NewBook from './components/NewBook';

const App = () => {
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
          <Link to="/add">
            <button>add book</button>
          </Link>
        </nav>

        <Routes>
          <Route path="/authors" element={<Authors />} />
          <Route path="/books" element={<Books />} />
          <Route path="/add" element={<NewBook />} />
          <Route path="/" element={<Authors />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;
