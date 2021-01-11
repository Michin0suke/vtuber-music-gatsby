import AutoComplete from '@tarekraafat/autocomplete.js';
import './autoComplete.css'

const removeChildAll = (e) => {
  while (e.firstChild) {
    e.removeChild(e.firstChild);
  }
};

const createAutoComplete = (requestVideo, remoteAllArtist, roleIndex, artistIndex, artistElement, updateRequestVideo) => {
  console.log(`#autoComplete-music-artist-${roleIndex}-${artistIndex}-${artistElement.en}`)
  // eslint-disable-next-line no-unused-vars
  const autoCompletejs = new AutoComplete({
      // データ
    data: {
      src: remoteAllArtist
        .concat(requestVideo.singers)
        .concat(requestVideo.music.composers)
        .concat(requestVideo.music.lyricists)
        .concat(requestVideo.music.arrangers)
        .map(artist => {
          const artistCopy = JSON.parse(JSON.stringify(artist))
          if (!artistCopy.name) artistCopy.name = ''
          if (!artistCopy.id_twitter) artistCopy.id_twitter = ''
          return artistCopy
        }),
      cache: true,
      key: [artistElement.en]
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
    selector: `#autoComplete-music-artist-${roleIndex}-${artistIndex}-${artistElement.en}`,
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
        source.setAttribute('id', `autoComplete-list-music-artist-${roleIndex}-${artistIndex}-${artistElement.en}`);
      },
      destination: () => document.querySelector(`#autoComplete-list-container-music-artist-${roleIndex}-${artistIndex}-${artistElement.en}`),
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
      removeChildAll(document.querySelector(`#autoComplete-list-music-artist-${roleIndex}-${artistIndex}-${artistElement.en}`));
      updateRequestVideo(v => {
        v.music[roleIndex][artistIndex] = Object.assign(v.music[roleIndex][artistIndex], selection)
        return v
      })
    }
  });
}
;

export default createAutoComplete
;
