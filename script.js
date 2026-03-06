const ENDPOINT = "/create-checkout";

const BASE_PAYLOAD = {
  handle: "agzap",
  items: [
    {
      quantity: 1,
      price: 100,
      description: "Produto de Exemplo"
    }
  ],
  order_nsu: "99697f55-b291-4b0d-80bc-b4f07367164d",
  redirect_url: "https://webhook.agzap.com.br/webhook/687f3ed1-e082-4125-a566-95e9fb1f94fc",
  webhook_url: "https://webhook.agzap.com.br/webhook/infinipay"
};

const inputName = document.getElementById("name");
const inputEmail = document.getElementById("email");
const inputPhone = document.getElementById("phone");
const statusEl = document.getElementById("status");
const payloadPreview = document.getElementById("payload-preview");
const payBtn = document.getElementById("pay-btn");
const checkoutLinkEl = document.getElementById("checkout-link");

let currentCheckoutUrl = "";
let debounceTimer;

function buildPayload() {
  return {
    ...BASE_PAYLOAD,
    customer: {
      name: inputName.value.trim(),
      email: inputEmail.value.trim(),
      phone_number: inputPhone.value.trim()
    }
  };
}

function buildCustomer() {
  return {
    name: inputName.value.trim(),
    email: inputEmail.value.trim(),
    phone_number: inputPhone.value.trim()
  };
}

function isValidCustomer(customer) {
  const validEmail = /.+@.+\..+/.test(customer.email);
  const validPhone = /^\+?\d{10,15}$/.test(customer.phone_number.replace(/\s|-/g, ""));
  return Boolean(customer.name) && validEmail && validPhone;
}

function setStatus(message, type) {
  statusEl.textContent = message;
  statusEl.classList.remove("ok", "error");
  if (type) {
    statusEl.classList.add(type);
  }
}

function renderPayload(payload) {
  payloadPreview.textContent = JSON.stringify(payload, null, 2);
}

function extractCheckoutUrl(data) {
  return (
    data?.checkout_url ||
    data?.url ||
    data?.link ||
    data?.invoice_url ||
    data?.data?.checkout_url ||
    ""
  );
}

async function generateCheckoutLink() {
  const payload = buildPayload();
  const customer = buildCustomer();
  renderPayload(payload);

  if (!isValidCustomer(customer)) {
    currentCheckoutUrl = "";
    payBtn.disabled = true;
    checkoutLinkEl.hidden = true;
    setStatus("Preencha nome, e-mail valido e telefone com DDI para gerar o link.");
    return;
  }

  setStatus("Gerando link de pagamento...");

  try {
    const response = await fetch(ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(customer)
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const message = data?.message || data?.error || `Erro HTTP ${response.status}`;
      throw new Error(message);
    }

    const checkoutUrl = extractCheckoutUrl(data?.data || data);

    if (!checkoutUrl) {
      throw new Error("A API respondeu sem URL de checkout.");
    }

    currentCheckoutUrl = checkoutUrl;
    payBtn.disabled = false;
    checkoutLinkEl.hidden = false;
    checkoutLinkEl.href = checkoutUrl;

    setStatus("Link gerado com sucesso. Clique em 'Pagar agora'.", "ok");
  } catch (error) {
    currentCheckoutUrl = "";
    payBtn.disabled = true;
    checkoutLinkEl.hidden = true;

    setStatus(`Falha ao gerar link: ${error.message}`, "error");
  }
}

function scheduleAutoGenerate() {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(generateCheckoutLink, 500);
}

[inputName, inputEmail, inputPhone].forEach((input) => {
  input.addEventListener("input", scheduleAutoGenerate);
});

payBtn.addEventListener("click", () => {
  if (!currentCheckoutUrl) {
    setStatus("Ainda nao existe link valido para pagamento.", "error");
    return;
  }

  window.location.href = currentCheckoutUrl;
});

renderPayload(buildPayload());
