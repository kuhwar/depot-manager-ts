import passport from 'passport'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID ?? '', // google client id
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '', // google client secret
      callbackURL: 'http://localhost:8000/auth/google/callback',
      passReqToCallback: true,
    },

    // returns the authenticated email profile
    async function (request, accessToken, refreshToken, profile, done) {
      return done(null, profile)
    }
  )
)

// function to serialize a user/profile object into the session
passport.serializeUser(function (user: Express.User, done) {
  done(null, user)
})

// function to deserialize a user/profile object into the session
passport.deserializeUser(function (user: Express.User, done) {
  done(null, user)
})
export default passport