import request from 'supertest'
import app from '../../index'
const assert = require('assert');


describe('GET /example', () => {
  it('responds with unauthorized', done => {
    request(app)
      .get('/example')
      .expect(200, done)
  })
})
