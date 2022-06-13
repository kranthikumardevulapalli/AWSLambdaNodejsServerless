const AWS       = require('aws-sdk');
const s3        = new AWS.S3();

/**
 * This handler method is used for reading uploaded text file and count words and write result in text file and upload to s3 bucket
 * This function trigeer by s3 bucket
 * when new file uploaded into s3 bucket this function will trigger and performs operation  
 * 
 */
exports.handler = async (event) => {
    
    const bucket    = process.env.bucket_name;
    // This variable holds file name, after lambda invokes from s3 this variable holds file name
    var file_name   = event.Records[0].s3.object.key
    
    //This condition is used for not invoking result file from s3 and upload result file into s3
    //s3 will trigger lambda when file a new file is added, so this condition prevents this case

    if(file_name.split('/')[1].split('_')[0]!='count'){  
        
        /**
         * start of reading file
         * Reading upladed file from s3 bucket and finding out the count of words in text file
         */

        var reading_file = {
            Bucket: bucket,
            Key: file_name
        };

        let count = 0;
        let success = false;
    
        try{
            let data = await get_data(reading_file);
            let info  = data.Body.toString('utf-8');
            count = info.split(" ").length;
            success = true;
            
        }catch(err){ 
            console.log(err);
        }

        /**
         * End of reading file
         */
    
        /**
         * start of writing result file into s3 bucket in same directory
         * This will take bucket name, file name as input
         */

        if(success){
            var write_data_params = {
                    Body: count.toString(),
                    Bucket: bucket,  
                    Key: file_name.split('/')[0]+"/"+"count_"+file_name.split('/')[1]
                }
                
            try{
                let writefile = await write_data(write_data_params);
                    console.log(writefile);
            }catch(err){
                console.log(err);
            }
        }
    }
};

/**
 * This function reads data from s3 bucket
 * @param bucket name
 * @param filename
 * @returns text file data
 */
const get_data = (reading_file)=>
    new Promise((resolve,reject)=>{
       s3.getObject(reading_file,(err,data)=>{
          if(err){
              reject(err);
          } else{
              resolve(data);
          }
       });
    });
    
/**
 * This function write result into file and upload into s3 bucket
 * @param result
 * @param bucketname
 * @param filename 
 * @returns uploads result file into same directory of parent file
 */ 
const write_data = (write_data_params)=>
    new Promise((resolve,reject)=>{
       s3.putObject(write_data_params,(err,data)=>{
          if(err){
              reject(err);
          } else{
              resolve(data);
          }
       });
    });

