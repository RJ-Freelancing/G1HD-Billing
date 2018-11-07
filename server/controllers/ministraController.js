import axios from 'axios'

const ministraAPI = process.env.MINISTRA_HOST+'stalker_portal/api/'
const ministaUser = process.env.MINISTRA_USER
const ministraPW = process.env.MINISTRA_PW
const config = {
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  },
  auth: {
    username: `${ministaUser}`,
    password: `${ministraPW}`
  }
}

export async function getTariffs(req, res, next) {
  await axios.get(ministraAPI+'tariffs/', config)
    .then(response => {
      if (response.data.status!=='OK') return res.status(404).json(response.data.error)
      return res.status(201).json(response.data.results)
    })
    .catch(error => {
      console.log("Ministra API Error : " + error)
      return res.status(404).json(error)
    })
}

