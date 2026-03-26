import crypto from "crypto";

export interface PayHerePaymentRequest {
  merchant_id: string;
  return_url: string;
  cancel_url: string;
  notify_url: string;
  order_id: string;
  items: string;
  currency: string;
  amount: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  hash: string;
  [key: string]: string;
}

export class PayHereService {
  private static getMerchantSecret(): string {
    let secret = process.env.PAYHERE_MERCHANT_SECRET;
    if (!secret) {
      console.warn("PAYHERE_MERCHANT_SECRET is not defined, using fallback for development");
      return "sandbox_secret";
    }
    if (secret.startsWith('"') && secret.endsWith('"')) {
      secret = secret.substring(1, secret.length - 1);
    }
    return secret;
  }

  public static getMerchantId(): string {
    let id = process.env.NEXT_PUBLIC_PAYHERE_MERCHANT_ID || "1211149"; // Sandbox fallback
    if (id.startsWith('"') && id.endsWith('"')) {
      id = id.substring(1, id.length - 1);
    }
    return id;
  }

  public static generateHash(
    orderId: string,
    amount: string,
    currency: string = "LKR"
  ): string {
    const merchantId = this.getMerchantId();
    const merchantSecret = this.getMerchantSecret();

    // Format amount to 2 decimal places
    const cleanAmount = amount.replace(/,/g, "");
    const formattedAmount = parseFloat(cleanAmount).toFixed(2);

    const hashedSecret = crypto
      .createHash("md5")
      .update(merchantSecret)
      .digest("hex")
      .toUpperCase();

    const hashString = `${merchantId}${orderId}${formattedAmount}${currency}${hashedSecret}`;

    return crypto
      .createHash("md5")
      .update(hashString)
      .digest("hex")
      .toUpperCase();
  }

  public static generateWebhookSignature(
    merchantId: string,
    orderId: string,
    amount: string,
    currency: string,
    statusCode: string
  ): string {
    const merchantSecret = this.getMerchantSecret();
    const hashedSecret = crypto
      .createHash("md5")
      .update(merchantSecret, "utf-8")
      .digest("hex")
      .toUpperCase();

    const hashString = `${merchantId}${orderId}${amount}${currency}${statusCode}${hashedSecret}`;
    
    return crypto
      .createHash("md5")
      .update(hashString, "utf-8")
      .digest("hex")
      .toUpperCase();
  }

  public static verifySignature(
    merchantId: string,
    orderId: string,
    amount: string,
    currency: string,
    statusCode: string,
    md5sig: string
  ): boolean {
    const localMd5sig = this.generateWebhookSignature(
        merchantId, 
        orderId, 
        amount, 
        currency, 
        statusCode
    );

    return localMd5sig === md5sig.toUpperCase();
  }

  public static getCheckoutUrl(): string {
    const payhereMode = process.env.NEXT_PUBLIC_PAYHERE_MODE || "sandbox";
    return payhereMode === "live"
      ? "https://www.payhere.lk/pay/checkout"
      : "https://sandbox.payhere.lk/pay/checkout";
  }
}
