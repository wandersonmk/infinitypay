type CheckoutBody = {
  name?: string
  email?: string
  phone_number?: string
}

const INFINITEPAY_ENDPOINT = "https://api.infinitepay.io/invoices/public/checkout/links"

export default defineEventHandler(async (event) => {
  const body = await readBody<CheckoutBody>(event)

  if (!body?.name || !body?.email || !body?.phone_number) {
    throw createError({
      statusCode: 400,
      statusMessage: "Campos obrigatorios: name, email e phone_number"
    })
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
    redirect_url: "https://app.agzap.com.br/",
    webhook_url: "https://webhook.agzap.com.br/webhook/infinipay",
    customer: {
      name: body.name,
      email: body.email,
      phone_number: body.phone_number
    }
  }

  try {
    const data = await $fetch(INFINITEPAY_ENDPOINT, {
      method: "POST",
      body: payload
    })

    return {
      success: true,
      data,
      payload
    }
  } catch (error: any) {
    const statusCode = error?.statusCode || error?.response?.status || 500
    const statusMessage =
      error?.data?.message ||
      error?.data?.error ||
      error?.message ||
      "Erro ao gerar checkout na InfinitePay"

    throw createError({
      statusCode,
      statusMessage
    })
  }
})
