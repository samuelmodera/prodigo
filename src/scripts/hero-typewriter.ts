import gsap from 'gsap';

const wordElement = document.querySelector<HTMLElement>('[data-hero-word]');

if (wordElement) {
  const words = ['ordenan', 'simplifican', 'conectan', 'escalan'];
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let timeline: gsap.core.Timeline | null = null;

  const startAnimation = () => {
    timeline?.kill();
    wordElement.textContent = words[0];

    const nextStartTimes: number[] = [];
    timeline = gsap.timeline({ paused: true, repeat: -1 });

    words.forEach((word, wordIndex) => {
      const startTime = wordIndex === 0 ? 0 : nextStartTimes[wordIndex - 1];

      for (let length = 1; length <= word.length; length += 1) {
        timeline?.call(
          () => {
            wordElement.textContent = word.slice(0, length);
          },
          [],
          startTime + (length - 1) * 0.11
        );
      }

      const eraseStart = startTime + (word.length - 1) * 0.11 + 2.2;

      for (let length = word.length - 1; length >= 0; length -= 1) {
        timeline?.call(
          () => {
            wordElement.textContent = word.slice(0, length);
          },
          [],
          eraseStart + (word.length - 1 - length) * 0.065
        );
      }

      nextStartTimes[wordIndex] = eraseStart + (word.length - 1) * 0.065 + 0.25;
    });

    const cycleEnd = nextStartTimes[words.length - 1];
    timeline.to({}, { duration: cycleEnd - timeline.duration(), ease: 'none' });

    if (document.visibilityState === 'visible') {
      timeline.play(0);
    }
  };

  const stopAnimation = () => {
    timeline?.kill();
    timeline = null;
    wordElement.textContent = words[0];
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
    timeline?.kill();
    timeline = null;
    reducedMotion.removeEventListener('change', handleMotionChange);
    document.removeEventListener('visibilitychange', handleVisibilityChange);
    window.removeEventListener('pagehide', cleanup);
  };

  const handlePageShow = (event: PageTransitionEvent) => {
    if (event.persisted) setup();
  };

  window.addEventListener('pageshow', handlePageShow);
  setup();
}
