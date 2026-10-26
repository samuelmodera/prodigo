import gsap from 'gsap';

const initServices = () => {
  const section = document.querySelector<HTMLElement>('.sv3');
  if (!section) return;

  const tabs = Array.from(section.querySelectorAll<HTMLButtonElement>('[data-service]'));
  const panels = Array.from(section.querySelectorAll<HTMLElement>('[data-service-panel]'));
  const scenes = Array.from(section.querySelectorAll<HTMLElement>('[data-scene]'));
  const replayButton = section.querySelector<HTMLButtonElement>('[data-replay]');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const abortController = new AbortController();

  let activeService = 'software';
  let displayedScene = getInitialScene();
  let narrative: gsap.core.Timeline | null = null;
  let transition: gsap.core.Timeline | null = null;
  let sectionVisible = false;

  function getInitialScene() {
    return scenes.find((scene) => !scene.hidden) ?? null;
  }

  const getScene = (service: string) =>
    scenes.find((scene) => scene.dataset.scene === service) ?? null;

  const killTimelines = () => {
    narrative?.kill();
    transition?.kill();
    narrative = null;
    transition = null;
  };

  const showFinalState = (scene: HTMLElement) => {
    gsap.set(scene.querySelectorAll<SVGElement>('[data-animate]'), { opacity: 1 });
    const paths = Array.from(scene.querySelectorAll<SVGPathElement>('[data-draw]'));
    paths.forEach((path) => {
      gsap.set(path, { strokeDashoffset: 0 });
    });

    scene.querySelectorAll<SVGCircleElement>('[data-packet]').forEach((packet, index) => {
      const path = paths[index];
      if (!path) return;
      const point = path.getPointAtLength(path.getTotalLength());
      packet.setAttribute('cx', String(point.x));
      packet.setAttribute('cy', String(point.y));
      gsap.set(packet, { opacity: 1 });
    });
  };

  const animatePackets = (
    timeline: gsap.core.Timeline,
    paths: SVGPathElement[],
    packets: SVGCircleElement[],
    startAt: number,
  ) => {
    paths.forEach((path, index) => {
      const packet = packets[index];
      if (!packet) return;

      const length = path.getTotalLength();
      const progress = { value: 0 };
      timeline.to(
        progress,
        {
          value: 1,
          duration: 0.72,
          ease: 'none',
          onStart: () => gsap.set(packet, { opacity: 1 }),
          onUpdate: () => {
            const point = path.getPointAtLength(length * progress.value);
            packet.setAttribute('cx', String(point.x));
            packet.setAttribute('cy', String(point.y));
          },
        },
        startAt + index * 0.08,
      );
    });
  };

  const playScene = () => {
    narrative?.kill();
    narrative = null;
    const scene = getScene(activeService);
    if (!scene || !sectionVisible) return;

    if (reduceMotion.matches) {
      showFinalState(scene);
      return;
    }

    const animated = scene.querySelectorAll<SVGElement>('[data-animate]');
    const paths = Array.from(scene.querySelectorAll<SVGPathElement>('[data-draw]'));
    const packets = Array.from(scene.querySelectorAll<SVGCircleElement>('[data-packet]'));

    gsap.set(animated, { opacity: 0 });
    if (packets.length) gsap.set(packets, { opacity: 0 });
    paths.forEach((path) => {
      const length = path.getTotalLength();
      gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
    });

    narrative = gsap.timeline();

    if (activeService === 'software') {
      narrative
        .to(animated, {
          opacity: 1,
          duration: 0.45,
          stagger: 0.12,
          ease: 'power1.out',
        })
        .to(paths, { strokeDashoffset: 0, duration: 0.9, stagger: 0.12, ease: 'power1.inOut' }, '-=0.15');
    } else if (activeService === 'automatizaciones') {
      const messages = Array.from(scene.querySelectorAll<SVGElement>('.sv3-phone [data-animate]'));
      const assistant = scene.querySelectorAll<SVGElement>('[data-automation-stage="assistant"]');
      const system = scene.querySelectorAll<SVGElement>('[data-automation-stage="system"]');
      const status = scene.querySelectorAll<SVGElement>('[data-animate]:not(.sv3-phone [data-animate])');

      narrative
        .to(messages[0], { opacity: 1, duration: 0.35, ease: 'power1.out' }, 0.4)
        .to(assistant, { opacity: 1, duration: 0.4, ease: 'power1.out' }, 1.35)
        .to(paths[0], { strokeDashoffset: 0, duration: 0.65, ease: 'power1.inOut' }, 1.75)
        .to(messages[1], { opacity: 1, duration: 0.35, ease: 'power1.out' }, 2.25)
        .to(system, { opacity: 1, duration: 0.4, ease: 'power1.out' }, 2.75)
        .to(paths.slice(1), { strokeDashoffset: 0, duration: 0.65, stagger: 0.25, ease: 'power1.inOut' }, 3.2)
        .to(messages[2], { opacity: 1, duration: 0.35, ease: 'power1.out' }, 4.05)
        .to(messages[3], { opacity: 1, duration: 0.4, ease: 'power1.out' }, 4.85)
        .to(status, { opacity: 1, duration: 0.35, stagger: 0.1, ease: 'power1.out' }, 5.3);
    } else {
      const connectors = Array.from(scene.querySelectorAll<SVGPathElement>('[data-connector] [data-draw]'));
      narrative
        .to(scene.querySelectorAll<SVGElement>('.sv3-system'), {
          opacity: 1,
          duration: 0.35,
          stagger: 0.12,
          ease: 'power1.out',
        }, 0.2)
        .to(connectors, { strokeDashoffset: 0, duration: 0.8, stagger: 0.08, ease: 'power1.inOut' }, 1.05)
        .to(scene.querySelectorAll<SVGElement>('.sv3-hub'), {
          opacity: 1,
          duration: 0.4,
          ease: 'power1.out',
        }, 2.15);
      animatePackets(narrative, connectors, packets, 2.65);
      narrative.to(scene.querySelectorAll<SVGElement>('[data-integration-final]'), {
        opacity: 1,
        duration: 0.4,
        ease: 'power1.out',
      }, 4.1);
    }
  };

  const switchScene = (service: string) => {
    const nextScene = getScene(service);
    if (!nextScene) return;

    narrative?.kill();
    narrative = null;
    transition?.kill();
    transition = null;

    if (reduceMotion.matches) {
      scenes.forEach((scene) => {
        scene.hidden = scene !== nextScene;
        gsap.set(scene, { opacity: 1 });
      });
      displayedScene = nextScene;
      showFinalState(nextScene);
      return;
    }

    const currentScene = displayedScene;
    scenes.forEach((scene) => {
      if (scene !== currentScene && scene !== nextScene) scene.hidden = true;
    });

    if (!currentScene || currentScene === nextScene) {
      scenes.forEach((scene) => {
        scene.hidden = scene !== nextScene;
        gsap.set(scene, { opacity: 1 });
      });
      displayedScene = nextScene;
      playScene();
      return;
    }

    gsap.set(nextScene, { opacity: 0 });
    nextScene.hidden = false;
    transition = gsap.timeline({
      onComplete: () => {
        currentScene.hidden = true;
        gsap.set(currentScene, { clearProps: 'opacity' });
        displayedScene = nextScene;
        transition = null;
        playScene();
      },
    });
    transition
      .to(currentScene, { opacity: 0, duration: 0.12, ease: 'power1.out' })
      .to(nextScene, { opacity: 1, duration: 0.18, ease: 'power1.out' });
  };

  const activate = (service: string) => {
    const selectedTab = tabs.find((tab) => tab.dataset.service === service);
    const nextPanel = panels.find((panel) => panel.dataset.servicePanel === service);
    if (!selectedTab || !nextPanel || service === activeService) return;

    const previousPanel = panels.find((panel) => !panel.hidden) ?? null;
    activeService = service;

    tabs.forEach((tab) => {
      const selected = tab === selectedTab;
      tab.setAttribute('aria-expanded', String(selected));
      const icon = tab.querySelector<HTMLElement>('.sv3-arrow');
      if (!icon) return;

      gsap.killTweensOf(icon);
      if (reduceMotion.matches) {
        icon.textContent = selected ? '↗' : '+';
        return;
      }

      gsap.set(icon, { opacity: 1 });
      gsap.to(icon, {
        opacity: 0,
        duration: 0.08,
        onComplete: () => {
          icon.textContent = selected ? '↗' : '+';
          gsap.to(icon, { opacity: 1, duration: 0.12 });
        },
      });
    });

    panels.forEach((panel) => {
      gsap.killTweensOf(panel);
      if (panel !== nextPanel && panel !== previousPanel) panel.hidden = true;
    });

    if (previousPanel && previousPanel !== nextPanel) {
      gsap.to(previousPanel, {
        height: 0,
        opacity: 0,
        duration: 0.25,
        ease: 'power1.inOut',
        onComplete: () => {
          previousPanel.hidden = true;
          gsap.set(previousPanel, { clearProps: 'height,opacity' });
        },
      });
    }

    nextPanel.hidden = false;
    gsap.fromTo(
      nextPanel,
      { height: 0, opacity: 0 },
      { height: 'auto', opacity: 1, duration: 0.3, ease: 'power1.out', clearProps: 'height,opacity' },
    );

    switchScene(service);
  };

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => activate(tab.dataset.service ?? ''), {
      signal: abortController.signal,
    });
  });

  replayButton?.addEventListener('click', () => {
    transition?.kill();
    transition = null;
    const activeScene = getScene(activeService);
    if (!activeScene) return;

    scenes.forEach((scene) => {
      scene.hidden = scene !== activeScene;
      gsap.set(scene, { opacity: 1 });
    });
    displayedScene = activeScene;
    playScene();
  }, { signal: abortController.signal });

  const observer = new IntersectionObserver(([entry]) => {
    const wasVisible = sectionVisible;
    sectionVisible = entry.isIntersecting;

    if (sectionVisible) {
      if (transition?.paused()) {
        transition.resume();
      } else if (narrative?.paused()) {
        narrative.resume();
      } else if (!wasVisible && !transition && !narrative) {
        playScene();
      }
    } else {
      transition?.pause();
      narrative?.pause();
    }
  }, { threshold: 0.15 });
  observer.observe(section);

  const onMotionPreferenceChange = () => {
    killTimelines();
    const activeScene = getScene(activeService);
    if (!activeScene) return;
    scenes.forEach((scene) => {
      scene.hidden = scene !== activeScene;
      gsap.set(scene, { opacity: 1 });
    });
    displayedScene = activeScene;
    if (reduceMotion.matches) showFinalState(activeScene);
    else playScene();
  };

  reduceMotion.addEventListener('change', onMotionPreferenceChange, {
    signal: abortController.signal,
  });

  window.addEventListener('pagehide', () => {
    killTimelines();
    observer.disconnect();
    abortController.abort();
  }, { once: true });

  if (reduceMotion.matches) {
    const initialScene = getScene(activeService);
    if (initialScene) showFinalState(initialScene);
  }
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initServices, { once: true });
} else {
  initServices();
}
