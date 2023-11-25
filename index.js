const express = require("express");
const line = require("@line/bot-sdk");
const axios = require("axios");
const fs = require("fs");
const FormData = require("form-data");
const channelToken =
  "1PZT/4Z4xYMVr70h/i2WFmM5QCCLIrDVJ9coQYN8OOBudY2v+zKKfcZutl8sV2pqE0pcqGW7TANW0tnKCVtCTLe/9f8uAypz0R5kRwXrgtn287H9yx7eZvLsGlWwTg0Zug4OWskQYOSj7iVAMXU9ngdB04t89/1O/w1cDnyilFU=";
  const discordWebhookUrl =
    "https://discord.com/api/webhooks/1177581734808784967/CyKsuy3m9bcG8dQEsa2grm5Iyx6Qba8l_QP4X8_ZmH72Rynswdyln4W4fts8MMDsA4xx";
const config = {
  channelAccessToken:
    "1PZT/4Z4xYMVr70h/i2WFmM5QCCLIrDVJ9coQYN8OOBudY2v+zKKfcZutl8sV2pqE0pcqGW7TANW0tnKCVtCTLe/9f8uAypz0R5kRwXrgtn287H9yx7eZvLsGlWwTg0Zug4OWskQYOSj7iVAMXU9ngdB04t89/1O/w1cDnyilFU=",
  channelSecret: "d2695c318a315b23a0b59bbc5f091774",
};

const app = express();

app.post("/webhook", line.middleware(config), (req, res) => {
  Promise.all(req.body.events.map(handleEvent))
    .then((result) => res.json(result))
    .catch((err) => {
      console.error(err);
      res.status(500).end();
    });
});

const client = new line.Client(config);



async function sendToDiscord(
  messageId,
  meType,
  mType,
  channelToken,
  cType = ""
) {
  const url = `https://api-data.line.me/v2/bot/message/${messageId}/content`;
  const headers = {
    Authorization: `Bearer ${channelToken}`,
  };

  let messageIdParam = messageId;
  if (cType !== "") {
    messageIdParam = "";
  }

  try {
    const { data } = await axios.get(url, {
      headers,
      responseType: "arraybuffer",
    });
    const fileBlob = Buffer.from(data, "binary");

    fs.writeFileSync(`${messageIdParam}${mType}`, fileBlob);
    const discordWebhookUrl =
      "https://discord.com/api/webhooks/1177581734808784967/CyKsuy3m9bcG8dQEsa2grm5Iyx6Qba8l_QP4X8_ZmH72Rynswdyln4W4fts8MMDsA4xx";
    const formData = new FormData();
    formData.append("file", fs.createReadStream(`${messageIdParam}${mType}`), {
      filename: `${messageIdParam}${mType}`,
      contentType: "application/octet-stream",
    });

    formData.append("content", `${messageIdParam}${mType}`);
    // Send the file to Discord using FormData
    const responsec = await axios.post(discordWebhookUrl, formData, {
      headers: {
        ...formData.getHeaders()
      },
    });
  console.log("File sent to Discord successfully:", responsec.data);
  return false;


    const fileStats = fs.statSync(`${messageIdParam}${mType}`);
    if (fileStats.isFile()) {
      console.log("File exists:", `${messageIdParam}${mType}`);
    } else {
      console.log("File does not exist:", `${messageIdParam}${mType}`);
    }
    

    const fileReadStream = fs.createReadStream(`${messageIdParam}${mType}`);
    const payload = {
      content: `${messageIdParam}${mType}`,
      file: {
        value: fileReadStream,
        options: {
          filename: `${messageIdParam}${mType}`,
        },
      },
    };

    const response = await axios.post(discordWebhookUrl, payload);

    const responseData = response.data;
    console.log(response);

    if (
      responseData.attachments &&
      responseData.attachments[0] &&
      responseData.attachments[0].url
    ) {
      return responseData.attachments[0].url;
    } else {
      return "ไม่สามารถบันทึกไฟล์ได้";
    }
  } catch (error) {
    
    console.error("เกิดข้อผิดพลาดในขณะส่งไปยัง Discord:", error.message);
    console.error("การตอบกลับจาก Discord API:", error.response.data);
    console.error("HTTP status code:", error.response.status);
    return "เกิดข้อผิดพลาดในขณะที่ส่งข้อมูลไปยัง Discord";
  }
}



function handleEvent(event) {
  var messageType = event.message.type;
  var messageId = event.message.id;
  var messageText = event.message.text;
  if (event.type === "message" && event.message.type === "text") {
    return client.replyMessage(event.replyToken, {
      type: "text",
      text: event.message.text,
    });
  } else if (event.message.type === "file") {

    var fileName = event.message.fileName;
    var fileType = fileName.split(".", 2)[1];
    var fileN = fileName.split(".", 2)[0];
    if (fileType == "pdf") {
      var mimetype = "application/pdf";
    } else if (fileType == "zip") {
      var mimetype = "application/zip";
    } else if (fileType == "rar") {
      var mimetype = "application/vnd.rar";
    } else if (fileType == "7z") {
      var mimetype = "application/x-7z-compressed";
    } else if (fileType == "doc") {
      var mimetype = "application/msword";
    } else if (fileType == "xls") {
      var mimetype = "application/vnd.ms-excel";
    } else if (fileType == "ppt") {
      var mimetype = "application/vnd.ms-powerpoint";
    } else if (fileType == "docx") {
      var mimetype =
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
    } else if (fileType == "xlsx") {
      var mimetype =
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
    } else if (fileType == "pptx") {
      var mimetype =
        "application/vnd.openxmlformats-officedocument.presentationml.presentation";
    } else if (fileType == "mp4") {
      var mimetype = "video/mp4";
    } else if (fileType == "mp3") {
      var mimetype = "audio/mpeg";
    } else if (fileType == "png") {
      var mimetype = "image/png";
    } else if (fileType == "gif") {
      var mimetype = "image/gif";
    } else if (fileType == "jpg") {
      var mimetype = "image/jpeg";
    } else if (fileType == "jpeg") {
      var mimetype = "image/jpeg";
    } else if (fileType == "exe") {
      var mimetype = "application/octet-stream";
    } else if (fileType == "txt") {
      var mimetype = "text/plain";
    } else if (fileType == "html") {
      var mimetype = "text/html";
    } else if (fileType == "css") {
      var mimetype = "text/css";
    } else if (fileType == "js") {
      var mimetype = "application/javascript";
    } else if (fileType == "wav") {
      var mimetype = "audio/wav";
    } else if (fileType == "ogg") {
      var mimetype = "audio/ogg";
    } else if (fileType == "mov") {
      var mimetype = "video/quicktime";
    } else if (fileType == "avi") {
      var mimetype = "video/x-msvideo";
    } else if (fileType == "svg") {
      var mimetype = "image/svg+xml";
    } else if (fileType == "tar") {
      var mimetype = "application/x-tar";
    } else if (fileType == "php") {
      var mimetype = "application/x-httpd-php";
    } else if (fileType == "ts") {
      var mimetype = "application/typescript";
    } else if (fileType == "raw") {
      var mimetype = "application/octet-stream";
    } else if (fileType == "json") {
      var mimetype = "application/json";
    } else if (fileType == "jsonld") {
      var mimetype = "application/ld+json";
    } else if (fileType == "csv") {
      var mimetype = "application/ld+json";
    } else {
      var mimetype = "undefined";
    }

    if(mimetype !== "undefined"){
   
             var x= sendToDiscord(messageId, mimetype, fileN+'.'+fileType, channelToken,'D');
    }

    
    return client.replyMessage(event.replyToken, {
      type: "text",
      text: fileN,
    });
  }
  return Promise.resolve(null);
}

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
