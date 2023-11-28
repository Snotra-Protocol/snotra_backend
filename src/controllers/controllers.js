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
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetGeneralInfoHandler = exports.UserInfoHandler = exports.GetPoolHandler = void 0;
const poolService_1 = require("../service/poolService");
const userService_1 = require("../service/userService");
const infoService_1 = require("../service/infoService");
const utils_1 = require("../utils/utils");
/**
 * @swagger
 * /pool/{poolId}:
 *   get:
 *     summary: Retrieve pool information
 *     parameters:
 *       - in: path
 *         name: poolId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Pool information
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PoolInfo'
 */
function GetPoolHandler(request, response, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const poolId = request.params.poolId;
        try {
            const pool = yield (0, poolService_1.getPool)(poolId);
            const offContractPool = (0, utils_1.getPoolInfo)(poolId);
            const nftHistory = yield (0, poolService_1.getPoolTransactions)(poolId);
            response.status(200).json(Object.assign(Object.assign(Object.assign({}, pool), offContractPool), { nftHistory }));
        }
        catch (error) {
            next(error);
        }
    });
}
exports.GetPoolHandler = GetPoolHandler;
/**
 * @swagger
 * /user/{walletAddress}:
 *   get:
 *     summary: Retrieve a user's information
 *     parameters:
 *       - in: path
 *         name: walletAddress
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A user object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserInformation'
 */
function UserInfoHandler(request, response, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const walletAddress = request.params.walletAddress;
        try {
            const userInformation = yield (0, userService_1.getUserInformation)(walletAddress);
            response.status(200).json(userInformation);
        }
        catch (error) {
            next(error);
        }
    });
}
exports.UserInfoHandler = UserInfoHandler;
/**
 * @swagger
 * /info:
 *   get:
 *     summary: Retrieve general information
 *     responses:
 *       200:
 *         description: An array of general information
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/GeneralInfo'
 */
function GetGeneralInfoHandler(request, response, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const poolList = yield (0, infoService_1.getGeneralInfo)();
            response.status(200).json(poolList);
        }
        catch (error) {
            next(error);
        }
    });
}
exports.GetGeneralInfoHandler = GetGeneralInfoHandler;
//# sourceMappingURL=controllers.js.map