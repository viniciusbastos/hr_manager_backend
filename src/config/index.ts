import merge from 'lodash.merge'

// make sure NODE_ENV is set
process.env.NODE_ENV = process.env.NODE_ENV || 'development'

const stage = process.env.STAGE || 'local'

const getConfig = async () => {
  let envConfig

  // dynamically import each config depending on the stage we're in
  if (stage === 'production') {
    const { default: prodConfig } = await import('./prod.js')
    envConfig = prodConfig
  } else {
    const { default: localConfig } = await import('./local.js')
    envConfig = localConfig
  }

  const defaultConfig = {
    stage,
    dbUrl: process.env.DATABASE_URL,
    jwtSecret: process.env.JWT_SECRET,
    port: process.env.PORT,
    logging: false
  }

  return merge(defaultConfig, envConfig)
}

export default getConfig
