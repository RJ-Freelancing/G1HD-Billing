import { validateParam, validateBody } from '../validations'
import { schemas } from '../validations/exampleValidation'
import { list, retrieve, create, patch, remove, checkPermission } from '../controllers/exampleController'


const router = require('express-promise-router')()


router.route('/')
  .get(
    list
  )
  .post(
    validateBody(schemas.postSchema),
    create
  )

router.route('/:id')
  .all(
    validateParam(schemas.idSchema, 'id'),
    checkPermission
  )
  .get(
    retrieve
  )
  .patch(
    validateBody(schemas.patchSchema),
    patch
  )
  .delete(
    remove
  )


export default router