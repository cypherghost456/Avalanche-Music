import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Shuffle, 
  Volume2, 
  Download, 
  X, 
  ChevronDown 
} from 'lucide-react';
import { useForm, ValidationError } from '@formspree/react';
import { motion, AnimatePresence } from 'framer-motion';

// ── Main album cover (used in hero + expanded player background)
import mainCoverUrl from '@assets/3F93F097-C814-49BC-AC1B-840F80DFD51F_1785047749934.jpg';

// ── Per-track artwork (gallery screenshots mapped to each track)
import art1Url  from '@assets/Screenshot_20260725_194245_Google~2_1785047750033.jpg';
import art2Url  from '@assets/Screenshot_20260725_212149_Gallery_1785047749973.jpg';
import art3Url  from '@assets/Screenshot_20260725_212039_Gallery_1785047750026.jpg';
import art4Url  from '@assets/Screenshot_20260725_212047_Gallery_1785047750020.jpg';
import art5Url  from '@assets/Screenshot_20260725_212051_Gallery_1785047750045.jpg';
import art6Url  from '@assets/Screenshot_20260725_212101_Gallery_1785047750039.jpg';
import art7Url  from '@assets/Screenshot_20260725_212113_Gallery_1785047750013.jpg';
import art8Url  from '@assets/Screenshot_20260725_212534_Gallery_1785047749959.jpg';
import art9Url  from '@assets/Screenshot_20260725_212116_Gallery_1785047750007.jpg';
import art10Url from '@assets/Screenshot_20260725_212124_Gallery_1785047750001.jpg';
import art11Url from '@assets/Screenshot_20260725_212130_Gallery_1785047749994.jpg';
import art12Url from '@assets/Screenshot_20260725_212511_Gallery_1785047749967.jpg';
import art13Url from '@assets/Screenshot_20260725_212136_Gallery_1785047749987.jpg';
import art14Url from '@assets/Screenshot_20260725_212140_Gallery_1785047749981.jpg';

// ── Audio tracks
import track1Url  from '@assets/spotlight-death_1785047575584.mp3';
import track2Url  from '@assets/Sumair_(Cypher_Ghost)_-_Calling_The_Light_1785047575602.mp3';
import track3Url  from '@assets/Sumair_(Cypher_Ghost)_-_Gravity_Left_Behind_1785047575610.mp3';
import track4Url  from '@assets/Sumair_(Cypher_Ghost)_-_Platinum_Gloom_1785047575629.mp3';
import track5Url  from '@assets/Sumair_(Cypher_Ghost)_-_Silk-lined_Glove_1785047575639.mp3';
import track6Url  from '@assets/Sumair_(Cypher_Ghost)_-_Sugar_&_Plastic_1785047575649.mp3';
import track7Url  from '@assets/Sumair_(Cypher_Ghost)_-_Tem_Thousand_Cuts_1785047575658.mp3';
import track8Url  from '@assets/Sumair_(Cypher_Ghost)_-_The_Sky_Opens_1785047575667.mp3';
import track9Url  from '@assets/Sumair_(Cypher_Ghost)_-_Until_I_Vanish_1785047575677.mp3';
import track10Url from '@assets/Sumair_(Cypher_Ghost)_-_Violet_Pulse_1785047575685.mp3';
import track11Url from '@assets/Sumair_(Cypher_Ghost)_-_Above_Hangar_One_1785047575692.mp3';
import track12Url from '@assets/Sumair_(Cypher_Ghost)_-_Above_The_Cloudline_1785047575699.mp3';
import track13Url from '@assets/Sumair_(Cypher_Ghost)_-_Above_The_Meridian_1785047575706.mp3';
import track14Url from '@assets/Sumair_(Cypher_Ghost)_-_After_The_Last_Note_1785047575720.mp3';

interface Track {
  id: number;
  title: string;
  file: string;
  art: string;
}

const tracks: Track[] = [
  { id: 1,  title: 'Spotlight Death',      file: track1Url,  art: art1Url  },
  { id: 2,  title: 'Calling The Light',    file: track2Url,  art: art2Url  },
  { id: 3,  title: 'Gravity Left Behind',  file: track3Url,  art: art3Url  },
  { id: 4,  title: 'Platinum Gloom',       file: track4Url,  art: art4Url  },
  { id: 5,  title: 'Silk-lined Glove',     file: track5Url,  art: art5Url  },
  { id: 6,  title: 'Sugar & Plastic',      file: track6Url,  art: art6Url  },
  { id: 7,  title: 'Ten Thousand Cuts',    file: track7Url,  art: art7Url  },
  { id: 8,  title: 'The Sky Opens',        file: track8Url,  art: art8Url  },
  { id: 9,  title: 'Until I Vanish',       file: track9Url,  art: art9Url  },
  { id: 10, title: 'Violet Pulse',         file: track10Url, art: art10Url },
  { id: 11, title: 'Above Hangar One',     file: track11Url, art: art11Url },
  { id: 12, title: 'Above The Cloudline',  file: track12Url, art: art12Url },
  { id: 13, title: 'Above The Meridian',   file: track13Url, art: art13Url },
  { id: 14, title: 'After The Last Note',  file: track14Url, art: art14Url },
];

const formatTime = (s: number) => {
  if (isNaN(s)) return '0:00';
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return m + ':' + String(sec).padStart(2, '0');
};

function App() {
  const audioRef = useRef<HTMLAudioElement>(null);

  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying]         = useState(false);
  const [progress, setProgress]           = useState(0);
  const [duration, setDuration]           = useState(0);
  const [currentTime, setCurrentTime]     = useState(0);
  const [volume, setVolume]               = useState(0.8);
  const [isExpanded, setIsExpanded]       = useState(false);
  const [isShuffle, setIsShuffle]         = useState(false);
  const [isPreparingDownloads, setIsPreparingDownloads] = useState(false);

  const [formState, handleSubmit] = useForm("mjgnpadd");

  // ─── Play a track ────────────────────────────────────────────────────
  const playTrack = (track: Track) => {
    setCurrentTrack(track);
    setIsPlaying(true);
    if (audioRef.current) {
      audioRef.current.src = track.file;
      audioRef.current.volume = volume;
      audioRef.current.play().catch(e => console.error("Playback failed", e));
    }
  };

  // ─── Toggle play / pause (stop propagation when called from buttons) ─
  const togglePlay = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!audioRef.current || !currentTrack) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().catch(err => console.error("Playback failed", err));
      setIsPlaying(true);
    }
  };

  // ─── Audio event listeners ───────────────────────────────────────────
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
      setProgress(audio.duration ? (audio.currentTime / audio.duration) * 100 : 0);
    };
    const onLoadedMetadata = () => setDuration(audio.duration);
    const onEnded = () => {
      if (currentTrack) {
        const idx = tracks.findIndex(t => t.id === currentTrack.id);
        const nextIdx = isShuffle
          ? Math.floor(Math.random() * tracks.length)
          : (idx + 1) % tracks.length;
        playTrack(tracks[nextIdx]);
      }
    };

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('ended', onEnded);
    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('ended', onEnded);
    };
  }, [currentTrack, isShuffle]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  // ─── Seek ────────────────────────────────────────────────────────────
  const seek = (value: number) => {
    if (audioRef.current && duration) {
      audioRef.current.currentTime = (value / 100) * duration;
      setProgress(value);
    }
  };

  // ─── Skip next / prev ────────────────────────────────────────────────
  const skipNext = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!currentTrack) return;
    const idx = tracks.findIndex(t => t.id === currentTrack.id);
    const nextIdx = isShuffle
      ? Math.floor(Math.random() * tracks.length)
      : (idx + 1) % tracks.length;
    playTrack(tracks[nextIdx]);
  };

  const skipPrev = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!currentTrack) return;
    if (currentTime > 3) { audioRef.current!.currentTime = 0; return; }
    const idx = tracks.findIndex(t => t.id === currentTrack.id);
    playTrack(tracks[(idx - 1 + tracks.length) % tracks.length]);
  };

  // ─── Download all ────────────────────────────────────────────────────
  const handleDownloadAll = async () => {
    setIsPreparingDownloads(true);
    for (let i = 0; i < tracks.length; i++) {
      const a = document.createElement('a');
      a.href = tracks[i].file;
      a.download = tracks[i].title + '.mp3';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      await new Promise(r => setTimeout(r, 400));
    }
    setIsPreparingDownloads(false);
  };

  // ─── Track row: clicking anywhere (except download) plays the track ──
  const handleTrackRowClick = (track: Track) => {
    if (currentTrack?.id === track.id) {
      togglePlay();
    } else {
      playTrack(track);
    }
  };

  return (
    <div className="min-h-[100dvh] w-full flex flex-col bg-background text-foreground selection:bg-primary/30 pb-[120px]">
      <audio ref={audioRef} />

      {/* ── Hero Section ──────────────────────────────────────────────── */}
      <section className="relative w-full min-h-[100dvh] flex flex-col items-center justify-center px-6 text-center overflow-hidden">

        {/* Purple-tinted avalanche background — faded + blurred */}
        <div className="absolute inset-0 pointer-events-none">
          <img
            src={mainCoverUrl}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
            style={{
              filter: 'blur(32px) brightness(0.28) saturate(2.2)',
              transform: 'scale(1.12)',
            }}
          />
          {/* Purple gradient overlay */}
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(to bottom, rgba(80,0,120,0.35) 0%, rgba(40,0,80,0.18) 40%, rgba(13,13,13,0.92) 75%, #0d0d0d 100%)',
            }}
          />
        </div>

        {/* Album cover image */}
        <div className="relative z-10 mb-8 mt-16">
          <img
            src={mainCoverUrl}
            alt="Avalanche album cover"
            className="w-52 h-52 md:w-72 md:h-72 object-cover mx-auto"
            style={{
              border: '1px solid rgba(201,168,76,0.25)',
              boxShadow: '0 0 60px rgba(100,0,180,0.35), 0 0 120px rgba(100,0,180,0.15)',
            }}
          />
        </div>

        {/* Title */}
        <h1 className="relative z-10 font-serif text-6xl md:text-8xl lg:text-[9rem] tracking-tight leading-none text-foreground mb-4">
          Avalanche
        </h1>
        <p className="relative z-10 font-serif italic text-muted-foreground text-lg md:text-2xl font-light">
          An auditory experience by Sumair (Cypher Ghost).
        </p>
        <div className="relative z-10 w-24 h-px bg-border mt-8" />

        <div className="absolute bottom-12 animate-bounce opacity-40 z-10">
          <ChevronDown className="w-8 h-8" />
        </div>
      </section>

      {/* ── I. The Record ─────────────────────────────────────────────── */}
      <section className="w-full max-w-4xl mx-auto px-4 md:px-6 py-24 flex flex-col">
        <div className="flex items-center mb-12">
          <h2 className="uppercase tracking-[0.2em] text-xs font-semibold text-primary mr-6 whitespace-nowrap">
            I. The Record
          </h2>
          <div className="h-px bg-border flex-1" />
        </div>

        <div className="flex flex-col mb-12">
          {tracks.map((track, i) => {
            const isPlayingThis = currentTrack?.id === track.id;
            return (
              <div
                key={track.id}
                data-testid={`track-row-${track.id}`}
                onClick={() => handleTrackRowClick(track)}
                className={`
                  group flex items-center gap-4 py-4 px-2 border-b border-border
                  transition-colors cursor-pointer select-none
                  hover:bg-primary/5
                  ${isPlayingThis
                    ? 'border-l-4 border-l-primary !pl-1'
                    : 'border-l-4 border-l-transparent'}
                `}
              >
                {/* Album art thumbnail with play overlay */}
                <div className="w-10 h-10 relative flex-shrink-0">
                  <img
                    src={track.art}
                    alt={track.title}
                    className="w-full h-full object-cover transition-all group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    {isPlayingThis && isPlaying ? (
                      <Pause className="w-4 h-4 text-primary" />
                    ) : (
                      <Play className="w-4 h-4 text-primary" />
                    )}
                  </div>
                </div>

                {/* Track number */}
                <span className="text-xs text-muted-foreground font-mono w-6 text-right opacity-50 group-hover:opacity-100 transition-opacity flex-shrink-0">
                  {String(i + 1).padStart(2, '0')}
                </span>

                {/* Track title */}
                <span
                  className={`font-serif text-lg flex-1 truncate transition-colors ${
                    isPlayingThis ? 'text-primary' : 'text-foreground'
                  }`}
                >
                  {track.title}
                </span>

                {/* Download — stop propagation so clicking download doesn't play */}
                <a
                  href={track.file}
                  download={track.title + '.mp3'}
                  data-testid={`download-track-${track.id}`}
                  onClick={e => e.stopPropagation()}
                  className="p-2 text-muted-foreground hover:text-primary transition-colors flex-shrink-0"
                >
                  <Download className="w-4 h-4" />
                </a>
              </div>
            );
          })}
        </div>

        <div className="flex justify-center mt-6">
          <button
            onClick={handleDownloadAll}
            disabled={isPreparingDownloads}
            data-testid="button-download-all"
            className="border border-border hover:border-primary text-foreground hover:text-primary transition-colors px-8 py-3 text-sm tracking-widest uppercase flex items-center gap-3 disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            {isPreparingDownloads ? 'Preparing...' : 'Download All'}
          </button>
        </div>
      </section>

      {/* ── II. The Curator ───────────────────────────────────────────── */}
      <section className="w-full max-w-2xl mx-auto px-6 py-24 flex flex-col text-center">
        <div className="flex items-center mb-12">
          <div className="h-px bg-border flex-1" />
          <h2 className="uppercase tracking-[0.2em] text-xs font-semibold text-primary mx-6 whitespace-nowrap">
            II. The Curator
          </h2>
          <div className="h-px bg-border flex-1" />
        </div>
        <p className="font-sans text-lg md:text-xl leading-relaxed text-foreground/80 font-light">
          Sumair, known digitally as Cypher Ghost, blends the analytical precision of AI with the
          emotional depth of human curation. 'Avalanche' is a collection of 14 sonic experiments
          — navigating the storm to find the stillness within.
        </p>
      </section>

      {/* ── III. Leave a Mark ─────────────────────────────────────────── */}
      <section className="w-full max-w-xl mx-auto px-6 py-24 flex flex-col">
        <div className="flex items-center mb-12">
          <div className="h-px bg-border flex-1" />
          <h2 className="uppercase tracking-[0.2em] text-xs font-semibold text-primary mx-6 whitespace-nowrap">
            III. Leave a Mark
          </h2>
          <div className="h-px bg-border flex-1" />
        </div>

        {formState.succeeded ? (
          <div className="text-center py-12">
            <p className="font-serif text-2xl text-primary">Message received.</p>
            <p className="font-serif italic text-muted-foreground mt-2">Stay Cool ❄️</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-8">
            <div className="flex flex-col gap-2">
              <label htmlFor="name" className="text-xs uppercase tracking-widest text-muted-foreground">
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                data-testid="input-name"
                className="bg-transparent border-b border-border focus:border-primary outline-none py-2 text-foreground transition-colors font-serif text-lg"
              />
              <ValidationError prefix="Name" field="name" errors={formState.errors} className="text-destructive text-xs" />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="message" className="text-xs uppercase tracking-widest text-muted-foreground">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows={4}
                required
                data-testid="input-message"
                className="bg-transparent border-b border-border focus:border-primary outline-none py-2 text-foreground transition-colors font-serif text-lg resize-none"
              />
              <ValidationError prefix="Message" field="message" errors={formState.errors} className="text-destructive text-xs" />
            </div>

            <button
              type="submit"
              disabled={formState.submitting}
              data-testid="button-submit-contact"
              className="border border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all px-8 py-4 text-sm tracking-widest uppercase mt-4 disabled:opacity-50"
            >
              Send Message
            </button>
          </form>
        )}
      </section>

      {/* ── Footer ────────────────────────────────────────────────────── */}
      <footer className="w-full flex flex-col items-center justify-center py-12 px-6 border-t border-border mt-auto">
        <p className="font-serif text-2xl text-foreground mb-2">Stay Cool ❄️</p>
        <p className="font-serif italic text-muted-foreground text-sm mb-8">- Sumair aka Cypher Ghost</p>
        <p className="text-xs text-muted-foreground/40 font-mono tracking-wider uppercase">© 2026 avalanchemusic.com</p>
      </footer>

      {/* ── Mini Sticky Player ────────────────────────────────────────── */}
      <AnimatePresence>
        {currentTrack && !isExpanded && (
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            transition={{ type: 'spring', damping: 28, stiffness: 220 }}
            onClick={() => setIsExpanded(true)}
            data-testid="mini-player"
            className="fixed bottom-0 left-0 right-0 z-40 cursor-pointer flex items-center px-4 md:px-8 py-3"
            style={{
              backdropFilter: 'blur(24px)',
              background: 'rgba(13,13,13,0.88)',
              borderTop: '1px solid rgba(201,168,76,0.3)',
            }}
          >
            {/* Left: art + info */}
            <div className="flex items-center gap-4 flex-1 min-w-0">
              <img
                src={currentTrack.art}
                alt={currentTrack.title}
                className="w-12 h-12 object-cover flex-shrink-0"
              />
              <div className="min-w-0 flex flex-col justify-center">
                <p className="text-sm font-serif truncate text-foreground">{currentTrack.title}</p>
                <p className="text-xs truncate text-muted-foreground">Sumair (Cypher Ghost)</p>
              </div>
            </div>

            {/* Centre controls — stop propagation so they don't open expanded player */}
            <div
              className="flex items-center gap-5"
              onClick={e => e.stopPropagation()}
            >
              <button
                onClick={e => skipPrev(e)}
                data-testid="button-prev-mini"
                className="text-muted-foreground hover:text-foreground hidden sm:block p-1"
              >
                <SkipBack className="w-5 h-5" />
              </button>
              <button
                onClick={e => togglePlay(e)}
                data-testid="button-play-mini"
                className="w-10 h-10 rounded-full border border-primary text-primary flex items-center justify-center hover:bg-primary/10 transition-colors"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
              </button>
              <button
                onClick={e => skipNext(e)}
                data-testid="button-next-mini"
                className="text-muted-foreground hover:text-foreground hidden sm:block p-1"
              >
                <SkipForward className="w-5 h-5" />
              </button>
            </div>

            {/* Progress line */}
            <div
              className="absolute bottom-0 left-0 h-[2px] transition-all duration-300"
              style={{ width: `${progress}%`, background: '#c9a84c' }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Full Expanded Player ──────────────────────────────────────── */}
      <AnimatePresence>
        {isExpanded && currentTrack && (
          <motion.div
            initial={{ opacity: 0, y: '100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-50 flex flex-col"
            style={{ background: 'rgba(0,0,0,0.97)' }}
          >
            {/* Blurred background art */}
            <div
              className="absolute inset-0 opacity-40 pointer-events-none"
              style={{
                backgroundImage: `url(${currentTrack.art})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                filter: 'blur(60px) brightness(0.2)',
                transform: 'scale(1.1)',
              }}
            />

            {/* Close button */}
            <button
              onClick={() => setIsExpanded(false)}
              data-testid="button-close-expanded"
              className="absolute top-6 right-6 z-20 text-muted-foreground hover:text-foreground p-2"
            >
              <X className="w-8 h-8" />
            </button>

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center justify-center flex-1 px-6 pb-8 overflow-y-auto w-full max-w-md mx-auto pt-16">

              {/* Spinning vinyl */}
              <div className="relative mb-10 mt-4 shrink-0">
                <div
                  className="w-64 h-64 sm:w-80 sm:h-80 rounded-full overflow-hidden relative"
                  style={{
                    animation: isPlaying ? 'vinylSpin 12s linear infinite' : 'none',
                    border: '1px solid rgba(201,168,76,0.2)',
                    boxShadow: '0 0 40px rgba(0,0,0,0.8)',
                  }}
                >
                  <img src={currentTrack.art} className="w-full h-full object-cover opacity-90" alt={currentTrack.title} />
                  {/* Centre hole */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-12 h-12 rounded-full bg-[#0a0a0a] border-2 border-primary/40 shadow-inner flex items-center justify-center">
                      <div className="w-3 h-3 rounded-full bg-black" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Track info */}
              <h2 className="text-3xl font-serif mb-2 text-foreground text-center px-4 w-full truncate">
                {currentTrack.title}
              </h2>
              <p className="text-base mb-8 text-muted-foreground font-light">Sumair (Cypher Ghost)</p>

              {/* Progress bar */}
              <div className="w-full mb-8">
                <input
                  type="range" min="0" max="100" value={progress}
                  onChange={e => seek(Number(e.target.value))}
                  data-testid="progress-bar"
                  className="w-full h-[2px] cursor-pointer appearance-none bg-border rounded-full outline-none"
                  style={{
                    background: `linear-gradient(to right, #c9a84c ${progress}%, rgba(255,255,255,0.1) ${progress}%)`,
                  }}
                />
                <style>{`
                  input[type=range]::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    width: 12px; height: 12px;
                    border-radius: 50%;
                    background: #c9a84c;
                    cursor: pointer;
                  }
                  input[type=range]::-moz-range-thumb {
                    width: 12px; height: 12px;
                    border-radius: 50%;
                    background: #c9a84c;
                    cursor: pointer;
                    border: none;
                  }
                  @keyframes vinylSpin {
                    from { transform: rotate(0deg); }
                    to   { transform: rotate(360deg); }
                  }
                `}</style>
                <div className="flex justify-between text-xs mt-3 text-muted-foreground font-mono opacity-60">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-between w-full mb-10 px-4">
                <button
                  onClick={() => setIsShuffle(s => !s)}
                  data-testid="button-shuffle"
                  className={`p-2 transition-colors ${isShuffle ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
                >
                  <Shuffle className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-6">
                  <button onClick={skipPrev} data-testid="button-prev-expanded" className="text-foreground hover:text-primary transition-colors p-2">
                    <SkipBack className="w-8 h-8" />
                  </button>
                  <button
                    onClick={togglePlay}
                    data-testid="button-play-expanded"
                    className="w-16 h-16 rounded-full flex items-center justify-center border border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all"
                  >
                    {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
                  </button>
                  <button onClick={skipNext} data-testid="button-next-expanded" className="text-foreground hover:text-primary transition-colors p-2">
                    <SkipForward className="w-8 h-8" />
                  </button>
                </div>

                {/* Volume */}
                <div className="group relative flex items-center justify-center p-2 text-muted-foreground hover:text-foreground">
                  <Volume2 className="w-5 h-5" />
                  <div className="absolute bottom-full right-0 mb-2 hidden group-hover:flex bg-card border border-border p-3 rounded-lg w-32 shadow-xl">
                    <input
                      type="range" min="0" max="1" step="0.01" value={volume}
                      onChange={e => setVolume(Number(e.target.value))}
                      data-testid="volume-slider"
                      className="w-full cursor-pointer h-1 appearance-none bg-border rounded-full"
                      style={{
                        background: `linear-gradient(to right, #c9a84c ${volume * 100}%, rgba(255,255,255,0.1) ${volume * 100}%)`,
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Up Next */}
              <div className="w-full mt-auto">
                <p className="text-[10px] uppercase tracking-[0.3em] mb-4 text-muted-foreground/60 border-b border-border/40 pb-2">
                  Up Next
                </p>
                <div className="space-y-1 max-h-[160px] overflow-y-auto pr-2">
                  {tracks.map((t, i) => {
                    const isPlayingThis = currentTrack.id === t.id;
                    return (
                      <div
                        key={t.id}
                        onClick={() => playTrack(t)}
                        data-testid={`upnext-track-${t.id}`}
                        className={`flex items-center gap-4 cursor-pointer px-3 py-2 transition-colors rounded ${
                          isPlayingThis
                            ? 'bg-primary/10 border-l-2 border-primary'
                            : 'hover:bg-white/5 border-l-2 border-transparent'
                        }`}
                      >
                        <span className="text-xs font-mono w-6 text-right text-muted-foreground/50">
                          {String(i + 1).padStart(2, '0')}
                        </span>
                        <img src={t.art} alt={t.title} className="w-6 h-6 object-cover flex-shrink-0 opacity-70" />
                        <span className={`text-sm font-serif truncate ${isPlayingThis ? 'text-primary' : 'text-foreground'}`}>
                          {t.title}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
