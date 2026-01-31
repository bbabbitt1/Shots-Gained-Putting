document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("create-btn");

  btn.addEventListener("click", async () => {
    const firstName = document.getElementById("reg-firstname").value.trim();
    const lastName = document.getElementById("reg-lastname").value.trim();
    const username = document.getElementById("reg-username").value.trim();
    const email = document.getElementById("reg-email").value.trim();
    const phone = document.getElementById("reg-phone").value.trim();
    const handicap = document.getElementById("reg-handicap").value.trim();
    const password = document.getElementById("reg-password").value;

    const errorEl = document.getElementById("register-error");
    if (errorEl) errorEl.textContent = "";

    if (!firstName || !lastName || !username || !email || !phone || !handicap || !password ){
      if (errorEl) errorEl.textContent = "All fields are required.";
      return;
    }


    btn.disabled = true;

    try {
      const res = await fetch("/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName,
          lastName,
          username,
          email,
          phone,
          handicap,
          password
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok && data.success) {
        alert("Account created successfully! You can now sign in.");
        window.location.href = "/index.html";
      } else {
        if (errorEl) errorEl.textContent = data.message || "Unable to register.";
      }
    } catch (err) {
      console.error(err);
      if (errorEl) errorEl.textContent = "Unable to register. Try again.";
    } finally {
      btn.disabled = false;
    }
  });
});
