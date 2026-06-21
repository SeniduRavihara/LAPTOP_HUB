# Manual Test Checklist

## 1. Cart: Login clears cart?

- [ ] Add items to cart while logged out
- [ ] Sign in — cart should **keep** the items (not cleared)
- [ ] Sign out — cart should be cleared

## 2. Buy Now redirect flow

- [ ] Click "Buy Now" on a product while logged out
- [ ] Should redirect to `/login?redirect=/checkout`
- [ ] Sign in — should redirect back to `/checkout`, not home

## 3. Checkout: Button text matches payment method

- [ ] Select **Online Payment** → button should say "Place Order (Online)"
- [ ] Select **Cash on Delivery** → button should say "Place Order (COD)"
- [ ] Submit with COD → should show "Placing Order..." not "Redirecting to PayHere..."

## 4. Slideshow images

- [ ] Home page slideshow — images should show **full** (not cropped)
- [ ] Verify `object-contain` is used (letterbox background if ratio differs)

## 5. Product filters

- [ ] Apply Filters button — cursor should be pointer, button scales on click
- [ ] Price range slider — max should go up to **500,000** (not 5,000)
- [ ] Select RAM / Processor filters → verify results narrow down

## 6. Contact form

- [ ] Fill name, email, message → click "Send Message"
- [ ] Should show a **toast**: "Thank you! We'll get back to you soon."

## 7. Product detail page

- [ ] Open any product (e.g. Dell Latitude 7430)
- [ ] "About this product" section should **not** contain hardcoded "Dell XPS 13 Plus" text
- [ ] Only the product's actual description should show

## 8. Product card pricing

- [ ] On home page / products page — strike-through price shows real `original_price`, not fake `price * 1.15`
- [ ] If no `original_price` set, no strike-through should appear

## 9. Product form: Numeric inputs

- [ ] Go to Add Product (admin/seller)
- [ ] Click on Price / Stock / Starting Bid input — existing `0` should be highlighted
- [ ] Typing a number should replace `0`, not append to it (no `0500`)

## 10. Product form: Image upload

- [ ] Upload the same image file twice → second should be skipped with warning
- [ ] Upload 2+ images → hover over non-first image → "Make Main" button should appear
- [ ] Click "Make Main" → that image should move to first position

## 11. Seller auction list

- [ ] Go to Seller → My Auctions
- [ ] Active auction should show **"End Auction"** button
- [ ] Click → confirmation dialog → confirms → auction ends, winner gets order

## 12. Seller sidebar

- [ ] Sidebar should show seller's name (e.g. "John's Store"), not "TechStore_Pro"
- [ ] "View Public Store" link should be **hidden** (commented out temporarily)
