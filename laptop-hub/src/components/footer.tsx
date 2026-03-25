import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="font-semibold mb-4">About LaptopHub</h3>
            <p className="text-sm opacity-80">
              Your premier destination for laptop sales and auctions
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm opacity-80">
              <li>
                <Link
                  href="#"
                  className="hover:opacity-100 transition-opacity"
                >
                  Browse Products
                </Link>
              </li>
              <li>
                <Link
                  href="/auctions"
                  className="hover:opacity-100 transition-opacity"
                >
                  Auctions
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:opacity-100 transition-opacity"
                >
                  Sell with Us
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Customer Service</h3>
            <ul className="space-y-2 text-sm opacity-80">
              <li>
                <Link
                  href="#"
                  className="hover:opacity-100 transition-opacity"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:opacity-100 transition-opacity"
                >
                  FAQs
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:opacity-100 transition-opacity"
                >
                  Returns
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <ul className="space-y-2 text-sm opacity-80">
              <li>
                <Link
                  href="#"
                  className="hover:opacity-100 transition-opacity"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:opacity-100 transition-opacity"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-primary-foreground/20 pt-8 text-center text-sm opacity-80">
          <p>&copy; {new Date().getFullYear()} LaptopHub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
