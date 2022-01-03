'use strict'
const { Server } = require('socket.io')
const log = require('debug')('dashboard:io')
const redisSub = require('./redisSub')
const UserRepo = require('./repos/UserRepo')

let io = null

redisSub.subscribe('dashboard', (err, count) => {
  log('subscribe result:', { err, count })
})

redisSub.on('message', async () => {
  const dashboard = await UserRepo.all()
  io.to('dashboard').emit('dashboard', dashboard)
})

module.exports = server => {
  io = new Server(server)
  io.on('connection', async socket => {
    socket.on('pingtest', async () => {
      socket.emit('pongtest')
    })

    socket.join('dashboard')

    const dashboard = await UserRepo.all()
    socket.emit('dashboard', dashboard)
  })
  return io
}
