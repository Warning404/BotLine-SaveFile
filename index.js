var axios = require('axios');
var fs = require('fs');
const fastify = require("fastify")({ logger: true });
const PORT = process.env.PORT || 3000;

var channelToken = "1PZT/4Z4xYMVr70h/i2WFmM5QCCLIrDVJ9coQYN8OOBudY2v+zKKfcZutl8sV2pqE0pcqGW7TANW0tnKCVtCTLe/9f8uAypz0R5kRwXrgtn287H9yx7eZvLsGlWwTg0Zug4OWskQYOSj7iVAMXU9ngdB04t89/1O/w1cDnyilFU=";
var discordWebhookUrl = "https://discord.com/api/webhooks/1177581734808784967/CyKsuy3m9bcG8dQEsa2grm5Iyx6Qba8l_QP4X8_ZmH72Rynswdyln4W4fts8MMDsA4xx";

fastify.post("/webhook", async (request, reply) => {
  try {
    const event = request.body; // LINE webhook event data
    await handleLineWebhook(event);
    reply.code(200).send({ success: true });
    await main();
  } catch (error) {
    console.error(error);
    reply.code(500).send({ success: false, error: "Internal Server Error" });
  }
});

async function main() {
  // Example usage
  const event = {
    // Replace with your LINE webhook event data
  };

  await handleLineWebhook(event);
}
function replyMsg(replyToken, mess, channelToken) {
  var url = 'https://api.line.me/v2/bot/message/reply';
  var headers = {
    'Content-Type': 'application/json; charset=UTF-8',
    'Authorization': 'Bearer ' + channelToken,
  };
  var data = {
    'replyToken': replyToken,
    'messages': mess
  };

  axios.post(url, data, { headers })
    .then(response => {
      console.log(response.data);
    })
    .catch(error => {
      console.error(error);
    });
}

async function sendToDiscord(messageId, meType, mType, channelToken, cType = '') {
  var url = `https://api-data.line.me/v2/bot/message/${messageId}/content`;
  var headers = {
    'Authorization': 'Bearer ' + channelToken
  };

  if (cType !== '') {
    messageId = '';
  }

  try {
    var getcontent = await axios.get(url, { headers, responseType: 'arraybuffer' });
    var fileBlob = Buffer.from(getcontent.data, 'binary');
    var payload = {
      "file": {
        value: fileBlob,
        options: {
          filename: `${messageId}${mType}`,
          contentType: meType
        }
      }
    };

    var response = await axios.post(discordWebhookUrl, payload);
    var responseData = response.data;

    if (responseData.attachments && responseData.attachments[0] && responseData.attachments[0].url) {
      return responseData.attachments[0].url;
    } else {
      return 'ไม่สามารถบันทึกไฟล์ได้';
    }
  } catch (error) {
    console.error(error);
    return 'Error uploading file to Discord';
  }
}

async function handleLineWebhook(event) {
  var value = event; // Replace with your LINE webhook event data
  var events = value.events;
  console.log(value);
  var event = events[0];
  var type = event.type;
  var replyToken = event.replyToken;
  var sourceType = event.source.type;
  var userId = event.source.userId;
  var groupId = event.source.groupId;
  var timeStamp = event.timestamp;

  switch (type) {
    case 'follow':
      break;
    case 'message':
      var messageType = event.message.type;
      var messageId = event.message.id;
      var messageText = event.message.text;

      if (messageType == 'file') {
        var fileName = event.message.fileName;
        var fileType = fileName.split('.', 2)[1];
        var fileN = fileName.split('.', 2)[0];

        if(fileType=="pdf"){var mimetype="application/pdf";}
            else if(fileType=="zip"){var mimetype="application/zip";}
            else if(fileType=="rar"){var mimetype="application/vnd.rar";}
            else if(fileType=="7z"){var mimetype="application/x-7z-compressed";}
            else if(fileType=="doc"){var mimetype="application/msword";}
            else if(fileType=="xls"){var mimetype="application/vnd.ms-excel";}
            else if(fileType=="ppt"){var mimetype="application/vnd.ms-powerpoint";}
            else if(fileType=="docx"){var mimetype="application/vnd.openxmlformats-officedocument.wordprocessingml.document";}
            else if(fileType=="xlsx"){var mimetype="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";}
            else if(fileType=="pptx"){var mimetype="application/vnd.openxmlformats-officedocument.presentationml.presentation";}
            else if(fileType=="mp4"){var mimetype="video/mp4";}
            else if(fileType=="mp3"){var mimetype="audio/mpeg";}
            else if(fileType=="png"){var mimetype="image/png";}
            else if(fileType=="gif"){var mimetype="image/gif";}
            else if(fileType=="jpg"){var mimetype="image/jpeg";}
            else if(fileType=="jpeg"){var mimetype="image/jpeg";}
            else if(fileType=="exe"){var mimetype="application/octet-stream";}
            else if(fileType=="txt"){var mimetype="text/plain";}
            else if(fileType=="html"){var mimetype="text/html";}
            else if(fileType=="css"){var mimetype="text/css";}
            else if(fileType=="js"){var mimetype="application/javascript";}
            else if(fileType=="wav"){var mimetype="audio/wav";}
            else if(fileType=="ogg"){var mimetype="audio/ogg";}
            else if(fileType=="mov"){var mimetype="video/quicktime";}
            else if(fileType=="avi"){var mimetype="video/x-msvideo";}
            else if(fileType=="svg"){var mimetype="image/svg+xml";}
            else if(fileType=="tar"){var mimetype="application/x-tar";}
            else if(fileType=="php"){var mimetype="application/x-httpd-php";}
            else if(fileType=="ts"){var mimetype="application/typescript";}
            else if(fileType=="raw"){var mimetype="application/octet-stream";}
            else if(fileType=="json"){var mimetype="application/json";}
            else if(fileType=="jsonld"){var mimetype="application/ld+json";}
            else if(fileType=="csv"){var mimetype="application/ld+json";}
            else {var mimetype="undefined";}

        if (mimetype !== "undefined") {
          var x = await sendToDiscord(messageId, mimetype, fileN + '.' + fileType, channelToken, 'D');
          var mess = [{
            "type": "template",
            "altText": "Download Button",
            "template": {
              "type": "buttons",
              "thumbnailImageUrl": "https://media.discordapp.net/attachments/1177581450514665542/1177618754667040890/folder.png",
              "imageAspectRatio": "rectangle",
              "imageSize": "cover",
              "imageBackgroundColor": "#FFFFFF",
              "title": `บันทึกไฟล์ ${fileN}.${fileType}`,
              "text": "Download the file",
              "defaultAction": { "type": "uri", "label": "Download", "uri": x },
              "actions": [{ "type": "uri", "label": "Download", "uri": x }]
            }
          }];
          replyMsg(replyToken, mess, channelToken);
        } else {
          var mess = [{ 'type': 'text', 'text': `ไม่รองรับไฟล์ประเภทนี้${fileType}` }];
          replyMsg(replyToken, mess, channelToken);
        }
      }
      else if(messageType == 'text'){
                     //var mess = [{'type': 'text', 'text': "Text"}];
            }
            else if(messageType == 'sticker'){}
            else if(messageType == 'image'){
            var mType = ".jpg";
            var meType = "image/jpeg";
            var x = sendToDiscord(messageId, meType, mType, channelToken);
   
           var mess = [ { "type": "template","altText": "Download Button","template": {"type": "buttons","thumbnailImageUrl": x,"imageAspectRatio": "rectangle", "imageSize": "cover","imageBackgroundColor": "#FFFFFF","title": `บันทึกไฟล์ภาพเรียบร้อย`,"text": "Download the file","defaultAction": {"type": "uri","label": "Download","uri": x},"actions": [{"type": "uri","label": "Download","uri": x}]}}];
            
            }
            else if(messageType == 'video'){
            var mType = ".mp4";
            var meType = "video/mp4";
            var x = sendToDiscord(messageId, meType, mType, channelToken);
           
           var mess = [ { "type": "template","altText": "Download Button","template": {"type": "buttons","thumbnailImageUrl": "https://media.discordapp.net/attachments/1177581450514665542/1177618260263456809/youtube.png","imageAspectRatio": "rectangle", "imageSize": "cover","imageBackgroundColor": "#FFFFFF","title": `บันทึกไฟล์วิดีโอเรียบร้อย`,"text": "Download the file","defaultAction": {"type": "uri","label": "Download","uri": x},"actions": [{"type": "uri","label": "Download","uri": x}]}}];
            
            }
            else if(messageType == 'audio'){
            var mType = ".mp3";
            var meType = "audio/mpeg";
            var x = sendToDiscord(messageId, meType, mType, channelToken);
       
           var mess = [ { "type": "template","altText": "Download Button","template": {"type": "buttons","thumbnailImageUrl": "https://media.discordapp.net/attachments/1177581450514665542/1177618510097162280/music-wave.png","imageAspectRatio": "rectangle", "imageSize": "cover","imageBackgroundColor": "#FFFFFF","title": `บันทึกไฟล์เสียงเรียบร้อย`,"text": "Download the file","defaultAction": {"type": "uri","label": "Download","uri": x},"actions": [{"type": "uri","label": "Download","uri": x}]}}];
            
            }
            else if(messageType == 'location'){}
            if(mess){replyMsg(replyToken, mess, channelToken);}
      break;
    default:
      break;
  }
}

fastify.listen(PORT, "0.0.0.0", (err, address) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  console.log(`Server is running on ${address}`);
});
