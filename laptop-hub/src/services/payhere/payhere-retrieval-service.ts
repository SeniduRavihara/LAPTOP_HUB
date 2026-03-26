import dns from "node:dns";
try {
  dns.setDefaultResultOrder("ipv4first");
} catch (e) {
  // Ignore if not supported (e.g. older Node versions)
}

/**
 * PayHere Retrieval API Service
 *
 * Used to verify payment status directly with PayHere when webhook fails.
 * Implements OAuth 2.0 authentication and payment lookup.
 *
 * @see https://support.payhere.lk/api-&-mobile-sdk/retrieval-api
 */

export interface PayHereAccessTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  scope: string;
}

export interface PayHerePaymentData {
  payment_id: number;
  order_id: string;
  date: string;
  description: string;
  status:
    | "RECEIVED"
    | "REFUND REQUESTED"
    | "REFUND PROCESSING"
    | "REFUNDED"
    | "CHARGEBACKED";
  currency: string;
  amount: number;
  customer: {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
  };
  payment_method: {
    method: string;
    card_customer_name?: string;
    card_no?: string;
  };
}

export interface PayHereRetrievalResponse {
  status: number; // 1 = success, 0 = pending, -1 = not found, -2 = auth error
  msg: string;
  data: PayHerePaymentData[] | null;
}

export class PayHereRetrievalService {
  private static accessToken: string | null = null;
  private static tokenExpiry: number = 0;

  private static getAppId(): string {
    let appId = process.env.PAYHERE_APP_ID;
    if (!appId) {
      throw new Error("PAYHERE_APP_ID is not defined");
    }
    // Clean potential quotes in env vars
    return appId.replace(/^["']|["']$/g, "").trim();
  }

  private static getAppSecret(): string {
    let appSecret = process.env.PAYHERE_APP_SECRET;
    if (!appSecret) {
      throw new Error("PAYHERE_APP_SECRET is not defined");
    }
    // Clean potential quotes in env vars
    return appSecret.replace(/^["']|["']$/g, "").trim();
  }

  private static getApiBaseUrl(): string {
    const payhereMode =
      process.env.PAYHERE_MODE ||
      process.env.NEXT_PUBLIC_PAYHERE_MODE ||
      "sandbox";
    return payhereMode === "live"
      ? "https://www.payhere.lk/merchant/v1"
      : "https://sandbox.payhere.lk/merchant/v1";
  }

  private static generateAuthorizationCode(): string {
    const appId = this.getAppId();
    const appSecret = this.getAppSecret();
    const credentials = `${appId}:${appSecret}`;
    return Buffer.from(credentials).toString("base64");
  }

  public static async getAccessToken(): Promise<string> {
    const now = Date.now();

    if (this.accessToken && this.tokenExpiry > now + 60000) {
      return this.accessToken;
    }

    const authCode = this.generateAuthorizationCode();
    const url = `${this.getApiBaseUrl()}/oauth/token`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Basic ${authCode}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "grant_type=client_credentials",
      cache: "no-store",
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ PayHere OAuth Error:", {
        status: response.status,
        statusText: response.statusText,
        body: errorText,
      });
      throw new Error(
        `Failed to get access token: ${response.status} ${errorText}`
      );
    }

    const data: PayHereAccessTokenResponse = await response.json();

    this.accessToken = data.access_token;
    this.tokenExpiry = now + data.expires_in * 1000;

    return data.access_token;
  }

  public static async retrievePayment(
    orderId: string
  ): Promise<PayHereRetrievalResponse> {
    try {
      const accessToken = await this.getAccessToken();
      const url = `${this.getApiBaseUrl()}/payment/search?order_id=${encodeURIComponent(
        orderId
      )}`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Failed to retrieve payment: ${response.status} ${errorText}`
        );
      }

      return await response.json();
    } catch (error) {
      console.error("PayHere retrieval error:", error);
      throw error;
    }
  }

  public static async getSuccessfulPayment(
    orderId: string
  ): Promise<PayHerePaymentData | null> {
    try {
      const result = await this.retrievePayment(orderId);

      if (result.status === 1 && result.data && result.data.length > 0) {
        const successfulPayments = result.data.filter(
          (p) => p.status === "RECEIVED"
        );
        if (successfulPayments.length > 0) {
          return successfulPayments[0];
        }
      }
      return null;
    } catch (error) {
      console.error("PayHere getSuccessfulPayment error:", error);
      return null;
    }
  }
}
