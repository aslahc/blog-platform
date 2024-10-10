// import { useEffect } from "react";
// import axios from "axios";
// import { useParams } from "react-router-dom";

// const CheckoutPage = () => {
//   const { blogId } = useParams(); // Get blogId from URL

//   useEffect(() => {
//     const loadRazorpay = async () => {
//       try {
//         // Call the backend to create Razorpay order
//         const res = await axios.post(
//           "http://localhost:5000/api/blogs/checkout",
//           {
//             blogId, // Pass blogId
//             amount: 100, // Amount in INR (100 INR = 10000 paise)
//           }
//         );

//         const orderId = res.data.orderId; // Extract orderId from response

//         const options = {
//           key: "rzp_test_O3ookB75C6tQTa", // Your Razorpay Key ID
//           amount: 100 * 100, // Amount in paise (100 INR)
//           currency: "INR",
//           order_id: orderId, // Pass the Razorpay order ID
//           handler: function (response) {
//             alert(
//               "Payment Successful! Razorpay Payment ID: " +
//                 response.razorpay_payment_id
//             );
//             // You can send this to the backend for further handling, like updating the blog status, etc.
//           },
//           prefill: {
//             name: "John Doe",
//             email: "john.doe@example.com",
//             contact: "1234567890",
//           },
//           theme: {
//             color: "#F37254",
//           },
//         };

//         const rzp1 = new window.Razorpay(options); // Create Razorpay instance
//         rzp1.open(); // Open the Razorpay modal
//       } catch (error) {
//         console.error("Error during Razorpay order creation:", error);
//       }
//     };

//     loadRazorpay();
//   }, [blogId]);

//   return <h2>Processing Payment...</h2>; // Show loading message while Razorpay is being processed
// };

// export default CheckoutPage;
