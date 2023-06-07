import axios from 'axios'
import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function CodeforcesScreen() {

  const [cfhandle, setCfHandle] = useState("");
  const [myData, setMyData] = useState([{}]);
  const { handle, rating, rank, maxRating, maxRank } = myData[0];

  const [filters, setFilters] = useState({ ok: false, wrong: false, minRating: 800, maxRating: 3500 });

  const [myUnfilteredSumbmission, setMyUnfilteredSumbmission] = useState([]);
  const [myFilteredSumbmission, setMyFilteredSumbmission] = useState([]);

  async function loadUser() {
    try {
      const response = await axios.get(`https://codeforces.com/api/user.info?handles=${cfhandle}`);

      const data = response.data.result.map(detail => {
        return {
          handle: detail.handle,
          rating: detail.rating,
          rank: detail.rank,
          maxRating: detail.maxRating,
          maxRank: detail.maxRank,
        }
      });
      console.log(data);

      setMyData(data)
      loadSubmission();
    }
    catch (error) {
      toast.error("Handle not found");
      console.error(error);
    }
  }

  async function loadSubmission() {
    try {
      const response = await axios.get(`https://codeforces.com/api/user.status?handle=${cfhandle}&from=1&count=100`);
      console.log(response.data.result);

      const unfilteredSumbission = response.data.result.map(prob => {
        return {
          id: prob.id,
          name: prob.problem.name,
          verdict: prob.verdict,
          rating: prob.problem.rating,
          link: `https://codeforces.com/contest/${prob.contestId}/submission/${prob.id}`,
        }
      });

      setMyUnfilteredSumbmission(unfilteredSumbission);
      filterSubmission();
    }
    catch (error) {
      console.error(error);
    }
  }

  function filterSubmission() {
    const filteredSumbission = myUnfilteredSumbmission.filter(prob => {
      if (prob.rating !== undefined
        &&
        ((!filters.ok && !filters.wrong) || (prob.verdict === "OK" && filters.ok) || (prob.verdict === "WRONG_ANSWER" && filters.wrong))
        &&
        (filters.minRating <= prob.rating && prob.rating <= filters.maxRating)) {
        console.log(prob);
        return prob;
      }
    });

    console.log(filteredSumbission);
    setMyFilteredSumbmission(filteredSumbission);
  }

  function handleOk(e) {
    if (filters.wrong)
      e.preventDefault();
    else {
      setFilters(prev => {
        return {
          ...prev, ok: !prev.ok
        }
      })
    }
  }

  function handleWrong(e) {
    if (filters.ok)
      e.preventDefault();
    else {
      setFilters(prev => {
        return {
          ...prev, wrong: !prev.wrong
        }
      })
    }
  }

  function handleMinRating(e) {
    setFilters(prev => {
      return {
        ...prev, minRating: Math.max(800, e.target.value)
      }
    })
  }

  function handleMaxRating(e) {
    setFilters(prev => {
      return {
        ...prev, maxRating: Math.min(3500, e.target.value)
      }
    })
  }

  return (
    <>
      <div>CodeforcesScreen</div>
      <label htmlFor="handle">Handle:</label>
      <input
        type="text"
        id="handle"
        value={cfhandle}
        onChange={e => setCfHandle(e.target.value)}
        onKeyDown={e => {
          if (e.key === "Enter")
            loadUser();
        }}
      />
      <button onClick={loadUser}>Search</button>
      <br />
      {
        cfhandle !== ""
          ?
          <div className="">
            {handle}<br />{rating}<br />{rank}<br />{maxRating}<br />{maxRank}<br />
          </div>
          :
          <>
          </>
      }
      {
        myUnfilteredSumbmission.length ?
          <>
            <div>
              Filters
              <br />
              <label htmlFor="ok">Accepted</label>
              <input type="checkbox" id="ok" onClick={handleOk} />
              <br />
              <label htmlFor="wrong">Wrong Answer</label>
              <input type="checkbox" id="wrong" onClick={handleWrong} />
              <br />
              <label htmlFor="minRating">Min Rating</label>
              <input type="number" id="minRating" onChange={handleMinRating} />
              <br />
              <label htmlFor="maxRating">Max Rating</label>
              <input type="number" id="maxRating" onChange={handleMaxRating} />
              <br />
              <button onClick={filterSubmission}>Apply</button>
            </div>
            <table className="">
              <tr>
                <th>Id</th>
                <th>Name</th>
                <th>Verdict</th>
                <th>Rating</th>
                <th>Link</th>
              </tr>
              {
                myFilteredSumbmission.map(({ id, name, verdict, rating, link }) =>
                  <tr key={id}>
                    <th>{id}</th>
                    <th>{name}</th>
                    <th>{verdict}</th>
                    <th>{rating}</th>
                    <th><Link to={link} target="_blank" rel="noopener noreferrer">link</Link></th>
                  </tr>
                )
              }

            </table>
          </>
          : <></>
      }
    </>
  )
}
/*
arrange filtered submission in grid with col name,verdict,rating,link
*/