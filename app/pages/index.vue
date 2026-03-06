<script setup lang="ts">
type CheckoutResponse = {
  success?: boolean
  data?: Record<string, any>
  payload?: Record<string, any>
}

const name = ref("Wanderson")
const email = ref("teste@teste.com")
const phoneNumber = ref("+5511914600243")

const statusText = ref("Digite os dados do cliente para gerar o link de pagamento.")
const statusType = ref<"idle" | "ok" | "error">("idle")
const checkoutUrl = ref("")
const isSubmitting = ref(false)

let debounceTimer: ReturnType<typeof setTimeout> | null = null

const payloadPreview = computed(() => ({
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
    name: name.value.trim(),
    email: email.value.trim(),
    phone_number: phoneNumber.value.trim()
  }
}))

const hasValidCustomer = computed(() => {
  const validEmail = /.+@.+\..+/.test(email.value.trim())
  const normalizedPhone = phoneNumber.value.replace(/\s|-/g, "")
  const validPhone = /^\+?\d{10,15}$/.test(normalizedPhone)
  return Boolean(name.value.trim()) && validEmail && validPhone
})

const statusClass = computed(() => {
  if (statusType.value === "ok") return "text-emerald-700 bg-emerald-50 border-emerald-200"
  if (statusType.value === "error") return "text-rose-700 bg-rose-50 border-rose-200"
  return "text-slate-600 bg-slate-50 border-slate-200"
})

function extractCheckoutUrl(data: Record<string, any> = {}) {
  return (
    data?.checkout_url ||
    data?.url ||
    data?.link ||
    data?.invoice_url ||
    data?.data?.checkout_url ||
    ""
  )
}

async function generateCheckoutLink() {
  checkoutUrl.value = ""

  if (!hasValidCustomer.value) {
    statusType.value = "idle"
    statusText.value = "Preencha nome, e-mail valido e telefone com DDI para gerar o link."
    return
  }

  isSubmitting.value = true
  statusType.value = "idle"
  statusText.value = "Gerando link de pagamento..."

  try {
    const response = await $fetch<CheckoutResponse>("/api/create-checkout", {
      method: "POST",
      body: {
        name: name.value.trim(),
        email: email.value.trim(),
        phone_number: phoneNumber.value.trim()
      }
    })

    const url = extractCheckoutUrl(response?.data || response)
    if (!url) {
      throw new Error("A API respondeu sem URL de checkout.")
    }

    checkoutUrl.value = url
    statusType.value = "ok"
    statusText.value = "Link gerado com sucesso. Clique em Pagar agora para continuar."
  } catch (error: any) {
    statusType.value = "error"
    statusText.value = `Falha ao gerar link: ${error?.statusMessage || error?.message || "erro inesperado"}`
  } finally {
    isSubmitting.value = false
  }
}

watch([name, email, phoneNumber], () => {
  if (debounceTimer) clearTimeout(debounceTimer)
  debounceTimer = setTimeout(generateCheckoutLink, 450)
})

onMounted(() => {
  generateCheckoutLink()
})
</script>

<template>
  <main class="min-h-screen bg-[radial-gradient(circle_at_10%_20%,#ffffff_0,#e8f1ff_30%,#dbe7ff_60%,#d5e3ff_100%)] px-4 py-10 md:px-8">
    <div class="mx-auto grid w-full max-w-6xl gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <section class="rounded-3xl border border-indigo-100 bg-white/85 p-6 shadow-[0_30px_70px_-30px_rgba(25,56,130,0.4)] backdrop-blur-xl md:p-8">
        <p class="mb-3 inline-flex rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-indigo-700">
          Checkout InfinitePay
        </p>
        <h1 class="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">Finalize o pagamento em poucos segundos</h1>
        <p class="mt-3 max-w-xl text-sm leading-6 text-slate-600 md:text-base">
          Preencha os dados do cliente para gerar automaticamente o link de pagamento seguro da InfinitePay.
        </p>

        <div class="mt-8 grid gap-4">
          <FormInput v-model="name" name="name" label="Nome" placeholder="Ex.: Wanderson" />
          <FormInput v-model="email" name="email" type="email" label="E-mail" placeholder="Ex.: teste@teste.com" />
          <FormInput v-model="phoneNumber" name="phone_number" type="tel" label="Telefone" placeholder="Ex.: +5511914600243" />
        </div>

        <div class="mt-5 rounded-2xl border px-4 py-3 text-sm font-medium" :class="statusClass">
          {{ statusText }}
        </div>

        <div class="mt-5 flex flex-col gap-3 sm:flex-row">
          <PrimaryButton :disabled="!checkoutUrl || isSubmitting" class="sm:w-auto" @click="checkoutUrl ? navigateTo(checkoutUrl, { external: true }) : null">
            {{ isSubmitting ? "Processando..." : "Pagar agora" }}
          </PrimaryButton>

          <a
            v-if="checkoutUrl"
            :href="checkoutUrl"
            target="_blank"
            rel="noreferrer noopener"
            class="inline-flex items-center justify-center rounded-xl border border-indigo-200 px-5 py-3 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-50"
          >
            Abrir link em nova aba
          </a>
        </div>
      </section>

      <aside class="space-y-6">
        <section class="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_20px_50px_-30px_rgba(15,23,42,0.55)]">
          <h2 class="text-sm font-semibold uppercase tracking-[0.1em] text-slate-500">Resumo do pedido</h2>
          <div class="mt-4 space-y-3 text-sm">
            <div class="flex items-center justify-between text-slate-700">
              <span>Produto de Exemplo</span>
              <span class="font-semibold">R$ 1,00</span>
            </div>
            <div class="flex items-center justify-between text-slate-500">
              <span>Quantidade</span>
              <span>1</span>
            </div>
            <div class="border-t border-slate-100 pt-3">
              <div class="flex items-center justify-between text-base font-semibold text-slate-900">
                <span>Total</span>
                <span>R$ 1,00</span>
              </div>
            </div>
          </div>
        </section>

        <section class="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_20px_50px_-30px_rgba(15,23,42,0.55)]">
          <h2 class="text-sm font-semibold uppercase tracking-[0.1em] text-slate-500">Payload enviado</h2>
          <pre class="mt-3 max-h-80 overflow-auto rounded-2xl bg-slate-50 p-4 text-xs leading-5 text-slate-700">{{ JSON.stringify(payloadPreview, null, 2) }}</pre>
        </section>
      </aside>
    </div>
  </main>
</template>
