import React from "react";
import "./styles.css";
import axios from "axios";
import { useState } from "react";

function App() {
  const [searchedUser, setSearchedUser] = useState("");
  const [repos, setRepos] = useState([]);
  const [showTable, setShowTable] = useState(false);
  const [isForked, setIsForked] = useState(false);

  const performApiCall = async () => {
    try {
      let response = await axios.get(
        `https://api.github.com/users/${searchedUser}/repos`
      );
      // console.log(response.data);
      let filteredRepos = response.data;
      // if (!isForked) {
      //   filteredRepos = filteredRepos.filter((repo) => !repo.fork);
      // }

      setRepos(filteredRepos.sort((a, b) => b.size - a.size));

      // setSearchedUser("");
      setShowTable(true);
    } catch (error) {
      setRepos([]);
      console.log("Axios error:", error);
    }
  };

  const handleToggle = () => {
    setIsForked(!isForked);
  };

  return (
    <div className="App">
      <div className="input">
        <label htmlFor="username">Github username: </label>
        <input
          id="username"
          type="text"
          value={searchedUser}
          onChange={(e) => setSearchedUser(e.target.value)}
        />
        <label htmlFor="fork">Include forks: </label>
        <input
          id="fork"
          type="checkbox"
          checked={isForked}
          onChange={() => handleToggle()} // Added onChange handler
        />
        <button type="submit" onClick={performApiCall} disabled={!searchedUser}>
          Submit
        </button>
      </div>
      {showTable &&
        (repos.length > 0 ? (
          <section>
            <header>
              <div className="col">Name</div>
              <div className="col">Language</div>
              <div className="col">Description</div>
              <div className="col">Size</div>
            </header>
            {repos
              .filter((repo) => isForked || !repo.fork)
              .map((repo) => (
                <div key={repo.id}>
                  <div className="col">{repo.name}</div>
                  <div className="col">{repo.language}</div>
                  <div className="col">{repo.description}</div>
                  <div className="col">{repo.size}</div>
                </div>
              ))}
          </section>
        ) : (
          <div className="error">Not found </div>
        ))}
    </div>
  );
}

export default App;
