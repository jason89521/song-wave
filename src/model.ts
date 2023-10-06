import { createModel } from 'daxus';
import { SongWithAudioURL } from './type';

export const requestedSongModel = createModel({ initialState: { data: [] as SongWithAudioURL[] } });

export function interludeSong(songOrIndex: SongWithAudioURL | number) {
  if (typeof songOrIndex === 'object') {
    requestedSongModel.mutate(draft => draft.data.unshift(songOrIndex));

    return;
  }

  const songToInterlude = requestedSongModel.getState().data[songOrIndex];
  if (songToInterlude) {
    requestedSongModel.mutate(draft => {
      draft.data.splice(songOrIndex, 1);
      draft.data.unshift(songToInterlude);
    });
  }
}
