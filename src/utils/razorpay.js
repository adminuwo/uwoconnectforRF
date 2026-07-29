let razorpayScriptPromise = null;

export const loadRazorpaySDK = () => {
  if (razorpayScriptPromise) return razorpayScriptPromise;

  razorpayScriptPromise = new Promise((resolve, reject) => {
    if (typeof window === 'undefined') {
      return reject(new Error('Window object not found'));
    }

    if (window.Razorpay) {
      return resolve(window.Razorpay);
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => {
      if (window.Razorpay) {
        resolve(window.Razorpay);
      } else {
        reject(new Error('Razorpay SDK failed to initialize'));
      }
    };
    script.onerror = () => {
      reject(new Error('Failed to load Razorpay SDK script'));
    };

    document.head.appendChild(script);
  });

  return razorpayScriptPromise;
};

export const initiateRazorpayCheckout = async ({
  keyId,
  orderId,
  amount,
  currency = 'INR',
  name = 'Uwo Connect',
  description = 'Workspace Plan Subscription',
  customerName = '',
  customerEmail = '',
  customerPhone = '',
  onSuccess,
  onDismiss
}) => {
  try {
    if (!orderId || orderId.includes('mock')) {
      console.log('Initiating mock sandbox Razorpay checkout session:', orderId);
      return { isMock: true, orderId };
    }

    const Razorpay = await loadRazorpaySDK();

    const options = {
      key: keyId,
      amount: amount, // amount in paise
      currency: currency,
      name: name,
      description: description,
      order_id: orderId,
      prefill: {
        name: customerName,
        email: customerEmail,
        contact: customerPhone
      },
      theme: {
        color: '#10B981'
      },
      handler: function (response) {
        console.log('Razorpay payment response:', response);
        if (onSuccess) {
          onSuccess({
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_signature: response.razorpay_signature
          });
        }
      },
      modal: {
        ondismiss: function () {
          console.log('Razorpay checkout dismissed');
          if (onDismiss) onDismiss();
        }
      }
    };

    const rzp = new Razorpay(options);
    rzp.open();
    return { isMock: false, rzp };
  } catch (err) {
    console.error('Failed to launch Razorpay Checkout:', err);
    throw err;
  }
};
