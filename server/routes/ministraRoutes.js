import passport from '../_helpers/passport'
import { getTariffs } from '../controllers/ministraController'


const passportJWT = passport.authenticate('jwt', { session: false })
const router = require('express-promise-router')()

  router.route('/tariffs')
  .get(
    passportJWT,
    getTariffs
  )


export default router