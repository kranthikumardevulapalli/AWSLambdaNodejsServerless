const AWS       = require('aws-sdk');
const s3        = new AWS.S3();
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
 * This handler method takes file name as an input and file call from s3 and gives result
 */
exports.handler = async (event) => {

    const body      = JSON.parse(event.body);
    const bucket    = process.env.bucket_name;
    const filename  = body.filename;
    var check_path  = filename.split('.'); 
    var file_key    = null;
    
    // This condition is used for checking if text file extention is given or not if not given it will add.
    if((check_path[1]==='txt')){
        file_key = check_path[0]+"/"+"count_"+filename
    }else{
        file_key = check_path[0]+"/"+"count_"+filename+".txt"
    }
    
    /**
     * This function is used for retreving file from s3 and give result as a response
     */
    var get_file_params = {
        Bucket: bucket,
        Key: file_key,
    };
    
    try{
        let data = await get_data(get_file_params);
        let info  = data.Body.toString('utf-8');
        return Response(200,{'statuscode':200,'body':"Text file words count is: "+info});
    }catch(err){ 
        console.log(err);
        if(err.code==='NoSuchKey'){
            return Response(400,{'statuscode':400,'body':"File name not existed, plese give valid filename"});
        }
    }
};

/**
 * This function get file from s3 and gives response
 * @param bucketname
 * @param filename 
 * @returns gives result from text file
 */
const get_data = (get_file_params)=>
    new Promise((resolve,reject)=>{
       s3.getObject(get_file_params,(err,data)=>{
          if(err){
              reject(err);
          } else{
              resolve(data);
          }
       });
    });