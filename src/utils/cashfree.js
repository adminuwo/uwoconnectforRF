let cashfreeScriptPromise = null;

export const loadCashfreeSDK = () => {
  if (cashfreeScriptPromise) return cashfreeScriptPromise;

  cashfreeScriptPromise = new Promise((resolve, reject) => {
    if (typeof window === 'undefined') {
      return reject(new Error('Window object not found'));
    }

    if (window.Cashfree) {
      return resolve(window.Cashfree);
    }

    const script = document.createElement('script');
    script.src = 'https://sdk.cashfree.com/js/v3/cashfree.js';
    script.async = true;
    script.onload = () => {
      if (window.Cashfree) {
        resolve(window.Cashfree);
      } else {
        reject(new Error('Cashfree SDK failed to initialize'));
      }
    };
    script.onerror = () => {
      reject(new Error('Failed to load Cashfree SDK script'));
    };

    document.head.appendChild(script);
  });

  return cashfreeScriptPromise;
};

export const initiateCashfreeCheckout = async ({ paymentSessionId, env = 'TEST', onComplete, onFailure }) => {
  try {
    // If mock session, run simulated checkout modal
    if (!paymentSessionId || paymentSessionId.includes('mock')) {
      console.log('Initiating mock sandbox Cashfree checkout session:', paymentSessionId);
      return { isMock: true, paymentSessionId };
    }

    const Cashfree = await loadCashfreeSDK();
    const mode = env === 'PRODUCTION' ? 'production' : 'sandbox';
    const cashfree = Cashfree({ mode });

    cashfree.checkout({
      paymentSessionId: paymentSessionId,
      redirectTarget: '_modal',
    }).then((result) => {
      if (result.error) {
        console.error('Cashfree checkout error:', result.error);
        if (onFailure) onFailure(result.error);
      }
      if (result.redirect) {
        console.log('Payment redirected');
      }
      if (result.paymentDetails) {
        console.log('Payment completed:', result.paymentDetails);
        if (onComplete) onComplete(result.paymentDetails);
      }
    });

    return { isMock: false, cashfree };
  } catch (err) {
    console.error('Failed to launch Cashfree Checkout:', err);
    throw err;
  }
};
