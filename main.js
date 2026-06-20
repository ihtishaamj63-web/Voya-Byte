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
