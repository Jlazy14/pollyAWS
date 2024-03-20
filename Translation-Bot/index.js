const AWS = require('aws-sdk');

const polly = new AWS.Polly();
const s3 = new AWS.S3();

exports.handler = async (event) => {
    try {
        const text = event.text;

        const params = {
            Text: text,
            OutputFormat: 'mp3',
            VoiceId: 'Joanna' // You can change this to the desired voice
        };

        const data = await polly.synthesizeSpeech(params).promise();

        const key = `audio-${Date.now()}.mp3`;

        const s3Params = {
            Bucket: 'lacy-polly', // Replace with your S3 bucket name
            Key: key,
            Body: data.AudioStream,
            ContentType: 'audio/mpeg'
        };

        await s3.upload(s3Params).promise();

        const outputMessage = `The audio file has been successfully stored in the S3 bucket by the name ${key}`;

        return {
            statusCode: 200,
            body: JSON.stringify({ message: outputMessage })
        };
    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Internal server error' })
        };
    }
};

