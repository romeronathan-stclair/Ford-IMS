import passport from "passport";
import passportLocal from "passport-local";


import { User, UserDocument } from "../models/user";
import bcrypt from "bcrypt";

const LocalStrategy = passportLocal.Strategy;

export const configPassport = () => {
    passport.serializeUser<any, any>((req, user, done) => {
        done(undefined, user);
    });

    passport.deserializeUser((id, done) => {
        User.findById(id, (err: NativeError, user: UserDocument) => done(err, user));
    });

    passport.use(
        new LocalStrategy({ usernameField: "email" }, (email, password, done) => {
            User.findOne({ email: email.toLowerCase() }, async (err: NativeError, user: UserDocument) => {
                if (err) {
                    return done(err);
                }
                if (!user) {
                    return done(undefined, false, {
                        message: `Email ${email} not found.`,
                    });
                }
                const isMatch: Boolean = await bcrypt.compare(password, user.password);

                return isMatch
                    ? done(undefined, user)
                    : done(undefined, false, {
                          message: "Invalid email or password",
                      });
            });
        })
    );
};
