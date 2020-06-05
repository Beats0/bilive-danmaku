import config from '../config';
import {
  currentTranslateToCode,
  getTranslateTTSUrl,
  translate
} from './translation';

const $audio = document.createElement('audio');
const $source = document.createElement('source');
$audio.volume = config.voiceVolume;
$audio.playbackRate = config.voiceSpeed;
$source.setAttribute('type', 'audio/mp3');
$source.setAttribute('src', '');
$audio.appendChild($source);
// 防止electron主进程还拿不到body导致渲染白版
document.body && document.body.appendChild($audio);

async function baiduTTS(fullText: string) {
  console.log('[baiduTTS translate]', fullText);
  const url = `http://tts.baidu.com/text2audio?cuid=baiduid&lan=zh&ctp=1&pdt=311&tex=${fullText}`;
  const res = await fetch(url);
  const blob = await res.blob();
  const resData = {
    res,
    blob
  };
  return resData;
}

async function googleTTS(fullText: string) {
  console.log('[googleTTS translate]', fullText);
  const url = await getTranslateTTSUrl(fullText);
  const res = await fetch(url);
  const blob = await res.blob();
  const resData = {
    res,
    blob
  };
  return resData;
}

export async function read(uname: string, text: string) {
  const fullText = `${uname} 说 ${text}`;
  let res;
  let blob;
  try {
    const googleTranslateRes = await translate(text, {
      from: 'auto',
      to: currentTranslateToCode()
    });
    console.log(googleTranslateRes.text);
    const { iso } = googleTranslateRes.from.language;
    let resData = {};
    if (config.voiceTranslateTo === 'zhCn' && iso === 'zh-CN') {
      resData = await baiduTTS(fullText);
    } else {
      resData = await googleTTS(`${googleTranslateRes.text}`);
    }
    res = resData.res;
    blob = resData.blob;

    if (res.status !== 200 || blob.type === 'application/json') {
      console.warn('合成语言失败');
      return;
    }
    $source.setAttribute('src', URL.createObjectURL(blob));
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
  reset() {
    taskQueue = [];
  },
  updateVolume(volume: number) {
    $audio.volume = volume;
  },
  updatePlaybackRate(rate: number) {
    $audio.playbackRate = rate;
  }
};

export default voice;
