const SPLIT_COMPOUNDS = new Set([
  '我去',
  '我想',
  '我要',
  '我喜欢',
  '我吃',
  '我喝',
  '我看',
  '他去',
  '他想',
  '他要',
  '她去',
  '她想',
  '她要',
  '你去',
  '你想',
  '你要',
  '不想',
  '不要',
  '不去',
  '不吃',
  '不喝'
]);

const MERGE_PAIRS = {
  '睡+觉': '睡觉',
  '起+床': '起床',
  '回+家': '回家',
  '开+心': '开心',
  '伤+心': '伤心',
  '难+过': '难过',
  '害+怕': '害怕',
  '生+病': '生病',
  '洗+手': '洗手',
  '刷+牙': '刷牙',
  '上+厕+所': '上厕所'
};

const STOP_CHARS = new Set([
  '，',
  '。',
  '？',
  '！',
  '、',
  ' ',
  '　',
  '的',
  '了',
  '吗',
  '呢',
  '啊',
  '吧'
]);

export function segmentChineseCommunicationText(text) {
  const cleaned = (text || '').trim();

  if (!cleaned) {
    return { segments: [], engine: 'intl-segmenter' };
  }

  let raw = [];
  let engine = 'char-split';

  if (typeof Intl !== 'undefined' && Intl.Segmenter) {
    const segmenter = new Intl.Segmenter('zh-CN', { granularity: 'word' });
    raw = Array.from(segmenter.segment(cleaned))
      .filter(segment => segment.isWordLike)
      .map(segment => segment.segment);
    engine = 'intl-segmenter';
  } else {
    raw = cleaned.split('').filter(char => !STOP_CHARS.has(char));
  }

  const split = [];
  raw.forEach(word => {
    if (SPLIT_COMPOUNDS.has(word)) {
      split.push.apply(split, word.split(''));
      return;
    }
    split.push(word);
  });

  const merged = [];
  let index = 0;

  while (index < split.length) {
    if (index + 2 < split.length) {
      const triKey = [split[index], split[index + 1], split[index + 2]].join(
        '+'
      );
      if (MERGE_PAIRS[triKey]) {
        merged.push(MERGE_PAIRS[triKey]);
        index += 3;
        continue;
      }
    }

    if (index + 1 < split.length) {
      const biKey = [split[index], split[index + 1]].join('+');
      if (MERGE_PAIRS[biKey]) {
        merged.push(MERGE_PAIRS[biKey]);
        index += 2;
        continue;
      }
    }

    merged.push(split[index]);
    index += 1;
  }

  return {
    segments: merged.filter(word => word && !STOP_CHARS.has(word)),
    engine
  };
}
