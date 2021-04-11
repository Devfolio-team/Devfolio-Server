const express = require('express');
const AWS = require('aws-sdk');
const fs = require('fs');
const formidable = require('formidable');

const router = express.Router();

AWS.config.region = 'ap-northeast-2';

const s3 = new AWS.S3();

router.post('/', (req, res) => {
  const form = new formidable.IncomingForm();

  try {
    form.parse(req, (err, fields, files) => {
      if (err) res.status(500).send('Faild');
      const params = {
        Bucket: 'aws-devfolio',
        Key: files.image.name,
        ACL: 'public-read',
        Body: fs.createReadStream(files.image.path),
      };

      s3.upload(params, (err, data) => {
        if (err) res.status(500).send('Faild');
        else {
          res.status(201).json({
            src: data.Location,
            alt: data.Key,
          });
        }
      });
    });
  } catch (error) {
    res.status(401).send('Faild');
  }
});

module.exports = router;
