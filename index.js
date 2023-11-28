"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@mysten/sui.js/client");
const express_1 = __importDefault(require("express"));
const body_parser_1 = require("body-parser");
const dotenv = __importStar(require("dotenv"));
const models_1 = require("./src/models/models");
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swagger_1 = require("./swagger");
const routes_1 = __importDefault(require("./src/routes/routes"));
dotenv.config();
if (process.env.INDEXER == 'true') {
    console.log('Indexer is enabled');
    const unsub = indexer();
    unsub.then((unsubscribe) => {
        process.on('SIGINT', () => __awaiter(void 0, void 0, void 0, function* () {
            console.log('Interrupted...');
            if (unsubscribe) {
                unsubscribe();
            }
        }));
    });
}
else {
    // Express initialization
    const app = (0, express_1.default)();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    function errorHandler(err, req, res, next) {
        console.log("error handler");
        console.error(err.stack);
        res.status(500).send('Something went wrong!');
    }
    // Middlewares
    app.use((0, body_parser_1.json)());
    app.use(errorHandler);
    app.use(routes_1.default);
    app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup((0, swagger_jsdoc_1.default)(swagger_1.options)));
    console.log((0, swagger_jsdoc_1.default)(swagger_1.options));
    // Routes
    app.listen(3000, () => {
        console.log('API listening on port 3000!');
    });
}
function indexer() {
    return __awaiter(this, void 0, void 0, function* () {
        const Package = process.env.INDEXER_PACKAGE || '';
        if (Package == '') {
            console.log('Package ID is not set');
            process.exit(1);
        }
        const rpcUrl = (0, client_1.getFullnodeUrl)("testnet");
        const client = new client_1.SuiClient({ url: rpcUrl });
        // naming the function unsubscribe may seem counterintuitive here, but you call it later to unsubscribe from the event
        let unsub = client.subscribeEvent({
            filter: {
                Sender: Package,
            },
            onMessage(event) {
                return __awaiter(this, void 0, void 0, function* () {
                    switch (event.type.split(":")[2]) {
                        case "PoolCreated":
                            const pool = event.parsedJson;
                            console.log("Pool created");
                            yield pool.save();
                            break;
                        case "NftStaked":
                            console.log("NFT staked");
                            const nftStaked = event.parsedJson;
                            const stakeHistory = new models_1.NftHistory(nftStaked.nft_id, nftStaked.pool_id, "staked", Date.now(), nftStaked.nft_type, nftStaked.owner, nftStaked.reward_coin_type, nftStaked.daily_reward);
                            const stakedNft = new models_1.StakedNft(stakeHistory.nft_id, stakeHistory.pool_id, stakeHistory.owner, nftStaked.nft_type, nftStaked.reward_coin_type, stakeHistory.daily_reward);
                            yield stakeHistory.save();
                            yield stakedNft.save();
                            break;
                        case "NftUnStaked":
                            console.log("NFT unstaked");
                            const nftUnStaked = event.parsedJson;
                            const unstakeHistory = new models_1.NftHistory(nftUnStaked.nft_id, nftUnStaked.pool_id, "unstaked", Date.now(), nftUnStaked.nft_type, nftUnStaked.owner, nftUnStaked.reward_coin_type, 0);
                            const unstakedNft = new models_1.StakedNft(unstakeHistory.nft_id, unstakeHistory.pool_id, unstakeHistory.owner, nftUnStaked.nft_type, nftUnStaked.reward_coin_type, unstakeHistory.daily_reward);
                            yield unstakeHistory.save();
                            yield unstakedNft.delete();
                            break;
                        case "ClaimedReward":
                            console.log("Reward claimed");
                            const claimedReward = event.parsedJson;
                            yield claimedReward.save();
                            break;
                        default:
                            console.log("Unknown event");
                    }
                });
            },
        });
        return unsub;
    });
}
//# sourceMappingURL=index.js.map