export interface Song {
  lang: string;
  singer: string;
  name: string;
  file: Blob;
}

export interface SongWithAudioURL extends Song {
  audioURL: string;
}
