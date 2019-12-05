"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var cors_1 = __importDefault(require("cors"));
var body_parser_1 = __importDefault(require("body-parser"));
var mongoose_1 = __importDefault(require("mongoose"));
var middleware_1 = require("./utils/middleware");
var passport_1 = __importDefault(require("passport"));
var passport_config_1 = __importDefault(require("./passport-config"));
var multer_1 = __importDefault(require("multer"));
var upload = multer_1.default({
    storage: multer_1.default.memoryStorage(),
});
var router = express_1.default.Router();
var app = express_1.default();
mongoose_1.default.set('useCreateIndex', true);
app.use(passport_1.default.initialize());
passport_config_1.default(passport_1.default);
app.use(cors_1.default());
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use(body_parser_1.default.json());
app.use(middleware_1.middleware.log);
var dbUrl = process.env.DB_URL || 'localhost';
var port = process.env.PORT || 8081;
mongoose_1.default.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });
var db = mongoose_1.default.connection;
// tslint:disable-next-line:no-console
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    app.use('/api', router);
    require('./routes/reservationsRoute')(router);
    require('./routes/contactsRoute')(router, upload);
    require('./routes/messagesRoute')(router);
    require('./routes/servicesRoute')(router, upload);
    require('./routes/usersRoute')(router);
    require('./routes/booksRoute')(router);
    if (app.listen(port)) {
        // tslint:disable-next-line:no-console
        console.log("Listening on port " + port);
    }
});
