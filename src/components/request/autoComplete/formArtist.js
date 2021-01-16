import AutoComplete from '@tarekraafat/autocomplete.js';
import './autoComplete.css'

const removeChildAll = (e) => {
  while (e.firstChild) {
    e.removeChild(e.firstChild);
  }
};

const elements = [
    'name',
    'name_ruby',
    'profile',
    // 'id_youtube',
    'id_twitter',
]

const createAutoComplete = (requestVideo, remoteAllArtist, singerIndex, singerElement, updateRequestVideo) => {
  // eslint-disable-next-line no-unused-vars
  const autoCompletejs = new AutoComplete({
      // データ
    data: {
      src: requestVideo.singers
        .concat(remoteAllArtist)
        .reduce((acc, cur) => {
          if (acc.map(i=>i.id).includes(cur.id)) return acc
          if (acc.find(i => i.name === cur.name && i.id_twitter === cur.id_twitter)) return acc
          return acc.concat(cur)
        }, [])
        .map(singer => {
          const singerCopy = JSON.parse(JSON.stringify(singer))
          if (!singerCopy.name_ruby) singerCopy.name_ruby = ''
          if (!singerCopy.id_twitter) singerCopy.id_twitter = ''
          if (!singerCopy.id_youtube) singerCopy.id_youtube = ''
          return singerCopy
        }),
      cache: true,
      key: [singerElement]
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
    selector: `#autoComplete-artist-${singerIndex}-${singerElement}`,
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
        source.setAttribute('id', `autoComplete-list-artist-${singerIndex}-${singerElement}`);
      },
      destination: document.querySelector(`#autoComplete-artist-${singerIndex}-${singerElement}`),
      position: 'afterend',
      element: 'ul'
    },
      // 結果表示の加工
    resultItem: {
      content: (data, source) => {
        source.innerHTML = `<span class='pre-text'>もしかして：</span>${data.value.name} ${data.value.id_twitter && `<span class='twitter-id'>(@${data.value.id_twitter})</span>`}`;
      },
      element: 'li'
    },
    onSelection: (feedback) => {
      const selection = feedback.selection.value;
      removeChildAll(document.querySelector(`#autoComplete-list-artist-${singerIndex}-${singerElement}`));
      updateRequestVideo(v => {
        v.singers[singerIndex] = Object.assign(v.singers[singerIndex], selection)
        if (selection.birthday) {
          const birthday = selection.birthday.split('-')
          v.singers[singerIndex].birthday_input.year = birthday[0]
          v.singers[singerIndex].birthday_input.month = birthday[1]
          v.singers[singerIndex].birthday_input.date = birthday[2]
        }
        if (selection.id_youtube) {
          v.singers[singerIndex].is_exist_remote_id_youtube = true
        }
        return v
      })
    }
  });
}
;

export default createAutoComplete
;
