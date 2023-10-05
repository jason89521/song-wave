import { createModel } from 'daxus';
import { SongWithAudioURL } from './type';

export const waitingSongModel = createModel({ initialState: { data: [] as SongWithAudioURL[] } });
console.log(waitingSongModel.getState());
