import request from 'supertest'
import app from '../../index'
const assert = require('assert');


describe('GET /api/users', () => {
  it('responds with unauthorized', done => {
    request(app)
      .get('/api/users')
      .expect(401, done)
  })
})
