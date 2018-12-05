import passport from '../_helpers/passport'
import { validateParam, validateBody } from '../validations'
import { schemas } from '../validations/userValidation'
import { checkMaintenance } from '../_helpers/checkMaintenance'
import { getAllUsers, addUser, validateUsername, getUser, updateUser, deleteUser, upgradeUserRole } from '../controllers/userController'


const passportJWT = passport.authenticate('jwt', { session: false })
const router = require('express-promise-router')()

router.route('/')
  .all(
    checkMaintenance,
    passportJWT
  )
  .get(
    getAllUsers
  )
  .post(
    validateBody(schemas.addSchema),
    addUser
  )

router.route('/:username')
  .all(
    checkMaintenance,
    passportJWT,
    validateParam(schemas.usernameSchema, 'username'),
    validateUsername
  )
  .get(
    getUser
  )
  .patch(
    validateBody(schemas.updateSchema),
    updateUser
  )
  .delete(
    deleteUser
  )

router.route('/upgrade/:username')
.post(
  checkMaintenance,
  passportJWT,
  validateParam(schemas.usernameSchema, 'username'),
  validateUsername,
  validateBody(schemas.upgradeSchema),
  upgradeUserRole
)

export default router