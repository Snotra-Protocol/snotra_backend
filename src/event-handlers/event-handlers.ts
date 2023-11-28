import { Pool,NftStaked,NftUnStaked,ClaimedReward } from "../models/models";

async function handlePoolCreated(pool_id: string, creator: string, nft_type: string, reward_coin_type: string, is_rarity: number, 
    creation_time: number, lock_duration: number, daily_reward_per_nft: number, max_daily_reward_per_nft: number, initial_reward_amt: number) {
    console.log("Pool created");
    const poolCreated = new Pool(pool_id, creator, nft_type, reward_coin_type, is_rarity, creation_time, lock_duration, 
        daily_reward_per_nft, max_daily_reward_per_nft, initial_reward_amt);
    await poolCreated.save();
}

async function handleNftStaked(nft_id: string, pool_id: string, owner: string, nft_type: string, reward_coin_type: string, daily_reward: number) {
    console.log("NFT staked");
    const nftStaked = new NftStaked(nft_id, pool_id, owner, nft_type, reward_coin_type, daily_reward);
    await nftStaked.save();
}

async function handleNftUnStaked(nft_id: string, pool_id: string, owner: string, nft_type: string, reward_coin_type: string) {
    console.log("NFT unstaked");
    const nftUnStaked = new NftUnStaked(nft_id, pool_id, owner, nft_type, reward_coin_type);
    await nftUnStaked.save();
}

async function handleClaimedReward( owner: string, pool_id: string, claimed_reward: number) {
    console.log("Reward claimed");
    const claimedReward = new ClaimedReward(owner, pool_id,claimed_reward);
    await claimedReward.save();
}