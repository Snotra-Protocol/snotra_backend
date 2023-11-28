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
const models_1 = require("../models/models");
function handlePoolCreated(pool_id, creator, nft_type, reward_coin_type, is_rarity, creation_time, lock_duration, daily_reward_per_nft, max_daily_reward_per_nft, initial_reward_amt) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("Pool created");
        const poolCreated = new models_1.Pool(pool_id, creator, nft_type, reward_coin_type, is_rarity, creation_time, lock_duration, daily_reward_per_nft, max_daily_reward_per_nft, initial_reward_amt);
        yield poolCreated.save();
    });
}
function handleNftStaked(nft_id, pool_id, owner, nft_type, reward_coin_type, daily_reward) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("NFT staked");
        const nftStaked = new models_1.NftStaked(nft_id, pool_id, owner, nft_type, reward_coin_type, daily_reward);
        yield nftStaked.save();
    });
}
function handleNftUnStaked(nft_id, pool_id, owner, nft_type, reward_coin_type) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("NFT unstaked");
        const nftUnStaked = new models_1.NftUnStaked(nft_id, pool_id, owner, nft_type, reward_coin_type);
        yield nftUnStaked.save();
    });
}
function handleClaimedReward(owner, pool_id, claimed_reward) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("Reward claimed");
        const claimedReward = new models_1.ClaimedReward(owner, pool_id, claimed_reward);
        yield claimedReward.save();
    });
}
//# sourceMappingURL=event-handlers.js.map