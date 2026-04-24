import amqp from "amqplib";
import dotenv from "dotenv";

dotenv.config();
let connection: any;
let channel: any;

export const connectRabbitMQ = async (): Promise<any> => {
  try {
    if (channel) return channel; // reuse existing

    console.log("Connecting to RabbitMQ...");

    connection = await amqp.connect(process.env.rbmq_url as string);

    connection.on("close", () => {
      console.log("❌ RabbitMQ closed. Reconnecting...");
      channel = null;
      setTimeout(connectRabbitMQ, 5000);
    });

    connection.on("error", (err:any) => {
      console.error("AMQP error:", err.message);
    });

    channel = await connection.createChannel();

    console.log("✅ RabbitMQ connected");

    return channel;
  } catch (err) {
    console.error("Connection failed. Retrying...", err);
    setTimeout(connectRabbitMQ, 5000);
  }
};