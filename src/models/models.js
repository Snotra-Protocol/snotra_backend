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
exports.StakedNft = exports.ClaimedReward = exports.NftUnStaked = exports.NftStaked = exports.NftHistory = exports.Pool = void 0;
const database_1 = require("../clients/database");
class Pool {
    constructor(pool_id, creator, nft_type, reward_coin_type, is_rarity, creation_time, lock_duration, daily_reward_per_nft, max_daily_reward_per_nft, initial_reward_amt) {
        this.pool_id = pool_id;
        this.creator = creator;
        this.nft_type = nft_type;
        this.reward_coin_type = reward_coin_type;
        this.is_rarity = is_rarity;
        this.creation_time = creation_time;
        this.lock_duration = lock_duration;
        this.daily_reward_per_nft = daily_reward_per_nft;
        this.max_daily_reward_per_nft = max_daily_reward_per_nft;
        this.initial_reward_amt = initial_reward_amt;
    }
    save() {
        return __awaiter(this, void 0, void 0, function* () {
            const db = yield (0, database_1.connectToDatabase)();
            const object = yield db.collection("pool").insertOne(this);
            if (object === null) {
                throw new Error("Pool not found");
            }
            if (!object.acknowledged) {
                throw new Error("Failed to save pool_created");
            }
        });
    }
    static get(pool_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const db = yield (0, database_1.connectToDatabase)();
            const object = yield db.collection("pool").findOne({ pool_id: pool_id });
            if (object === null) {
                throw new Error("Pool not found");
            }
            return new Pool(object.pool_id, object.creator, object.nft_type, object.reward_coin_type, object.is_rarity, object.creation_time, object.lock_duration, object.daily_reward_per_nft, object.max_daily_reward_per_nft, object.initial_reward_amt);
        });
    }
    static getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const db = yield (0, database_1.connectToDatabase)();
            const object = db.collection("pool").find();
            if (object === null) {
                throw new Error("Pool not found");
            }
            const pools = [];
            yield object.forEach((doc) => {
                pools.push(new Pool(doc.pool_id, doc.creator, doc.nft_type, doc.reward_coin_type, doc.is_rarity, doc.creation_time, doc.lock_duration, doc.daily_reward_per_nft, doc.max_daily_reward_per_nft, doc.initial_reward_amt));
            });
            return pools;
        });
    }
}
exports.Pool = Pool;
class NftHistory {
    constructor(nft_id, pool_id, action, timestamp, nft_type, owner, reward_coin_type, daily_reward) {
        this.nft_id = nft_id;
        this.pool_id = pool_id;
        this.action = action;
        this.timestamp = timestamp;
        this.nft_type = nft_type;
        this.owner = owner;
        this.reward_coin_type = reward_coin_type;
        this.daily_reward = daily_reward;
    }
    save() {
        return __awaiter(this, void 0, void 0, function* () {
            const db = yield (0, database_1.connectToDatabase)();
            const object = yield db.collection("nft_history").insertOne(this);
            if (!object.acknowledged) {
                throw new Error("Failed to save nft_history");
            }
        });
    }
    static getByPoolId(pool_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const db = yield (0, database_1.connectToDatabase)();
            const object = db.collection("nft_history").find({ pool_id: pool_id });
            if (object === null) {
                throw new Error("Pool not found");
            }
            const nftHistories = [];
            yield object.forEach((doc) => {
                nftHistories.push(new NftHistory(doc.nft_id, doc.pool_id, doc.action, doc.timestamp, doc.nft_type, doc.owner, doc.reward_coin_type, doc.daily_reward));
            });
            return nftHistories;
        });
    }
}
exports.NftHistory = NftHistory;
class NftStaked {
    constructor(nft_id, pool_id, owner, nft_type, reward_coin_type, daily_reward) {
        this.nft_id = nft_id;
        this.pool_id = pool_id;
        this.owner = owner;
        this.nft_type = nft_type;
        this.reward_coin_type = reward_coin_type;
        this.daily_reward = daily_reward;
    }
    save() {
        return __awaiter(this, void 0, void 0, function* () {
            const db = yield (0, database_1.connectToDatabase)();
            const object = yield db.collection("nft_staked").insertOne(this);
            if (!object.acknowledged) {
                throw new Error("Failed to save nft_staked");
            }
        });
    }
}
exports.NftStaked = NftStaked;
class NftUnStaked {
    constructor(nft_id, pool_id, owner, nft_type, reward_coin_type) {
        this.nft_id = nft_id;
        this.pool_id = pool_id;
        this.owner = owner;
        this.nft_type = nft_type;
        this.reward_coin_type = reward_coin_type;
    }
    save() {
        return __awaiter(this, void 0, void 0, function* () {
            const db = yield (0, database_1.connectToDatabase)();
            const object = yield db.collection("nft_unstaked").insertOne(this);
            if (!object.acknowledged) {
                throw new Error("Failed to save nft_unstaked");
            }
        });
    }
}
exports.NftUnStaked = NftUnStaked;
class ClaimedReward {
    constructor(owner, pool_id, claimed_amount) {
        this.owner = owner;
        this.pool_id = pool_id;
        this.claimed_amount = claimed_amount;
    }
    save() {
        return __awaiter(this, void 0, void 0, function* () {
            const db = yield (0, database_1.connectToDatabase)();
            const object = yield db.collection("claimed_reward").insertOne(this);
            if (!object.acknowledged) {
                throw new Error("Failed to save claimed_reward");
            }
        });
    }
    static getTotalClaimedRewardByOwner(owner) {
        return __awaiter(this, void 0, void 0, function* () {
            const db = yield (0, database_1.connectToDatabase)();
            const object = yield db.collection("claimed_reward").aggregate([
                { $match: { owner: owner } },
                { $group: { _id: null, total: { $sum: "$claimed_amount" } } }
            ]);
            if (object === null) {
                throw new Error("Claimed reward not found");
            }
            let totalClaimedReward = 0;
            yield object.forEach((doc) => {
                totalClaimedReward = doc.total;
            });
            return totalClaimedReward;
        });
    }
}
exports.ClaimedReward = ClaimedReward;
class StakedNft {
    constructor(nft_id, pool_id, owner, nft_type, reward_coin_type, daily_reward) {
        this.nft_id = nft_id;
        this.pool_id = pool_id;
        this.owner = owner;
        this.nft_type = nft_type;
        this.reward_coin_type = reward_coin_type;
        this.daily_reward = daily_reward;
    }
    save() {
        return __awaiter(this, void 0, void 0, function* () {
            const db = yield (0, database_1.connectToDatabase)();
            const object = yield db.collection("staked_nft").insertOne(this);
            if (!object.acknowledged) {
                throw new Error("Failed to save staked_nft");
            }
        });
    }
    delete() {
        return __awaiter(this, void 0, void 0, function* () {
            const db = yield (0, database_1.connectToDatabase)();
            const object = yield db.collection("staked_nft").deleteOne({ nft_id: this.nft_id });
            if (!object.acknowledged) {
                throw new Error("Failed to delete nft_staked");
            }
        });
    }
    static getByOwner(owner) {
        return __awaiter(this, void 0, void 0, function* () {
            const db = yield (0, database_1.connectToDatabase)();
            const object = db.collection("staked_nft").find({ owner: owner });
            if (object === null) {
                throw new Error("Pool not found");
            }
            const stakedNfts = [];
            yield object.forEach((doc) => {
                stakedNfts.push(new StakedNft(doc.nft_id, doc.pool_id, doc.owner, doc.nft_type, doc.reward_coin_type, doc.daily_reward));
            });
            return stakedNfts;
        });
    }
    static getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const db = yield (0, database_1.connectToDatabase)();
            const object = db.collection("staked_nft").find();
            if (object === null) {
                throw new Error("Pool not found");
            }
            const stakedNfts = [];
            yield object.forEach((doc) => {
                stakedNfts.push(new StakedNft(doc.nft_id, doc.pool_id, doc.owner, doc.nft_type, doc.reward_coin_type, doc.daily_reward));
            });
            return stakedNfts;
        });
    }
}
exports.StakedNft = StakedNft;
//# sourceMappingURL=models.js.map