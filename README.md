AWS Lamda Nodejs serverless Project:
1. uploading a text file into s3 bucket using aws api gateway and lambda
2. S3 Lambda trigger perform count words of text file and store result into a text file and upload into same directory
3. Using file name as an input retrive result from file using API gatewat and Lambda function

AWS services used for this project:
1. Functions:
    a. upload_file_into_s3
    b. read_file_from_s3
    c. count_words_from_file

2. API Gateway

3. S3 bucket

Description:

1(a) upload_file_into_s3 Function:
 - this function is connected with api gateway takes text file as an input and upload into s3 bucket
 - Using API gateway we need to invoke this function

2(b) read_file_from_s3 Trigger Function:
 - this lambda function connects with s3 bucket as a trigger
 - when new file uploads into s3 bucket this lambda function will trigger
 - reading text file and performing counting words operation
 - storing results file with in same directory of parent file

3(c) count_words_from_file Function:
 - This function takes file name as input and return result
 - Through API gateway we need to invoke this function

Deploy this application using serverless framework:
command:
- npm i
- sls deploy