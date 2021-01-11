import AutoComplete from '@tarekraafat/autocomplete.js';
import './autoComplete.css'

const removeChildAll = (e) => {
  while (e.firstChild) {
    e.removeChild(e.firstChild);
  }
};

const createAutoComplete = (requestVideo, remoteAllMusic, updateRequestVideo) => {
  // eslint-disable-next-line no-unused-vars
  const autoCompletejs = new AutoComplete({
      // データ
    data: {
      src: remoteAllMusic.concat(requestVideo.music),
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
      },
      destination: () => document.querySelector(`#autoComplete-music-title`),
      position: 'afterend',
      element: 'ul'
    },
      // 結果表示の加工
    resultItem: {
      content: (data, source) => {
        source.innerHTML = data.match;
      },
      element: 'li'
    },
    onSelection: (feedback) => {
      const selection = feedback.selection.value;
      console.log(selection)
      document.querySelector(`#autoComplete-music-title`).value = selection.title;
      removeChildAll(document.querySelector(`#autoComplete-music-title`));
      updateRequestVideo(v => {
        v.music = selection; return v
      })
    }
  });
}
;

export default createAutoComplete
;
