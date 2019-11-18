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
var validator = __importStar(require("./utils/validators"));
var middleware_1 = require("./utils/middleware");
var passport_1 = __importDefault(require("passport"));
var passport_config_1 = __importDefault(require("./passport-config"));
var adminUserController = __importStar(require("./controllers/adminUser"));
var serviceController = __importStar(require("./controllers/service"));
var contactController = __importStar(require("./controllers/contact"));
var bookController = __importStar(require("./controllers/book"));
var messageController = __importStar(require("./controllers/messages"));
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
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    router.post('/login', validator.credentialValidator, userController.postLogin);
    router.post('/register', validator.registerValidator, userController.postRegister);
    router.post('/service/obtain-id', serviceController.postObtainServiceId);
    router.get('/available-services', serviceController.getAvailableServices);
    router.get('/serviceName/:service_id', serviceController.getServiceName);
    router.get('/contact/:service_id', contactController.getContact);
    router.get('/messages/:service_id', messageController.getMessages);
    router.post('/admin/auth', middleware_1.middleware.isAuthenticatedAsAdmin, adminUserController.auth);
    router.post('/admin/login', validator.credentialValidator, adminUserController.postLogin);
    router.post('/admin/register', validator.registerValidator, adminUserController.postRegister);
    router.post('/settings/service', middleware_1.middleware.isAuthenticatedAsAdmin, upload.single('image'), serviceController.postUpdateService);
    router.get('/settings/service/:service_id', middleware_1.middleware.isAuthenticatedAsAdmin, serviceController.getServiceSettings);
    router.post('/settings/contact', middleware_1.middleware.isAuthenticatedAsAdmin, upload.single('image'), contactController.postSaveContact);
    router.get('/settings/contact/:service_id', middleware_1.middleware.isAuthenticatedAsAdmin, contactController.getContact);
    router.post('/settings/book', middleware_1.middleware.isAuthenticatedAsAdmin, bookController.postSaveBookTime);
    router.get('/settings/book/:service_id', middleware_1.middleware.isAuthenticatedAsAdmin, bookController.getBookTimeSettings);
    router.post('/settings/breaks', middleware_1.middleware.isAuthenticatedAsAdmin, bookController.postSaveBreaks);
    router.get('/settings/breaks/:service_id', middleware_1.middleware.isAuthenticatedAsAdmin, bookController.getBreakSettings);
    router.post('/settings/leaves', middleware_1.middleware.isAuthenticatedAsAdmin, bookController.postSaveLeaves);
    router.get('/settings/leaves/:service_id', middleware_1.middleware.isAuthenticatedAsAdmin, bookController.getLeaveSettings);
    router.post('/settings/messages', middleware_1.middleware.isAuthenticatedAsAdmin, messageController.postSaveMessages);
    router.get('/settings/messages/:service_id', middleware_1.middleware.isAuthenticatedAsAdmin, messageController.getMessages);
    app.use('/api', router);
    if (app.listen(port)) {
        // tslint:disable-next-line
        console.log("Listening on port " + port);
    }
});
