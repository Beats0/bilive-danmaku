import fs from "fs";
import { ipcRenderer } from 'electron'
import config from '../config';

const $audio = document.createElement('audio');
const $source = document.createElement('source');
$audio.volume = config.voiceVolume;
$audio.playbackRate = config.voiceSpeed;
$source.setAttribute('type', 'audio/mp3');
$source.setAttribute('src', '');
$audio.appendChild($source);
// 防止electron主进程还拿不到body导致渲染白版
document?.body.appendChild($audio);

async function edgeTTS(text: string, voice: string): Promise<Blob | null> {
  return new Promise<Blob>(async (resolve, reject) => {
    try {
      const audioPath = await ipcRenderer.invoke("tts", text, voice);
      if (audioPath) {
        const buffer = fs.readFileSync(audioPath);
        const blob = new Blob([buffer], {
          type: "audio/webm",
          endings: "transparent"
        });
        resolve(blob);
      }
    } catch (err) {
      console.log("合成失败: " + err);
      resolve(null);
    }
  });
}

async function speechTTS(text: string): Promise<Blob> {
  // 创建语音合成对象
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'zh-CN';
  utterance.rate = 1.0;
  utterance.pitch = 1.0;

  return new Promise<Blob>((resolve, reject) => {
    // 默认MIME类型
    const mimeType: string = 'audio/webm';
    // 创建音频上下文
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const source = audioContext.createMediaStreamDestination();
    // 创建MediaRecorder来录制音频
    let recorder: MediaRecorder;
    try {
      recorder = new MediaRecorder(source.stream, { mimeType });
    } catch (e) {
      console.error('不支持指定的MIME类型:', mimeType);
      reject(new Error(`不支持的MIME类型: ${mimeType}`));
      return;
    }
    // 存储音频数据的数组
    const audioChunks: Blob[] = [];
    // 当有可用数据时添加到数组
    recorder.ondataavailable = (event: BlobEvent) => {
      if (event.data.size > 0) {
        audioChunks.push(event.data);
      }
    };
    // 录制完成时创建Blob
    recorder.onstop = () => {
      const audioBlob = new Blob(audioChunks, { type: mimeType });
      resolve(audioBlob);
      // 清理资源
      audioContext.close();
    };
    // 开始录制
    recorder.start();

    // 设置语音合成事件
    const synth = window.speechSynthesis;
    utterance.onend = () => {
      // 语音合成结束后停止录制
      if (recorder.state !== 'inactive') {
        recorder.stop();
      }
    };

    utterance.onerror = (event: SpeechSynthesisErrorEvent) => {
      reject(new Error(`语音合成错误: ${event.error}`));
      if (recorder.state !== 'inactive') {
        recorder.stop();
      }
      audioContext.close();
    };
    // 开始语音合成
    synth.speak(utterance);
  });
}

export async function read(uname: string, text: string) {
  const fullText = `${uname} 说 ${text}`;
  try {
    let blob: Blob | null;
    if (config.ttsEngine === "edgeTTS") {
      blob = await edgeTTS(fullText, config.edgeTTSVoice);
    } else if (config.ttsEngine === "speechTTS") {
      blob = await speechTTS(fullText);
    }
    if (!blob || blob.size === 0) return;

    $source.setAttribute("src", URL.createObjectURL(blob));
    $audio.load();

    try {
      const playEndPromise = new Promise(resolve => {
        $audio.onended = resolve;
      });
      await $audio.play();
      return playEndPromise;
    } catch (err) {
      console.warn('语言朗读消息失败', err.message);
    }
  } catch (err) {
    console.warn('语言朗读消息失败', err.message);
  }
}

type Task = {
  uname: string;
  text: string;
};

export type TaskConfig = {
  taskLength: number;
  taskMaxLength: number;
};

let taskQueue: Task[] = [];
let isWorking = false;

export function queryTask(): TaskConfig {
  const taskConfig: TaskConfig = {
    taskLength: taskQueue.length,
    taskMaxLength: config.taskMaxLength
  };
  return taskConfig;
}

async function handleTaskQueue() {
  isWorking = true;
  const task = taskQueue.shift();
  if (task) {
    await read(task.uname, task.text);
    await handleTaskQueue();
  } else {
    isWorking = false;
  }
}

const voice = {
  push(uname: string, text: string) {
    if (taskQueue.length >= config.taskMaxLength) return;
    if (taskQueue.some(t => t.text === text)) return;
    taskQueue.push({ uname, text });
    if (!isWorking) {
      handleTaskQueue();
    }
  },
  resetPush(uname: string, text: string) {
    this.reset();
    this.push(uname, text);
  },
  reset() {
    taskQueue = [];
    isWorking = false;
  },
  updateVolume(volume: number) {
    $audio.volume = volume;
  },
  updatePlaybackRate(rate: number) {
    $audio.playbackRate = rate;
  }
};

export default voice;
