import { getFullnodeUrl, SuiClient } from '@mysten/sui.js/client';
import express,{Request, Response, NextFunction} from 'express';
import { json } from "body-parser";
import * as dotenv from "dotenv";
import { Pool,NftHistory,NftUnStaked,NftStaked,ClaimedReward,StakedNft } from './src/models/models';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import { options } from './swagger';
import router from './src/routes/routes';

dotenv.config();

if (process.env.INDEXER == 'true'){
	console.log('Indexer is enabled');
	const unsub = indexer();
	unsub.then((unsubscribe) => {
		process.on('SIGINT', async () => {
			console.log('Interrupted...');
			if (unsubscribe) {
				unsubscribe();
			}
		});
	});
}else {
	// Express initialization
	const app = express();

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	function errorHandler(err: Error, req: Request, res: Response, next: NextFunction): void {
		console.log("error handler")
		console.error(err.stack);
		res.status(500).send('Something went wrong!');
	}
	// Middlewares

	app.use(json());
	app.use(errorHandler);
	app.use(router);
	app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerJsdoc(options)));

	console.log(swaggerJsdoc(options));
	// Routes
	app.listen(3000, () => {
		console.log('API listening on port 3000!');
	});
}

async function indexer() : Promise<any>{
	const Package = process.env.INDEXER_PACKAGE || '';
	if (Package == ''){
		console.log('Package ID is not set');
		process.exit(1);
	}
	const rpcUrl = getFullnodeUrl("testnet");
	const client = new SuiClient({ url: rpcUrl });

	// naming the function unsubscribe may seem counterintuitive here, but you call it later to unsubscribe from the event
	let unsub = client.subscribeEvent({
		filter: {
			Sender: Package,
		},
		async onMessage(event) {
			
			switch(event.type.split(":")[2]){
				case "PoolCreated":
					const pool = event.parsedJson as Pool;
					console.log("Pool created");
					await pool.save();
					break;
				case "NftStaked":
					console.log("NFT staked");
					const nftStaked = event.parsedJson as NftStaked;
					const stakeHistory = new NftHistory(nftStaked.nft_id,nftStaked.pool_id,"staked",Date.now(),nftStaked.nft_type,nftStaked.owner,nftStaked.reward_coin_type,nftStaked.daily_reward);
					const stakedNft = new StakedNft(stakeHistory.nft_id,stakeHistory.pool_id,stakeHistory.owner,nftStaked.nft_type,nftStaked.reward_coin_type,stakeHistory.daily_reward);
					await stakeHistory.save();
					await stakedNft.save();
					break;
				case "NftUnStaked":
					console.log("NFT unstaked");
					const nftUnStaked = event.parsedJson as NftUnStaked;
					const unstakeHistory = new NftHistory(nftUnStaked.nft_id,nftUnStaked.pool_id,"unstaked",Date.now(),nftUnStaked.nft_type,nftUnStaked.owner,nftUnStaked.reward_coin_type,0);
					const unstakedNft = new StakedNft(unstakeHistory.nft_id,unstakeHistory.pool_id,unstakeHistory.owner,nftUnStaked.nft_type,nftUnStaked.reward_coin_type,unstakeHistory.daily_reward);
					await unstakeHistory.save();
					await unstakedNft.delete();
					break;
				case "ClaimedReward":
					console.log("Reward claimed");
					const claimedReward = event.parsedJson as ClaimedReward;
					await claimedReward.save();
					break;
				default:
					console.log("Unknown event");
			}
		},
	});

	return unsub;
}
