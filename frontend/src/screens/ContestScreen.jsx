import axios from 'axios'
import React from 'react'

export default function Contest() {

  async function loadContest() {
    const response = await axios.get("https://kontests.net/api/v1/all");

    const data = response.data.filter(contest => {
      if (contest.site === "CodeForces" || contest.site === "CodeChef" || contest.site === "Atcoder") {
        return contest;
      }
    }).map(contest => {
      return {
        name: contest.name,
        url: contest.url,
        start_time: contest.start_time,
        end_time: contest.end_time,
        site: contest.site
      }
    });

    console.log(data);
  }

  loadContest();
  return (
    <div>Contest</div>
  )
}
