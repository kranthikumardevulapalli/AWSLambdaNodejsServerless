const AWS       = require('aws-sdk');
const s3        = new AWS.S3();
const multipart = require('aws-lambda-multipart-parser');
const Response  = (statusCode,body)=>{
    return {
        'statusCode' : statusCode,
        'body'       : JSON.stringify(body),
        headers    : {
            'Content-Type':'application/json',
            'Access-Control-Allow-Origin':'*'
        }
    }
};

/**
 * This handler method uploads a text file into s3 bucket
 * takes taxt file as an input in the form of multipart/formdata
 * uploads text file into s3 bucket
 */
exports.handler = async (event) => {
    
    const bucket = process.env.bucket_name;
    // Here multipart module is used for parse the formdata after uploading the text file through AWS API gateway
    const result = multipart.parse(event)
    
    // This condition is using for allowing only text files to upload
    if (result.file.contentType === 'text/plain') {
        
        var file_directory = result.file.filename.split('.').length == 2 ? result.file.filename.split('.')[0] : result.file.filename.split('.')[0]
        var file_name = result.file.filename;
        var content = result.file.content;
        var file_params = { Bucket: bucket, Key: file_directory + "/" + file_name, Body: content };
        var key_count = null;

        /**
         * checking file name directory existed in bucket
         * This will take inputs of bucket name and directory name
         * returns if directory existed or not
         */
            let params = {
                Bucket: bucket,
                Prefix: file_directory,
                MaxKeys: 1
            }

            try {
                const get_info = await get_data(params);
                console.log(get_info)
                key_count = get_info.KeyCount;
            } catch (err) {
                console.log(err);
                return Response(400,{'statuscode':400,'body':err.body});
            }

        /**
         * End of checking file name directory existed in bucket
         */

        // If directory with file name not existed enters this if condition

        if (key_count == 0) {

            /**
             * start of uploading file
             *Using aws sdk s3 upload method, file will upload into s3 bucket with separate directory 
             */

            try {
                const uploaddata = await s3.upload(file_params).promise();
                console.log(uploaddata);
                return Response(200,{'statuscode':200,'body':"file successfully uploaded."});
            } catch (err) {
                console.log(err);
                return Response(400,{'statuscode':400,'body':err.body});
            }
            /**
             * End of uploading file
             */

        } else {
            // If same file name already existed this error will throw.
            return Response(400,{'statuscode':400,'body':"file name already existed, please choose different file name."});
        }

    } else {
        // If any other files uploaded this error will throw
        return Response(400,{'statuscode':400,'body':"only text file is allowed."});
    }
};

/**
 * This function check same directory is existed or not
 * @param bucketname
 * @param directoryname
 * @returns directory information
 */
const get_data = (params) =>
    new Promise((resolve, reject) => {
        s3.listObjectsV2(params, (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });