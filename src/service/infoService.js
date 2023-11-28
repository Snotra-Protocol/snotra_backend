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
exports.getGeneralInfo = void 0;
const models_1 = require("../models/models");
const utils_1 = require("../utils/utils");
class GeneralInfo {
    constructor(totalTVL, totalStaked, totalApr) {
        this.totalTVL = totalTVL;
        this.totalStaked = totalStaked;
        this.totalApr = totalApr;
    }
}
function getGeneralInfo() {
    return __awaiter(this, void 0, void 0, function* () {
        const pools = yield models_1.Pool.getAll();
        let totalApy = 0;
        let totalTvl = 0;
        let totalRewardPerDay = 0;
        for (const pool of pools) {
            const floor = yield (0, utils_1.getFloorPrice)(pool.pool_id);
            if (floor === undefined) {
                totalTvl += 0;
            }
            else {
                totalTvl += floor;
            }
            totalRewardPerDay += pool.daily_reward_per_nft;
        }
        const allStakedNFTs = yield models_1.StakedNft.getAll();
        totalApy = totalRewardPerDay * 365 * 100 / totalTvl;
        return new GeneralInfo(totalTvl, allStakedNFTs.length, totalApy);
    });
}
exports.getGeneralInfo = getGeneralInfo;
//# sourceMappingURL=infoService.js.map