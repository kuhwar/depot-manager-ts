import passport from 'passport'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import prisma from './prisma'

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
      if (!profile.emails || profile.emails.length === 0) return done('No email in the user profile', false)

      // This is redundant as before we reach here we check the hostname via validateHost middleware, but we need depotId to check if the user has access to depot
      const host = await prisma.host.findUnique({ where: { name: request.hostname } })
      if (!host) return done('', false)

      const user = await prisma.user.findUnique({ where: { email_depotId: { email: profile.emails[0].value, depotId: host.depotId } }, include: { depot: true } })
      // const user = await prisma.user.findUnique({where: {email: profile.emails[0].value, depotId: host.depotId}, include: {depot: true}})
      if (!user) return done('You are not authorized to access here', false)

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