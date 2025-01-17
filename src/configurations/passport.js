"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const passport_google_oauth20_1 = require("passport-google-oauth20");
const prisma_1 = __importDefault(require("./prisma"));
passport_1.default.use(new passport_google_oauth20_1.Strategy({
    clientID: (_a = process.env.GOOGLE_CLIENT_ID) !== null && _a !== void 0 ? _a : '', // google client id
    clientSecret: (_b = process.env.GOOGLE_CLIENT_SECRET) !== null && _b !== void 0 ? _b : '', // google client secret
    callbackURL: '/auth/google/callback',
    passReqToCallback: true,
}, 
// returns the authenticated email profile
function (request, accessToken, refreshToken, profile, done) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!profile.emails || profile.emails.length === 0)
            return done('No email in the user profile', false);
        // This is redundant as before we reach here we check the hostname via validateHost middleware, but we need depotId to check if the user has access to depot
        const host = yield prisma_1.default.host.findUnique({ where: { name: request.hostname } });
        if (!host)
            return done('', false);
        const user = yield prisma_1.default.user.findUnique({ where: { email_depotId: { email: profile.emails[0].value, depotId: host.depotId } }, include: { depot: true } });
        // const user = await prisma.user.findUnique({where: {email: profile.emails[0].value, depotId: host.depotId}, include: {depot: true}})
        if (!user)
            return done('You are not authorized to access here', false);
        return done(null, profile);
    });
}));
// function to serialize a user/profile object into the session
passport_1.default.serializeUser(function (user, done) {
    done(null, user);
});
// function to deserialize a user/profile object into the session
passport_1.default.deserializeUser(function (user, done) {
    done(null, user);
});
exports.default = passport_1.default;
