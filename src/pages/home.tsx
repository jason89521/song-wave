import { useModel } from 'daxus';
import { waitingSongModel } from '../model';
import { useCallback } from 'react';

export function HomePage() {
  const waitingSongs = useModel(
    waitingSongModel,
    useCallback(state => state.data, [])
  );

  return (
    <div>
      {waitingSongs.map((song, index) => {
        const suffix = index === 0 ? ' (現在播放）' : '';
        const title = `[${song.lang}] ${song.singer} - ${song.name}${suffix}`;

        return (
          <div className="mb-4" key={index}>
            <div>
              <span>{title}</span>
              <div className="flex gap-2">
                {index > 0 && (
                  <button className="cursor-pointer rounded bg-slate-300 px-2 py-1 text-sm">
                    插播
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
