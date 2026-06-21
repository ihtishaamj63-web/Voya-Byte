// ============================================
// 9. LOGIN PAGE - FIXED WITH INSTANT REDIRECT
// ============================================
function initLoginPage() {
  const loginForm = document.getElementById("loginForm");
  const signupForm = document.getElementById("signupForm");
  const showSignupBtn = document.getElementById("showSignup");
  const showLoginBtn = document.getElementById("showLogin");
  const successMessage = document.getElementById("successMessage");
  const errorMessage = document.getElementById("errorMessage");
  const sessionExpiredMessage = document.getElementById(
    "sessionExpiredMessage"
  );

  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get("expired") === "true" && sessionExpiredMessage) {
    sessionExpiredMessage.style.display = "block";
  }

  const user = JSON.parse(localStorage.getItem("voyaUser") || "null");
  if (user) {
    window.location.href = "home.html"; // changed
    return;
  }

  // ... rest of code ...

  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      // ... validation code ...
      
      localStorage.setItem(
        "voyaUser",
        JSON.stringify({ name: user.name, email: user.email })
      );
      localStorage.setItem("voyaVisitCount", "0");
      window.location.href = "home.html"; // changed
    });
  }

  if (signupForm) {
    signupForm.addEventListener("submit", (e) => {
      // ... validation code ...
      
      localStorage.setItem("voyaUsers", JSON.stringify(users));
      localStorage.setItem("voyaUser", JSON.stringify({ name, email }));
      localStorage.setItem("voyaVisitCount", "0");
      window.location.href = "home.html"; // changed
    });
  }
  
  // ... rest unchanged ...
}


// function setTheme(buttonColor, backgroundColor) {

//     document.documentElement.style.setProperty(
//         '--primary-color',
//         buttonColor
//     );

//     document.documentElement.style.setProperty(
//         '--bg-color',
//         backgroundColor
//     );

//     localStorage.setItem('themeColor', buttonColor);
//     localStorage.setItem('bgColor', backgroundColor);
// }

// window.addEventListener('load', () => {
//     const savedTheme = localStorage.getItem('themeColor');
//     const savedBg = localStorage.getItem('bgColor');

//     if (savedTheme && savedBg) {
//         document.documentElement.style.setProperty(
//             '--primary-color',
//             savedTheme
//         );

//         document.documentElement.style.setProperty(
//             '--bg-color',
//             savedBg
//         );
//     }
// });
 
// ============================================
// THEME & COLOR SWITCHER
// ============================================
function initThemeControls() {
  const html = document.documentElement;
  const themeToggle = document.getElementById("theme-toggle");
  const colorButtons = document.querySelectorAll(".color-btn");

  // Load saved theme
  const savedTheme = localStorage.getItem("theme") || "light";
  const savedColor = localStorage.getItem("color") || "blue";

  html.setAttribute("data-theme", savedTheme);
  html.setAttribute("data-color", savedColor);

  // Highlight active color button
  colorButtons.forEach((btn) => {
    if (btn.dataset.color === savedColor) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  });

  // Dark/Light mode toggle
  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const currentTheme = html.getAttribute("data-theme");

      const newTheme =
        currentTheme === "dark" ? "light" : "dark";

      html.setAttribute("data-theme", newTheme);
      localStorage.setItem("theme", newTheme);
    });
  }

  // Color switcher
  colorButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const color = button.dataset.color;

      html.setAttribute("data-color", color);
      localStorage.setItem("color", color);

      colorButtons.forEach((btn) =>
        btn.classList.remove("active")
      );

      button.classList.add("active");
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initThemeControls();
});