import Redis from "ioredis"


const publisher = new Redis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  username: process.env.REDIS_USER,
  password: process.env.REDIS_PASSWORD,
  tls: {}, 
  maxRetriesPerRequest: 2, 
})


const subscriber = new Redis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  username: process.env.REDIS_USER,
  password: process.env.REDIS_PASSWORD,
  tls: {}, 
  maxRetriesPerRequest: 2, 
})

export {publisher, subscriber}