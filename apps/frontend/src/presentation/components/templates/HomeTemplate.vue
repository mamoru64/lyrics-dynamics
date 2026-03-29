<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import type { ContestSong } from "../../../domain/entities/ContestSong";
import BaseButton from "../atoms/BaseButton.vue";
import BaseSelect from "../atoms/BaseSelect.vue";
import ExpressionVisualizer from "../organisms/ExpressionVisualizer.vue";

const props = defineProps<{
  songs: ContestSong[];
  selectedSongId: string;
  currentLyric: string;
  isPlaying: boolean;
  playheadPosition: number;
  firstCharStartTime: number;
  textAliveLoading: boolean;
  textAliveReady: boolean;
  textAliveError: string;
}>();

const emit = defineEmits<{
  selectSong: [songId: string];
  playSong: [];
  pauseSong: [];
  mediaMount: [element: HTMLElement];
}>();

const songOptions = computed(() => props.songs.map((song) => ({ label: `${song.title} / ${song.artistName}`, value: song.id })));
const selectedSong = computed(() => props.songs.find((song) => song.id === props.selectedSongId) ?? null);
const mediaMountRef = ref<HTMLElement | null>(null);

onMounted(() => {
  if (mediaMountRef.value) {
    emit("mediaMount", mediaMountRef.value);
  }
});
</script>

<template>
  <main class="home-template">
    <header>
      <h1>Lyrics Dynamics</h1>
      <p>TextAlive App API連携を前提に、歌詞をリアルタイムに文字と図形へ変換します。</p>
      <div class="song-picker">
        <label class="song-picker-label" for="song-select">対象楽曲</label>
        <BaseSelect
          id="song-select"
          :model-value="selectedSongId"
          :options="songOptions"
          @update:model-value="(value) => emit('selectSong', value)"
        />
      </div>
      <div v-if="selectedSong" class="song-meta">
        <p class="song-title">{{ selectedSong.title }}</p>
        <p class="song-artist">{{ selectedSong.artistName }}</p>
        <div class="song-links">
          <a :href="selectedSong.musicUrl" target="_blank" rel="noreferrer">楽曲ページ</a>
          <a :href="selectedSong.textaliveSongUrl" target="_blank" rel="noreferrer">TextAlive固定URL</a>
          <a :href="selectedSong.lyricsUrl" target="_blank" rel="noreferrer">歌詞ページ</a>
          <a :href="selectedSong.sourceUrl" target="_blank" rel="noreferrer">出典</a>
        </div>
      </div>
    </header>
    <section class="textalive-panel">
      <h2>TextAlive Player</h2>
      <p v-if="textAliveLoading">楽曲を読み込み中...</p>
      <p v-else-if="textAliveReady">読み込み完了。再生できます。</p>
      <p v-else>楽曲の読み込み待機中です。</p>
      <p v-if="textAliveError" class="textalive-error">{{ textAliveError }}</p>
      <div class="textalive-actions">
        <BaseButton :disabled="!textAliveReady" @click="emit('playSong')">再生</BaseButton>
        <BaseButton :disabled="!textAliveReady" @click="emit('pauseSong')">一時停止</BaseButton>
      </div>
    </section>
    <div ref="mediaMountRef" class="media-mount" aria-hidden="true"></div>
    <ExpressionVisualizer
      :lyric="currentLyric"
      :playing="isPlaying"
      :playhead-position="playheadPosition"
      :first-char-start-time="firstCharStartTime"
    />
  </main>
</template>

<style scoped>
.home-template {
  max-width: 820px;
  margin: 0 auto;
  padding: 2rem 1rem 3rem;
  display: grid;
  gap: 1.2rem;
}

h1 {
  margin: 0;
  font-size: clamp(1.8rem, 3.8vw, 2.8rem);
}

p {
  margin: 0;
}

header {
  display: grid;
  gap: 0.9rem;
}

.song-picker {
  display: grid;
  gap: 0.45rem;
}

.song-picker-label {
  font-size: 0.95rem;
  font-weight: 700;
}

.song-meta {
  display: grid;
  gap: 0.35rem;
  padding: 1rem;
  background: rgba(255, 250, 243, 0.75);
  border: 1px solid var(--line);
  border-radius: 16px;
}

.song-title {
  font-size: 1.1rem;
  font-weight: 700;
}

.song-artist {
  color: #6c5743;
}

.song-links {
  display: flex;
  flex-wrap: wrap;
  gap: 0.8rem;
}

.song-links a {
  color: var(--accent);
  font-weight: 700;
  text-decoration: none;
}

.song-links a:hover {
  text-decoration: underline;
}

.textalive-panel {
  display: grid;
  gap: 0.7rem;
  padding: 1rem;
  border: 1px solid var(--line);
  border-radius: 16px;
  background: var(--panel);
}

.textalive-panel h2 {
  margin: 0;
  font-size: 1.15rem;
}

.textalive-actions {
  display: flex;
  gap: 0.6rem;
}

.textalive-error {
  color: #ba2b2b;
}

.media-mount {
  width: 1px;
  height: 1px;
  overflow: hidden;
  opacity: 0;
  pointer-events: none;
}
</style>