// "use client";

// import React, { useState } from "react";
// import Script from "next/script";
// import { useRouter } from "next/navigation";

// const PaymentPage = () => {
//   const AMOUNT = 100; // Constant amount in INR
//   const [isProcessing, setIsProcessing] = useState(false);
//   const router = useRouter();

//   const handlePayment = async () => {
//     setIsProcessing(true);

//     try {
//       // create order
//       const response = await fetch("/api/create-order", { method: "POST" });
//       const data = await response.json();

//       // Initialize Razorpay
//       const options = {
//         key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
//         amount: AMOUNT * 100,
//         currency: "INR",
//         name: "Your Company Name",
//         description: "Test Transaction",
//         order_id: data.id, // ✅ Fix here
//         handler: async function (response) {
//           // Verify payment

//           const verifyRes = await fetch("/api/verify-payment", {
//             method: "POST",
//             headers: {
//               "Content-Type": "application/json",
//             },
//             body: JSON.stringify({
//               razorpay_order_id: response.razorpay_order_id,
//               razorpay_payment_id: response.razorpay_payment_id,
//               razorpay_signature: response.razorpay_signature,
//             }),
//           });

//           const veryifyData = await verifyRes.json();

//           if (veryifyData.success) {
//             console.log("Payment verified successfully");
//             console.log("Payment successful", response);
//             router.push("/success");
//           } else {
//             console.error("Payment verification failed", veryifyData);
//             alert("Payment verification failed. Please try again.");
//           }
//         },
//         prefill: {
//           name: "Chetan Kumawat",
//           email: "chetankumawat@example.com",
//           contact: "9999999999",
//         },
//         theme: {
//           color: "#3399cc",
//         },
//       };
//       const rzp1 = new window.Razorpay(options);
//       rzp1.open();
//     } catch (error) {
//       console.error("Payment failed", error);
//     } finally {
//       setIsProcessing(false);
//     }
//   };

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
//       <Script
//         src="https://checkout.razorpay.com/v1/checkout.js"
//         // onLoad={() => console.log("Razorpay script loaded")}
//         onLoad={() => console.log("Razorpay SDK loaded")}
//       />
//       <h1 className="text-2xl font-bold mb-4">Razorpay Payment</h1>
//       <p className="mb-4">Amount: ₹{AMOUNT}</p>
//       <button
//         onClick={handlePayment}
//         disabled={isProcessing}
//         className={`px-6 py-3 bg-blue-500 text-white rounded-lg ${
//           isProcessing ? "opacity-50 cursor-not-allowed" : ""
//         }`}
//       >
//         {isProcessing ? "Processing..." : "Pay Now"}
//       </button>
//     </div>
//   );
// };

// export default PaymentPage;

// File: components/RazorpayCheckout.jsx

"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RazorpayCheckout() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const loadScript = (src) =>
    new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

  const handlePayment = async () => {
    setLoading(true);
    const res = await loadScript(
      "https://checkout.razorpay.com/v1/checkout.js"
    );
    if (!res) {
      alert("Razorpay SDK failed to load");
      return setLoading(false);
    }

    const data = await fetch("/api/create-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: 500 }), // ₹500
    }).then((res) => res.json());

    // The options object in Razorpay is the core configuration for initializing the Razorpay Checkout modal. It tells Razorpay what the payment is for, how much to charge, who’s paying, and how to handle the response.

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: data.amount,
      currency: data.currency,
      order_id: data.id,
      name: "My Store",
      description: "Order Payment",
      handler: async (response) => {
        alert("Payment successful: " + response.razorpay_payment_id);
        // Optionally verify signature server-side

        const verifyRes = await fetch("/api/verify-payment", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          }),
        });

        const verifyData = await verifyRes.json();

        if (verifyData.success) {
          console.log("Payment verified successfully");
          console.log("Payment successful", response);
          router.push("/success");
        } else {
          console.error("Payment verification failed", verifyData);
          alert("Payment verification failed. Please try again.");
        }
      },
      prefill: {
        name: "Test User",
        email: "test@example.com",
        contact: "9999999999",
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
    setLoading(false);
  };

  return (
    <button onClick={handlePayment} disabled={loading}>
      {loading ? "Processing..." : "Pay ₹500"}
    </button>
  );
}
