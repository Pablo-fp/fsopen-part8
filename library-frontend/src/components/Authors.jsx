import { useState, useEffect } from 'react';

const Authors = () => {
  const [authors, setAuthors] = useState([]);
  const [selectedAuthor, setSelectedAuthor] = useState('');
  const [birthYear, setBirthYear] = useState('');

  const fetchAuthors = () => {
    fetch('http://localhost:4000/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `
          query {
            allAuthors {
              name
              born
              bookCount
            }
          }
        `
      })
    })
      .then((res) => res.json())
      .then((result) => {
        setAuthors(result.data.allAuthors);
      })
      .catch((error) => console.error(error));
  };

  useEffect(() => {
    fetchAuthors();
  }, []);

  const submitBirthYear = async (event) => {
    event.preventDefault();

    const mutation = `
      mutation {
        editAuthor(name: "${selectedAuthor}", setBornTo: ${Number(birthYear)}) {
          name
          born
          bookCount
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
        console.error(result.errors);
      } else {
        console.log('Updated author:', result.data.editAuthor);
        // Refetch authors for updated view
        fetchAuthors();
        setSelectedAuthor('');
        setBirthYear('');
      }
    } catch (error) {
      console.error('Error updating author:', error);
    }
  };

  return (
    <div>
      <h2>authors</h2>
      {authors.length === 0 ? (
        <div>Loading...</div>
      ) : (
        <>
          <table>
            <tbody>
              <tr>
                <th>name</th>
                <th>born</th>
                <th>books</th>
              </tr>
              {authors.map((a) => (
                <tr key={a.name}>
                  <td>{a.name}</td>
                  <td>{a.born || 'N/A'}</td>
                  <td>{a.bookCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <h3>Set birth year</h3>
          <form onSubmit={submitBirthYear}>
            <div>
              <select
                value={selectedAuthor}
                onChange={({ target }) => setSelectedAuthor(target.value)}
              >
                <option value="">Select author</option>
                {authors.map((author) => (
                  <option key={author.name} value={author.name}>
                    {author.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              born
              <input
                type="number"
                value={birthYear}
                onChange={({ target }) => setBirthYear(target.value)}
              />
            </div>
            <button type="submit">Update birth year</button>
          </form>
        </>
      )}
    </div>
  );
};

export default Authors;
