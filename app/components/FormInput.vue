<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    modelValue: string
    label: string
    type?: string
    placeholder?: string
    name?: string
  }>(),
  {
    type: "text",
    placeholder: "",
    name: ""
  }
)

const emit = defineEmits<{
  "update:modelValue": [value: string]
}>()

const inputId = computed(() => {
  const base = props.name || props.label || "campo"
  return `field-${base.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`
})

function onInput(event: Event) {
  const target = event.target as HTMLInputElement
  emit("update:modelValue", target.value)
}
</script>

<template>
  <div class="field">
    <label :for="inputId">{{ label }}</label>
    <input
      :id="inputId"
      :name="name || inputId"
      :type="type"
      :placeholder="placeholder"
      :value="modelValue"
      @input="onInput"
    />
  </div>
</template>

<style scoped>
.field {
  display: grid;
  gap: 8px;
}

label {
  font-size: 0.82rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-weight: 700;
  color: #4a5b82;
}

input {
  width: 100%;
  border: 1px solid #c8d7f5;
  border-radius: 14px;
  padding: 13px 14px;
  font-size: 1rem;
  color: #1a2540;
  background: #fbfcff;
  transition: border-color 0.18s ease, box-shadow 0.18s ease, transform 0.18s ease;
}

input::placeholder {
  color: #8a9bbb;
}

input:focus {
  outline: 0;
  border-color: #4e7eff;
  box-shadow: 0 0 0 4px rgba(78, 126, 255, 0.15);
  transform: translateY(-1px);
}
</style>
