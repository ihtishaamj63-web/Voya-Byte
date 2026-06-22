# Voya Bite

A travel booking website built by four developers as a collaborative project. Users can browse adventures, hotels, flights, and deals, filter by region and price, book trips, and download PDF confirmations.

## What the Site Does

- Browse travel packages across Africa, Asia, Europe, South America, and Oceania
- Filter listings by region, category, and price
- Book adventures, hotels, flights, and limited-time deals
- Request custom trips with flexible destination and budget options
- Pricing updates live based on adults, children, and group size
- Download PDF booking confirmations with reference codes
- Switch between light/dark mode and four color themes
- FAQ accordion and contact form with submission handling

## Built With

HTML, CSS, and JavaScript. No frameworks.

External libraries used:
- jsPDF for PDF generation
- ScrollReveal for scroll animations
- Font Awesome and Material Symbols for icons
- Formspree for contact form submissions

## Project Files

```
voya-bite/
├── home.html
├── services.html
├── about.html
├── FAQ.html
├── contact.html
├── review.html
├── style.css
├── main.js
├── favicon files
```

## How the Booking System Works

When a user clicks "Book Now" on any card:

1. A modal opens with the item details pre-filled
2. Checkout dates auto-calculate based on the booking category
3. Pricing changes as the user adjusts adults, children, or dates
4. The form validates in real time before submission
5. A PDF generates with a booking code, itinerary, pricing breakdown, and terms
6. Booking data saves to localStorage

## Theme System

Four color themes (blue, green, purple, orange) plus light/dark mode. Preferences save to localStorage. The theme toggle and color buttons sit fixed on the right side of the screen across all pages.

## Team

| Name | Role |
|---|---|
| Likona Mkhatshana | HTML, About page |
| Nithaam Julius | Design, Figma, FAQ page |
| Ihtishaam Johnson | Editor, documentation, Services page |
| Zanda Kumsha | CSS, Home page |
| Butsha Tengwa | Contact page |

## Things That Could Be Better

- Bookings only save to localStorage with no backend
- No user accounts or login system
- PDF generation depends on jsPDF loading from CDN
- No server-side validation beyond Formspree
- Service listings are hardcoded in HTML rather than loaded dynamically

## Links

- Figma: https://www.figma.com/design/WcYBszkLji8bDsXQ0UPpXD/HTML--CSS---JavaScript-Showcase-Brief?m=auto&t=QRlCwrhpymZjPT4g-1
- GitHub: https://github.com/ihtishaamj63-web/Voya-Byte.git
- Live site: https://ihtishaamj63-web.github.io/Voya-Byte/