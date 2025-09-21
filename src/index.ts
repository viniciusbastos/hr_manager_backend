

import * as dotenv from 'dotenv'
dotenv.config()
import getConfig from './config/index.js'
import app from './server.js'
import redisClient from './redis/client.js'
;(async () => {
  const config = await getConfig()

  // Redis connects automatically on import

  // creates and starts a server for our API on a defined port
  app.listen(config.port, () => {
    console.log('A server is running in the port ' + config.port)
  })
})()
