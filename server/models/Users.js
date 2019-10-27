"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var bcrypt_nodejs_1 = __importDefault(require("bcrypt-nodejs"));
var mongoose_1 = __importDefault(require("mongoose"));
var userSchema = new mongoose_1.default.Schema({
    email: { type: String, unique: true },
    password: String,
}, { timestamps: true });
userSchema.pre('save', function save(next) {
    var user = this;
    if (!user.isModified('password')) {
        return next();
    }
    bcrypt_nodejs_1.default.genSalt(10, function (err, salt) {
        if (err) {
            return next(err);
        }
        // tslint:disable-next-line
        bcrypt_nodejs_1.default.hash(user.password, salt, function () { }, function (bcyptError, hash) {
            if (bcyptError) {
                return next(bcyptError);
            }
            user.password = hash;
            next();
        });
    });
});
exports.User = mongoose_1.default.model('User', userSchema, 'User');
