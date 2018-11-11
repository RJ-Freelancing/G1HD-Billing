import passport from 'passport'
import JwtStrategy, { ExtractJwt } from 'passport-jwt'
import LocalStrategy from 'passport-local'
import User from '../models/userModel'


// JWT Strategy
passport.use(new JwtStrategy.Strategy({
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: process.env.JWT_SECRET
}, async (payload, done) => {
  try {
    const user = await User.findById(payload.sub)
    if (!user) return done(null, false)
    done(null, user)
  } catch (error) {
    done(error, false)
  }
}))


// Local Strategy
passport.use(new LocalStrategy.Strategy({ usernameField: 'username' }, async (username, password, done) => {
  try {
    const user = await User.findOne({ username })
    if (!user) return done(null, false)
    if (await user.isValidPassword(password))
      return done(null, user)
    else
      done(null, false)
  } catch (error) {
    done(error, false)
  }
}))


export default passport