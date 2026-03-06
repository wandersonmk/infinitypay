const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

const INFINITEPAY_ENDPOINT = "https://api.infinitepay.io/invoices/public/checkout/links";

app.use(express.json());
app.use(express.static(path.join(__dirname)));

app.post("/create-checkout", async (req, res) => {
  try {
    const { name, email, phone_number } = req.body || {};

    if (!name || !email || !phone_number) {
      return res.status(400).json({
        success: false,
        message: "Campos obrigatorios: name, email e phone_number"
      });
    }

    const payload = {
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
      webhook_url: "https://webhook.agzap.com.br/webhook/infinipay",
      customer: {
        name,
        email,
        phone_number
      }
    };

    const response = await fetch(INFINITEPAY_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      return res.status(response.status).json({
        success: false,
        message: data?.message || data?.error || "Erro ao gerar checkout na InfinitePay",
        raw: data
      });
    }

    return res.json({
      success: true,
      data,
      payload
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Erro interno no servidor"
    });
  }
});

app.get("*", (_req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
