"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var cors_1 = __importDefault(require("cors"));
var body_parser_1 = __importDefault(require("body-parser"));
var mongoose_1 = __importDefault(require("mongoose"));
var userController = __importStar(require("./controllers/user"));
var loggingMiddleware_1 = require("./logger/loggingMiddleware");
var passport_1 = __importDefault(require("passport"));
var passport_config_1 = __importDefault(require("./passport-config"));
var router = express_1.default.Router();
var app = express_1.default();
mongoose_1.default.set('useCreateIndex', true);
app.use(passport_1.default.initialize());
passport_config_1.default(passport_1.default);
app.use(cors_1.default());
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use(body_parser_1.default.json());
app.use(loggingMiddleware_1.log);
var dbUrl = process.env.DB_URL || 'localhost';
var port = process.env.PORT || 8081;
mongoose_1.default.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true });
var db = mongoose_1.default.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    router.post('/login', userController.credentialValidator, userController.postLogin);
    router.post('/register', userController.registerValidator, userController.postRegister);
    router.get('/hello', function (req, res) {
        res.send('Csoró');
    });
    router.post('/post', function (req, res) {
        db.collection('posts').insertOne(req.body, function (cucc) {
            res.sendStatus(201);
        });
    });
    app.use('/api', router);
    if (app.listen(port)) {
        // tslint:disable-next-line
        console.log("Listening on port " + port);
    }
});
