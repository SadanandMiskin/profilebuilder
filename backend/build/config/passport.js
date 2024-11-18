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
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const passport_google_oauth20_1 = require("passport-google-oauth20");
const database_1 = require("./database");
passport_1.default.use(new passport_google_oauth20_1.Strategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback"
}, (accessToken, refreshToken, profile, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const [rows] = yield database_1.pool.execute('SELECT * FROM users WHERE googleId = ?', [profile.id]);
        if (Array.isArray(rows) && rows.length > 0) {
            return done(null, rows[0]);
        }
        const [result] = yield database_1.pool.execute(`INSERT INTO users (googleId, email, name) VALUES (?, ?, ?)`, [profile.id, profile.emails[0].value, profile.displayName]);
        const [newUser] = yield database_1.pool.execute('SELECT * FROM users WHERE id = ?', [result.insertId]);
        return done(null, (Array.isArray(newUser) ? newUser[0] : null));
    }
    catch (error) {
        return done(error);
    }
})));
passport_1.default.serializeUser((user, done) => {
    done(null, user.id);
});
passport_1.default.deserializeUser((id, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const [rows] = yield database_1.pool.execute('SELECT * FROM users WHERE id = ?', [id]);
        done(null, Array.isArray(rows) ? rows[0] : null);
    }
    catch (error) {
        done(error, null);
    }
}));
//# sourceMappingURL=passport.js.map