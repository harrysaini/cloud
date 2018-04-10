var AWS  = require('aws-sdk');
var uuid = require('uuid/v4');
var multer = require('multer');
var config = require('../config/config');

AWS.config.update({
	accessKeyId: config.aws_s3.accessKey,
	secretAccessKey: config.aws_s3.accessSecret,
	region: config.aws_s3.region
});

var s3 = new AWS.S3();

/*get random file name*/
function getFileName(){
	return 'sha-uploads-'+uuidv4();
}




function uploadToS3(req){
	return new Promise(function(resolve,reject){

		let params = {
			Bucket: config.aws_s3.imageBucket,
			Key: getFileName(),
			Body: req.file.buffer,
			ContentType: req.file.mimetype,
			ACL: 'public-read'
		};


		s3.upload(params,function(err,data){
			if(err){
				return reject(err)
			}
			return resolve(data);

		});
	});  


}

exports.uploadAttachments = function(req , res){
	var upload = multer();
	var cpUpload = upload.single('attachment');

	cpUpload(req, res, function(uploadError) {


		uploadToS3(req).then(function(data){
			console.log(data);

			return res.json({
				key : data.key,
				location : data.Location
			})

		}).catch(function(err){

			console.log(err);

			return res.status(422).send({
				status: 1,
				message: String(err)

			});
		});

	});
}