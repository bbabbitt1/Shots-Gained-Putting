document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("signin-btn").addEventListener("click", async () => {
    const email = document.getElementById("signin-email").value.trim();
    const password = document.getElementById("signin-password").value;
    const errorEl = document.getElementById("signin-error");

    errorEl.textContent = "";

    if (!email || !password) {
      errorEl.textContent = "Email and password are required.";
      return;
    }

    try {
      const res = await fetch("/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (res.ok && data.success) {
        window.location.href = "/home.html";
      } else {
        errorEl.textContent = "Invalid email or password.";
      }
    } catch {
      errorEl.textContent = "Unable to sign in.";
    }
  });
});
