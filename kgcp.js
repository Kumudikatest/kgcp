const google = require('googleapis').google;
const _auth = require('./Authorizer');
const pubsub = google.pubsub('v1');
const AWS = require('aws-sdk');
const ddb = new AWS.DynamoDB.DocumentClient();
const cognito_idp = new AWS.CognitoIdentityServiceProvider();

exports.handler = function (request, response) {
    cognito_idp.listUsers({
        UserPoolId: "us-east-1_jfB99rZCt",
        Limit: 10
    }).promise()
        .then(data => {
            console.log(data);
            // your code goes here
        })
        .catch(err => {
            console.log(err);
            // error handling goes here
        });
    ddb.scan({
        TableName: "ChineseAnimal"
    }).promise()
        .then(data => {
            console.log(data);
            // your code goes here
        })
        .catch(err => {
            console.log(err);
            // error handling goes here
            pubsub.projects.topics.subscriptions.list({
                topic: `projects/${process.env.GCP_PROJECT}/topics/test.indunill`,
                pageSize: 10
            })
                .then(response => {
                    console.log(response.data);  // successful response
                    /*
                    response.data = {
                        "subscriptions": [
                            "projects/<project>/subscriptions/<subscription-1>",
                            "projects/<project>/subscriptions/<subscription-2>",
                            ...
                        ]
                    }
                    */
                })
                .catch(err => {
                    console.log(err, err.stack); // an error occurred
                });
        });

    response.send({ "message": "Successfully executed" });
}