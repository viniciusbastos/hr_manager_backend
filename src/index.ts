import * as dotenv from 'dotenv'
dotenv.config()

import app from './server'

// creates and starts a server for our API on a defined port
app.listen(3001, () => {
  console.log(`Example app listening at http://localhost:3001`)
})
