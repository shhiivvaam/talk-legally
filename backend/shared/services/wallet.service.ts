/**
 * Wallet service client interface for inter-service communication.
 * Used by other services (e.g., session-service, billing-service)
 * to interact with the wallet-service via HTTP.
 */
export interface WalletServiceClient {
  getBalance(userId: string): Promise<{ userId: string; balance: number }>;
  addBalance(userId: string, amount: number, referenceId?: string): Promise<{
    success: boolean;
    balanceBefore: number;
    balanceAfter: number;
    transactionId: string;
  }>;
  deductBalance(userId: string, amount: number, description?: string, sessionId?: string): Promise<{
    success: boolean;
    balanceBefore: number;
    balanceAfter: number;
    transactionId: string;
  }>;
  checkBalance(userId: string, requiredAmount: number): Promise<boolean>;
}
