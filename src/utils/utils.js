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
exports.getPoolInfo = exports.getAccountNFTs = exports.getFloorPrice = void 0;
const graphql_request_1 = require("graphql-request");
/* eslint-disable @typescript-eslint/no-explicit-any */
const priceQuery = (0, graphql_request_1.gql) `
query MyQuery($slug: String!) {
  sui {
    collections(where: { slug: { _eq: $slug } }) {
      floor
    }
  }
}
`;
const nftFieldsQuery = (0, graphql_request_1.gql) `
query MyQuery {
    sui {
      collections(
        where: {slug: {_eq: $slug}}
      ) {
        title
        floor
        cover_url
      }
    }
  }
`;
const nftsQuery = (0, graphql_request_1.gql) `
query MyQuery($address: String!) {
    sui {
      nfts(where: { owner: { _eq: $address } }) {
        collection {
          slug
        }
        token_id
      }
    }
  }
`;
function getFloorPrice(slug) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        const endpoint = 'https://api.indexer.xyz/graphql';
        const headers = {
            'x-api-user': 'Snotra',
            'x-api-key': process.env.INDEXER_API_KEY || '',
        };
        const client = new graphql_request_1.GraphQLClient(endpoint, { headers });
        const data = yield client.request(priceQuery, { slug });
        // Check if collections array exists and has at least one element
        if ((_b = (_a = data === null || data === void 0 ? void 0 : data.sui) === null || _a === void 0 ? void 0 : _a.collections) === null || _b === void 0 ? void 0 : _b.length) {
            const floor = data.sui.collections[0].floor;
            return floor;
        }
        else {
            // Handle the case where there are no collections
            console.error('No collections found for the given slug');
            return undefined;
        }
    });
}
exports.getFloorPrice = getFloorPrice;
function getAccountNFTs(address) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const endpoint = 'https://api.indexer.xyz/graphql';
        const headers = {
            'x-api-user': 'Snotra',
            'x-api-key': process.env.INDEXER_API_KEY || '',
        };
        const client = new graphql_request_1.GraphQLClient(endpoint, { headers });
        const data = yield client.request(nftsQuery, { address });
        // Check if nfts array exists
        if ((_a = data === null || data === void 0 ? void 0 : data.sui) === null || _a === void 0 ? void 0 : _a.nfts) {
            return data.sui.nfts;
        }
        else {
            // Handle the case where there are no NFTs
            console.error('No NFTs found for the given address');
            return undefined;
        }
    });
}
exports.getAccountNFTs = getAccountNFTs;
function getPoolInfo(address) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        const endpoint = 'https://api.indexer.xyz/graphql';
        const headers = {
            'x-api-user': 'Snotra',
            'x-api-key': process.env.INDEXER_API_KEY || '',
        };
        const client = new graphql_request_1.GraphQLClient(endpoint, { headers });
        const data = yield client.request(nftFieldsQuery, { address });
        // Check if collections array exists and has at least one element
        if ((_b = (_a = data === null || data === void 0 ? void 0 : data.sui) === null || _a === void 0 ? void 0 : _a.collections) === null || _b === void 0 ? void 0 : _b.length) {
            return data.sui.collections[0];
        }
        else {
            // Handle the case where there are no collections
            console.error('No collections found for the given address');
            return undefined;
        }
    });
}
exports.getPoolInfo = getPoolInfo;
//# sourceMappingURL=utils.js.map