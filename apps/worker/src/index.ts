import db from "@repo/db";
import { createClient } from "redis";

const client = createClient({
  url: `redis://${process.env.REDIS_USERNAME}:${process.env.REDIS_PASSWORD}@${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
});

const p2pTransfer = async (submission: string) => {
  try {
    const { senderId, receiverId, amount, p2pId } = JSON.parse(submission);
    console.log("Processing transaction:", { senderId, receiverId, amount });
    const parsedSenderId = parseInt(senderId, 10);
    const parsedReceiverId = parseInt(receiverId, 10);
    await db.$transaction(async (tx) => {
      await tx.balance.update({
        where: { userId: parsedSenderId },
        data: { amount: { decrement: amount } },
      });

      await tx.balance.update({
        where: { userId: parsedReceiverId },
        data: { amount: { increment: amount } },
      });
      await tx.peerTransfer.update({
        where: {
          id: p2pId,
        },
        data: {
          status: "Success",
        },
      });
    });

    console.log("Transaction processed successfully.");
  } catch (error) {
    console.error("Error processing transaction:", error);
    const { p2pId } = JSON.parse(submission);
    await db.peerTransfer.update({
      where: {
        id: p2pId,
      },
      data: {
        status: "failure",
      },
    });
  }
};

const startWorker = async () => {
  try {
    await client.connect();
    console.log("Redis connected from the worker side.");

   

    while (true) {
      try {
        console.log("Waiting for new transaction...");
        const submission = await client.brPop("transfer", 0);

        if (!submission) {
          console.log("Can't get submission");
          return;
        }

        if (submission && submission.key && submission.element) {
          const { key, element } = submission;
          console.log(`Popped from list '${key}':`, element);

          await p2pTransfer(element);
        } else {
          console.log("No value popped.");
        }
      } catch (error) {
        console.log("Error in popping from Redis:", error);
      }
    }
  } catch (error) {
    console.log("Error in starting worker:", error);
  }
};

startWorker();
