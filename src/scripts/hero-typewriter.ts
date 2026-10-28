import gsap from 'gsap';

const wordElement = document.querySelector<HTMLElement>('[data-hero-word]');

if (wordElement) {
  const words = ['ordenan', 'simplifican', 'conectan', 'escalan'];
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let timeline: gsap.core.Timeline | null = null;
  let isSetup = false;

  const setWord = (word: string, isTyping: boolean) => {
    wordElement.textContent = word;
    wordElement.dataset.typing = String(isTyping);
  };

  const startAnimation = () => {
    timeline?.kill();
    setWord(words[0], false);

    const nextStartTimes: number[] = [];
    const activeTimeline = gsap.timeline({ paused: true, repeat: -1 });
    timeline = activeTimeline;

    words.forEach((word, wordIndex) => {
      const startTime = wordIndex === 0 ? 0 : nextStartTimes[wordIndex - 1];

      for (let length = 1; length <= word.length; length += 1) {
        activeTimeline.call(
          () => {
            setWord(word.slice(0, length), length < word.length);
          },
          [],
          startTime + (length - 1) * 0.11
        );
      }

      const eraseStart = startTime + (word.length - 1) * 0.11 + 2.2;

      for (let length = word.length - 1; length >= 0; length -= 1) {
        activeTimeline.call(
          () => {
            setWord(word.slice(0, length), length > 0);
          },
          [],
          eraseStart + (word.length - 1 - length) * 0.065
        );
      }

      nextStartTimes[wordIndex] = eraseStart + (word.length - 1) * 0.065 + 0.25;
    });

    const cycleEnd = nextStartTimes[words.length - 1];
    activeTimeline.to({}, { duration: cycleEnd - activeTimeline.duration(), ease: 'none' });

    if (document.visibilityState === 'visible') {
      activeTimeline.play(0);
    }
  };

  const stopAnimation = () => {
    timeline?.kill();
    timeline = null;
    setWord(words[0], false);
  };

  const handleMotionChange = () => {
    if (reducedMotion.matches) {
      stopAnimation();
    } else {
      startAnimation();
    }
  };

  const handleVisibilityChange = () => {
    if (document.visibilityState === 'hidden') {
      timeline?.pause();
    } else if (!reducedMotion.matches) {
      timeline?.play();
    }
  };

  const setup = () => {
    if (isSetup) return;
    isSetup = true;
    reducedMotion.addEventListener('change', handleMotionChange);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('pagehide', cleanup);

    if (reducedMotion.matches) {
      stopAnimation();
    } else {
      startAnimation();
    }
  };

  const cleanup = () => {
    if (!isSetup) return;
    isSetup = false;
    timeline?.kill();
    timeline = null;
    reducedMotion.removeEventListener('change', handleMotionChange);
    document.removeEventListener('visibilitychange', handleVisibilityChange);
    window.removeEventListener('pagehide', cleanup);
    setWord(words[0], false);
  };

  const handlePageShow = (event: PageTransitionEvent) => {
    if (event.persisted) setup();
  };

  window.addEventListener('pageshow', handlePageShow);
  setup();
}
