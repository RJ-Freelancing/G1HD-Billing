import request from 'supertest'
import app from '../../index'
const assert = require('assert');


describe('GET /', () => {
  it('responds with unauthorized', () => {
    request(app)
      .get('/')
      .expect(401)
  })
})
