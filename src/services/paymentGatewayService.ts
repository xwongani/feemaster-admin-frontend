// Payment Gateway Service
// Handles different payment methods and integrations

export interface PaymentMethod {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  popular?: boolean;
  enabled: boolean;
  processingTime: string;
  fees: {
    percentage: number;
    fixed: number;
  };
}

export interface PaymentRequest {
  amount: number;
  currency: string;
  studentId: string;
  studentName: string;
  paymentMethod: string;
  paymentType: string;
  description?: string;
  metadata?: Record<string, any>;
}

export interface PaymentResponse {
  success: boolean;
  transactionId?: string;
  status: 'pending' | 'completed' | 'failed';
  message: string;
  redirectUrl?: string;
  errorCode?: string;
}

export interface PaymentStatus {
  transactionId: string;
  status: 'pending' | 'completed' | 'failed';
  amount: number;
  currency: string;
  timestamp: string;
  message?: string;
}

// Available payment methods
export const PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: 'tumeny',
    name: 'TUMENY',
    description: 'Secure mobile money payment',
    icon: 'fas fa-mobile-alt',
    color: 'bg-blue-500',
    popular: true,
    enabled: true,
    processingTime: 'Instant',
    fees: { percentage: 0, fixed: 0 }
  },
  {
    id: 'airtel_money',
    name: 'Airtel Money',
    description: 'Airtel mobile money service',
    icon: 'fas fa-mobile-alt',
    color: 'bg-red-500',
    enabled: true,
    processingTime: 'Instant',
    fees: { percentage: 0, fixed: 0 }
  },
  {
    id: 'mtn_momo',
    name: 'MTN Mobile Money',
    description: 'MTN mobile money service',
    icon: 'fas fa-mobile-alt',
    color: 'bg-yellow-500',
    enabled: true,
    processingTime: 'Instant',
    fees: { percentage: 0, fixed: 0 }
  },
  {
    id: 'bank_transfer',
    name: 'Bank Transfer',
    description: 'Direct bank transfer',
    icon: 'fas fa-university',
    color: 'bg-green-500',
    enabled: true,
    processingTime: '1-3 business days',
    fees: { percentage: 0, fixed: 0 }
  },
  {
    id: 'credit_card',
    name: 'Credit/Debit Card',
    description: 'Visa, Mastercard, American Express',
    icon: 'fas fa-credit-card',
    color: 'bg-purple-500',
    enabled: true,
    processingTime: 'Instant',
    fees: { percentage: 2.5, fixed: 0 }
  },
  {
    id: 'cash',
    name: 'Cash Payment',
    description: 'Pay at school office',
    icon: 'fas fa-money-bill-wave',
    color: 'bg-yellow-500',
    enabled: true,
    processingTime: 'Immediate',
    fees: { percentage: 0, fixed: 0 }
  }
];

// Payment Gateway Service Class
export class PaymentGatewayService {
  private static instance: PaymentGatewayService;
  private apiBaseUrl: string;

  private constructor() {
    this.apiBaseUrl = (window as any).REACT_APP_API_BASE_URL || 'http://localhost:8000/api/v1';
  }

  public static getInstance(): PaymentGatewayService {
    if (!PaymentGatewayService.instance) {
      PaymentGatewayService.instance = new PaymentGatewayService();
    }
    return PaymentGatewayService.instance;
  }

  // Get available payment methods
  public getPaymentMethods(): PaymentMethod[] {
    return PAYMENT_METHODS.filter(method => method.enabled);
  }

  // Calculate fees for a payment method
  public calculateFees(amount: number, paymentMethodId: string): number {
    const method = PAYMENT_METHODS.find(m => m.id === paymentMethodId);
    if (!method) return 0;

    const { percentage, fixed } = method.fees;
    return (amount * percentage / 100) + fixed;
  }

  // Process payment
  public async processPayment(paymentRequest: PaymentRequest): Promise<PaymentResponse> {
    try {
      // Validate payment request
      const validation = this.validatePaymentRequest(paymentRequest);
      if (!validation.valid) {
        return {
          success: false,
          status: 'failed',
          message: validation.message
        };
      }

      // Calculate total amount including fees
      const fees = this.calculateFees(paymentRequest.amount, paymentRequest.paymentMethod);
      const totalAmount = paymentRequest.amount + fees;

      // Create payment payload
      const payload = {
        student_id: paymentRequest.studentId,
        amount: totalAmount,
        payment_method: paymentRequest.paymentMethod,
        payment_type: paymentRequest.paymentType,
        description: paymentRequest.description,
        metadata: {
          ...paymentRequest.metadata,
          fees,
          original_amount: paymentRequest.amount
        }
      };

      // Send to backend
      const response = await fetch(`${this.apiBaseUrl}/payments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Payment processing failed');
      }

      const result = await response.json();
      
      if (result.success) {
        return {
          success: true,
          transactionId: result.data.id,
          status: 'completed',
          message: 'Payment processed successfully'
        };
      } else {
        return {
          success: false,
          status: 'failed',
          message: result.message || 'Payment processing failed'
        };
      }

    } catch (error: any) {
      console.error('Payment processing error:', error);
      return {
        success: false,
        status: 'failed',
        message: error.message || 'Payment processing failed',
        errorCode: 'PAYMENT_ERROR'
      };
    }
  }

  // Check payment status
  public async checkPaymentStatus(transactionId: string): Promise<PaymentStatus> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/payments/${transactionId}/status`);
      
      if (!response.ok) {
        throw new Error('Failed to check payment status');
      }

      const result = await response.json();
      return result.data;

    } catch (error: any) {
      console.error('Payment status check error:', error);
      throw error;
    }
  }

  // Validate payment request
  private validatePaymentRequest(request: PaymentRequest): { valid: boolean; message: string } {
    if (!request.amount || request.amount <= 0) {
      return { valid: false, message: 'Invalid payment amount' };
    }

    if (!request.studentId) {
      return { valid: false, message: 'Student ID is required' };
    }

    if (!request.paymentMethod) {
      return { valid: false, message: 'Payment method is required' };
    }

    const method = PAYMENT_METHODS.find(m => m.id === request.paymentMethod);
    if (!method || !method.enabled) {
      return { valid: false, message: 'Payment method not available' };
    }

    return { valid: true, message: '' };
  }

  // Get payment method by ID
  public getPaymentMethod(methodId: string): PaymentMethod | undefined {
    return PAYMENT_METHODS.find(method => method.id === methodId);
  }

  // Format currency
  public formatCurrency(amount: number, currency: string = 'ZMW'): string {
    return new Intl.NumberFormat('en-ZM', {
      style: 'currency',
      currency,
      minimumFractionDigits: 2
    }).format(amount);
  }

  // Generate transaction ID
  public generateTransactionId(): string {
    const timestamp = Date.now().toString();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `TXN-${timestamp.slice(-8)}-${random}`;
  }
}

// Export singleton instance
export const paymentGateway = PaymentGatewayService.getInstance(); 