import { getAllUsers, getUser } from '../controllers/ministraController'

const router = require('express-promise-router')()

  router.route('/')
  .get(
    getAllUsers
  )

router.route('/:username')
  .get(
    getUser
  )

export default router