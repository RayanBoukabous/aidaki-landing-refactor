// Payment-related TypeScript types

/**
 * Payment invoice status enum
 */
export enum InvoiceStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED'
}

/**
 * Payment method enum
 */
export enum PaymentMethod {
  CIB = 'CIB',
  EDAHABIA = 'EDAHABIA'
}

/**
 * Subscription status enum
 */
export enum SubscriptionStatus {
  TRIAL = 'TRIAL',
  ACTIVE = 'ACTIVE',
  EXPIRED = 'EXPIRED',
  CANCELLED = 'CANCELLED'
}

/**
 * Plan interface
 */
export interface Plan {
  id: number;
  name: string;
  description: string;
  price: number;
  billingCycle: string;
  durationInDays: number;
  isActive: boolean;
  tokenLimit?: number;
  planTier?: number;
  details?: {
    maxCourses?: number;
    supportLevel?: string;
    features?: string[];
  };
  planImage?: {
    id: number;
    url: string;
  };
}

/**
 * Payment invoice interface
 */
export interface PaymentInvoice {
  id: number;
  userId: number;
  planId: number;
  subscriptionId?: number | null;
  amount: string;
  currency: string;
  status: InvoiceStatus;
  paymentMethod: PaymentMethod;
  paymentUrl?: string;
  createdAt: string;
  updatedAt: string;
  paidAt?: string | null;
  plan?: Plan;
  subscription?: {
    id: number;
    status: SubscriptionStatus;
    startDate: string;
    endDate: string;
  } | null;
}

/**
 * Create payment response
 */
export interface CreatePaymentResponse {
  paymentUrl: string;
  invoiceId: number;
  amount: string;
  status: InvoiceStatus;
  createdAt: string;
}

/**
 * Payment status response
 */
export interface PaymentStatusResponse {
  invoiceId: number;
  status: InvoiceStatus;
  amount: string;
  paidAt: string | null;
  subscriptionId: number | null;
}

/**
 * Create payment request
 */
export interface CreatePaymentRequest {
  planId: number;
}
