// import { NextResponse, NextRequest } from "next/server";
// import Razorpay from "razorpay";

// const razorpay = new Razorpay({
//   key_id: process.env.RAZORPAY_KEY_ID,
//   key_secret: process.env.RAZORPAY_KEY_SECRET,
// });

// export async function POST(request) {
//   try {
//     const order = await razorpay.orders.create({
//       amount: 100 * 100, // Amount in paise
//       currency: "INR",
//       receipt: "receipt_" + Math.random().toString(36).substring(7),
//     });
//     return NextResponse.json({ orderId: order.id }, { status: 200 });
//   } catch (error) {
//     console.error("Error creating order:", error);
//     return NextResponse.json(
//       { error: "Error creating order" },
//       { status: 500 }
//     );
//   }
// }

// File: app/api/razorpay/order/route.js
import Razorpay from "razorpay";

export async function POST(req) {
  const body = await req.json();
  const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });

  const options = {
    amount: body.amount * 100, // in paise
    currency: "INR",
    receipt: `receipt_${Date.now()}`,
    payment_capture: 1,
  };

  try {
    const order = await razorpay.orders.create(options);
    return Response.json(order);
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
