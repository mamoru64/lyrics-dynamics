<script setup lang="ts">
const model = defineModel<string>({ required: true });

defineProps<{
  options: Array<{
    label: string;
    value: string;
  }>;
}>();
</script>

<template>
  <select v-model="model" class="base-select">
    <option v-for="option in options" :key="option.value" :value="option.value">
      {{ option.label }}
    </option>
  </select>
</template>

<style scoped>
.base-select {
  width: 100%;
  border: 1px solid var(--line);
  border-radius: 12px;
  padding: 0.75rem 0.9rem;
  font-size: 1rem;
  color: var(--text);
  background: var(--panel);
}
</style>