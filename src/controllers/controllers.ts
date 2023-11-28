import { NextFunction, Request,Response } from 'express';
import { getPool,getPoolTransactions } from '../service/poolService';
import {getUserInformation} from '../service/userService';
import {getGeneralInfo} from '../service/infoService';
import { getPoolInfo } from '../utils/utils';


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
export async function GetPoolHandler(request: Request, response: Response, next: NextFunction) : Promise<void>{
    const poolId = request.params.poolId;
    try {
        const pool = await getPool(poolId);
        const offContractPool = getPoolInfo(poolId);
        const nftHistory = await getPoolTransactions(poolId);
        response.status(200).json({...pool,...offContractPool,nftHistory});
    } catch (error) {
        next(error)
    }
}

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
export async function UserInfoHandler(request: Request, response: Response, next: NextFunction) : Promise<void>{
    const walletAddress = request.params.walletAddress;
    try {
        const userInformation = await getUserInformation(walletAddress);
        response.status(200).json(userInformation);
    } catch (error) {
        next(error)
    }
}

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
export async function GetGeneralInfoHandler(request: Request, response: Response, next: NextFunction) : Promise<void>{
    try {
        const poolList = await getGeneralInfo();
        response.status(200).json(poolList);
    } catch (error) {
        next(error)
    }
}