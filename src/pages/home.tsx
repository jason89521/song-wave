import { useModel } from 'daxus';
import { interludeSong, requestedSongModel } from '../model';
import { useCallback } from 'react';

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
                <button
                  className="cursor-pointer rounded bg-slate-300 px-2 py-1 text-sm"
                  onClick={() => {
                    interludeSong(index);
                  }}
                >
                  插播
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
