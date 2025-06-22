// // File: app/api/razorpay/webhook/route.js
// import crypto from "crypto";

// export const config = {
//   api: {
//     bodyParser: false,
//   },
// };

// export async function POST(req) {
//   const chunks = [];
//   for await (const chunk of req.body) chunks.push(chunk);
//   const rawBody = Buffer.concat(chunks);
//   const signature = req.headers.get("x-razorpay-signature");

//   const expectedSignature = crypto
//     .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET)
//     .update(rawBody)
//     .digest("hex");

//   if (signature !== expectedSignature) {
//     return new Response("Invalid signature", { status: 400 });
//   }

//   const event = JSON.parse(rawBody.toString());

//   if (event.event === "payment.captured") {
//     const payment = event.payload.payment.entity;
//     console.log("✅ Payment verified:", payment);
//     // TODO: Update order status in DB
//   }

//   return new Response("OK", { status: 200 });
// }
// // This webhook handler verifies the signature of incoming requests from Razorpay

// app/api/razorpay/webhook/route.js
import crypto from "crypto";

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req) {
  const chunks = [];
  for await (const chunk of req.body) chunks.push(chunk);
  const rawBody = Buffer.concat(chunks);
  const signature = req.headers.get("x-razorpay-signature");

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET)
    .update(rawBody)
    .digest("hex");

  if (signature !== expectedSignature) {
    console.warn("❌ Webhook signature mismatch");
    return new Response("Invalid signature", { status: 400 });
  }

  const event = JSON.parse(rawBody.toString());

  if (event.event === "payment.captured") {
    const payment = event.payload.payment.entity;
    console.log("✅ Webhook verified. Payment captured:", payment);
    // TODO: Confirm order, save to DB
  }

  return new Response("OK", { status: 200 });
}

// 🔧 How It Works (Step-by-Step)
// User makes a payment.

// Razorpay processes it.

// If you've set up a webhook, Razorpay sends a POST request to your backend URL (e.g., https://yourdomain.com/api/razorpay-webhook).

// This request contains a JSON payload with payment details and a signature.

// You verify the signature on your backend (to ensure it's Razorpay, not a spoof).

// Based on the event (e.g. payment.captured, order.paid), you update your database.

// 🔁 Common Webhook Events in Razorpay
// Event Name	    What It Means
// payment.captured	A payment was successfully completed and captured. ✅
// payment.failed	Payment failed (e.g., user canceled, insufficient funds). ❌
// order.paid	The full order has been paid.
// refund.processed	A refund was completed. 🔁
// subscription.charged	A recurring subscription charge succeeded. 🔄
