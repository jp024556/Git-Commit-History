import "./styles.css";
import { useState, useEffect, useCallback } from "react";
import { Octokit } from "@octokit/core";
import { timeFormatter } from "./helpers/timeFormatter";

export default function App() {
  
  // Repository information
  const repoName = "Git-Commit-History";
  const ownerName = "jp024556";
  
  // Check if localStorage already have token
  let storedKey = localStorage.getItem("_access_token_") || "";

  // State variables
  const [accessToken, setAccessToken] = useState(storedKey);
  const [commitData, setCommitData] = useState([]);

  // Save token in localStorage & also update state var
  const setToken = (evt) => {
    evt.preventDefault();
    setAccessToken(evt.target.value);
    storedKey = evt.target.value;
    localStorage.setItem("_access_token_", evt.target.value);
  };

  // Memoize fetchCommits method
  const fetchCommits = useCallback(() => {
    const octokit = new Octokit({
      auth: accessToken
    });
    octokit
      .request("GET /repos/{owner}/{repo}/commits", {
        owner: ownerName,
        repo: repoName
      })
      .then((res) => {
        if (res.status === 200) {
          setCommitData(res.data);
        } else {
          alert("Something went wrong !");
        }
      })
      .catch((err) => console.log(err));
  }, [accessToken]);

  // Fetch commits & set interval & also clear interval when destroying UI
  useEffect(() => {
    fetchCommits();
    const intervalId1 = setInterval(() => {
      fetchCommits();
    }, 30000);
    return () => {
      clearInterval(intervalId1);
    };
  }, [fetchCommits]);

  return (
    <div className="main_container">
      {!accessToken && (
        <form>
          <input
            type="text"
            placeholder="Enter github personal access token"
            value={accessToken}
            onChange={(evt) => setToken(evt)}
          />
        </form>
      )}
      {accessToken && (
        <>
          <div className="upper-section">
            <button className="btn" onClick={() => fetchCommits()}>
              Refresh Now
            </button>
            <span className="time_refresh_txt">
              Getting updated every 30 seconds ...
            </span>
          </div>
          {commitData.map((data) => {
            return (
              <div className="commit" key={data.sha}>
                <h4 className="commit_message">{data.commit.message}</h4>
                <p className="descr">
                  {timeFormatter(data.commit.author.date)}{" "}
                  <span className="bold">by {data.commit.author.name}</span>
                </p>
              </div>
            );
          })}
        </>
      )}
    </div>
  );
}
