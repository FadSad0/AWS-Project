const AWS = require('aws-sdk');

const s3 = new AWS.S3();

exports.handler = async (event) => {
    // Handle OPTIONS request
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': 'http://upload-file-1019.s3-website-ap-northeast-1.amazonaws.com',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Amz-Date, Authorization, X-Api-Key, X-Amz-Security-Token',
                'Access-Control-Allow-Credentials': 'true'
            },
            body: JSON.stringify({ message: 'CORS Preflight successful' })
        };
    }

    // Handle other HTTP methods (POST, GET, etc.)
    if (event.httpMethod === 'POST') {
        const { fileName, fileType } = JSON.parse(event.body);

        const params = {
            Bucket: 'upload-file-1019',
            Key: `uploads/${Date.now()}-${fileName}`,
            Expires: 60, // URL expiration time in seconds
            ContentType: fileType,
        };

        const presignedUrl = await s3.getSignedUrl('putObject', params);

        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ presignedUrl }),
        };
    }

    // Return error for unsupported HTTP methods
    return {
        statusCode: 400,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: 'Unsupported HTTP method' }),
    };
};
