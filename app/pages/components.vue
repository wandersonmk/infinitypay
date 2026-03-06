<script setup lang="ts">
const demoName = ref("")
const demoEmail = ref("")
const demoPhone = ref("")
</script>

<template>
  <main class="min-h-screen bg-slate-100 px-4 py-10 md:px-8">
    <div class="mx-auto w-full max-w-4xl rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
      <h1 class="text-2xl font-bold text-slate-900 md:text-3xl">Biblioteca de Componentes</h1>
      <p class="mt-2 text-sm text-slate-600">Padrao visual para formularios de checkout.</p>

      <section class="mt-8 grid gap-4 md:grid-cols-2">
        <FormInput v-model="demoName" label="Nome" name="demo_name" placeholder="Ex.: Maria Silva" />
        <FormInput v-model="demoEmail" label="E-mail" name="demo_email" type="email" placeholder="Ex.: maria@email.com" />
      </section>

      <section class="mt-4">
        <FormInput v-model="demoPhone" label="Telefone" name="demo_phone" type="tel" placeholder="Ex.: +5511999998888" />
      </section>

      <section class="mt-8 flex flex-col gap-3 sm:flex-row">
        <PrimaryButton class="sm:w-auto">Botao Primario</PrimaryButton>
        <PrimaryButton class="sm:w-auto" :disabled="true">Botao Desabilitado</PrimaryButton>
      </section>

      <section class="mt-8 rounded-2xl bg-slate-50 p-4 text-xs text-slate-700">
        <pre>{{ JSON.stringify({ name: demoName, email: demoEmail, phone: demoPhone }, null, 2) }}</pre>
      </section>
    </div>
  </main>
</template>
