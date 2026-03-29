<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { createTextAlivePlayer } from "../../infrastructure/textalive/player";
import { fetchTextAliveToken } from "../../infrastructure/api/TextAliveApi";
import { contestSongs, defaultContestSong } from "../../shared/config/contestSongs";
import HomeTemplate from "../components/templates/HomeTemplate.vue";

const selectedSongId = ref(defaultContestSong?.id ?? "");

const songs = contestSongs;
const selectedSong = computed(() => songs.find((song) => song.id === selectedSongId.value) ?? null);
const player = ref<ReturnType<typeof createTextAlivePlayer> | null>(null);
const mediaMountElement = ref<HTMLElement | null>(null);
const textAliveLoading = ref(false);
const textAliveReady = ref(false);
const textAliveError = ref("");
const currentLyric = ref("");
const isPlaying = ref(false);
let playbackTicker: ReturnType<typeof setInterval> | null = null;
let lastCharStartTime = -1;
const playheadPosition = ref(0);
let fallbackClockPosition = 0;
let fallbackClockTimestamp = 0;
const firstCharStartTime = ref(-1);
type TimedChar = {
  text: string;
  startTime: number;
  endTime: number;
};
const timedChars = ref<TimedChar[]>([]);
let timedCharIndex = 0;

const updateLyricIfAvailable = (textAlivePlayer: ReturnType<typeof createTextAlivePlayer>, position: number): void => {
  if (!textAlivePlayer.video) return;
  playheadPosition.value = position;

  const list = timedChars.value;
  if (list.length === 0) return;

  if (timedCharIndex >= list.length) {
    timedCharIndex = list.length - 1;
  }

  while (timedCharIndex + 1 < list.length && list[timedCharIndex + 1].startTime <= position) {
    timedCharIndex += 1;
  }

  while (timedCharIndex > 0 && list[timedCharIndex].startTime > position) {
    timedCharIndex -= 1;
  }

  const item = list[timedCharIndex];
  if (!item) return;

  if (position < item.startTime || position > item.endTime) return;

  if (lastCharStartTime !== item.startTime || currentLyric.value !== item.text) {
    currentLyric.value = item.text;
    lastCharStartTime = item.startTime;
  }
};

const rebuildTimedChars = (textAlivePlayer: ReturnType<typeof createTextAlivePlayer>) => {
  const list: TimedChar[] = [];
  let charNode = textAlivePlayer.video?.firstChar ?? null;

  while (charNode) {
    list.push({
      text: charNode.text,
      startTime: charNode.startTime,
      endTime: charNode.endTime,
    });
    charNode = charNode.next;
  }

  timedChars.value = list;
  timedCharIndex = 0;
  firstCharStartTime.value = list[0]?.startTime ?? -1;
};

const getReliablePosition = (textAlivePlayer: ReturnType<typeof createTextAlivePlayer>): number => {
  const playerPosition = Math.max(textAlivePlayer.videoPosition, textAlivePlayer.mediaPosition, playheadPosition.value);
  const now = performance.now();

  // Some environments occasionally stop advancing reported positions while playing.
  // Keep a local clock to bridge those gaps.
  if (isPlaying.value && playerPosition <= fallbackClockPosition + 1) {
    const elapsed = Math.max(0, now - fallbackClockTimestamp);
    fallbackClockPosition += elapsed;
    fallbackClockTimestamp = now;
    return fallbackClockPosition;
  }

  fallbackClockPosition = playerPosition;
  fallbackClockTimestamp = now;
  return playerPosition;
};

const stopPlaybackTicker = () => {
  if (playbackTicker) {
    clearInterval(playbackTicker);
    playbackTicker = null;
  }
};

const startPlaybackTicker = (textAlivePlayer: ReturnType<typeof createTextAlivePlayer>) => {
  stopPlaybackTicker();
  fallbackClockPosition = Math.max(textAlivePlayer.videoPosition, textAlivePlayer.mediaPosition, playheadPosition.value);
  fallbackClockTimestamp = performance.now();
  playbackTicker = setInterval(() => {
    const position = getReliablePosition(textAlivePlayer);
    updateLyricIfAvailable(textAlivePlayer, position);
  }, 45);
};

const handleSelectSong = (songId: string) => {
  selectedSongId.value = songId;
};

const handleMediaMount = (element: HTMLElement) => {
  mediaMountElement.value = element;
};

const bindPlayerListeners = (textAlivePlayer: ReturnType<typeof createTextAlivePlayer>) => {
  textAlivePlayer.addListener({
    onVideoReady: () => {
      currentLyric.value = "";
      lastCharStartTime = -1;
      playheadPosition.value = 0;
      fallbackClockPosition = 0;
      fallbackClockTimestamp = performance.now();
      rebuildTimedChars(textAlivePlayer);
    },
    onTimeUpdate: (position: number) => {
      playheadPosition.value = position;
      updateLyricIfAvailable(textAlivePlayer, position);
    },
    onThrottledTimeUpdate: (position: number) => {
      playheadPosition.value = position;
      updateLyricIfAvailable(textAlivePlayer, position);
    },
    onPlay: () => {
      isPlaying.value = true;
      playheadPosition.value = Math.max(textAlivePlayer.videoPosition, textAlivePlayer.mediaPosition, playheadPosition.value);
      startPlaybackTicker(textAlivePlayer);
      updateLyricIfAvailable(textAlivePlayer, getReliablePosition(textAlivePlayer));
    },
    onPause: () => {
      isPlaying.value = false;
      stopPlaybackTicker();
    },
    onStop: () => {
      isPlaying.value = false;
      stopPlaybackTicker();
    },
  });
};

const ensurePlayer = async () => {
  if (player.value) return player.value;
  const token = await fetchTextAliveToken();
  player.value = createTextAlivePlayer(token, mediaMountElement.value ?? undefined);
  bindPlayerListeners(player.value);
  return player.value;
};

const loadSelectedSong = async () => {
  if (!selectedSong.value) return;
  stopPlaybackTicker();
  isPlaying.value = false;
  textAliveLoading.value = true;
  textAliveReady.value = false;
  textAliveError.value = "";

  try {
    const textAlivePlayer = await ensurePlayer();
    await textAlivePlayer.createFromSongUrl(selectedSong.value.textaliveSongUrl);
    currentLyric.value = "";
    lastCharStartTime = -1;
    playheadPosition.value = 0;
    fallbackClockPosition = 0;
    fallbackClockTimestamp = performance.now();
    rebuildTimedChars(textAlivePlayer);
    textAliveReady.value = true;
  } catch (error) {
    textAliveError.value = error instanceof Error ? error.message : "TextAlive Player の初期化に失敗しました";
  } finally {
    textAliveLoading.value = false;
  }
};

const handlePlaySong = () => {
  player.value?.requestPlay();
};

const handlePauseSong = () => {
  player.value?.requestPause();
};

onMounted(async () => {
  await loadSelectedSong();
});

watch(selectedSongId, async () => {
  await loadSelectedSong();
});

onBeforeUnmount(() => {
  stopPlaybackTicker();
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
    :text-alive-loading="textAliveLoading"
    :text-alive-ready="textAliveReady"
    :text-alive-error="textAliveError"
    @select-song="handleSelectSong"
    @play-song="handlePlaySong"
    @pause-song="handlePauseSong"
    @media-mount="handleMediaMount"
  />
</template>