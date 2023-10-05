import { HomePage, AddSongPage, ListPage } from './pages';

export const DB_VERSION = 1;
export const DB_NAME = 'song_wave';
export const SONG_STORE_NAME = 'songs';

export const enum SongIndex {
  lang = 'lang_index',
  singer = 'singer_index',
  name = 'name_index',
}

export const enum Page {
  home = 'home',
  addSong = 'add-song',
  list = 'list',
}

export const pageComponentRecord = {
  [Page.home]: HomePage,
  [Page.list]: ListPage,
  [Page.addSong]: AddSongPage,
};
