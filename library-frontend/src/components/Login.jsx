import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext.jsx';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true); // true: login mode, false: sign up mode
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [favoriteGenre, setFavoriteGenre] = useState('');
  const { setToken } = useContext(AuthContext);
  const navigate = useNavigate();

  const submit = async (event) => {
    event.preventDefault();

    if (isLogin) {
      // Login mode - use login mutation
      const mutation = `
      mutation {
        login(username: "${username}", password: "${password}") {
          value
        }
      }
    `;
      try {
        const response = await fetch('http://localhost:4000/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: mutation })
        });
        const result = await response.json();
        if (result.errors) {
          console.error('Login error:', result.errors);
        } else {
          const token = result.data.login.value;
          setToken(token);
          localStorage.setItem('library-user-token', token);
          navigate('/');
        }
      } catch (error) {
        console.error('Error during login:', error);
      }
    } else {
      // Sign up mode - use createUser mutation
      const mutation = `
      mutation {
        createUser(username: "${username}", favoriteGenre: "${favoriteGenre}") {
          username
        }
      }
      `;
      try {
        const response = await fetch('http://localhost:4000/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: mutation })
        });
        const result = await response.json();
        if (result.errors) {
          console.error('Sign up error:', result.errors);
        } else {
          alert('User created successfully. Please log in.');
          setIsLogin(true);
          setPassword('');
          setFavoriteGenre('');
        }
      } catch (error) {
        console.error('Error during sign up:', error);
      }
    }
  };

  return (
    <div>
      <h2>{isLogin ? 'Login' : 'Sign Up'}</h2>
      <form onSubmit={submit}>
        <div>
          <label>Username: </label>
          <input
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        {isLogin && (
          <div>
            <label>Password: </label>
            <input
              type="password"
              value={password}
              onChange={({ target }) => setPassword(target.value)}
            />
          </div>
        )}
        {!isLogin && (
          <div>
            <label>Favorite Genre: </label>
            <input
              value={favoriteGenre}
              onChange={({ target }) => setFavoriteGenre(target.value)}
            />
          </div>
        )}
        <button type="submit">{isLogin ? 'login' : 'sign up'}</button>
      </form>
      <div>
        {isLogin ? (
          <p>
            Don't have an account?{' '}
            <button onClick={() => setIsLogin(false)}>Sign up</button>
          </p>
        ) : (
          <p>
            Have an account?{' '}
            <button onClick={() => setIsLogin(true)}>Login</button>
          </p>
        )}
      </div>
    </div>
  );
};

export default Login;
