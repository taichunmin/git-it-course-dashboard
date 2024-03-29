'use strict'

/**
 * curl --unix-socket /var/run/docker.sock http:/v1.24/containers/json
 */

const _ = require('lodash')
const axios = require('axios')
const log = require('debug')('dashboard:repos/DockerApi')

exports.getAllClientSshPorts = async () => {
  const containers = _.get(await axios.get('/v1.24/containers/json', {
    headers: { Host: 'localhost' },
    params: { filters: '{"label":["role=git-it-client"]}' },
    socketPath: '/var/run/docker.sock',
  }), 'data')
  if (!_.isArray(containers)) {
    log(containers)
    return
  }
  const ports = {}
  _.each(containers, container => {
    const mid = container.Id.substr(0, 12)
    const port22 = _.find(container.Ports, port => port.PrivatePort === 22)
    if (!port22) return
    ports[mid] = port22.PublicPort
  })
  return ports
}
