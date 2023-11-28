import {Pool,NftHistory} from "../models/models";

export async function getPool(poolId: string) : Promise<Pool> {
    const pool = await Pool.get(poolId);
    return pool;
}

export async function getPoolTransactions(poolId: string) : Promise<NftHistory[]> {
    const history = await NftHistory.getByPoolId(poolId);
    return history;
}
