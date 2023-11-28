import { Pool, StakedNft,ClaimedReward } from "../models/models";
import { getFloorPrice } from "../utils/utils";

class UserInformation {
    constructor(
        public totalValue: number,
        public totalStaked: number,
        public totalReward: number,
        public apr: number,
        public StakedNft: StakedNft[],
    ) {}
}

export async function getUserInformation(walletAddress: string) : Promise<UserInformation> {
    const stakedNfts = await StakedNft.getByOwner(walletAddress);

    let totalValue: number = 0.00;
    let totalDailyReward: number =  0.00;


    const pools = await Pool.getAll();
    const poolMap = new Map<string, Pool>();
    for (const pool of pools) {
        poolMap.set(pool.pool_id, pool);
    }

    for (const nft of stakedNfts) {
        const pool = poolMap.get(nft.pool_id);
        if (pool === undefined) {
            throw new Error("Pool not found");
        }
        const value = await getFloorPrice(pool.pool_id);
        if (value === undefined) {
            totalValue += 0;
        }else {
            totalValue += value;
        }
        totalDailyReward += pool.daily_reward_per_nft;
    }

    const totalReward = await ClaimedReward.getTotalClaimedRewardByOwner(walletAddress);
    const apr = totalDailyReward * 365 * 100 / totalValue;

    return new UserInformation(totalValue, stakedNfts.length, totalReward, apr, stakedNfts);
}
