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
exports.getUserInformation = void 0;
const models_1 = require("../models/models");
const utils_1 = require("../utils/utils");
class UserInformation {
    constructor(totalValue, totalStaked, totalReward, apr, StakedNft) {
        this.totalValue = totalValue;
        this.totalStaked = totalStaked;
        this.totalReward = totalReward;
        this.apr = apr;
        this.StakedNft = StakedNft;
    }
}
function getUserInformation(walletAddress) {
    return __awaiter(this, void 0, void 0, function* () {
        const stakedNfts = yield models_1.StakedNft.getByOwner(walletAddress);
        let totalValue = 0.00;
        let totalDailyReward = 0.00;
        const pools = yield models_1.Pool.getAll();
        const poolMap = new Map();
        for (const pool of pools) {
            poolMap.set(pool.pool_id, pool);
        }
        for (const nft of stakedNfts) {
            const pool = poolMap.get(nft.pool_id);
            if (pool === undefined) {
                throw new Error("Pool not found");
            }
            const value = yield (0, utils_1.getFloorPrice)(pool.pool_id);
            if (value === undefined) {
                totalValue += 0;
            }
            else {
                totalValue += value;
            }
            totalDailyReward += pool.daily_reward_per_nft;
        }
        const totalReward = yield models_1.ClaimedReward.getTotalClaimedRewardByOwner(walletAddress);
        const apr = totalDailyReward * 365 * 100 / totalValue;
        return new UserInformation(totalValue, stakedNfts.length, totalReward, apr, stakedNfts);
    });
}
exports.getUserInformation = getUserInformation;
//# sourceMappingURL=userService.js.map