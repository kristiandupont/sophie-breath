import { getSpeech } from "./speech";

export function playAudioFromLink(url: string) {
  const audio = new Audio(url);
  audio.play();
  return new Promise<void>((resolve) => {
    audio.onended = () => {
      resolve();
    };
  });
}
let ttsState = {
  queue: [] as string[],
  isProcessing: false,
};

let audioPlayerState = {
  isPlaying: false,
};

// TTS Functions
export function addToTTSQueue(paragraph: string) {
  ttsState.queue.push(paragraph);
  if (!ttsState.isProcessing) {
    processTTSQueue();
  }
}

async function processTTSQueue() {
  ttsState.isProcessing = true;
  while (ttsState.queue.length > 0) {
    const paragraph = ttsState.queue.shift() as string;
    const audioLink = await getSpeech(paragraph);
    playAudio(audioLink);
  }
  ttsState.isProcessing = false;
}

// Audio Player Functions
function playAudio(audioLink: string) {
  if (!audioPlayerState.isPlaying) {
    audioPlayerState.isPlaying = true;
    playAudioFromLink(audioLink) // Function to play audio
      .then(() => {
        audioPlayerState.isPlaying = false;
        if (ttsState.queue.length > 0) {
          processTTSQueue(); // Start next audio if queue is not empty
        }
      });
  }
}
