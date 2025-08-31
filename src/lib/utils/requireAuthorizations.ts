interface PaymentResponse {
  [key: string]: any; // You should replace this with a more specific interface for your API response
}

interface PaymentError extends Error {
  status?: number;
  details?: any;
}

/**
 * Makes a payment request to the specified endpoint
 * @param token Payment token to be sent
 * @returns Promise resolving to the payment result
 * @throws {PaymentError} When the request fails or returns an error status
 */
async function pay(token: string): Promise<PaymentResponse> {
  const url = 'http://127.0.0.1:5000/make_payment';
  const data = {
    token: token
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const error: PaymentError = new Error(
        `HTTP error! status: ${response.status}`
      );
      error.status = response.status;
      throw error;
    }

    const result: PaymentResponse = await response.json();
    console.log('Success:', result); // Removed the return of this log statement
    return result;
  } catch (error) {
    console.error('Error:', error);

    // Enhance the error with more details if available
    if (error instanceof Error) {
      const paymentError: PaymentError = error;
      paymentError.details = 'Payment processing failed';
      throw paymentError;
    }

    throw new Error('Unknown payment error occurred');
  }
}

export { pay };
