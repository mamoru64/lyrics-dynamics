<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { contestSongs, defaultContestSong } from "../../shared/config/contestSongs";
import { useTextAlivePlayback } from "../composables/useTextAlivePlayback";
import HomeTemplate from "../components/templates/HomeTemplate.vue";

const selectedSongId = ref(defaultContestSong?.id ?? "");
const songs = contestSongs;
const selectedSong = computed(() => songs.find((song) => song.id === selectedSongId.value) ?? null);

const {
  textAliveLoading,
  textAliveReady,
  textAliveError,
  currentLyric,
  isPlaying,
  playheadPosition,
  firstCharStartTime,
  volume,
  isMuted,
  setMediaMount,
  loadSong,
  play,
  pause,
  setVolume,
  volumeUp,
  volumeDown,
  toggleMute,
} = useTextAlivePlayback();

const handleSelectSong = (songId: string) => {
  selectedSongId.value = songId;
};

const loadSelectedSong = async () => {
  if (!selectedSong.value) return;
  await loadSong(selectedSong.value.textaliveSongUrl, {
    lyricsUrl: selectedSong.value.textaliveLyricsUrl,
    songTitle: selectedSong.value.title,
  });
};

const handlePlaySong = () => {
  play();
};

const handlePauseSong = () => {
  pause();
};

const handleVolumeUp = () => {
  volumeUp();
};

const handleVolumeDown = () => {
  volumeDown();
};

const handleToggleMute = () => {
  toggleMute();
};

const handleVolumeChange = (nextVolume: number) => {
  setVolume(nextVolume);
};

const handleMediaMount = (element: HTMLElement) => {
  setMediaMount(element);
};

onMounted(async () => {
  await loadSelectedSong();
});

watch(selectedSongId, async () => {
  await loadSelectedSong();
});
</script>

<template>
  <HomeTemplate
    :songs="songs"
    :selected-song-id="selectedSong?.id ?? ''"
    :current-lyric="currentLyric"
    :is-playing="isPlaying"
    :playhead-position="Math.floor(playheadPosition)"
    :first-char-start-time="firstCharStartTime"
    :volume="volume"
    :is-muted="isMuted"
    :text-alive-loading="textAliveLoading"
    :text-alive-ready="textAliveReady"
    :text-alive-error="textAliveError"
    @select-song="handleSelectSong"
    @play-song="handlePlaySong"
    @pause-song="handlePauseSong"
    @volume-up="handleVolumeUp"
    @volume-down="handleVolumeDown"
    @volume-change="handleVolumeChange"
    @toggle-mute="handleToggleMute"
    @media-mount="handleMediaMount"
  />
</template>
