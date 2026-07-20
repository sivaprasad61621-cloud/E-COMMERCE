/**
 * Test Mode Payment Integration Gateway Service
 * Simulates card verification, authorization, and instant receipt generation.
 */

export class PaymentService {
  /**
   * Process payment charge in Test Mode
   * @param {Object} paymentData { amount, currency, cardNumber, expMonth, expYear, cvc, customerEmail }
   */
  static async processPayment(paymentData = {}) {
    const {
      amount,
      currency = 'USD',
      cardNumber = '',
      expMonth = '',
      expYear = '',
      cvc = '',
      customerEmail = '',
    } = paymentData;

    // Basic Validation
    if (!amount || amount <= 0) {
      throw new Error('Invalid payment amount');
    }

    const cleanedCard = String(cardNumber).replace(/\s+/g, '');

    // Test Card Failure simulation
    if (cleanedCard.endsWith('0000')) {
      return {
        success: false,
        status: 'declined',
        error: 'Your card was declined. Please try a valid test card.',
      };
    }

    if (cleanedCard.endsWith('9999')) {
      return {
        success: false,
        status: 'insufficient_funds',
        error: 'Insufficient funds on test account.',
      };
    }

    // Generate simulated transaction authorization
    const timestamp = Date.now();
    const transactionId = `txn_${timestamp}_${Math.floor(Math.random() * 100000)}`;
    const receiptNumber = `REC-VEL-${Math.floor(100000 + Math.random() * 900000)}`;

    const cardLast4 = cleanedCard.length >= 4 ? cleanedCard.slice(-4) : '4242';

    return {
      success: true,
      status: 'succeeded',
      transactionId,
      receiptNumber,
      amount: parseFloat(amount).toFixed(2),
      currency: currency.toUpperCase(),
      paymentMethod: {
        type: 'card',
        brand: 'Visa (Test)',
        last4: cardLast4,
      },
      customerEmail,
      createdAt: new Date().toISOString(),
    };
  }
}

export default PaymentService;
