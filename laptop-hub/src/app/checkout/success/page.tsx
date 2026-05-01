import React from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export default function CheckoutSuccessPage({ searchParams }: any) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Payment Successful!</h1>
          <p className="text-muted-foreground">Thank you for your order.</p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
