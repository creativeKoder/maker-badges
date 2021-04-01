import gql from "graphql-tag";
export const collateralFlippers = {
  "ETH-A": "0xF32836B9E1f47a0515c6Ec431592D5EbC276407f",
  "BAT-A": "0xF7C569B2B271354179AaCC9fF1e42390983110BA",
  "USDC-A": "0xbe359e53038E41a1ffA47DAE39645756C80e557a",
  // "USDC-B": "0x77282aD36aADAfC16bCA42c865c674F108c4a616",
  "WBTC-A": "0x58CD24ac7322890382eE45A3E4F903a5B22Ee930",
  // "TUSD-A": "0x9E4b213C4defbce7564F2Ac20B6E3bF40954C440",
  // "ZRX-A": "0xc7e8Cd72BDEe38865b4F5615956eF47ce1a7e5D0",
  // "KNC-A": "0x475F1a89C1ED844A08E8f6C50A00228b5E59E4A9",
  // "MANA-A": "0xA6EA3b9C04b8a38Ff5e224E7c3D6937ca44C0ef9"
};

export const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";
export const ZERO_ROOT = "0x0000000000000000000000000000000000000000000000000000000000000000";

export const SUBGRAPH_BATCHES = 1000;
export const BATCH_QUERIES = 5000;

export const ALL_BITES_QUERY = gql`
  query allBites($collateral: String!, $offset: Int) {
    allBites(ilkIdentifier: $collateral, first: ${BATCH_QUERIES}, offset: $offset) {
      nodes {
        bidId
        tx {
          txFrom
        }
      }
      pageInfo {
        endCursor
        hasNextPage
      }
    }
  }
`;

export const ALL_FLIP_BIDS_QUERY = gql`
  query allFlipBidEvents($offset: Int) {
    allFlipBidEvents(first: ${BATCH_QUERIES}, offset: $offset) {
      nodes {
        bidId
        act
        tx {
          nodes {
            txFrom
          }
        }
      }
      pageInfo {
        endCursor
        hasNextPage
      }
    }
  }
`;

export const ALL_FLIP_WINS_QUERY = gql`
  query allFlipBidGuys($flipper: String!, $offset: Int) {
    allFlipBidGuys(
      filter: {
        addressByAddressId: { address: { equalToInsensitive: $flipper } }
      }
      orderBy: HEADER_BY_HEADER_ID__BLOCK_NUMBER_DESC
      first: ${BATCH_QUERIES}
      offset: $offset
    ) {
      nodes {
        bidId
        guy
      }
      pageInfo {
        endCursor
        hasNextPage
      }
    }
  }
`;

// USER QUERIES

// FLIP BIDS FOR USER
export const USER_FLIPS_BIDS_QUERY = gql`
  query userFlipBids($flipper: String!, $address: String) {
    allFlipBidGuys(
      filter: {
        addressByAddressId: { address: { equalToInsensitive: $flipper } }
        guy: { equalToInsensitive: $address }
      }
      orderBy: HEADER_BY_HEADER_ID__BLOCK_NUMBER_DESC
      first: ${BATCH_QUERIES}
      offset: 0
    ) {
      nodes {
        bidId
        guy
      }
    }
  }
`;

// FLIP WINS FOR USER
