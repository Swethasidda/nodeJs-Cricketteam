const express = require('express')
const app = express()
const path = require('path')
const dbpath = path.join(__dirname, 'cricketTeam.db')
const {open} = require('sqlite')
const sqlite3 = require('sqlite3')
let db = null
const intializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbpath,
      driver: sqlite3.Database,
    })
    app.listen(3001, () => {
      console.log('Server is runninr at http://localhost:3001')
    })
  } catch (e) {
    console.log(`DB Error ${e.message}`)
    process.exit(1)
  }
}
intializeDBAndServer()
app.use(express.json())
//API 1
app.get('/players/', async (request, response) => {
  const getPlayersQuery = `
    SELECT *
    FROM cricket_team;
    `
  const playerslist = await db.all(getPlayersQuery)
  const ans = playerslist => {
    return {
      playerId: playerslist.player_id,
      playerName: playerslist.player_name,
      jerseyNumber: playerslist.jersey_number,
      role: playerslist.role,
    }
  }
  response.send(playerslist.map(each => ans(each)))
})

//API 2
app.post('/players/', async (request, response) => {
  let bodydetails = request.body
  const {playerName, jerseyNumber, role} = bodydetails
  const addQuery = `
  INSERT INTO cricket_team(player_name,jersey_number,role)
  VALUES(
    '${playerName}',
    '${jerseyNumber}',
    '${role}'
  );
  `
  await db.run(addQuery)
  response.send('Player Added to Team')
})
// AP3
app.get('/players/:playerId/', async (request, response) => {
  const {playerId} = request.params
  const getPlayerQuery = `
  SELECT *
  FROM cricket_team
  WHERE player_id = ${playerId};
  `
  const player = await db.get(getPlayerQuery)
  response.send({
    playerId: player.player_id,
    playerName: player.player_name,
    jerseyNumber: player.jersey_number,
    role: player.role,
  })
})

// API 4
app.put('/players/:playerId/', async (request, response) => {
  const playerDetails = request.body
  const {playerId} = request.params
  const {playerName, jerseyNumber, role} = playerDetails
  const updateplayerquary = `
  UPDATE cricket_team
  SET 
  player_name = '${playerName}',
  jersey_number = '${jerseyNumber}',
  role = '${role}'
  WHERE player_id= ${playerId};
  `
  await db.run(updateplayerquary)
  response.send('Player Details Updated')
})

//API 5

app.delete('/players/:playerId/', async (request, response) => {
  const {playerId} = request.params
  const deleteQuery = `
  DELETE FROM cricket_team
  WHERE player_id = ${playerId};
  `
  await db.run(deleteQuery)
  response.send('Player Removed')
})
module.exports = app
