import { useModel } from 'daxus';
import { waitingSongModel } from '../model';
import { useCallback, useEffect, useState } from 'react';
import { SongWithAudioURL } from '../type';

export function PlayingSong() {
  const waitingSongs = useModel(
    waitingSongModel,
    useCallback(state => state.data, [])
  );
  const nextSong = waitingSongs[0];
  const [currentSong, setCurrentSong] = useState<SongWithAudioURL | null>(null);

  useEffect(() => {
    if (currentSong !== null || typeof nextSong === 'undefined') {
      return;
    }

    setCurrentSong(nextSong);
  }, [currentSong, nextSong]);

  console.log(waitingSongs);

  return (
    <div className="mb-4">
      {currentSong ? (
        <div className="text-center">
          <audio
            controls
            className="block w-full"
            src={currentSong.audioURL}
            autoPlay
            onEnded={() => {
              waitingSongModel.mutate(draft => draft.data.shift());
              setCurrentSong(null);
            }}
          />
          現在播放：{currentSong.name}
        </div>
      ) : (
        '無點播歌曲'
      )}
    </div>
  );
}
