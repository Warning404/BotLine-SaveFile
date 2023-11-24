const express = require("express");
const line = require("@line/bot-sdk");

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

function handleEvent(event) {
  if (event.type === "message" && event.message.type === "text") {
    return client.replyMessage(event.replyToken, {
      type: "text",
      text: event.message.text,
    });
  } else if (event.message.type === "file") {
    return client.replyMessage(event.replyToken, {
      type: "text",
      text: event.message.type,
    });
  }
  return Promise.resolve(null);
}

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
