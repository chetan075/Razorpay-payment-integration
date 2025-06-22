// import { NextResponse } from "next/server";
// import crypto from "crypto";

// export async function POST(request) {
//   const body = await request.json();

//   const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;

//   const generated_signature = crypto
//     .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
//     .update(`${razorpay_order_id}|${razorpay_payment_id}`)
//     .digest("hex");

//   if (generated_signature === razorpay_signature) {
//     // Payment is verified
//     return NextResponse.json({ verified: true }, { status: 200 });
//   } else {
//     // Invalid signature
//     return NextResponse.json({ verified: false }, { status: 400 });
//   }
// }

// app/api/verify-payment/route.js
import crypto from "crypto";

export async function POST(req) {
  const body = await req.json();
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  const isAuthentic = expectedSignature === razorpay_signature;

  if (isAuthentic) {
    // TODO: Update payment status in DB
    console.log("✅ Client-side signature verified");
    return Response.json({ success: true });
  } else {
    console.warn("❌ Invalid client-side signature");
    return Response.json({ success: false });
  }
}

// 🔒 Why Are You Using This Code?
// ✅ 1. Security Verification (Client Can't Be Trusted)
// When Razorpay returns a successful payment response on the client side (in the browser), it includes:

// razorpay_order_id

// razorpay_payment_id

// razorpay_signature

// But you can’t trust anything coming from the frontend alone — it could be faked.

// So, Razorpay provides a signature (razorpay_signature) to help prove that the payment data is real and untampered.

// ✅ 2. Signature Verification
// You use your Razorpay Key Secret (kept only on your server) to recreate the signature Razorpay would have generated.

// Then, compare it with the one Razorpay sent.

// If they match ✅ — the payment is real.

// If they don’t ❌ — it might be spoofed or tampered with.
