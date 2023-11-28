import { connectToDatabase } from '../clients/database'

export class Pool {
    constructor(
        public pool_id: string,
        public creator: string,
        public nft_type: string,
        public reward_coin_type: string,
        public is_rarity: number,
        public creation_time: number,
        public lock_duration: number,
        public daily_reward_per_nft: number,
        public max_daily_reward_per_nft: number,
        public initial_reward_amt: number
    ) {}

    async save(): Promise<void> {
        const db = await connectToDatabase();
        const object = await db.collection("pool").insertOne(this);
        if (object === null) {
            throw new Error("Pool not found");
        }
        if (!object.acknowledged){
            throw new Error("Failed to save pool_created");
        }
    }

    static async get(pool_id: string): Promise<Pool> {
        const db = await connectToDatabase();
        const object = await db.collection("pool").findOne({pool_id: pool_id});
        if (object === null) {
            throw new Error("Pool not found");
        }
        return new Pool(
            object.pool_id,
            object.creator,
            object.nft_type,
            object.reward_coin_type,
            object.is_rarity,
            object.creation_time,
            object.lock_duration,
            object.daily_reward_per_nft,
            object.max_daily_reward_per_nft,
            object.initial_reward_amt
        );

    }

    static async getAll(): Promise<Pool[]> {
        const db = await connectToDatabase();
        const object = db.collection("pool").find();
        if (object === null) {
            throw new Error("Pool not found");
        }
        const pools: Pool[] = [];
        await object.forEach((doc)  =>{
            pools.push(new Pool(
                doc.pool_id,
                doc.creator,
                doc.nft_type,
                doc.reward_coin_type,
                doc.is_rarity,
                doc.creation_time,
                doc.lock_duration,
                doc.daily_reward_per_nft,
                doc.max_daily_reward_per_nft,
                doc.initial_reward_amt
            ));
          });
        return pools;
    }
}

export class NftHistory {
    constructor(
        public nft_id: string,
        public pool_id: string,
        public action: string,
        public timestamp: number,
        public nft_type: string,
        public owner: string,
        public reward_coin_type: string,
        public daily_reward: number
    ) {}

    async save(): Promise<void> {
        const db = await connectToDatabase();
        const object = await db.collection("nft_history").insertOne(this);
        if (!object.acknowledged){
            throw new Error("Failed to save nft_history");
        }
    }

    static async getByPoolId(pool_id: string): Promise<NftHistory[]> {
        const db = await connectToDatabase();
        const object = db.collection("nft_history").find({pool_id: pool_id});
        if (object === null) {
            throw new Error("Pool not found");
        }
        const nftHistories: NftHistory[] = [];
        await object.forEach((doc)  =>{
            nftHistories.push(new NftHistory(
                doc.nft_id,
                doc.pool_id,
                doc.action,
                doc.timestamp,
                doc.nft_type,
                doc.owner,
                doc.reward_coin_type,
                doc.daily_reward
            ));
          });
        return nftHistories;
    }
}

export class NftStaked {
    constructor(
        public nft_id: string,
        public pool_id: string,
        public owner: string,
        public nft_type: string,
        public reward_coin_type: string,
        public daily_reward: number
    ) {}

    async save(): Promise<void> {
        const db = await connectToDatabase();
        const object = await db.collection("nft_staked").insertOne(this);
        if (!object.acknowledged){
            throw new Error("Failed to save nft_staked");
        }
    }
}

export class NftUnStaked {
    constructor(
        public nft_id: string,
        public pool_id: string,
        public owner: string,
        public nft_type: string,
        public reward_coin_type: string,
    ) {}

    async save(): Promise<void> {
        const db = await connectToDatabase();
        const object = await db.collection("nft_unstaked").insertOne(this);
        if (!object.acknowledged){
            throw new Error("Failed to save nft_unstaked");
        }
    }
}

export class ClaimedReward {
    constructor(
        public owner: string,
        public pool_id: string,
        public claimed_amount: number
    ) {}

    async save(): Promise<void> {
        const db = await connectToDatabase();
        const object = await db.collection("claimed_reward").insertOne(this);
        if (!object.acknowledged){
            throw new Error("Failed to save claimed_reward");
        }
    }

    static async getTotalClaimedRewardByOwner(owner: string): Promise<number> {
        const db = await connectToDatabase();
        const object = await db.collection("claimed_reward").aggregate([
            { $match: { owner: owner } },
            { $group: { _id: null, total: { $sum: "$claimed_amount" } } }
        ]);
        if (object === null) {
            throw new Error("Claimed reward not found");
        }
        let totalClaimedReward: number = 0;
        await object.forEach((doc)  =>{
            totalClaimedReward = doc.total;
          });
        return totalClaimedReward;
    }
}

export class StakedNft {
    constructor(
        public nft_id: string,
        public pool_id: string,
        public owner: string,
        public nft_type: string,
        public reward_coin_type: string,
        public daily_reward: number
    ) {}

    async save(): Promise<void> {
        const db = await connectToDatabase();
        const object = await db.collection("staked_nft").insertOne(this);
        if (!object.acknowledged){
            throw new Error("Failed to save staked_nft");
        }
    }
    
    async delete(): Promise<void> {
        const db = await connectToDatabase();
        const object = await db.collection("staked_nft").deleteOne({nft_id: this.nft_id});
        if (!object.acknowledged){
            throw new Error("Failed to delete nft_staked");
        }
    }

    static async getByOwner(owner: string): Promise<StakedNft[]> {
        const db = await connectToDatabase();
        const object = db.collection("staked_nft").find({owner: owner});
        if (object === null) {
            throw new Error("Pool not found");
        }
        const stakedNfts: StakedNft[] = [];
        await object.forEach((doc)  =>{
            stakedNfts.push(new StakedNft(
                doc.nft_id,
                doc.pool_id,
                doc.owner,
                doc.nft_type,
                doc.reward_coin_type,
                doc.daily_reward
            ));
          });
        return stakedNfts;
    }

    static async getAll(): Promise<StakedNft[]> {
        const db = await connectToDatabase();
        const object = db.collection("staked_nft").find();
        if (object === null) {
            throw new Error("Pool not found");
        }
        const stakedNfts: StakedNft[] = [];
        await object.forEach((doc)  =>{
            stakedNfts.push(new StakedNft(
                doc.nft_id,
                doc.pool_id,
                doc.owner,
                doc.nft_type,
                doc.reward_coin_type,
                doc.daily_reward
            ));
          });
        return stakedNfts;
    }
}