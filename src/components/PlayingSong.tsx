import { useModel } from 'daxus';
import { requestedSongModel } from '../model';
import { useCallback, useEffect, useState } from 'react';
import { SongWithAudioURL } from '../type';

export function PlayingSong() {
  const requestedSongs = useModel(
    requestedSongModel,
    useCallback(state => state.data, [])
  );
  const [currentSong, setCurrentSong] = useState<SongWithAudioURL | null>(null);

  useEffect(() => {
    // Initiate current song if it is null and there are waiting songs.
    const nextSong = requestedSongs[0];
    if (currentSong !== null || typeof nextSong === 'undefined') {
      return;
    }

    setCurrentSong(nextSong);
    requestedSongModel.mutate(draft => draft.data.shift());
  }, [currentSong, requestedSongs]);

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
              const nextSong = requestedSongs[0];
              if (nextSong) {
                setCurrentSong(nextSong);
                requestedSongModel.mutate(draft => draft.data.shift());
              } else {
                setCurrentSong(null);
              }
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
