import JWT from "passport-jwt";
import User from "../models/user.js";
import passport from "passport";
import { ServerConfig } from "./server.config.js";
import { isAccessTokenBlacklisted } from "../utils/tokens/generateTokens.js";

const JwtStrategy = JWT.Strategy;
const ExtractJwt = JWT.ExtractJwt;

// SECURITY: Fail fast at boot if the access-token secret is missing — a missing
// secret would cause tokens to be signed/verified with undefined, which some
// versions of jsonwebtoken accept (effectively no-signature tokens).
if (!ServerConfig.JWT_ACCESS_SECRET) {
  throw new Error(
    "FATAL: JWT_ACCESS_TOKEN_SECRET_KEY is required. " +
    "Please set JWT_ACCESS_TOKEN_SECRET_KEY in your environment variables."
  );
}

// Web clients send the JWT as a secure httpOnly `accessToken` cookie; mobile/app
// clients send it as an Authorization: Bearer header. Read the cookie FIRST so a
// stale/sentinel Authorization header from a migrated web client is ignored.
const cookieExtractor = (req) =>
  req && req.cookies && req.cookies.accessToken ? req.cookies.accessToken : null;

const tokenExtractor = ExtractJwt.fromExtractors([
  cookieExtractor,
  ExtractJwt.fromAuthHeaderAsBearerToken(),
]);

const opts = {
  jwtFromRequest: tokenExtractor,
  secretOrKey: ServerConfig.JWT_ACCESS_SECRET,
  // SECURITY: Restrict accepted algorithms to HS256 (how tokens are signed).
  // Prevents alg:none and RSA/ECDSA confusion attacks.
  algorithms: ["HS256"],
  // Needed so the verify callback can re-extract the raw token for blacklist check.
  passReqToCallback: true,
};

passport.use(
  "jwt",
  new JwtStrategy(opts, function (req, jwt_payload, done) {
    const finish = (err, user) => {
      if (err) {
        console.error("JWT Strategy Error:", err);
        return done(err, false);
      }
      return done(null, user);
    };

    const rawToken = tokenExtractor(req);

    Promise.resolve()
      .then(async () => {
        if (rawToken && (await isAccessTokenBlacklisted(rawToken, jwt_payload))) {
          return done(null, false);
        }

        const user = await User.findOne({ _id: jwt_payload._id }).select("-password");
        if (!user) {
          return done(null, false);
        }

        if (user.isBanned === true || user.status === "inactive" || user.isActive === false) {
          return done(null, false);
        }

        if (user.passwordChangedAt && jwt_payload.iat) {
          const changedAtSec = Math.floor(new Date(user.passwordChangedAt).getTime() / 1000);
          if (jwt_payload.iat < changedAtSec) {
            return done(null, false);
          }
        }

        return done(null, user);
      })
      .catch((error) => finish(error, false));
  })
);

// Express 5 + passport: bare passport.authenticate('jwt') never ends the response
// when a Bearer token is present. Wrap default JWT auth so failures return 401
// and successes call next() (same pattern as optionalAuthenticate.js).
const authenticate = passport.authenticate.bind(passport);
passport.authenticate = function jwtAuthenticateWrapper(strategy, options, callback) {
  if (typeof options === "function") {
    callback = options;
    options = {};
  }

  if (strategy === "jwt" && !callback) {
    const authOptions = options || {};
    return (req, res, next) => {
      authenticate(strategy, authOptions, (err, user, info) => {
        if (err) {
          return next(err);
        }
        if (!user) {
          return res.status(401).json({
            success: false,
            error: "Unauthorized",
            message: info?.message || "Authentication required",
          });
        }
        req.user = user;
        return next();
      })(req, res, next);
    };
  }

  return authenticate(strategy, options, callback);
};

export default passport;
