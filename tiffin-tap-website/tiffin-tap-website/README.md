# Tiffin Tap website demo

A responsive multi-page-style website for the Tiffin Tap student startup concept.

## Run it
1. Extract `tiffin-tap-website.zip`.
2. Open `index.html` in a modern browser.
3. Internet is needed for Google Fonts and the remote Unsplash food photos. The site itself runs locally.

## Pages
Home, Our Menu, Order Now, Subscriptions, How It Works, For Schools, About Us, Contact, and Home-to-School Pickup request.

## Demo functionality
- Hash-based navigation between pages.
- Mobile navigation menu.
- Menu day tabs and category filters.
- Order form validation and order summary.
- Configurable normal / late / closed order window.
- Local demo order IDs and browser-local storage.
- Subscription plan selection pre-fills the order form.
- School enquiry, contact and home pickup demo forms.
- Local pickup request status.
- Scroll reveal animations, progress bar, back-to-top button, reduced-motion support.

## Important
This is a front-end demonstration only. It does not connect to a kitchen, payment gateway, live delivery tracking, email service or database. Form submissions are saved in the browser's localStorage. Clearing browser data removes them. The menu, prices, order deadlines and late fee are illustrative placeholders.

## Configure demo order times and price
Edit the `SETTINGS` object at the top of `app.js`:
- `normalOrderCutoff`: normal ordering cutoff in 24-hour `HH:MM`.
- `lateOrderCutoff`: closing time for late orders.
- `lateFee`: illustrative late fee.
- `demoBasePrice`: fallback illustrative price.
Menu sample prices are in the `MENU` array in `app.js`.
