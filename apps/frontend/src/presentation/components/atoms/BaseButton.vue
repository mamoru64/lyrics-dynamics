<script setup lang="ts">
defineProps<{
  disabled?: boolean;
}>();
</script>

<template>
  <button class="base-button" :disabled="disabled"><slot /></button>
</template>

<style scoped>
.base-button {
  border: none;
  border-radius: 999px;
  padding: 0.7rem 1.2rem;
  font-weight: 700;
  background: linear-gradient(120deg, #e36a2e, #f2b24a);
  color: #fff;
  cursor: pointer;
}

.base-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>