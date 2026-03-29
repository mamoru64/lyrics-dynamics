<script setup lang="ts">
const model = defineModel<string>({ required: true });

defineProps<{
  placeholder?: string;
}>();
</script>

<template>
  <input v-model="model" class="base-input" :placeholder="placeholder" />
</template>

<style scoped>
.base-input {
  width: 100%;
  border: 1px solid var(--line);
  border-radius: 12px;
  padding: 0.75rem 0.9rem;
  font-size: 1rem;
}
</style>