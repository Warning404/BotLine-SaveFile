const fastify = require("fastify")({ logger: true });
const { Client } = require("@line/bot-sdk");

const config = {
  channelAccessToken:
    "1PZT/4Z4xYMVr70h/i2WFmM5QCCLIrDVJ9coQYN8OOBudY2v+zKKfcZutl8sV2pqE0pcqGW7TANW0tnKCVtCTLe/9f8uAypz0R5kRwXrgtn287H9yx7eZvLsGlWwTg0Zug4OWskQYOSj7iVAMXU9ngdB04t89/1O/w1cDnyilFU=",
  channelSecret: "d2695c318a315b23a0b59bbc5f091774",
};

const client = new Client(config);

fastify.post("/webhook", async (request, reply) => {
  const body = request.body;

  // Validate the request signature
  const signature = request.headers["x-line-signature"];
  if (!client.validateSignature(body, signature)) {
    reply.code(401).send({ error: "Invalid signature" });
    return;
  }

  // Handle Line Bot events
  const events = body.events;
  for (const event of events) {
    if (event.type === "message") {
      // Handle different types of messages (text, image, etc.)
      // Example: Reply to a text message
      const message = { type: "text", text: "Hello, world!" };
      await client.replyMessage(event.replyToken, message);
    }
  }

  reply.send({ success: true });
});

fastify.listen(3000, (err, address) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  console.log(`Server listening on ${address}`);
});
