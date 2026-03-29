<script setup lang="ts">
import { computed } from "vue";
import { ExternalLink, FileText, Music2, Radio } from "lucide-vue-next";
import type { ContestSong } from "../../../domain/entities/ContestSong";
import BaseSelect from "../atoms/BaseSelect.vue";

const props = defineProps<{
  songs: ContestSong[];
  selectedSongId: string;
}>();

const emit = defineEmits<{
  selectSong: [songId: string];
}>();

const songOptions = computed(() => props.songs.map((song) => ({ label: `${song.title} / ${song.artistName}`, value: song.id })));
const selectedSong = computed(() => props.songs.find((song) => song.id === props.selectedSongId) ?? null);
</script>

<template>
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
        <a :href="selectedSong.musicUrl" target="_blank" rel="noreferrer" title="楽曲ページ" aria-label="楽曲ページ">
          <Music2 :size="15" />
        </a>
        <a :href="selectedSong.textaliveSongUrl" target="_blank" rel="noreferrer" title="TextAlive固定URL" aria-label="TextAlive固定URL">
          <Radio :size="15" />
        </a>
        <a :href="selectedSong.lyricsUrl" target="_blank" rel="noreferrer" title="歌詞ページ" aria-label="歌詞ページ">
          <FileText :size="15" />
        </a>
        <a :href="selectedSong.sourceUrl" target="_blank" rel="noreferrer" title="出典" aria-label="出典">
          <ExternalLink :size="15" />
        </a>
      </div>
    </div>
  </header>
</template>

<style scoped>
header {
  display: grid;
  gap: 0.9rem;
}

h1 {
  margin: 0;
  font-size: clamp(1.8rem, 3.8vw, 2.8rem);
}

p {
  margin: 0;
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
  background: rgba(247, 251, 255, 0.75);
  border: 1px solid var(--line);
  border-radius: 16px;
}

.song-title {
  font-size: 1.1rem;
  font-weight: 700;
}

.song-artist {
  color: #2c4b73;
}

.song-links {
  display: flex;
  flex-wrap: wrap;
  gap: 0.8rem;
}

.song-links a {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 999px;
  border: 1px solid var(--line);
  background: rgba(247, 251, 255, 0.92);
  color: var(--accent);
  text-decoration: none;
  transition: transform 120ms ease, background-color 120ms ease, border-color 120ms ease;
}

.song-links a:hover {
  transform: translateY(-1px);
  border-color: var(--accent);
  background: #ffffff;
}

.song-links a:active {
  transform: translateY(0);
}
</style>
