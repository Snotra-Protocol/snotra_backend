"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controllers_1 = require("../controllers/controllers");
const router = (0, express_1.Router)();
router.get('/pool/:poolId', controllers_1.GetPoolHandler);
router.get('/info', controllers_1.GetGeneralInfoHandler);
router.get('/user/:walletAddress', controllers_1.UserInfoHandler);
exports.default = router;
//# sourceMappingURL=routes.js.map