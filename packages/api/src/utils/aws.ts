import * as _ from 'lodash';
import * as AWS from 'aws-sdk';
const { v4: uuidv4 } = require("uuid");

// const AWS = require("aws-sdk");

// AWS.config.update({ region: "us-east-1" });
// var dynamoDb = new AWS.DynamoDB.DocumentClient();

if (process.env.ENVIRONMENT !== "production") {
  var credentials = new AWS.SharedIniFileCredentials({ profile: "local" });
  AWS.config.credentials = credentials;
  AWS.config.update({ region: "local" });
  var localConfig = {
    region: "localhost",
    endpoint: "http://localhost:8000",
  }
  var dynamoDb = new AWS.DynamoDB.DocumentClient(localConfig);
}

const DYNAMODB_TABLE: string = process.env.DYNAMODB_TABLE!;

export async function addOrUpdateTemplateRecord(
  _templateId: number,
  _addresses: string[],
  _root: string,
  _progress: object,
) {
  return new Promise(async (resolve) => {
    const timestamp = new Date().getTime();
    const tId = await getIdByTemplate(_templateId);

    if (_.isNull(tId)) {
      const params = {
        TableName: DYNAMODB_TABLE,
        Item: {
          id: uuidv4(),
          templateId: _templateId,
          addresses: JSON.stringify(_addresses),
          root: _root,
          progress: JSON.stringify(_root),
          createdAt: timestamp,
          updatedAt: timestamp,
        },
      };
      // console.log(params);
      dynamoDb.put(params, (error: any, result: any) => {
        if (error) { console.log(error); }
        console.log(result);
        resolve(result);
        return;
      });
    }

    if (tId) {
      const params = {
        TableName: DYNAMODB_TABLE,
        Key: { id: tId },
        UpdateExpression:
          "set addresses = :v, root = :w, progress = :x, updatedAt = :y",
        ExpressionAttributeValues: {
          ":v": JSON.stringify(_addresses != [] ? _addresses.sort() : []),
          ":w": _root,
          ":x": JSON.stringify(_progress),
          ":y": timestamp,
        },
      };
      // console.log(params);
      dynamoDb.update(params, (error: any, result: any) => {
        if (error) { console.log(error); }
        console.log(result);
        resolve(result);
      });
    }
  });

}

function getIdByTemplate(templateId: number) {
  return new Promise((resolve, reject) => {
    const params = {
      TableName: DYNAMODB_TABLE,
      IndexName: "templateId-index",
      KeyConditionExpression: "templateId = :templateId",
      ExpressionAttributeValues: {
        ":templateId": templateId,
      },
    };

    // console.log(params);
    dynamoDb.query(params, (error: any, result: any) => {
      const items = _.get(result, 'Items');
      console.log(_.size(items));
      console.log(items);

      if (error) { console.log(error); reject({error: error}); }

      if (_.size(items)) {
        console.log('getIdByTemplate:', _.head(items));
        resolve(_.get(_.head(items), "root"));
        return;
      }

      resolve(null);
    });
  });
}

export function getTemplate(
  templateId: number,
): Promise<{ addresses: string[]; root: string; progress: Object }> {
  return new Promise((resolve, reject) => {
    const params = {
      TableName: DYNAMODB_TABLE,
      IndexName: "templateId-index",
      KeyConditionExpression: "templateId = :templateId",
      ExpressionAttributeValues: {
        ":templateId": templateId,
      },
    };
    dynamoDb.query(params, (error: any, result: any) => {
      const items = _.get(result, 'Items');

      if (error) { console.log(error); reject(); }

      if (_.size(items)) {
        const addresses = _.get(items, '0.addresses');
        resolve({
          addresses: [...JSON.parse(addresses)],
          root: _.get(items, '0.root'),
          progress: _.get(items, '0.progress'),
        });
        return;
      }

      resolve({
        addresses: [],
        root: "",
        progress: {},
      });
    });
  });
}
