'use strict';
const AWS = require('aws-sdk');

const options = process.env.IS_OFFLINE
  ? {
      region: "localhost",
      endpoint: "http://localhost:8000",
      accessKeyId: "DEFAULT_ACCESS_KEY",
      secretAccessKey: "DEFAULT_SECRET"
    }
  : {};

module.exports = {
  create: async(event, context) => {
    console.log('creating toy....')
    let bodyObj = {}
    try {
      bodyObj = JSON.parse(event.body);
    } catch (err) {
      // the console log will go to cloud watch
      console.log('not a json body');
      return {
        statusCode: 400
      }
    }

    if (bodyObj.name === 'undefined' || bodyObj.price === 'undefine') {
      console.log('missing parameters');
      return {
        statusCode: 400
      }
    }

    // env is defined in serverless.yml
    let putParams = {
      TableName: process.env.DYNAMODB_TOY_TABLE,
      Item: {
        name: bodyObj.name,
        price: bodyObj.price
      }
    }

    let putResult = {};
    try {
      let dynamodb = new AWS.DynamoDB.DocumentClient(options);
      putResult = await dynamodb.put(putParams).promise()
    } catch (err) {
      console.log('unable to save to db')
      return {
        statusCode: 500
      }
    }
    
    console.log(`toy ${bodyObj.name} ${bodyObj.price} save to DB`)
    return {
      statusCode: 200
    }
  },
  list: async(event, context) => {
    console.log('listing toys....')
    let scanParams = {
      TableName: process.env.DYNAMODB_TOY_TABLE
    }

    let scanResult = {}
    try {
      let dynamodb = new AWS.DynamoDB.DocumentClient(options);
      scanResult = await dynamodb.scan(scanParams).promise()
    } catch (err) {
      console.log('unable to scan db');
      return {
        statusCode: 500
      }
    }

    console.log('returning the list')
    console.log(scanResult);
    return {
      statusCode: 200,
      body: JSON.stringify(scanResult.Items.map(toy => {
        return {
          name: toy.name,
          price: toy.price
        }
      }))
    }
  }
};

// module.exports.hello = async event => {
//   return {
//     statusCode: 200,
//     body: JSON.stringify(
//       {
//         message: 'Go Serverless v1.0! Your function executed successfully!',
//         input: event,
//       },
//       null,
//       2
//     ),
//   };

//   // Use this code if you don't use the http event with the LAMBDA-PROXY integration
//   // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
// };
