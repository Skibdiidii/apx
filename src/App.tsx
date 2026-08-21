import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2, VolumeX, Music, SkipForward, Play, Pause, X } from 'lucide-react';

interface Song {
  id: string;
  title: string;
  artist: string;
  src: string;
}

const playlist: Song[] = [
  {
    id: '1',
    title: 'Illusionary Daytime x 室内系 TrackMaker',
    artist: '',
    src: '/song1.mp3'
  },
  {
    id: '2',
    title: 'DEAD LOCS PT2',
    artist: 'Yus Gz',
    src: '/bg-audio.mp3'
  },
  {
    id: '3',
    title: 'Glue Song',
    artist: 'beabadoobee',
    src: '/song2.mp3'
  }
];

export default function App() {
  const [entered, setEntered] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isPlaylistOpen, setIsPlaylistOpen] = useState(false);

  const audioRef = useRef<HTMLAudioElement>(null);
  const isFirstMount = useRef(true);
  const currentSong = playlist[currentSongIndex];

  const handleEnter = () => {
    setEntered(true);
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch((e) => {
        console.warn('Audio play blocked:', e);
      });
    }
  };

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play().then(() => {
          setIsPlaying(true);
        }).catch((e) => console.warn('Play error:', e));
      }
    }
  };

  const nextSong = () => {
    setCurrentSongIndex((prev) => (prev + 1) % playlist.length);
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const handleEnded = () => {
      nextSong();
    };
    audio.addEventListener('ended', handleEnded);
    return () => {
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }
    if (entered && audioRef.current) {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch((e) => {
        console.warn('Track switch error:', e);
      });
    }
  }, [currentSongIndex]);

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-black text-white selection:bg-white/30 font-sans">
      {/* Background GIF with Ultra HD Smooth Local Asset Rendering */}
      <div 
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat will-change-transform"
        style={{ 
          backgroundImage: 'url(/bg.gif), url(https://i.pinimg.com/originals/4b/72/19/4b721935356eb63ccdc4cd5990edb211.gif)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          imageRendering: 'auto',
          filter: 'contrast(1.06) saturate(1.15) brightness(0.95)'
        }}
      />
      
      <div className="fixed inset-0 z-0 bg-black/15 pointer-events-none" />

      <audio 
        ref={audioRef} 
        preload="auto"
        src={currentSong.src} 
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />

      <AnimatePresence>
        {!entered ? (
          <motion.div
            key="enter-screen"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
            className="fixed inset-0 z-50 flex cursor-pointer items-center justify-center bg-black/80 backdrop-blur-md"
            onClick={handleEnter}
          >
            <motion.div 
              animate={{ opacity: [0.5, 1, 0.5], scale: [0.98, 1.02, 0.98] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="text-center p-6"
            >
              <p className="text-xl font-medium tracking-[0.3em] text-white/90 font-mono drop-shadow-lg">
                [ click anywhere to enter ]
              </p>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="main-content"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease: 'easeOut' }}
            className="relative z-10 flex min-h-screen items-center justify-center p-4 py-12"
          >
            {/* Top Right Controls */}
            <div className="fixed top-6 right-6 z-20 flex items-center gap-3">
              <button 
                onClick={() => setIsPlaylistOpen(true)}
                className="flex items-center gap-2 rounded-full bg-[#1db954]/25 hover:bg-[#1db954]/45 px-4 py-3 text-[#1db954] backdrop-blur-2xl border border-[#1db954]/40 transition-all shadow-xl hover:scale-105"
                title="Open Spotify Playlist"
              >
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#1db954] text-black">
                  <SpotifyIcon className="h-3 w-3 fill-current" />
                </div>
                <span className="text-xs font-bold tracking-wide font-mono hidden sm:inline">Spotify</span>
              </button>

              <button 
                onClick={togglePlay}
                className="rounded-full bg-black/25 p-3.5 text-white/90 backdrop-blur-2xl border border-white/15 transition-all hover:bg-black/50 hover:scale-105 hover:text-white shadow-xl"
                title="Toggle Audio"
              >
                {isPlaying ? <Volume2 size={20} /> : <VolumeX size={20} />}
              </button>
            </div>

            {/* 100% Pure Transparent Profile Card */}
            <div className="w-full max-w-md overflow-hidden rounded-3xl border border-white/20 bg-transparent shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]">
               {/* Pure Transparent Banner */}
               <div className="h-28 w-full bg-transparent border-b border-white/10" />
               
               <div className="relative px-6 pb-8 pt-10">
                 {/* Avatar Container with visible status badge */}
                 <div className="absolute -top-12 left-6">
                    <div className="relative inline-block">
                        <div className="relative h-20 w-20 rounded-full border-[3px] border-white/20 overflow-hidden shadow-2xl bg-black/40">
                          <img 
                            src="/avatar.jpeg" 
                            alt="Harumi" 
                            className="h-full w-full object-cover"
                            onError={(e) => {
                              e.currentTarget.src = "/274b0594-1905-4f0d-82da-07dc87d2430e.jpeg";
                            }}
                          />
                        </div>
                        {/* Discord Status Moon (Idle 🌙) Badge positioned prominently outside overflow */}
                        <div 
                          className="absolute -bottom-1 -right-1 z-20 flex h-7 w-7 items-center justify-center rounded-full border-2 border-black/80 bg-[#1e1f22] shadow-lg"
                          title="Idle 🌙"
                        >
                          <span className="text-sm select-none leading-none">🌙</span>
                        </div>
                    </div>
                 </div>

                 {/* Profile Info */}
                 <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-black tracking-tight text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">Harumi</h1>
                        <p className="text-sm font-medium text-white/80 drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">myeyesaregoingdownx</p>
                    </div>
                 </div>

                 {/* Description Box - 100% Pure Transparent */}
                 <div className="mt-4 rounded-2xl bg-transparent border border-white/15 p-3.5 text-sm text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
                   <p className="font-mono tracking-wide">fuck y'all niggas lol</p>
                 </div>

                 <div className="mt-5 h-[1px] w-full bg-white/10" />

                 {/* Stats block - 100% Pure Transparent */}
                 <div className="mt-5 grid grid-cols-2 gap-2.5">
                    <div className="rounded-2xl bg-transparent border border-white/15 p-3 shadow-sm">
                        <p className="text-[11px] font-bold text-white/70 uppercase tracking-wider font-mono drop-shadow">Created</p>
                        <p className="mt-1 text-sm font-semibold text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">Aug 11, 2026</p>
                    </div>
                    <div className="rounded-2xl bg-transparent border border-white/15 p-3 shadow-sm">
                        <p className="text-[11px] font-bold text-white/70 uppercase tracking-wider font-mono drop-shadow">Account Age</p>
                        <p className="mt-1 text-sm font-semibold text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">9d</p>
                    </div>
                    <div className="col-span-2 rounded-2xl bg-transparent border border-white/10 p-3 shadow-sm">
                        <p className="text-[11px] font-bold text-white/70 uppercase tracking-wider font-mono drop-shadow">ID</p>
                        <p className="mt-1 font-mono text-xs font-semibold text-white/95 tracking-wide drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">1536544136134402048</p>
                    </div>
                 </div>

                 {/* Discord Button */}
                 <a 
                    href="https://discord.com/users/1536544136134402048"
                    target="_blank"
                    rel="noreferrer"
                    className="mt-6 flex w-full items-center justify-center gap-2.5 rounded-2xl bg-[#5865F2]/80 py-3 font-bold text-white shadow-[0_4px_25px_rgba(88,101,242,0.5)] transition-all hover:bg-[#5865F2] hover:scale-[1.02] active:scale-[0.98] border border-white/10"
                 >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 127.14 96.36" fill="currentColor">
                        <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1,105.25,105.25,0,0,0,32.19-16.14h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.31,60,73.31,53s5-12.74,11.43-12.74S96.2,46,96.09,53,91.04,65.69,84.69,65.69Z"/>
                    </svg>
                    Add me on Discord
                 </a>
               </div>
            </div>

            {/* Spotify Playlist Modal Drawer */}
            <AnimatePresence>
              {isPlaylistOpen && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4"
                >
                  <motion.div 
                    initial={{ scale: 0.9, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.9, y: 20 }}
                    className="w-full max-w-md overflow-hidden rounded-2xl border border-white/15 bg-[#121212]/95 shadow-2xl backdrop-blur-xl text-white"
                  >
                    <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1db954] text-black">
                          <SpotifyIcon className="h-6 w-6 fill-current" />
                        </div>
                        <div>
                          <h2 className="font-bold text-lg">Spotify Playlist</h2>
                        </div>
                      </div>
                      <button 
                        onClick={() => setIsPlaylistOpen(false)}
                        className="rounded-full bg-white/10 p-2 text-white/80 hover:bg-white/20 hover:text-white transition-colors"
                      >
                        <X size={18} />
                      </button>
                    </div>

                    <div className="max-h-80 overflow-y-auto p-4 space-y-2">
                      {playlist.map((song, idx) => {
                        const isCurrent = idx === currentSongIndex;
                        return (
                          <div 
                            key={song.id}
                            onClick={() => {
                              setCurrentSongIndex(idx);
                              setIsPlaying(true);
                            }}
                            className={`flex items-center justify-between rounded-xl p-3 cursor-pointer transition-all border ${
                              isCurrent 
                                ? 'bg-[#1db954]/20 border-[#1db954]/50' 
                                : 'bg-white/5 border-transparent hover:bg-white/10'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-black/40 text-[#1db954]">
                                {isCurrent && isPlaying ? (
                                  <motion.div 
                                    animate={{ height: [10, 20, 10] }}
                                    transition={{ repeat: Infinity, duration: 0.8 }}
                                    className="w-1 bg-[#1db954] rounded-full mx-0.5"
                                  />
                                ) : (
                                  <Music size={18} />
                                )}
                              </div>
                              <div>
                                <p className={`font-semibold text-sm ${isCurrent ? 'text-[#1db954]' : 'text-white'}`}>
                                  {song.title}
                                </p>
                                <p className="text-xs text-white/50">{song.artist}</p>
                              </div>
                            </div>

                            {isCurrent && (
                              <span className="text-xs font-mono bg-[#1db954] text-black font-bold px-2.5 py-1 rounded-full">
                                Playing
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    <div className="border-t border-white/10 bg-black/40 px-6 py-4 flex items-center justify-between">
                      <div className="text-xs text-white/60 font-mono">
                        Track {currentSongIndex + 1} of {playlist.length}
                      </div>
                      <div className="flex items-center gap-3">
                        <button 
                          onClick={togglePlay}
                          className="rounded-full bg-white p-2.5 text-black hover:scale-105 transition-transform"
                        >
                          {isPlaying ? <Pause size={18} /> : <Play size={18} />}
                        </button>
                        <button 
                          onClick={nextSong}
                          className="rounded-full bg-white/10 p-2.5 text-white hover:bg-white/20 hover:scale-105 transition-transform"
                        >
                          <SkipForward size={18} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function SpotifyIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" {...props}>
      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.261.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141 4.2-1.26 9.6-0.6 13.38 1.68.42.24.6.84.36 1.14zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.3c-.6.18-1.2-.18-1.38-.78-.18-.6.18-1.2.78-1.38C8.82 5.82 16.02 6.12 20.4 8.76c.54.3.72 1 .42 1.54-.3.54-1 .72-1.56.42z"/>
    </svg>
  );
}


