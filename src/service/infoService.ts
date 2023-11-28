import { Pool, StakedNft} from "../models/models";
import { getFloorPrice } from "../utils/utils";

class GeneralInfo {
    constructor(
        public totalTVL: number,
        public totalStaked: number,
        public totalApr: number,
    ) {}
}

export async function getGeneralInfo(): Promise<GeneralInfo> {
    const pools = await Pool.getAll();
    let totalApy = 0;
    let totalTvl = 0;
    let totalRewardPerDay = 0;
    for (const pool of pools) {
        const floor = await getFloorPrice(pool.pool_id);
        if (floor === undefined) {
            totalTvl += 0;
        }else {
            totalTvl += floor;
        }
        totalRewardPerDay += pool.daily_reward_per_nft;
    }
    const allStakedNFTs = await StakedNft.getAll();
    totalApy = totalRewardPerDay * 365 * 100 / totalTvl;
    return new GeneralInfo(totalTvl,allStakedNFTs.length, totalApy);
}