// ============================================
// VOYA BITE - COMBINED JAVASCRIPT
// Ihtishaam | Likona | Nithaam | Zanda
// ============================================

// ============================================
// 1. THEME MANAGEMENT (Ihtishaam)
// ============================================
function initTheme() {
  const savedTheme = localStorage.getItem("vb-theme") || "light";
  const savedColor = localStorage.getItem("vb-color") || "blue";
  document.documentElement.setAttribute("data-theme", savedTheme);
  document.documentElement.setAttribute("data-color", savedColor);
  updateThemeIcon(savedTheme);
  updateActiveColorBtn(savedColor);
}

function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute("data-theme");
  const newTheme = currentTheme === "light" ? "dark" : "light";
  document.documentElement.setAttribute("data-theme", newTheme);
  localStorage.setItem("vb-theme", newTheme);
  updateThemeIcon(newTheme);
}

function updateThemeIcon(theme) {
  const icon = document.querySelector(
    "#theme-toggle.material-symbols-outlined",
  );
  if (icon) icon.textContent = theme === "dark" ? "light_mode" : "dark_mode";
}

function setColor(color) {
  document.documentElement.setAttribute("data-color", color);
  localStorage.setItem("vb-color", color);
  updateActiveColorBtn(color);
}

function updateActiveColorBtn(color) {
  document
    .querySelectorAll(".color-btn")
    .forEach((btn) =>
      btn.classList.toggle("active", btn.dataset.color === color),
    );
}

// ============================================
// 2. SHARED UTILITIES
// ============================================
function initMobileMenu() {
  const menuBtn = document.getElementById("menu-btn");
  const navLinks = document.getElementById("nav-links");
  if (!menuBtn || !navLinks) return;
  menuBtn.addEventListener("click", () => navLinks.classList.toggle("active"));
  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => navLinks.classList.remove("active"));
  });
}

function initBackToTop() {
  const btn = document.getElementById("sv-back-to-top");
  if (!btn) return;
  window.addEventListener("scroll", () =>
    btn.classList.toggle("visible", window.scrollY > 500),
  );
  btn.addEventListener("click", () =>
    window.scrollTo({ top: 0, behavior: "smooth" }),
  );
}

function initLogout() {
  const logoutBtn = document.getElementById("logoutBtn");
  if (!logoutBtn) return;
  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("voyaUser");
    sessionStorage.removeItem("voyaUser");
    localStorage.setItem("voyaVisitCount", "0");
    window.location.href = "index.html";
  });
}

// ============================================
// 3. PAGE DETECTION
// ============================================
function initPageSpecific() {
  const path = window.location.pathname.toLowerCase();
  if (path.includes("services")) initServicesPage();
  else if (path.includes("about")) initAboutPage();
  else if (path.includes("faq")) initFAQPage();
  else if (path.includes("contact")) initContactPage();
  else if (path.includes("login")) initLoginPage();
  else initHomePage();
}

// ============================================
// 4. SERVICES PAGE (Ihtishaam)
// ============================================
let currentBookingData = {
  itemName: "",
  category: "",
  price: 0,
  basePrice: 0,
  location: "",
  duration: "",
};

const PRICE_PER_EXTRA_ADULT = 500,
  PRICE_PER_CHILD = 250,
  FLIGHT_CHILD_DISCOUNT = 0.25,
  FLIGHT_GROUP_DISCOUNT = 0.1,
  FLIGHT_GROUP_THRESHOLD = 4;

function generateBookingCode() {
  return (
    "VB-" +
    Date.now().toString(36).toUpperCase() +
    "-" +
    Math.random().toString(36).substring(2, 8).toUpperCase()
  );
}

function validateFullName(n) {
  const t = n.trim();
  return !t
    ? "Full name is required"
    : t.length < 3
      ? "Name must be at least 3 characters"
      : !t.includes(" ")
        ? "Please enter both first and last name"
        : /[^a-zA-Z\s'-]/.test(t)
          ? "Name contains invalid characters"
          : "";
}

function validateEmail(e) {
  const t = e.trim();
  return !t
    ? "Email address is required"
    : !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(t)
      ? "Please enter a valid email address"
      : "";
}

function validatePhone(p) {
  const t = p.trim();
  if (!t) return "Phone number is required";
  const d = t.replace(/\D/g, "");
  return d.length < 10
    ? "Phone number must have at least 10 digits"
    : d.length > 15
      ? "Phone number is too long"
      : "";
}

function validateCheckIn(d) {
  if (!d) return "Start date is required";
  const s = new Date(d),
    t = new Date();
  t.setHours(0, 0, 0, 0);
  return s < t ? "Start date cannot be in the past" : "";
}

function validateCheckOut(ci, co) {
  return co && new Date(co) <= new Date(ci)
    ? "End date must be after start date"
    : "";
}

function showFieldError(id, err) {
  const el = document.getElementById(id);
  if (!el) return;
  if (err) {
    el.textContent = err;
    el.classList.add("show");
  } else {
    el.textContent = "";
    el.classList.remove("show");
  }
}

function toggleFieldClass(inp, err) {
  if (!inp) return;
  inp.classList.remove("error", "valid");
  if (err) inp.classList.add("error");
  else if (inp.value.trim()) inp.classList.add("valid");
}

function setupRealTimeValidation() {
  const ni = document.getElementById("full-name"),
    ei = document.getElementById("email"),
    pi = document.getElementById("phone"),
    ci = document.getElementById("check-in"),
    coi = document.getElementById("check-out");
  if (!ni || !ei || !pi || !ci || !coi) return;

  ni.addEventListener("blur", function () {
    const e = validateFullName(this.value);
    showFieldError("name-error", e);
    toggleFieldClass(this, e);
  });
  ni.addEventListener("input", function () {
    if (this.classList.contains("error")) {
      const e = validateFullName(this.value);
      showFieldError("name-error", e);
      toggleFieldClass(this, e);
    }
  });
  ei.addEventListener("blur", function () {
    const e = validateEmail(this.value);
    showFieldError("email-error", e);
    toggleFieldClass(this, e);
  });
  ei.addEventListener("input", function () {
    if (this.classList.contains("error")) {
      const e = validateEmail(this.value);
      showFieldError("email-error", e);
      toggleFieldClass(this, e);
    }
  });
  pi.addEventListener("blur", function () {
    const e = validatePhone(this.value);
    showFieldError("phone-error", e);
    toggleFieldClass(this, e);
  });
  pi.addEventListener("input", function () {
    if (this.classList.contains("error")) {
      const e = validatePhone(this.value);
      showFieldError("phone-error", e);
      toggleFieldClass(this, e);
    }
  });
  ci.addEventListener("change", function () {
    const e = validateCheckIn(this.value);
    showFieldError("checkin-error", e);
    toggleFieldClass(this, e);
    autoSetCheckOut();
    updatePriceDisplay();
  });
  coi.addEventListener("change", function () {
    const e = validateCheckOut(ci.value, this.value);
    showFieldError("checkout-error", e);
    toggleFieldClass(this, e);
    updatePriceDisplay();
  });
}

function autoSetCheckOut() {
  const cat = currentBookingData.category.toLowerCase(),
    cv = document.getElementById("check-in").value;
  if (!cv) return;
  const ci = new Date(cv);
  let days = 0;
  if (cat === "adventure") {
    const m = currentBookingData.duration.match(/(\d+)/);
    if (m) days = parseInt(m[1]);
  } else if (cat === "hotel") days = 1;
  else if (cat === "flight") days = 7;
  else if (cat === "deal") {
    if (currentBookingData.itemName.includes("Early Bird")) days = 60;
    else if (currentBookingData.itemName.includes("Last Minute")) days = 14;
    else days = 3;
  }
  if (days > 0) {
    const co = new Date(ci);
    co.setDate(co.getDate() + days);
    const cs = co.toISOString().split("T")[0];
    const coEl = document.getElementById("check-out");
    if (coEl) {
      coEl.value = cs;
      coEl.setAttribute("min", cs);
    }
  }
}

function calculateTotalPrice() {
  const adultsEl = document.getElementById("adults");
  const childrenEl = document.getElementById("children");
  const a = adultsEl ? parseInt(adultsEl.value) || 1 : 1;
  const c = childrenEl ? parseInt(childrenEl.value) || 0 : 0;
  const bp = currentBookingData.basePrice;
  const cat = currentBookingData.category.toLowerCase();
  const tp = a + c;

  if (cat === "flight") {
    let atp = bp,
      ctp = Math.round(bp * (1 - FLIGHT_CHILD_DISCOUNT)),
      tac = a * atp,
      tcc = c * ctp,
      sub = tac + tcc,
      disc = 0;
    if (tp >= FLIGHT_GROUP_THRESHOLD)
      disc = Math.round(sub * FLIGHT_GROUP_DISCOUNT);
    return {
      basePrice: bp,
      adultTicketPrice: atp,
      childTicketPrice: ctp,
      totalAdultCost: tac,
      totalChildCost: tcc,
      subtotal: sub,
      discount: disc,
      totalPrice: sub - disc,
      adults: a,
      children: c,
      isFlight: true,
      totalPeople: tp,
    };
  }
  const ea = Math.max(0, a - 1),
    aec = ea * PRICE_PER_EXTRA_ADULT,
    cc = c * PRICE_PER_CHILD;
  return {
    basePrice: bp,
    adultExtraCost: aec,
    childCost: cc,
    totalPrice: bp + aec + cc,
    extraAdults: ea,
    children: c,
    isFlight: false,
  };
}

function updatePriceDisplay() {
  const p = calculateTotalPrice();
  const basePriceEl = document.getElementById("summary-base-price");
  const totalEl = document.getElementById("summary-total");

  if (!basePriceEl || !totalEl) {
    currentBookingData.price = p.totalPrice;
    return;
  }

  if (currentBookingData.category.toLowerCase() === "custom") {
    basePriceEl.textContent = "Quote on request";
    totalEl.textContent = "TBD";
    const aer = document.getElementById("adult-extra-row");
    const cer = document.getElementById("child-extra-row");
    const dr = document.getElementById("discount-row");
    if (aer) aer.style.display = "none";
    if (cer) cer.style.display = "none";
    if (dr) dr.style.display = "none";
    currentBookingData.price = 0;
    return;
  }

  if (p.isFlight) {
    basePriceEl.textContent =
      "R" + p.adultTicketPrice.toLocaleString() + " per adult";
    const aer = document.getElementById("adult-extra-row");
    if (aer && p.adults > 1) {
      aer.style.display = "flex";
      document.getElementById("summary-adult-extra").textContent =
        "R" +
        p.totalAdultCost.toLocaleString() +
        " (" +
        p.adults +
        " adult ticket" +
        (p.adults > 1 ? "s" : "") +
        ")";
    } else if (aer) aer.style.display = "none";

    const cer = document.getElementById("child-extra-row");
    if (cer && p.children > 0) {
      cer.style.display = "flex";
      document.getElementById("summary-child-extra").textContent =
        "R" +
        p.totalChildCost.toLocaleString() +
        " (" +
        p.children +
        " child ticket" +
        (p.children > 1 ? "s" : "") +
        ")";
    } else if (cer) cer.style.display = "none";

    let dr = document.getElementById("discount-row");
    if (p.discount > 0) {
      if (!dr) {
        dr = document.createElement("div");
        dr.id = "discount-row";
        dr.className = "summary-row";
        dr.style.color = "#27ae60";
        dr.innerHTML =
          '<span>Group Discount (10%):</span><span id="summary-discount"></span>';
        const totalRow = document.querySelector(".summary-row.total");
        if (totalRow) totalRow.parentNode.insertBefore(dr, totalRow);
      }
      dr.style.display = "flex";
      document.getElementById("summary-discount").textContent =
        "-R" + p.discount.toLocaleString();
    } else if (dr) dr.style.display = "none";

    totalEl.textContent = "R" + p.totalPrice.toLocaleString();
    currentBookingData.price = p.totalPrice;
  } else {
    basePriceEl.textContent = "R" + p.basePrice.toLocaleString();
    const aer = document.getElementById("adult-extra-row");
    if (aer && p.adultExtraCost > 0) {
      aer.style.display = "flex";
      document.getElementById("summary-adult-extra").textContent =
        "R" +
        p.adultExtraCost.toLocaleString() +
        " (" +
        p.extraAdults +
        " extra adult" +
        (p.extraAdults > 1 ? "s" : "") +
        ")";
    } else if (aer) aer.style.display = "none";

    const cer = document.getElementById("child-extra-row");
    if (cer && p.childCost > 0) {
      cer.style.display = "flex";
      document.getElementById("summary-child-extra").textContent =
        "R" +
        p.childCost.toLocaleString() +
        " (" +
        p.children +
        " child" +
        (p.children > 1 ? "ren" : "") +
        ")";
    } else if (cer) cer.style.display = "none";

    const dr = document.getElementById("discount-row");
    if (dr) dr.style.display = "none";
    totalEl.textContent = "R" + p.totalPrice.toLocaleString();
    currentBookingData.price = p.totalPrice;
  }
}

function setupPriceListeners() {
  const adults = document.getElementById("adults");
  const children = document.getElementById("children");
  if (adults) {
    adults.addEventListener("change", updatePriceDisplay);
    adults.addEventListener("input", updatePriceDisplay);
  }
  if (children) {
    children.addEventListener("change", updatePriceDisplay);
    children.addEventListener("input", updatePriceDisplay);
  }
}

function openBookingForm(itemName, category, price, location, duration) {
  hideCustomFields();
  const np = parseInt(price) || 0;
  currentBookingData = {
    itemName,
    category,
    price: np,
    basePrice: np,
    location,
    duration,
  };
  const titleEl = document.getElementById("booking-item-title");
  const summaryEl = document.getElementById("summary-item");
  const formModal = document.getElementById("booking-form-modal");
  const form = document.getElementById("booking-details-form");
  const adults = document.getElementById("adults");
  const children = document.getElementById("children");

  if (!formModal || !form) return;

  if (titleEl) titleEl.textContent = itemName + " - " + category;
  if (summaryEl) summaryEl.textContent = itemName;
  setFormDateConstraints(category, itemName);
  updateFormLabels(category);
  formModal.style.display = "block";
  form.reset();
  if (adults) adults.value = 1;
  if (children) children.value = 0;
  clearAllErrors();
  updatePriceDisplay();
}

function openCustomTripForm() {
  currentBookingData = {
    itemName: "Custom Trip Inquiry",
    category: "Custom",
    price: 0,
    basePrice: 0,
    location: "To be determined",
    duration: "Flexible",
  };

  const titleEl = document.getElementById("booking-item-title");
  const summaryEl = document.getElementById("summary-item");
  const formModal = document.getElementById("booking-form-modal");
  const form = document.getElementById("booking-details-form");
  const checkin = document.getElementById("check-in");
  const checkout = document.getElementById("check-out");
  const adults = document.getElementById("adults");
  const children = document.getElementById("children");

  if (!formModal || !form) {
    console.error("Booking modal not found");
    return;
  }

  if (titleEl) titleEl.textContent = "Custom Trip Inquiry";
  if (summaryEl) summaryEl.textContent = "Custom Trip";

  const today = new Date().toISOString().split("T")[0];
  if (checkin) checkin.setAttribute("min", today);
  if (checkout) checkout.setAttribute("min", today);

  updateFormLabels("custom");
  formModal.style.display = "block";
  form.reset();
  if (adults) adults.value = 1;
  if (children) children.value = 0;

  showCustomFields();
  clearAllErrors();
  updatePriceDisplay();
}

function hideCustomFields() {
  ["destination-group", "trip-type-group", "budget-group"].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.style.display = "none";
  });
}

function showCustomFields() {
  const specialRequests = document.getElementById("special-requests");
  if (!specialRequests) return;

  createCustomField(
    "destination-group",
    "Preferred Destination",
    "destination",
    "text",
    "e.g., Bali, Morocco, Patagonia...",
    "special-requests",
    "before",
  );
  createCustomField(
    "trip-type-group",
    "Trip Type",
    "trip-type",
    "select",
    "",
    "destination-group",
    "after",
    [
      { value: "", text: "Select type..." },
      { value: "adventure", text: "Adventure" },
      { value: "hotel", text: "Hotel Stay" },
      { value: "flight", text: "Flight Only" },
      { value: "package", text: "Full Package" },
    ],
  );
  createCustomField(
    "budget-group",
    "Budget Range",
    "budget",
    "select",
    "",
    "trip-type-group",
    "after",
    [
      { value: "", text: "Select budget..." },
      { value: "0-5000", text: "Under R5,000" },
      { value: "5000-10000", text: "R5,000 - R10,000" },
      { value: "10000-20000", text: "R10,000 - R20,000" },
      { value: "20000-50000", text: "R20,000 - R50,000" },
      { value: "50000+", text: "R50,000+" },
    ],
  );
  ["destination-group", "trip-type-group", "budget-group"].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.style.display = "block";
  });
}

function createCustomField(
  id,
  label,
  inputId,
  type,
  placeholder,
  refId,
  position,
  options,
) {
  let el = document.getElementById(id);
  if (!el) {
    el = document.createElement("div");
    el.id = id;
    el.className = "form-group";
    let html = '<label for="' + inputId + '">' + label + "</label>";
    if (type === "select" && options) {
      html += '<select id="' + inputId + '">';
      options.forEach((opt) => {
        html += '<option value="' + opt.value + '">' + opt.text + "</option>";
      });
      html += "</select>";
    } else {
      html +=
        '<input type="' +
        type +
        '" id="' +
        inputId +
        '" placeholder="' +
        placeholder +
        '">';
    }
    el.innerHTML = html;
    const refEl = document.getElementById(refId);
    if (refEl && refEl.parentNode) {
      if (position === "before") refEl.parentNode.insertBefore(el, refEl);
      else refEl.parentNode.insertBefore(el, refEl.nextSibling);
    } else {
      const form = document.getElementById("booking-details-form");
      if (form) form.appendChild(el);
    }
  }
  el.style.display = "block";
  return el;
}

function setFormDateConstraints(category, itemName) {
  const today = new Date(),
    todayStr = today.toISOString().split("T")[0];
  let minDate = todayStr;
  if (category.toLowerCase() === "deal") {
    if (itemName.includes("Early Bird")) {
      const d = new Date(today);
      d.setDate(d.getDate() + 60);
      minDate = d.toISOString().split("T")[0];
    } else if (itemName.includes("Last Minute")) {
      const d = new Date(today);
      d.setDate(d.getDate() + 14);
      minDate = d.toISOString().split("T")[0];
    }
  }
  const checkin = document.getElementById("check-in");
  const checkout = document.getElementById("check-out");
  if (checkin) checkin.setAttribute("min", minDate);
  if (checkout) checkout.setAttribute("min", minDate);
}

function updateFormLabels(category) {
  const cil = document.querySelector('label[for="check-in"]'),
    col = document.querySelector('label[for="check-out"]'),
    al = document.querySelector('label[for="adults"]');
  switch (category.toLowerCase()) {
    case "flight":
      if (cil) cil.textContent = "Departure Date";
      if (col) col.textContent = "Return Date";
      if (al) al.textContent = "Adult Tickets (12+ years)";
      break;
    case "hotel":
      if (cil) cil.textContent = "Check-in Date";
      if (col) col.textContent = "Check-out Date";
      if (al) al.textContent = "Adults (12+ years)";
      break;
    case "custom":
      if (cil) cil.textContent = "Preferred Start Date";
      if (col) col.textContent = "Preferred End Date";
      if (al) al.textContent = "Number of Travelers";
      break;
    default:
      if (cil) cil.textContent = "Start Date";
      if (col) col.textContent = "End Date";
      if (al) al.textContent = "Adults (12+ years)";
  }
}

function clearAllErrors() {
  document.querySelectorAll(".error-message").forEach((el) => {
    el.textContent = "";
    el.classList.remove("show");
  });
  document
    .querySelectorAll(
      ".form-group input,.form-group textarea,.form-group select",
    )
    .forEach((el) => el.classList.remove("error", "valid"));
}

function closeBookingForm() {
  const modal = document.getElementById("booking-form-modal");
  if (modal) modal.style.display = "none";
}

function submitBookingForm(event) {
  if (event) event.preventDefault();
  const fn = document.getElementById("full-name").value,
    em = document.getElementById("email").value,
    ph = document.getElementById("phone").value,
    ci = document.getElementById("check-in").value,
    co = document.getElementById("check-out").value;
  const ne = validateFullName(fn),
    ee = validateEmail(em),
    pe = validatePhone(ph),
    cie = validateCheckIn(ci),
    coe = validateCheckOut(ci, co);
  showFieldError("name-error", ne);
  toggleFieldClass(document.getElementById("full-name"), ne);
  showFieldError("email-error", ee);
  toggleFieldClass(document.getElementById("email"), ee);
  showFieldError("phone-error", pe);
  toggleFieldClass(document.getElementById("phone"), pe);
  showFieldError("checkin-error", cie);
  toggleFieldClass(document.getElementById("check-in"), cie);
  showFieldError("checkout-error", coe);
  toggleFieldClass(document.getElementById("check-out"), coe);
  if (ne || ee || pe || cie || coe) {
    const fe = document.querySelector(".error-message.show");
    if (fe) fe.scrollIntoView({ behavior: "smooth", block: "center" });
    return;
  }
  let fd = {
    fullName: fn.trim(),
    email: em.trim(),
    phone: ph.trim(),
    checkIn: ci,
    checkOut: co,
    adults: document.getElementById("adults").value,
    children: document.getElementById("children").value,
    specialRequests: document.getElementById("special-requests").value.trim(),
  };
  const de = document.getElementById("destination"),
    te = document.getElementById("trip-type"),
    be = document.getElementById("budget");
  if (de && de.style.display !== "none") {
    fd.isCustomTrip = true;
    fd.destination = de.value.trim();
    fd.tripType = te ? te.value : "";
    fd.budget = be ? be.value : "";
  }

  const pricing = calculateTotalPrice();
  const bookingForLedger = {
    name: fd.fullName,
    package: currentBookingData.itemName,
    price: pricing.totalPrice,
    email: fd.email,
    phone: fd.phone,
    startDate: fd.checkIn,
    endDate: fd.checkOut,
    adults: fd.adults,
    children: fd.children,
    location: currentBookingData.location,
    category: currentBookingData.category,
  };
  localStorage.setItem("voyaBiteNewBooking", JSON.stringify(bookingForLedger));

  closeBookingForm();
  generateBookingPDF(fd);
}

function generateBookingPDF(formData) {
  showProcessingModal();
  const bookingCode = generateBookingCode(),
    pricing = calculateTotalPrice();
  const bookingDate = new Date().toLocaleDateString("en-ZA", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
  setTimeout(() => {
    if (!window.jspdf) {
      alert("PDF library not loaded. Please include jsPDF.");
      return;
    }
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const pw = doc.internal.pageSize.getWidth(),
      ph = doc.internal.pageSize.getHeight(),
      m = 18;
    let y = 20;
    doc.setFillColor(40, 40, 40);
    doc.rect(0, 0, pw, 35, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text("VOYA BITE", pw / 2, 15, { align: "center" });
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.text(
      formData.isCustomTrip ? "TRIP INQUIRY" : "BOOKING CONFIRMATION",
      pw / 2,
      24,
      { align: "center" },
    );
    y = 46;
    doc.setDrawColor(60, 60, 60);
    doc.setLineWidth(0.5);
    doc.rect(m, y - 4, pw - m * 2, 16);
    doc.setFillColor(245, 245, 245);
    doc.rect(m, y - 4, pw - m * 2, 16, "F");
    doc.setTextColor(40, 40, 40);
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.text("BOOKING CODE:", m + 4, y + 2);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(bookingCode, m + 4, y + 7);
    if (!formData.isCustomTrip) {
      doc.setTextColor(39, 174, 96);
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.text("CONFIRMED", pw - m - 4, y + 4, { align: "right" });
    } else {
      doc.setTextColor(230, 126, 34);
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.text("PENDING REVIEW", pw - m - 4, y + 4, { align: "right" });
    }
    y = 74;
    doc.setTextColor(40, 40, 40);
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("GUEST DETAILS", m, y);
    y += 4;
    doc.setDrawColor(40, 40, 40);
    doc.line(m, y, pw - m, y);
    y += 8;
    doc.setFontSize(9);
    [
      ["Name:", formData.fullName],
      ["Email:", formData.email],
      ["Phone:", formData.phone],
    ].forEach(([l, v]) => {
      doc.setFont("helvetica", "bold");
      doc.text(l, m, y);
      doc.setFont("helvetica", "normal");
      doc.text(v, m + 32, y);
      y += 7;
    });
    y += 4;
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text(formData.isCustomTrip ? "INQUIRY DETAILS" : "TRIP DETAILS", m, y);
    y += 4;
    doc.line(m, y, pw - m, y);
    y += 8;
    doc.setFontSize(9);
    if (formData.isCustomTrip) {
      [
        ["Trip Type:", formData.tripType || "Not specified"],
        ["Destination:", formData.destination || "Not specified"],
        ["Budget:", formData.budget || "Not specified"],
        [
          "Travelers:",
          formData.adults +
            " adult(s)" +
            (parseInt(formData.children) > 0
              ? ", " + formData.children + " child(ren)"
              : ""),
        ],
        ["Start Date:", formData.checkIn || "Not specified"],
        ["End Date:", formData.checkOut || "Not specified"],
        ["Inquiry Date:", bookingDate],
      ].forEach(([l, v]) => {
        doc.setFont("helvetica", "bold");
        doc.text(l, m, y);
        doc.setFont("helvetica", "normal");
        doc.text(v, m + 38, y);
        y += 7;
      });
    } else {
      [
        ["Trip:", currentBookingData.itemName],
        ["Category:", currentBookingData.category],
        ["Location:", currentBookingData.location],
        ["Duration:", currentBookingData.duration],
        [
          "Travelers:",
          formData.adults +
            " adult(s)" +
            (parseInt(formData.children) > 0
              ? ", " + formData.children + " child(ren)"
              : ""),
        ],
        ["Start Date:", formData.checkIn || "Not specified"],
        ["End Date:", formData.checkOut || "Not specified"],
        ["Booked On:", bookingDate],
      ].forEach(([l, v]) => {
        doc.setFont("helvetica", "bold");
        doc.text(l, m, y);
        doc.setFont("helvetica", "normal");
        doc.text(v, m + 38, y);
        y += 7;
      });
    }
    y += 4;
    if (!formData.isCustomTrip) {
      doc.setFillColor(245, 245, 245);
      if (pricing.isFlight) {
        let bh = 16;
        if (pricing.adults > 1) bh += 7;
        if (pricing.children > 0) bh += 7;
        if (pricing.discount > 0) bh += 14;
        bh += 10;
        doc.rect(m, y - 2, pw - m * 2, bh, "F");
        doc.setTextColor(40, 40, 40);
        doc.setFontSize(9);
        doc.setFont("helvetica", "bold");
        doc.text("Price per adult ticket:", m + 3, y + 3);
        doc.setFont("helvetica", "normal");
        doc.text(
          "R" + pricing.adultTicketPrice.toLocaleString(),
          pw - m - 3,
          y + 3,
          { align: "right" },
        );
        if (pricing.adults > 1) {
          y += 7;
          doc.setFont("helvetica", "bold");
          doc.text("Adult Tickets (" + pricing.adults + "x):", m + 3, y + 3);
          doc.setFont("helvetica", "normal");
          doc.text(
            "R" + pricing.totalAdultCost.toLocaleString(),
            pw - m - 3,
            y + 3,
            { align: "right" },
          );
        }
        if (pricing.children > 0) {
          y += 7;
          doc.setFont("helvetica", "bold");
          doc.text(
            "Child Tickets (" + pricing.children + "x, 25% off):",
            m + 3,
            y + 3,
          );
          doc.setFont("helvetica", "normal");
          doc.text(
            "R" + pricing.totalChildCost.toLocaleString(),
            pw - m - 3,
            y + 3,
            { align: "right" },
          );
        }
        if (pricing.discount > 0) {
          y += 7;
          doc.setDrawColor(180, 180, 180);
          doc.line(m + 3, y + 1, pw - m - 3, y + 1);
          doc.setTextColor(39, 174, 96);
          doc.setFont("helvetica", "bold");
          doc.text("Group Discount (10%):", m + 3, y + 4);
          doc.text(
            "-R" + pricing.discount.toLocaleString(),
            pw - m - 3,
            y + 4,
            { align: "right" },
          );
        }
        y += 10;
        doc.setDrawColor(180, 180, 180);
        doc.line(m + 3, y - 1, pw - m - 3, y - 1);
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(11);
        doc.setFont("helvetica", "bold");
        doc.text("TOTAL:", m + 3, y + 4);
        doc.setFontSize(12);
        doc.text("R" + pricing.totalPrice.toLocaleString(), pw - m - 3, y + 4, {
          align: "right",
        });
      } else {
        let bh = 16;
        if (pricing.adultExtraCost > 0) bh += 7;
        if (pricing.childCost > 0) bh += 7;
        bh += 10;
        doc.rect(m, y - 2, pw - m * 2, bh, "F");
        doc.setTextColor(40, 40, 40);
        doc.setFontSize(9);
        doc.setFont("helvetica", "bold");
        doc.text("Base Price:", m + 3, y + 3);
        doc.setFont("helvetica", "normal");
        doc.text("R" + pricing.basePrice.toLocaleString(), pw - m - 3, y + 3, {
          align: "right",
        });
        if (pricing.adultExtraCost > 0) {
          y += 7;
          doc.setFont("helvetica", "bold");
          doc.text("Extra Adults (" + pricing.extraAdults + "):", m + 3, y + 3);
          doc.setFont("helvetica", "normal");
          doc.text(
            "R" + pricing.adultExtraCost.toLocaleString(),
            pw - m - 3,
            y + 3,
            { align: "right" },
          );
        }
        if (pricing.childCost > 0) {
          y += 7;
          doc.setFont("helvetica", "bold");
          doc.text("Children (" + pricing.children + "):", m + 3, y + 3);
          doc.setFont("helvetica", "normal");
          doc.text(
            "R" + pricing.childCost.toLocaleString(),
            pw - m - 3,
            y + 3,
            { align: "right" },
          );
        }
        y += 10;
        doc.setDrawColor(180, 180, 180);
        doc.line(m + 3, y - 1, pw - m - 3, y - 1);
        doc.setFontSize(11);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(0, 0, 0);
        doc.text("TOTAL:", m + 3, y + 4);
        doc.setFontSize(12);
        doc.text("R" + pricing.totalPrice.toLocaleString(), pw - m - 3, y + 4, {
          align: "right",
        });
      }
    } else {
      doc.setFillColor(255, 243, 205);
      doc.rect(m, y - 2, pw - m * 2, 13, "F");
      doc.setTextColor(150, 100, 0);
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.text(
        "A travel specialist will contact you within 24 hours with a personalized quote.",
        m + 4,
        y + 3,
      );
    }
    y += 16;
    doc.setTextColor(40, 40, 40);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("IMPORTANT INFORMATION", m, y);
    y += 4;
    doc.line(m, y, pw - m, y);
    y += 7;
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(80, 80, 80);
    const info = formData.isCustomTrip
      ? [
          "A travel specialist will review your inquiry and contact you shortly.",
          "This is not a confirmed booking.",
          "For immediate assistance, contact support@voyabite.com",
          "Please save this reference code for your records.",
        ]
      : [
          "Please save this booking code for future reference.",
          "Present this booking code and valid ID at check-in.",
          "Free cancellation up to 48 hours before start date.",
          "For changes or assistance, contact support@voyabite.com",
        ];
    info.forEach((line) => {
      doc.text(line, m, y);
      y += 6;
    });
    doc.setFillColor(40, 40, 40);
    doc.rect(0, ph - 18, pw, 18, "F");
    doc.setTextColor(200, 200, 200);
    doc.setFontSize(7);
    doc.text(
      "Voya Bite Travel Solutions | support@voyabite.com | +27 800 123 456",
      pw / 2,
      ph - 10,
      { align: "center" },
    );
    doc.text(
      "Computer-generated document - no signature required.",
      pw / 2,
      ph - 5,
      { align: "center" },
    );
    doc.save(
      "VoyaBite-" +
        (formData.isCustomTrip ? "Inquiry" : "Booking") +
        "-" +
        bookingCode +
        ".pdf",
    );
    updateModalWithCode(bookingCode, formData);
  }, 1000);
}

function showProcessingModal() {
  const modal = document.getElementById("booking-modal");
  const body = document.getElementById("booking-modal-body");
  if (!modal || !body) return;
  modal.style.display = "block";
  body.innerHTML =
    '<div class="booking-confirmation"><div class="booking-loader"></div><h2>Processing Your ' +
    (currentBookingData.category === "Custom" ? "Inquiry" : "Booking") +
    "</h2><p><strong>" +
    currentBookingData.itemName +
    "</strong></p><p>" +
    currentBookingData.category +
    "</p><p>" +
    currentBookingData.location +
    "</p><p>Generating your confirmation...</p></div>";
}

function updateModalWithCode(bookingCode, formData) {
  const pricing = calculateTotalPrice();
  let pd = "";
  if (formData.isCustomTrip) {
    pd +=
      "<p><strong>Custom Trip Inquiry</strong></p><p>Destination: " +
      (formData.destination || "TBD") +
      "</p><p>Type: " +
      (formData.tripType || "Not specified") +
      "</p><p>" +
      (formData.checkIn || "Date TBD") +
      "</p><p>Travelers: " +
      formData.adults +
      " adult" +
      (formData.adults > 1 ? "s" : "") +
      (parseInt(formData.children) > 0
        ? " + " +
          formData.children +
          " child" +
          (formData.children > 1 ? "ren" : "")
        : "") +
      "</p>";
  } else {
    pd +=
      "<p><strong>" +
      currentBookingData.itemName +
      "</strong></p><p>" +
      currentBookingData.location +
      "</p><p>" +
      (formData.checkIn || "Date TBD") +
      "</p>";
    if (pricing.isFlight)
      pd +=
        "<p>" +
        formData.adults +
        " adult ticket" +
        (formData.adults > 1 ? "s" : "") +
        (parseInt(formData.children) > 0
          ? " + " +
            formData.children +
            " child ticket" +
            (formData.children > 1 ? "s" : "")
          : "") +
        "</p>";
    else
      pd +=
        "<p>" +
        formData.adults +
        " adult" +
        (formData.adults > 1 ? "s" : "") +
        (parseInt(formData.children) > 0
          ? " + " +
            formData.children +
            " child" +
            (formData.children > 1 ? "ren" : "")
          : "") +
        "</p>";
    pd +=
      "<p><strong>R" +
      currentBookingData.price.toLocaleString() +
      "</strong></p>";
  }
  const title = formData.isCustomTrip
    ? "Inquiry Submitted"
    : "Booking Confirmed";
  const icon = formData.isCustomTrip ? "&#9993;" : "&#10003;";
  const note1 = formData.isCustomTrip
    ? "Your trip inquiry has been submitted. A travel specialist will contact you within 24 hours."
    : "Your booking PDF has been downloaded automatically.";
  const body = document.getElementById("booking-modal-body");
  if (!body) return;
  body.innerHTML =
    '<div class="booking-confirmation"><div class="booking-success-icon">' +
    icon +
    "</div><h2>" +
    title +
    "</h2><p>Thank you, <strong>" +
    formData.fullName +
    '</strong></p><div class="booking-code-display"><p>Your Reference Code:</p><h3>' +
    bookingCode +
    '</h3></div><div class="booking-details-summary">' +
    pd +
    '</div><p class="booking-note">' +
    note1 +
    '</p><button class="btn" onclick="closeModal()">Done</button></div>';
}

function closeModal() {
  const modal = document.getElementById("booking-modal");
  if (modal) modal.style.display = "none";
}

function initServicesPage() {
  if (!document.getElementById("sv-filter-bar")) return;
  setupRealTimeValidation();
  setupPriceListeners();
  const filterBtn = document.getElementById("sv-filter-btn");
  if (filterBtn) {
    filterBtn.addEventListener("click", () => {
      const st = document.getElementById("sv-search").value.toLowerCase(),
        r = document.getElementById("sv-region-filter").value,
        t = document.getElementById("sv-type-filter").value,
        pr = document.getElementById("sv-price-filter").value;
      const cards = document.querySelectorAll(".sv-card, .sv-deal-card");
      let vis = 0;
      cards.forEach((c) => {
        let s = true;
        if (st && !(c.dataset.location || "").toLowerCase().includes(st))
          s = false;
        if (r && c.dataset.region !== r) s = false;
        if (t && c.dataset.category !== t) s = false;
        if (pr) {
          const [mn, mx] = pr.split("-").map(Number);
          if (parseInt(c.dataset.price) < mn || parseInt(c.dataset.price) > mx)
            s = false;
        }
        c.style.display = s ? "" : "none";
        if (s) vis++;
      });
      document.querySelectorAll(".sv-section").forEach((sec) => {
        const vc = sec.querySelectorAll(
          '.sv-card:not([style*="display: none"]), .sv-deal-card:not([style*="display: none"])',
        );
        sec.style.display = vc.length === 0 ? "none" : "";
      });
      handleNoResultsMessage(vis);
    });
  }
  const searchInput = document.getElementById("sv-search");
  if (searchInput) {
    searchInput.addEventListener("input", () => {
      clearTimeout(window.st);
      window.st = setTimeout(
        () => document.getElementById("sv-filter-btn").click(),
        400,
      );
    });
  }
}

function handleNoResultsMessage(vc) {
  const em = document.getElementById("sv-no-results");
  if (em) em.remove();
  if (vc === 0) {
    const m = document.createElement("div");
    m.id = "sv-no-results";
    m.className = "sv-no-results";
    m.innerHTML =
      '<div class="sv-no-results-content"><h3>No Results Available</h3><p>No matches found. Try adjusting your filters.</p><button id="sv-clear-filters">Clear All Filters</button></div>';
    const filterBar = document.getElementById("sv-filter-bar");
    if (filterBar) filterBar.parentNode.insertBefore(m, filterBar.nextSibling);
    const clearBtn = document.getElementById("sv-clear-filters");
    if (clearBtn) clearBtn.addEventListener("click", clearAllFilters);
  }
}

function clearAllFilters() {
  document.getElementById("sv-search").value = "";
  document.getElementById("sv-region-filter").value = "";
  document.getElementById("sv-type-filter").value = "";
  document.getElementById("sv-price-filter").value = "";
  document
    .querySelectorAll(".sv-card, .sv-deal-card")
    .forEach((c) => (c.style.display = ""));
  document
    .querySelectorAll(".sv-section")
    .forEach((s) => (s.style.display = ""));
  const m = document.getElementById("sv-no-results");
  if (m) m.remove();
}

// ============================================
// 5. ABOUT PAGE (Likona)
// ============================================
function initAboutPage() {
  if (!document.querySelector(".about-team")) return;
}

// ============================================
// 6. FAQ PAGE (Nithaam)
// ============================================
function initFAQPage() {
  if (!document.querySelector(".faq-section")) return;
  document.querySelectorAll(".faq-trigger").forEach((button) => {
    button.addEventListener("click", () => {
      const targetId = button.getAttribute("data-target");
      const paragraph = document.getElementById(targetId);
      if (!paragraph) return;
      const isOpen = paragraph.classList.contains("faq-show");
      document
        .querySelectorAll(".faq-paragraph.faq-show")
        .forEach((item) => item.classList.remove("faq-show"));
      document
        .querySelectorAll(".faq-trigger.faq-active")
        .forEach((item) => item.classList.remove("faq-active"));
      if (!isOpen) {
        paragraph.classList.add("faq-show");
        button.classList.add("faq-active");
      }
    });
  });
}

// ============================================
// 7. HOME PAGE (Zanda)
// ============================================
function initHomePage() {
  if (!document.querySelector(".home-hero") && !document.querySelector("#home"))
    return;
  if (typeof ScrollReveal === "function") {
    const sro = { distance: "50px", origin: "bottom", duration: 1000 };
    ScrollReveal().reveal(".home-header-content h1", { ...sro, delay: 500 });
    ScrollReveal().reveal(".home-header-content p", { ...sro });
    ScrollReveal().reveal(".home-banner-card", { ...sro, interval: 500 });
  }
}

// ============================================
// 8. CONTACT PAGE - FIXED
// ============================================
function initContactPage() {
  if (!document.getElementById("contactForm")) return;

  const form = document.getElementById("contactForm");
  const submitBtn = document.getElementById("submitBtn");
  const btnText = document.getElementById("btnText");
  const btnLoading = document.getElementById("btnLoading");
  const successMessage = document.getElementById("successMessage");
  const errorMessage = document.getElementById("errorMessage");
  const messageInput = document.getElementById("message");
  const charCount = document.getElementById("charCount");

  if (messageInput && charCount) {
    messageInput.addEventListener("input", function () {
      const length = this.value.length;
      charCount.textContent = length;
      if (length > 500) {
        this.value = this.value.substring(0, 500);
        charCount.textContent = 500;
      }
      charCount.parentElement.classList.toggle("warning", length > 450);
    });
  }

  function validateField(field) {
    const errorElement = document.getElementById(field.id + "Error");
    if (!errorElement) return true;

    if (field.type === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(field.value)) {
        field.classList.add("error");
        errorElement.classList.add("show");
        return false;
      }
    } else if (field.value.trim() === "") {
      field.classList.add("error");
      errorElement.classList.add("show");
      return false;
    }
    field.classList.remove("error");
    errorElement.classList.remove("show");
    return true;
  }

  const inputs = form.querySelectorAll("input, textarea");
  inputs.forEach((input) => {
    input.addEventListener("blur", () => validateField(input));
    input.addEventListener("input", () => {
      if (input.classList.contains("error")) validateField(input);
    });
  });

  form.addEventListener("submit", async function (e) {
    e.preventDefault();
    if (successMessage) successMessage.classList.remove("show");
    if (errorMessage) errorMessage.classList.remove("show");

    let isValid = true;
    inputs.forEach((input) => {
      if (!validateField(input)) isValid = false;
    });
    if (!isValid) return;

    if (submitBtn) submitBtn.disabled = true;
    if (btnText) btnText.style.display = "none";
    if (btnLoading) btnLoading.style.display = "inline";

    try {
      const formData = new FormData(form);
      const response = await fetch(form.action, {
        method: form.method,
        body: formData,
        headers: { Accept: "application/json" },
      });

      if (response.ok) {
        if (successMessage) successMessage.classList.add("show");
        form.reset();
        if (charCount) {
          charCount.textContent = "0";
          charCount.parentElement.classList.remove("warning");
        }
        if (successMessage)
          successMessage.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        setTimeout(() => successMessage.classList.remove("show"), 5000);
      } else {
        throw new Error("Form submission failed");
      }
    } catch (error) {
      if (errorMessage) {
        errorMessage.classList.add("show");
        errorMessage.scrollIntoView({ behavior: "smooth", block: "center" });
        setTimeout(() => errorMessage.classList.remove("show"), 5000);
      }
    } finally {
      if (submitBtn) submitBtn.disabled = false;
      if (btnText) btnText.style.display = "inline";
      if (btnLoading) btnLoading.style.display = "none";
    }
  });
}

// ============================================
// 9. LOGIN PAGE - FIXED WITH INSTANT REDIRECT
// ============================================
// ============================================
// 9. LOGIN PAGE - FIXED WITH INSTANT REDIRECT
// ============================================
document.addEventListener("DOMContentLoaded", () => {
  // ===== THEME + COLOR SWITCHER =====
  const html = document.documentElement;
  const themeToggle = document.getElementById("theme-toggle");
  const colorBtns = document.querySelectorAll(".color-btn");

  // Load saved theme
  const savedTheme = localStorage.getItem("voyaTheme") || "light";
  const savedColor = localStorage.getItem("voyaColor") || "blue";
  html.setAttribute("data-theme", savedTheme);
  html.setAttribute("data-color", savedColor);

  updateThemeIcon(savedTheme);
  updateActiveColorBtn(savedColor);

  themeToggle?.addEventListener("click", () => {
    const currentTheme = html.getAttribute("data-theme");
    const newTheme = currentTheme === "light" ? "dark" : "light";
    html.setAttribute("data-theme", newTheme);
    localStorage.setItem("voyaTheme", newTheme);
    updateThemeIcon(newTheme);
  });

  colorBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const color = btn.dataset.color;
      html.setAttribute("data-color", color);
      localStorage.setItem("voyaColor", color);
      updateActiveColorBtn(color);
    });
  });

  function updateThemeIcon(theme) {
    const icon = themeToggle?.querySelector(".material-symbols-outlined");
    if (icon) icon.textContent = theme === "light" ? "dark_mode" : "light_mode";
  }

  function updateActiveColorBtn(color) {
    colorBtns.forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.color === color);
    });
  }

  // ===== MOBILE MENU =====
  const menuBtn = document.getElementById("menu-btn");
  const navLinks = document.getElementById("nav-links");

  menuBtn?.addEventListener("click", () => {
    navLinks.classList.toggle("active");
    const icon = menuBtn.querySelector(".material-symbols-outlined");
    icon.textContent = navLinks.classList.contains("active") ? "close" : "menu";
  });

  // ===== AUTH LOGIC =====
  const loginForm = document.getElementById("loginForm");
  const signupForm = document.getElementById("signupForm");
  const showSignupBtn = document.getElementById("showSignup");
  const showLoginBtn = document.getElementById("showLogin");

  const successMsg = document.getElementById("successMessage");
  const errorMsg = document.getElementById("errorMessage");
  const errorText = document.getElementById("errorText");
  const sessionExpiredMsg = document.getElementById("sessionExpiredMessage");

  // Check if already logged in
  checkExistingSession();
  checkSessionExpiry();

  // Toggle between login/signup forms
  showSignupBtn?.addEventListener("click", () => {
    loginForm.style.display = "none";
    signupForm.style.display = "block";
    hideMessages();
    clearErrors();
  });

  showLoginBtn?.addEventListener("click", () => {
    signupForm.style.display = "none";
    loginForm.style.display = "block";
    hideMessages();
    clearErrors();
  });

  // ===== SIGNUP =====
  signupForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    hideMessages();
    clearErrors();

    const name = document.getElementById("signupName").value.trim();
    const email = document
      .getElementById("signupEmail")
      .value.trim()
      .toLowerCase();
    const password = document.getElementById("signupPassword").value;

    let isValid = true;

    if (name.length < 2) {
      showFieldError("signupNameError");
      isValid = false;
    }
    if (!validateEmail(email)) {
      showFieldError("signupEmailError");
      isValid = false;
    }
    if (password.length < 6) {
      showFieldError("signupPasswordError");
      isValid = false;
    }

    if (!isValid) return;

    // Get existing users
    const users = getUsers();

    // Check if email already exists
    if (users.some((user) => user.email === email)) {
      showError("An account with this email already exists");
      return;
    }

    // Create new user
    users.push({ name, email, password });
    localStorage.setItem("voyaUsers", JSON.stringify(users));

    showSuccess("Account created! Logging you in...");

    // Auto login after signup
    setTimeout(() => {
      createSession(email, name, false);
      redirectToHome();
    }, 1200);
  });

  // ===== LOGIN =====
  loginForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    hideMessages();
    clearErrors();

    const email = document
      .getElementById("loginEmail")
      .value.trim()
      .toLowerCase();
    const password = document.getElementById("loginPassword").value;
    const rememberMe = document.getElementById("rememberMe").checked;

    let isValid = true;

    if (!validateEmail(email)) {
      showFieldError("loginEmailError");
      isValid = false;
    }
    if (!password) {
      showFieldError("loginPasswordError");
      isValid = false;
    }

    if (!isValid) return;

    const users = getUsers();
    const user = users.find(
      (u) => u.email === email && u.password === password,
    );

    if (!user) {
      showError("Invalid email or password");
      return;
    }

    showSuccess("Login successful!");
    createSession(email, user.name, rememberMe);

    setTimeout(() => {
      redirectToHome();
    }, 1200);
  });

  // ===== HELPER FUNCTIONS =====
  function getUsers() {
    return JSON.parse(localStorage.getItem("voyaUsers") || "[]");
  }

  function createSession(email, name, remember) {
    const session = {
      email,
      name,
      loggedIn: true,
      loginTime: Date.now(),
      remember,
      visitCount: 0,
    };
    localStorage.setItem("voyaSession", JSON.stringify(session));
  }

  function checkExistingSession() {
    const session = JSON.parse(localStorage.getItem("voyaSession"));
    if (session?.loggedIn && session.remember) {
      // Auto-redirect if "remember me" was checked
      redirectToHome();
    }
  }

  function checkSessionExpiry() {
    const session = JSON.parse(localStorage.getItem("voyaSession"));
    const urlParams = new URLSearchParams(window.location.search);

    if (urlParams.get("expired") === "true") {
      sessionExpiredMsg.style.display = "flex";
      localStorage.removeItem("voyaSession");
    }

    // Example: expire after 3 visits if not "remember me"
    if (session?.loggedIn && !session.remember) {
      session.visitCount = (session.visitCount || 0) + 1;
      if (session.visitCount >= 3) {
        localStorage.removeItem("voyaSession");
        window.location.href = "index.html?expired=true";
      } else {
        localStorage.setItem("voyaSession", JSON.stringify(session));
      }
    }
  }

  function redirectToHome() {
    window.location.href = "home.html";
  }

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function showFieldError(id) {
    document.getElementById(id).style.display = "block";
  }

  function clearErrors() {
    document.querySelectorAll(".login-error-text").forEach((el) => {
      el.style.display = "none";
    });
  }

  function showSuccess(text) {
    successMsg.querySelector("span").textContent = text;
    successMsg.style.display = "flex";
    errorMsg.style.display = "none";
    sessionExpiredMsg.style.display = "none";
  }

  function showError(text) {
    errorText.textContent = text;
    errorMsg.style.display = "flex";
    successMsg.style.display = "none";
    sessionExpiredMsg.style.display = "none";
  }

  function hideMessages() {
    successMsg.style.display = "none";
    errorMsg.style.display = "none";
    sessionExpiredMsg.style.display = "none";
  }
});

// ============================================
// 10. AUTH SYSTEM - GLOBAL
// ============================================
function initAuth() {
  updateAuthUI();
}

function updateAuthUI() {
  const user = JSON.parse(localStorage.getItem("voyaUser") || "null");
  const logoutBtn = document.getElementById("logoutBtn");

  if (user) {
    if (logoutBtn) logoutBtn.style.display = "inline-block";

    let visitCount = parseInt(localStorage.getItem("voyaVisitCount") || "0");
    visitCount++;
    localStorage.setItem("voyaVisitCount", visitCount.toString());

    if (visitCount >= 3) {
      localStorage.removeItem("voyaUser");
      localStorage.setItem("voyaVisitCount", "0");
      if (!window.location.pathname.toLowerCase().includes("login")) {
        window.location.href = "login.html?expired=true";
      }
    }
  } else {
    if (logoutBtn) logoutBtn.style.display = "none";
  }
}

// ============================================
// 11. INITIALIZE EVERYTHING
// ============================================
window.onclick = function (event) {
  if (event.target == document.getElementById("booking-form-modal"))
    document.getElementById("booking-form-modal").style.display = "none";
  if (event.target == document.getElementById("booking-modal"))
    document.getElementById("booking-modal").style.display = "none";
};

document.addEventListener("DOMContentLoaded", function () {
  initTheme();
  initMobileMenu();
  initBackToTop();
  initAuth();
  initLogout();
  initPageSpecific();

  const themeToggle = document.getElementById("theme-toggle");
  if (themeToggle) themeToggle.addEventListener("click", toggleTheme);

  document
    .querySelectorAll(".color-btn")
    .forEach((btn) =>
      btn.addEventListener("click", () => setColor(btn.dataset.color)),
    );
});
