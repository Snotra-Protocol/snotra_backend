export const options = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'Express API with Swagger',
        version: '1.0.0',
      },
      components: {
        schemas: {
            User: {
                type: 'object',
                properties: {
                  totalValue: { type: 'number' },
                  totalStaked: { type: 'number' },
                  totalReward: { type: 'number' },
                  apr: { type: 'number' },
                  StakedNft: { 
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        nft_id: { type: 'string' },
                        pool_id: { type: 'string' },
                        owner: { type: 'string' },
                        nft_type: { type: 'string' },
                        reward_coin_type: { type: 'string' },
                        daily_reward: { type: 'number' }
                      }
                    }
                  },
                },
              },
              GeneralInfo: {
                type: 'object',
                properties: {
                  totalTVL: { type: 'number' },
                  totalStaked: { type: 'number' },
                  totalApr: { type: 'number' },
                },
              },
              Pool: {
                type: 'object',
                properties: {
                  pool_id: { type: 'string' },
                  creator: { type: 'string' },
                  nft_type: { type: 'string' },
                  reward_coin_type: { type: 'string' },
                  is_rarity: { type: 'number' },
                  creation_time: { type: 'number' },
                  lock_duration: { type: 'number' },
                  daily_reward_per_nft: { type: 'number' },
                  max_daily_reward_per_nft: { type: 'number' },
                  initial_reward_amt: { type: 'number' },
                },
              },
              Collection: {
                type: 'object',
                properties: {
                  title: { type: 'string' },
                  floor: { type: 'number' },
                  cover_url: { type: 'string' },
                },
              },
              NftHistory: {
                type: 'object',
                properties: {
                  nft_id: { type: 'string' },
                  pool_id: { type: 'string' },
                  action: { type: 'string' },
                  timestamp: { type: 'number' },
                  nft_type: { type: 'string' },
                  owner: { type: 'string' },
                  reward_coin_type: { type: 'string' },
                  daily_reward: { type: 'number' },
                },
              },
              PoolInfo: {
                type: 'object',
                properties: {
                  pool: { $ref: '#/components/schemas/Pool' },
                  collection: { $ref: '#/components/schemas/Collection' },
                  transactions: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/NftHistory' },
                  },
                },
              },
        },
      },
    },
    apis: ['./src/routes/routes.ts'], // path to the API docs
  };