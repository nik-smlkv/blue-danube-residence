// --- Валидация ---
function validateSerbianPhone(phone) {
  const regex = /^\+?\d+$/;
  if (!phone.trim()) return "Broj telefona je obavezan";
  if (!regex.test(phone)) return "Neispravan format broja iz Srbije";
  return "";
}

function validateName(name) {
  const regex = /^[A-Za-zА-Яа-яЁёЉЊЂЃҐЌЏŠŽČĆĐšžčćđјљњћўїєіё\s\-]+$/u;
  if (!name.trim()) return "Ime je obavezno";
  if (!regex.test(name))
    return "Dozvoljena su samo slova (latinična ili ćirilična)";
  return "";
}

function validateEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  if (!email.trim()) return "Email je obavezan";
  if (!regex.test(email)) return "Neispravan format email adrese";
  return "";
}

// --- Фильтрация ---
function filterPhoneInput(value) {
  let filtered = value.replace(/[^\d+]/g, "");
  if (filtered.includes("+")) {
    filtered = "+" + filtered.replace(/\+/g, "");
  }
  return filtered;
}

// --- Инициализация формы ---
function initForm(formId) {
  const form = document.getElementById(formId);
  const usernameInput = form.querySelector("input[name='username']");
  const phoneInput = form.querySelector("input[name='phone']");
  const emailInput = form.querySelector("input[name='email']");
  const submitBtn = document.getElementById("submitBtn");
  const errorBlock = document.getElementById("formError");

  // обработка ввода
  usernameInput.addEventListener("input", () => {
    const msg = validateName(usernameInput.value);
    usernameInput.nextElementSibling.nextElementSibling.textContent = msg;
    usernameInput.dataset.error = !!msg;
    toggleSubmit();
  });

  phoneInput.addEventListener("input", () => {
    phoneInput.value = filterPhoneInput(phoneInput.value);
    const msg = validateSerbianPhone(phoneInput.value);
    phoneInput.nextElementSibling.nextElementSibling.textContent = msg;
    phoneInput.dataset.error = !!msg;
    toggleSubmit();
  });

  emailInput.addEventListener("input", () => {
    const msg = validateEmail(emailInput.value);
    emailInput.nextElementSibling.nextElementSibling.textContent = msg;
    emailInput.dataset.error = !!msg;
    toggleSubmit();
  });

  function toggleSubmit() {
    const valid =
      !validateName(usernameInput.value) &&
      !validateSerbianPhone(phoneInput.value) &&
      !validateEmail(emailInput.value);
    submitBtn.disabled = !valid;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    submitBtn.disabled = true;
    errorBlock.textContent = "";

    const formData = {
      fields: {
        TITLE:
          "Complete CRM form 'Prijava za konsultacije sa sajta (sopenpark.rs)'",
        NAME: usernameInput.value.trim(),
        PHONE: [{ VALUE: phoneInput.value.trim(), VALUE_TYPE: "WORK" }],
        EMAIL: [{ VALUE: emailInput.value.trim(), VALUE_TYPE: "WORK" }],
      },
      params: { REGISTER_SONET_EVENT: "Y" },
    };

    try {
      const response = await fetch(
        "https://crm.bktesla.rs/rest/1/gt107jhf1wp8901m/crm.lead.add.json",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) throw new Error(`Ошибка HTTP: ${response.status}`);

      const result = await response.json();
      console.log("Успешно отправлено:", result);

      form.reset();
      toggleSubmit();
      alert("Форма успешно отправлена!");
    } catch (error) {
      console.error("Ошибка при отправке:", error);
      alert("Ошибка при отправке формы.");
    } finally {
      submitBtn.disabled = false;
    }
  });
}

initForm("crmForm");
