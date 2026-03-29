<script setup lang="ts">
import { onMounted, ref } from "vue";
import type { ContestSong } from "../../../domain/entities/ContestSong";
import SongSelectorPanel from "../molecules/SongSelectorPanel.vue";
import TextAliveStatusPanel from "../molecules/TextAliveStatusPanel.vue";
import ExpressionVisualizer from "../organisms/ExpressionVisualizer.vue";

const props = defineProps<{
  songs: ContestSong[];
  selectedSongId: string;
  currentLyric: string;
  isPlaying: boolean;
  playheadPosition: number;
  firstCharStartTime: number;
  volume: number;
  isMuted: boolean;
  textAliveLoading: boolean;
  textAliveReady: boolean;
  textAliveError: string;
}>();

const emit = defineEmits<{
  selectSong: [songId: string];
  playSong: [];
  pauseSong: [];
  volumeUp: [];
  volumeDown: [];
  volumeChange: [nextVolume: number];
  toggleMute: [];
  mediaMount: [element: HTMLElement];
}>();
const mediaMountRef = ref<HTMLElement | null>(null);

onMounted(() => {
  if (mediaMountRef.value) {
    emit("mediaMount", mediaMountRef.value);
  }
});
</script>

<template>
  <main class="home-template">
    <SongSelectorPanel :songs="songs" :selected-song-id="selectedSongId" @select-song="(songId) => emit('selectSong', songId)" />
    <TextAliveStatusPanel
      :text-alive-loading="textAliveLoading"
      :text-alive-ready="textAliveReady"
      :is-playing="isPlaying"
      :text-alive-error="textAliveError"
    />
    <div ref="mediaMountRef" class="media-mount" aria-hidden="true"></div>
    <ExpressionVisualizer
      :lyric="currentLyric"
      :playing="isPlaying"
      :playhead-position="playheadPosition"
      :first-char-start-time="firstCharStartTime"
      :volume="volume"
      :is-muted="isMuted"
      :controls-enabled="textAliveReady"
      @play-song="emit('playSong')"
      @pause-song="emit('pauseSong')"
      @volume-up="emit('volumeUp')"
      @volume-down="emit('volumeDown')"
      @volume-change="(value) => emit('volumeChange', value)"
      @toggle-mute="emit('toggleMute')"
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

.media-mount {
  width: 1px;
  height: 1px;
  overflow: hidden;
  opacity: 0;
  pointer-events: none;
}
</style>