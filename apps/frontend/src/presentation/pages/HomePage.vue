<script setup lang="ts">
import HomeTemplate from "../components/templates/HomeTemplate.vue";
import { useExpressionStore } from "../stores/expressionStore";

const store = useExpressionStore();

const handleSubmit = async (lyric: string, bpm: number) => {
  await store.analyze(lyric, bpm);
};
</script>

<template>
  <HomeTemplate :expression="store.current" :pending="store.pending" @submit="handleSubmit" />
</template>