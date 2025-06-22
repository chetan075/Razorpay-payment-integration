// // File: components/RazorpayCheckout.jsx
// "use client";
// import { useState } from "react";

// export default function RazorpayCheckout() {
//   const [loading, setLoading] = useState(false);

//   const loadScript = (src) =>
//     new Promise((resolve) => {
//       const script = document.createElement("script");
//       script.src = src;
//       script.onload = () => resolve(true);
//       script.onerror = () => resolve(false);
//       document.body.appendChild(script);
//     });

//   const handlePayment = async () => {
//     setLoading(true);
//     const res = await loadScript(
//       "https://checkout.razorpay.com/v1/checkout.js"
//     );
//     if (!res) {
//       alert("Razorpay SDK failed to load");
//       return setLoading(false);
//     }

//     const data = await fetch("/api/razorpay/order", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ amount: 500 }), // ₹500
//     }).then((res) => res.json());

//     const options = {
//       key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
//       amount: data.amount,
//       currency: data.currency,
//       order_id: data.id,
//       name: "My Store",
//       description: "Order Payment",
//       handler: (response) => {
//         alert("Payment successful: " + response.razorpay_payment_id);
//         // Optionally verify signature server-side
//       },
//       prefill: {
//         name: "Test User",
//         email: "test@example.com",
//         contact: "9999999999",
//       },
//     };

//     const paymentObject = new window.Razorpay(options);
//     paymentObject.open();
//     setLoading(false);
//   };

//   return (
//     <button onClick={handlePayment} disabled={loading}>
//       {loading ? "Processing..." : "Pay ₹500"}
//     </button>
//   );
// }
