const express = require("express");
const line = require("@line/bot-sdk");
const axios = require("axios");
const fs = require("fs");
const FormData = require("form-data");
const channelToken =
  "Ma49cvTxIE63C/K96QCHWGck1DdT8gwMil+IowXyAT/hDD2A0bYP4TAbUBirtM2Xz01BrSvq4EEcoR3tAm4NJqP9f+F72graa4vyqlyHlKECVd0b4DDM5R4XxBPos8O3RFjVCMaUMlcByt2LRMKx3QdB04t89/1O/w1cDnyilFU=";
    const discordWebhookUrl =
      "https://discord.com/api/webhooks/1177816237137481838/lDWzUW23xPDVE7KsKhjsjMd5BGqU-rBDTSN8G55u8YNei_KICxIWXj-DjAxjAJkS-6Fz";
const config = {
  channelAccessToken:
    "Ma49cvTxIE63C/K96QCHWGck1DdT8gwMil+IowXyAT/hDD2A0bYP4TAbUBirtM2Xz01BrSvq4EEcoR3tAm4NJqP9f+F72graa4vyqlyHlKECVd0b4DDM5R4XxBPos8O3RFjVCMaUMlcByt2LRMKx3QdB04t89/1O/w1cDnyilFU=",
  channelSecret: "1dc33a631637d5de87bfbd3ee9a0f26a",
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
  fromType,
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

    const formData = new FormData();
    formData.append("file", fs.createReadStream(`${messageIdParam}${mType}`), {
      filename: `${messageIdParam}${mType}`,
      contentType: "application/octet-stream",
    });

    formData.append("content", `ชื่อเอกสาร : ${messageIdParam}${mType} , แหล่งที่มา : ${fromType}`);
    // Send the file to Discord using FormData
    const response = await axios.post(discordWebhookUrl, formData, {
      headers: {
        ...formData.getHeaders()
      },
    });   

    const responseData = response.data;
  

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



async function handleEvent(event) {
  var messageType = event.message.type;
  var messageId = event.message.id;
  let sourceType = event.source.type || "";
  let groupId = event.source.groupId || "";
  let userId = event.source.userId || "";
  let fromType = `type : ${sourceType} , groupId : ${groupId} , userId : ${userId} `;
  var messageText = event.message.text;
  if (event.type === "message" && event.message.type === "text") {
    // console.log(event);
  } else if (messageType === "file") {
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

    let cdn = `ไม่ร้องรับไฟล์${fileType}`;
    let mess;

    if (mimetype !== "undefined") {
      cdn = await sendToDiscord(
        messageId,
        mimetype,
        fileN + "." + fileType,
        channelToken,
        fromType,
        "D"
      );

      mess = [
        {
          type: "template",
          altText: "บันทึกไฟล์แล้ว ♥",
          template: {
            type: "buttons",
            
            imageAspectRatio: "rectangle",
            imageSize: "cover",
            imageBackgroundColor: "#FFFFFF",
            title: `บันทึกไฟล์ ${fileN}.${fileType}`,
            text: "Download the file",
            defaultAction: { type: "uri", label: "Download", uri: cdn },
            actions: [{ type: "uri", label: "Download", uri: cdn }],
          },
        },
      ];
    } else {
      mess = [{ type: "text", text: `ไม่รองรับไฟล์ประเภทนี้${fileType}` }];
    }
    return client.replyMessage(event.replyToken, mess);
  } else if (messageType == "sticker") {
  } else if (messageType == "image") {
    // console.log(event.source.groupId);
    let mType = ".jpg";
    let meType = "image/jpeg";    
    let cdn = await sendToDiscord(
      messageId,
      meType,
      mType,
      channelToken,
      fromType
    );
    let mess = [
      {
        type: "template",
        altText: "บันทึกไฟล์แล้ว ♥",
        template: {
          type: "buttons",          
          imageAspectRatio: "rectangle",
          imageSize: "cover",
          imageBackgroundColor: "#FFFFFF",
          title: `บันทึกไฟล์ภาพเรียบร้อย`,
          text: "Download the file",
          defaultAction: { type: "uri", label: "Download", uri: cdn },
          actions: [{ type: "uri", label: "Download", uri: cdn }],
        },
      },
    ];
    return client.replyMessage(event.replyToken, mess);
  } else if (messageType == "video") {

    let mType = ".mp4";
    let meType = "video/mp4";
    let cdn = await sendToDiscord(
      messageId,
      meType,
      mType,
      channelToken,
      fromType
    );
    let mess = [
      {
        type: "template",
        altText: "บันทึกไฟล์แล้ว ♥",
        template: {
          type: "buttons",
          
          imageAspectRatio: "rectangle",
          imageSize: "cover",
          imageBackgroundColor: "#FFFFFF",
          title: `บันทึกไฟล์วิดีโอเรียบร้อย`,
          text: "Download the file",
          defaultAction: { type: "uri", label: "Download", uri: cdn },
          actions: [{ type: "uri", label: "Download", uri: cdn }],
        },
      },
    ];
    return client.replyMessage(event.replyToken, mess);
   
  } else if (messageType == "audio") {
let mType = ".mp3";
let meType = "audio/mpeg";
let cdn = await sendToDiscord(messageId, meType, mType, channelToken,fromType);
let mess = [
  {
    type: "template",
    altText: "บันทึกไฟล์แล้ว ♥",
    template: {
      type: "buttons",
     
      imageAspectRatio: "rectangle",
      imageSize: "cover",
      imageBackgroundColor: "#FFFFFF",
      title: `บันทึกไฟล์เสียงเรียบร้อย`,
      text: "Download the file",
      defaultAction: { type: "uri", label: "Download", uri: cdn },
      actions: [{ type: "uri", label: "Download", uri: cdn }],
    },
  },
];
return client.replyMessage(event.replyToken, mess);
  } else if (messageType == "location") {
  }
  return Promise.resolve(null);
}

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
