import crypto from "crypto";

const BASE_URL =
  process.env.CASHFREE_ENV === "production"
    ? "https://api.cashfree.com/pg"
    : "https://sandbox.cashfree.com/pg";

function getHeaders() {
  if (!process.env.CASHFREE_APP_ID || !process.env.CASHFREE_SECRET_KEY) {
    throw new Error("Missing Cashfree credentials");
  }

  return {
    "Content-Type": "application/json",
    "x-client-id": process.env.CASHFREE_APP_ID,
    "x-client-secret": process.env.CASHFREE_SECRET_KEY,
    "x-api-version": "2023-08-01",
    "x-request-id": crypto.randomUUID()
  };
}

export async function createOrder({ amount, customerName, customerEmail, customerPhone }) {
  const orderId = `roastme_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

  const res = await fetch(`${BASE_URL}/orders`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({
      order_id: orderId,
      order_amount: Number(amount),
      order_currency: "INR",
      order_note: "RoastMe AI unlock",
      customer_details: {
        customer_id: orderId,
        customer_name: customerName || "Anonymous",
        customer_email: customerEmail || "user@roastme.ai",
        customer_phone: customerPhone || "9999999999"
      }
    })
  });

  const data = await res.json();
  if (!res.ok) {
    const message = data?.message || data?.error || "Failed to create Cashfree order";
    const err = new Error(message);
    err.data = data;
    err.status = res.status;
    throw err;
  }

  return {
    orderId,
    paymentSessionId: data.payment_session_id
  };
}

export async function verifyOrder(orderId) {
  const res = await fetch(`${BASE_URL}/orders/${orderId}`, {
    method: "GET",
    headers: getHeaders()
  });

  const data = await res.json();
  if (!res.ok) {
    const message = data?.message || data?.error || "Failed to verify order";
    throw new Error(message);
  }

  const paid = data.order_status === "PAID";
  const amount = Number(data.order_amount || 0);

  return { paid, amount };
}


