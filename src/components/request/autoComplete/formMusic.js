import AutoComplete from '@tarekraafat/autocomplete.js';
import './autoComplete.css'

const removeChildAll = (e) => {
  while (e.firstChild) {
    e.removeChild(e.firstChild);
  }
};

const createAutoComplete = (requestVideo, remoteAllMusic, updateRequestVideo, steps, setStep, syncMusic, upsertRequestVideo) => {
  // eslint-disable-next-line no-unused-vars
  const autoCompletejs = new AutoComplete({
      // データ
    data: {
      src: remoteAllMusic
      .concat(requestVideo.music)
      .reduce((acc, cur) => {
        if (acc.find(i=>i.title === cur.title && i.composers[0]?.name === cur.composers[0]?.name && i.lyricists[0]?.name === cur.lyricists[0]?.name)) {
          return acc
        }
        // if (acc.map(i=>i.composers[0]?.name).includes(cur.composers[0]?.name)) return acc
        // if (acc.map(i=>i.lyricists[0]?.name).includes(cur.lyricists[0]?.name)) return acc
        return acc.concat(cur)
      },[]),
      cache: true,
      key: ['title']
    },
      // 結果のソート
    sort: (a, b) => {
      if (a.match < b.match) return -1;
      if (a.match > b.match) return 1;
      return 0;
    },
      // inputの初期値
    // placeHolder: 'Food & Drinks',
      // inputのセレクタ
    selector: `#autoComplete-music-title`,
      // 実行される最低文字数
    threshold: 0,
      // 遅延
    debounce: 0,
      // 検索モード
    searchEngine: 'loose',
      // ハイライト
    highlight: true,
      // 最大表示数
    maxResults: 5,
      // 結果表示の詳細
    resultsList: {
      render: true,
      container: (source) => {
        source.setAttribute('id', `#autoComplete-list-music-title`);
        source.classList.add('relative')
      },
      destination: document.querySelector(`#autoComplete-music-title`),
      position: 'afterend',
      element: 'ul'
    },
      // 結果表示の加工
    resultItem: {
      content: (data, source) => {
        source.innerHTML = `<span class='pre-text'>もしかして：</span>${data.match}<span class='music-artists'>(作曲: ${data.value.composers.map(i=>i.name).join('&')} / 作詞: ${data.value.lyricists.map(i=>i.name).join('&')})</span>`;
      },
      element: 'li'
    },
    onSelection: (feedback) => {
      // 飛ばしてstage4まで

      const selection = feedback.selection.value;
      document.querySelector(`#autoComplete-music-title`).value = selection.title;
      removeChildAll(document.querySelector(`#autoComplete-music-title`));

      updateRequestVideo(v => {
        if (v.stage < 4) v.stage = 4
        v.music = selection
        syncMusic(v)
        upsertRequestVideo(v)
        return v
      })
      setStep(steps.VIDEO_ARTIST_ASK)
    }
  });
}
;

export default createAutoComplete
;
