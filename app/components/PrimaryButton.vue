<script setup lang="ts">
defineProps<{
  disabled?: boolean
}>()
</script>

<template>
  <button class="btn" :disabled="disabled">
    <slot />
  </button>
</template>

<style scoped>
.btn {
  margin-top: 4px;
  width: 100%;
  border: 0;
  border-radius: 14px;
  padding: 14px;
  font-size: 1rem;
  font-weight: 700;
  letter-spacing: 0.02em;
  color: #fff;
  background: linear-gradient(135deg, #1f63ff, #1749bd);
  cursor: pointer;
  box-shadow: 0 14px 24px rgba(22, 74, 196, 0.28);
  transition: transform 0.18s ease, box-shadow 0.18s ease, background 0.18s ease;
}

.btn:hover:enabled {
  background: linear-gradient(135deg, #1a56dd, #123d9f);
  transform: translateY(-1px);
  box-shadow: 0 16px 26px rgba(22, 74, 196, 0.32);
}

.btn:disabled {
  opacity: 0.55;
  box-shadow: none;
  cursor: not-allowed;
}
</style>
