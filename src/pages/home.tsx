import { useModel } from 'daxus';
import { interludeSong, requestedSongModel } from '../model';
import { useCallback } from 'react';
import { Button } from '../components';

export function HomePage() {
  const requestedSongs = useModel(
    requestedSongModel,
    useCallback(state => state.data, [])
  );

  return (
    <div>
      {requestedSongs.map((song, index) => {
        const title = `[${song.lang}] ${song.singer} - ${song.name}`;

        return (
          <div className="mb-4" key={index}>
            <div>
              <span>{title}</span>
              <div className="flex gap-2">
                <Button
                  onClick={() => {
                    interludeSong(index);
                  }}
                >
                  插播
                </Button>
                <Button
                  onClick={() => {
                    requestedSongModel.mutate(draft => {
                      draft.data.splice(index, 1);
                    });
                  }}
                >
                  刪除
                </Button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
