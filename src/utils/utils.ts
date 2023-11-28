import { GraphQLClient, gql } from 'graphql-request';
/* eslint-disable @typescript-eslint/no-explicit-any */

const priceQuery = gql`
query MyQuery($slug: String!) {
  sui {
    collections(where: { slug: { _eq: $slug } }) {
      floor
    }
  }
}
`;

const nftFieldsQuery = gql`
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

const nftsQuery = gql`
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

export async function getFloorPrice(slug: string) : Promise<number | undefined> {
    const endpoint = 'https://api.indexer.xyz/graphql';
    const headers = {
      'x-api-user': 'Snotra',
      'x-api-key': process.env.INDEXER_API_KEY || '',
    };
  
    const client = new GraphQLClient(endpoint, { headers });
  
    const data: any = await client.request(priceQuery, { slug });

    // Check if collections array exists and has at least one element
    if (data?.sui?.collections?.length) {
      const floor: number = data.sui.collections[0].floor;
      return floor;
    } else {
      // Handle the case where there are no collections
      console.error('No collections found for the given slug');
      return undefined;
    }
}

// Define the types for the GraphQL response
interface CollectionInfo {
  slug: string;
}

interface NftInfo {
  collection: CollectionInfo;
  token_id: string;
}

interface NftsData {
  sui: {
    nfts: NftInfo[];
  };
}

export async function getAccountNFTs(address: string) : Promise<any> {
    const endpoint = 'https://api.indexer.xyz/graphql';
    const headers = {
      'x-api-user': 'Snotra',
      'x-api-key': process.env.INDEXER_API_KEY || '',
    };
  
    const client = new GraphQLClient(endpoint, { headers });
  
    const data: NftsData = await client.request(nftsQuery, { address });
    // Check if nfts array exists
    if (data?.sui?.nfts) {
      return data.sui.nfts;
    } else {
      // Handle the case where there are no NFTs
      console.error('No NFTs found for the given address');
      return undefined;
    }
}

interface Collection {
  title: string;
  floor: number;
  cover_url: string;
}

interface SuiData {
  collections: Collection[];
}

interface QueryData {
    sui: SuiData;
}

export async function getPoolInfo(address: string) : Promise<any> {
    const endpoint = 'https://api.indexer.xyz/graphql';
    const headers = {
      'x-api-user': 'Snotra',
      'x-api-key': process.env.INDEXER_API_KEY || '',
    };
  
    const client = new GraphQLClient(endpoint, { headers });
  
    const data: QueryData = await client.request(nftFieldsQuery, { address });
    // Check if collections array exists and has at least one element
    if (data?.sui?.collections?.length) {
      return data.sui.collections[0];
    } else {
      // Handle the case where there are no collections
      console.error('No collections found for the given address');
      return undefined;
    }
}
