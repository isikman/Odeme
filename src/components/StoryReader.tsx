import React, { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX, Mic, MicOff, X } from 'lucide-react';
import HTMLFlipBook from 'react-pageflip';
import { Story } from '../types/story';
import { BACKGROUND_MUSIC, SOUND_EFFECTS } from '../constants/audio';

interface StoryReaderProps {
  story: Story;
  onClose: () => void;
}

interface PageProps {
  number: number;
  content?: string;
  image?: string;
  isSpread?: boolean;
  description?: string;
  side?: 'left' | 'right';
  isCover?: boolean;
}

const VolumeSlider = ({ value, onChange, className = "" }: { value: number; onChange: (value: number) => void; className?: string }) => (
  <input
    type="range"
    min="0"
    max="100"
    value={value}
    onChange={(e) => onChange(Number(e.target.value))}
    className={`w-20 h-1 bg-white/20 rounded-full appearance-none cursor-pointer ${className}`}
    style={{
      backgroundImage: `linear-gradient(to right, white ${value}%, rgba(255,255,255,0.2) ${value}%)`,
    }}
  />
);

const SpeechBubble = ({ content, position }: { content: string, position: 'left' | 'right' }) => {
  return (
    <div className={`absolute ${position === 'left' ? 'left-4 top-8' : 'right-4 bottom-8'} max-w-[200px] z-20`}>
      <div className="bg-black/20 backdrop-blur-sm text-white p-4 rounded-2xl shadow-lg border border-white/10">
        <p className="text-lg leading-relaxed">{content}</p>
        <div 
          className={`absolute w-4 h-4 bg-black/20 border border-white/10 transform rotate-45 ${
            position === 'left' ? '-left-2 top-1/2 -translate-y-1/2' : '-right-2 top-1/2 -translate-y-1/2'
          }`}
        />
      </div>
    </div>
  );
};

const Page = React.forwardRef<HTMLDivElement, PageProps>(({ number, content, image, isSpread, description, side, isCover }, ref) => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  return (
    <div 
      ref={ref} 
      className="relative w-full h-full bg-white shadow-lg overflow-hidden"
    >
      {isSpread ? (
        <>
          <div className="absolute inset-0">
            <div className="relative w-[200%] h-full" style={{
              left: side === 'left' ? '0' : '-100%'
            }}>
              {image && (
                <>
                  {!isImageLoaded && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                      <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin" />
                    </div>
                  )}
                  <img
                    src={`${image}?w=2200&h=1466&fit=crop&q=90`}
                    alt={`Pages ${number}`}
                    className={`w-full h-full object-cover transition-opacity duration-300 ${isImageLoaded ? 'opacity-100' : 'opacity-0'}`}
                    width={2200}
                    height={1466}
                    loading={number <= 2 ? "eager" : "lazy"}
                    decoding="async"
                    onLoad={() => setIsImageLoaded(true)}
                  />
                </>
              )}
            </div>
          </div>
          
          {content && (
            <SpeechBubble 
              content={content} 
              position={side === 'left' ? 'left' : 'right'} 
            />
          )}
          
          {side === 'left' ? (
            <>
              <div className="absolute top-0 left-0 w-24 h-24 cursor-pointer z-10">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
                <div className="absolute top-2 left-2 w-12 h-12 border-t-2 border-l-2 border-white/20" />
              </div>
              <div className="absolute bottom-0 left-0 w-24 h-24 cursor-pointer z-10">
                <div className="absolute bottom-0 left-0 w-full h-full bg-gradient-to-tr from-white/10 to-transparent pointer-events-none" />
                <div className="absolute bottom-2 left-2 w-12 h-12 border-b-2 border-l-2 border-white/20" />
              </div>
            </>
          ) : (
            <>
              <div className="absolute top-0 right-0 w-24 h-24 cursor-pointer z-10">
                <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-white/10 to-transparent pointer-events-none" />
                <div className="absolute top-2 right-2 w-12 h-12 border-t-2 border-r-2 border-white/20" />
              </div>
              <div className="absolute bottom-0 right-0 w-24 h-24 cursor-pointer z-10">
                <div className="absolute bottom-0 right-0 w-full h-full bg-gradient-to-tl from-white/10 to-transparent pointer-events-none" />
                <div className="absolute bottom-2 right-2 w-12 h-12 border-b-2 border-r-2 border-white/20" />
              </div>
            </>
          )}
        </>
      ) : (
        <div className="absolute inset-0">
          {image && (
            <>
              {!isImageLoaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                  <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin" />
                </div>
              )}
              <img
                src={`${image}?w=1100&h=1466&fit=crop&q=90`}
                alt={content || `Page ${number}`}
                className={`w-full h-full object-cover transition-opacity duration-300 ${isImageLoaded ? 'opacity-100' : 'opacity-0'}`}
                width={1100}
                height={1466}
                loading={number === 0 ? "eager" : "lazy"}
                decoding="async"
                onLoad={() => setIsImageLoaded(true)}
              />
              <div className={`absolute inset-0 ${isCover ? 'bg-gradient-to-br from-blue-600/90 to-blue-700/90' : 'bg-gradient-to-br from-blue-500/80 to-blue-600/80'} flex flex-col items-center justify-center p-8`}>
                {content && (
                  <>
                    <h1 className={`${isCover ? 'text-5xl' : 'text-4xl'} font-bold mb-4 text-white text-center`}>{content}</h1>
                    {description && <p className="text-xl text-white/90 text-center">{description}</p>}
                  </>
                )}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
});

Page.displayName = 'Page';

export default function StoryReader({ story, onClose }: StoryReaderProps) {
  const [isMusicMuted, setIsMusicMuted] = useState(false);
  const [isNarrationMuted, setIsNarrationMuted] = useState(true);
  const [isNarrationPlaying, setIsNarrationPlaying] = useState(false);
  const [musicVolume, setMusicVolume] = useState(30);
  const [narrationVolume, setNarrationVolume] = useState(70);
  const [showControls, setShowControls] = useState(true);
  const [currentNarrationIndex, setCurrentNarrationIndex] = useState(0);
  const [isMusicReady, setIsMusicReady] = useState(false);
  
  const backgroundMusicRef = useRef<HTMLAudioElement>(null);
  const narrationRef = useRef<HTMLAudioElement>(null);
  const pageFlipRef = useRef<HTMLAudioElement | null>(null);
  const bookRef = useRef<any>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout>();

  // Sayfa yapısını oluştur
  const pages = React.useMemo(() => {
    const result = [];
    
    // Kapak sayfası
    result.push({
      content: story.title,
      image: story.thumbnailURL,
      isSpread: false,
      description: story.description,
      isCover: true,
      narrationIndex: 0 // Kapak için ilk narration
    });

    // İç sayfalar
    for (let i = 0; i < story.imageURLs.length; i++) {
      // Sol sayfa
      result.push({
        content: story.storyTexts[i * 2], // İlk metin
        image: story.imageURLs[i],
        isSpread: true,
        side: 'left',
        narrationIndex: i + 1 // Kapaktan sonraki narration'lar
      });

      // Sağ sayfa
      result.push({
        content: story.storyTexts[(i * 2) + 1], // Sonraki metin
        image: story.imageURLs[i],
        isSpread: true,
        side: 'right',
        narrationIndex: i + 1 // Sol sayfa ile aynı narration
      });
    }

    // Arka kapak
    result.push({
      content: "Son",
      image: story.thumbnailURL,
      isSpread: false,
      description: "Yeni maceralarda görüşmek üzere!",
      narrationIndex: story.numberOfPages === 12 ? 7 : 13 // 12 sayfalık kitapta 8., 24 sayfalık kitapta 14. narration
    });

    return result;
  }, [story]);

  useEffect(() => {
    if (backgroundMusicRef.current) {
      backgroundMusicRef.current.src = BACKGROUND_MUSIC.magical;
      backgroundMusicRef.current.volume = musicVolume / 100;
      backgroundMusicRef.current.loop = true;
      
      backgroundMusicRef.current.load();
      setIsMusicReady(true);
    }

    return () => {
      if (backgroundMusicRef.current) {
        backgroundMusicRef.current.pause();
        backgroundMusicRef.current.currentTime = 0;
      }
    };
  }, []);

  useEffect(() => {
    const pageFlipSound = new Audio(SOUND_EFFECTS.pageFlip);
    pageFlipSound.volume = 0.5;
    pageFlipRef.current = pageFlipSound;

    return () => {
      if (pageFlipRef.current) {
        pageFlipRef.current.pause();
        pageFlipRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (isMusicReady && backgroundMusicRef.current) {
      const playTimer = setTimeout(() => {
        const playPromise = backgroundMusicRef.current?.play();
        if (playPromise) {
          playPromise.catch(error => {
            console.log('Müzik daha sonra başlatılacak:', error);
          });
        }
      }, 500);

      return () => clearTimeout(playTimer);
    }
  }, [isMusicReady]);

  useEffect(() => {
    if (backgroundMusicRef.current) {
      backgroundMusicRef.current.volume = musicVolume / 100;
      backgroundMusicRef.current.muted = isMusicMuted;
    }
  }, [musicVolume, isMusicMuted]);

  useEffect(() => {
    if (narrationRef.current) {
      narrationRef.current.volume = narrationVolume / 100;
      narrationRef.current.muted = isNarrationMuted;
    }
  }, [narrationVolume, isNarrationMuted]);

  useEffect(() => {
    const hideControls = () => setShowControls(false);
    const timer = setTimeout(hideControls, 3000);
    return () => clearTimeout(timer);
  }, [showControls]);

  // Narration yönetimi
  useEffect(() => {
    if (!isNarrationMuted && story.narrationURLs[currentNarrationIndex]) {
      const playNarration = async () => {
        try {
          if (narrationRef.current) {
            narrationRef.current.src = story.narrationURLs[currentNarrationIndex];
            await narrationRef.current.load();
            await narrationRef.current.play();
            setIsNarrationPlaying(true);

            narrationRef.current.onended = () => {
              setIsNarrationPlaying(false);
              // Sonraki narration'a geç
              if (currentNarrationIndex < (story.numberOfPages === 12 ? 7 : 13)) {
                setCurrentNarrationIndex(prev => prev + 1);
                if (pageFlipRef.current && bookRef.current) {
                  pageFlipRef.current.currentTime = 0;
                  pageFlipRef.current.play().then(() => {
                    setTimeout(() => {
                      bookRef.current.pageFlip().flipNext();
                    }, 100);
                  });
                }
              }
            };
          }
        } catch (error) {
          console.error('Narration playback error:', error);
          setIsNarrationPlaying(false);
          setIsNarrationMuted(true);
        }
      };

      playNarration();
    }

    return () => {
      if (narrationRef.current) {
        narrationRef.current.onended = null;
      }
    };
  }, [isNarrationMuted, currentNarrationIndex, story.narrationURLs, story.numberOfPages]);
// Buraya eklenecek yeni useEffect
useEffect(() => {
  if (isNarrationMuted && narrationRef.current) {
    narrationRef.current.pause();
    narrationRef.current.currentTime = 0;
    setIsNarrationPlaying(false);
  }
}, [isNarrationMuted]);
  const handleMusicVolumeChange = (value: number) => {
    setMusicVolume(value);
  };

  const handleNarrationVolumeChange = (value: number) => {
    setNarrationVolume(value);
  };

  const toggleMusicMute = () => {
    setIsMusicMuted(!isMusicMuted);
  };

  const toggleNarrationMute = () => {
    setIsNarrationMuted(!isNarrationMuted);
  };

  const handleMouseMove = () => {
    setShowControls(true);
  };

  const handlePageFlip = () => {
    if (!isNarrationPlaying && pageFlipRef.current) {
      pageFlipRef.current.currentTime = 0;
      pageFlipRef.current.play().catch(error => {
        console.log('Sayfa çevirme sesi oynatılamadı:', error);
      });
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/90 z-[100] flex items-center justify-center"
      onMouseMove={handleMouseMove}
    >
      <audio ref={backgroundMusicRef} />
      <audio ref={narrationRef} />

      <div 
        className={`fixed top-6 left-1/2 -translate-x-1/2 z-[110] transition-all duration-300 ${
          showControls ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
        }`}
      >
        <div className="bg-black/40 backdrop-blur-sm rounded-full p-2 flex items-center gap-2">
          <div className="group relative px-2">
            <button
              onClick={toggleMusicMute}
              className="p-1.5 rounded-full hover:bg-white/10 transition-colors"
            >
              {isMusicMuted ? (
                <VolumeX className="w-4 h-4 text-white/70 group-hover:text-white" />
              ) : (
                <Volume2 className="w-4 h-4 text-white/70 group-hover:text-white" />
              )}
            </button>
            <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <VolumeSlider value={musicVolume} onChange={handleMusicVolumeChange} />
            </div>
          </div>

          <div className="group relative px-2">
            <button
              onClick={toggleNarrationMute}
              className={`p-1.5 rounded-full transition-colors ${
                !isNarrationMuted ? 'bg-blue-500 text-white' : 'hover:bg-white/10'
              }`}
            >
              {isNarrationMuted ? (
                <MicOff className="w-4 h-4 text-white/70 group-hover:text-white" />
              ) : (
                <Mic className="w-4 h-4 text-white group-hover:text-white" />
              )}
            </button>
            <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <VolumeSlider value={narrationVolume} onChange={handleNarrationVolumeChange} />
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4 text-white/70 hover:text-white" />
          </button>
        </div>
      </div>

      <div className="w-full max-w-5xl aspect-[16/9] p-8 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-100 to-blue-50 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.3)] border-8 border-white/20"></div>
        <HTMLFlipBook
          ref={bookRef}
          width={550}
          height={733}
          size="stretch"
          minWidth={315}
          maxWidth={1000}
          minHeight={400}
          maxHeight={1533}
          drawShadow={true}
          flippingTime={1000}
          className={`mx-auto relative z-10 ${isNarrationPlaying ? 'pointer-events-none' : ''}`}
          startPage={0}
          showCover={true}
          mobileScrollSupport={!isNarrationPlaying}
          onFlip={handlePageFlip}
          disableFlipByClick={isNarrationPlaying}
        >
          {pages.map((page, index) => (
            <Page
              key={index}
              number={index + 1}
              content={page.content}
              image={page.image}
              isSpread={page.isSpread}
              description={page.description}
              side={page.side}
              isCover={page.isCover}
            />
          ))}
        </HTMLFlipBook>
      </div>
    </div>
  );
}