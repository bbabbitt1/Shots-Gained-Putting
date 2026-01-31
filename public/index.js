document.addEventListener("DOMContentLoaded", () => {
  const signInBtn = document.getElementById("signin-btn");

  signInBtn.addEventListener("click", async () => {
    const email = document.getElementById("signin-email").value.trim();
    const password = document.getElementById("signin-password").value;
    const errorEl = document.getElementById("signin-error");

    if (errorEl) errorEl.textContent = "";

    if (!email || !password) {
      if (errorEl) errorEl.textContent = "Email and password are required.";
      return;
    }

    try {
      const response = await fetch("/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // ✅ SUCCESS → go to home page
        window.location.href = "/home.html";
      } else {
        if (errorEl) errorEl.textContent = "Invalid email or password.";
      }
    } catch (err) {
      console.error(err);
      if (errorEl) errorEl.textContent = "Something went wrong. Try again.";
    }
  });
});
