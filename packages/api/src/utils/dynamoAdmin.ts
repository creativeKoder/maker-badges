const _ = require('lodash');
const { v4: uuidv4 } = require("uuid");
const AWS = require("aws-sdk");

const badgeTemplates = [
  {
    "templateId": 0,
    "action": "Chai",
    "checked": "MakerBadges",
    "ipfs": "Dev"
  },
  {
    "templateId": 1,
    "action": "Chief",
    "checked": "MakerBadges",
    "ipfs": "Dev"
  },
  {
    "templateId": 2,
    "action": "Robot",
    "checked": "MakerBadges",
    "ipfs": "Dev"
  },
  {
    "templateId": 3,
    "action": "Flipper",
    "checked": "MakerBadges",
    "ipfs": "Dev"
  },
  {
    "templateId": 4,
    "action": "Accrue 1 Dai from DSR",
    "checked": "TheGraph",
    "ipfs": ""
  },
  {
    "templateId": 5,
    "action": "Earn in DSR for 3 months",
    "checked": "TheGraph",
    "ipfs": ""
  },
  {
    "templateId": 6,
    "action": "Earn in DSR for 6 months",
    "checked": "TheGraph",
    "ipfs": ""
  },
  {
    "templateId": 7,
    "action": "Send 10 Dai",
    "checked": "TheGraph",
    "ipfs": ""
  },
  {
    "templateId": 8,
    "action": "Send 20 Dai",
    "checked": "TheGraph",
    "ipfs": ""
  },
  {
    "templateId": 9,
    "action": "Vote on a Governance Poll",
    "checked": "TheGraph",
    "ipfs": ""
  },
  {
    "templateId": 10,
    "action": "Vote on 5 Governance Polls",
    "checked": "TheGraph",
    "ipfs": ""
  },
  {
    "templateId": 11,
    "action": "Vote on 10 Governance Polls",
    "checked": "TheGraph",
    "ipfs": ""
  },
  {
    "templateId": 12,
    "action": "Vote on 20 Governance Polls",
    "checked": "TheGraph",
    "ipfs": ""
  },
  {
    "templateId": 13,
    "action": "Vote on 50 Governance Polls",
    "checked": "TheGraph",
    "ipfs": ""
  },
  {
    "templateId": 14,
    "action": "Vote on 100 Governance Polls",
    "checked": "TheGraph",
    "ipfs": ""
  },
  {
    "templateId": 15,
    "action": "Vote on 2 consecutive Governance Polls",
    "checked": "TheGraph",
    "ipfs": ""
  },
  {
    "templateId": 16,
    "action": "Vote on 5 consecutive Governance Polls",
    "checked": "TheGraph",
    "ipfs": ""
  },
  {
    "templateId": 17,
    "action": "Vote on 10 consecutive Governance Polls",
    "checked": "TheGraph",
    "ipfs": ""
  },
  {
    "templateId": 18,
    "action": "Vote on an Executive Proposal",
    "checked": "TheGraph",
    "ipfs": ""
  },
  {
    "templateId": 19,
    "action": "Vote on 5 Executive Proposals",
    "checked": "TheGraph",
    "ipfs": ""
  },
  {
    "templateId": 20,
    "action": "Vote on 10 Executive Proposals",
    "checked": "TheGraph",
    "ipfs": ""
  },
  {
    "templateId": 21,
    "action": "Vote on 20 Executive Proposals",
    "checked": "TheGraph",
    "ipfs": ""
  },
  {
    "templateId": 22,
    "action": "Vote on 50 Executive Proposals",
    "checked": "TheGraph",
    "ipfs": ""
  },
  {
    "templateId": 23,
    "action": "First Executive Voter",
    "checked": "TheGraph",
    "ipfs": ""
  },
  {
    "templateId": 24,
    "action": "First Governance Poller",
    "checked": "TheGraph",
    "ipfs": ""
  },
  {
    "templateId": 25,
    "action": "Bite an unsafe Vault",
    "checked": "TheGraph",
    "ipfs": ""
  },
  {
    "templateId": 26,
    "action": "Bite 10 unsafe Vaults",
    "checked": "TheGraph",
    "ipfs": ""
  },
  {
    "templateId": 27,
    "action": "Bite 50 unsafe Vaults",
    "checked": "TheGraph",
    "ipfs": ""
  },
  {
    "templateId": 28,
    "action": "Bite 100 unsafe Vaults",
    "checked": "TheGraph",
    "ipfs": ""
  },
  {
    "templateId": 29,
    "action": "Bid on a Collateral Auction",
    "checked": "TheGraph",
    "ipfs": ""
  },
  {
    "templateId": 30,
    "action": "Bid on 5 Collateral Auctions",
    "checked": "TheGraph",
    "ipfs": ""
  },
  {
    "templateId": 31,
    "action": "Bid on 10 Collateral Auctions",
    "checked": "TheGraph",
    "ipfs": ""
  },
  {
    "templateId": 32,
    "action": "Bid on 25 Collateral Auctions",
    "checked": "TheGraph",
    "ipfs": ""
  },
  {
    "templateId": 33,
    "action": "Won a Collateral Auction",
    "checked": "TheGraph",
    "ipfs": ""
  },
  {
    "templateId": 34,
    "action": "Won 5 Collateral Auctions",
    "checked": "TheGraph",
    "ipfs": ""
  },
  {
    "templateId": 35,
    "action": "Won 10 Collateral Auctions",
    "checked": "TheGraph",
    "ipfs": ""
  },
  {
    "templateId": 36,
    "action": "Won 25 Collateral Auctions",
    "checked": "TheGraph",
    "ipfs": ""
  }
];

AWS.config.credentials = new AWS.SharedIniFileCredentials({ profile: "local" });

var localConfig = {
  endpointDiscoveryEnabled: true,
  apiVersion: '2012-08-10',
  region: "local",
  endpoint: "http://0.0.0.0:8000",
};
AWS.config.update(localConfig);

var dynamo   = new AWS.DynamoDB();
var dynamoDb = new AWS.DynamoDB.DocumentClient();


const DYNAMODB_TABLE = 'badge-templates';

function getDynamoTables() {
  return new Promise((resolve, reject) => {
    var params = {};
    dynamo.listTables(params, (err, data) => {
      console.log(data);
      if(err) reject(err);
      else resolve(data);
    })
  })
}

getDynamoTables()
  .then((data) => { console.log(tables); });


async function addOrUpdateBadgeTemplateRecord(_data) {
  return new Promise(async (resolve) => {
    const timestamp = new Date().getTime();
    const params = {
      TableName: 'badge-templates',
      Item: {
        id: uuidv4(),
        createdAt: timestamp,
        updatedAt: timestamp,
        ..._data
      },
    };
    dynamoDb.put(params, (error, result) => {
      if (error) {
        console.log(error);
      }
      resolve(result);
      return;
    });
  });
};

const promises = _.map(badgeTemplates, ((badge) => { addOrUpdateBadgeTemplateRecord(badge); }));

Promise
  .all(promises)
  .then((results) => { console.log('Finished All', results); });
