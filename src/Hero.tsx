import React, { useState, useEffect } from 'react';

// Image assets - local files
const imgAvatarImg = "/assets/avatar.png";
const imgLogo = "/assets/logo.svg";
const imgVector = "/assets/clock-icon.svg";
const imgVector1 = "/assets/arrow-icon.svg";
const imgVector2 = "/assets/email-icon.svg";

interface BadgeProps {
  label: string;
}

const Badge: React.FC<BadgeProps> = ({ label }) => {
  return (
    <div className="border border-[rgba(45,48,48,0.6)] rounded-full px-4 py-2 shrink-0">
      <p className="font-['Figtree',sans-serif] font-normal text-sm leading-6 text-[#38342f] whitespace-nowrap">
        {label}
      </p>
    </div>
  );
};

export default function Hero() {
  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const displayHours = hours % 12 || 12;
      const displayMinutes = minutes.toString().padStart(2, '0');
      setCurrentTime(`${displayHours}:${displayMinutes} ${ampm}`);
    };

    // Actualizar inmediatamente
    updateTime();

    // Actualizar cada segundo
    const interval = setInterval(updateTime, 1000);

    // Limpiar el intervalo al desmontar el componente
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-start w-full min-h-screen bg-[#f6f3f1]">
      {/* Navbar */}
      <header className="w-full bg-[#f6f3f1] px-4 sm:px-6 md:px-12 lg:px-[72px] py-6 sm:py-8 md:py-10">
        <nav className="flex flex-col gap-4 sm:gap-6 md:gap-8 lg:flex-row lg:items-center lg:justify-between w-full max-w-[1777px] mx-auto">
          {/* Top Row: Logo and Navigation (Mobile/Tablet) */}
          <div className="flex items-center justify-between w-full lg:w-auto">
            {/* Logo */}
            <div className="flex gap-2 items-center">
              <div className="h-[20px] w-[15px] sm:h-[23px] sm:w-[17px] shrink-0">
                <img 
                  alt="Samuel Möder logo" 
                  className="w-full h-full object-contain" 
                  src={imgLogo} 
                />
              </div>
              <h2 className="font-['Figtree',sans-serif] font-medium text-base sm:text-lg leading-none text-[#38342f] whitespace-nowrap">
                Samuel Möder
              </h2>
            </div>

            {/* Navigation - Visible on all screens */}
            <div className="flex gap-6 sm:gap-8 items-center font-['Figtree',sans-serif] font-medium text-base sm:text-lg whitespace-nowrap lg:hidden">
              <a 
                href="#works" 
                className="text-[rgba(45,48,48,0.6)] hover:text-[#38342f] transition-colors"
                aria-label="View works"
              >
                Works
              </a>
              <a 
                href="#about" 
                className="text-[#38342f] hover:opacity-80 transition-opacity"
                aria-label="About me"
                aria-current="page"
              >
                About
              </a>
            </div>
          </div>

          {/* Description - Responsive visibility */}
          <p className="text-xs sm:text-sm font-['Figtree',sans-serif] font-normal leading-[1.2] sm:leading-[14px] text-[rgba(45,48,48,0.6)] text-center lg:text-center max-w-full lg:max-w-none px-4 lg:px-0 lg:flex-1 lg:mx-auto">
            Hi 👋 I'm Samuel Möder, Product designer & Frontend Developer based in Santiago de Chile
          </p>

          {/* Navigation - Desktop only (hidden on mobile/tablet) */}
          <div className="hidden lg:flex gap-8 items-center font-['Figtree',sans-serif] font-medium text-lg whitespace-nowrap">
            <a 
              href="#works" 
              className="text-[rgba(45,48,48,0.6)] hover:text-[#38342f] transition-colors"
              aria-label="View works"
            >
              Works
            </a>
            <a 
              href="#about" 
              className="text-[#38342f] hover:opacity-80 transition-opacity"
              aria-label="About me"
              aria-current="page"
            >
              About
            </a>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="w-full px-4 sm:px-8 md:px-16 lg:px-[72px] py-[128px] min-h-[762px]">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-0 w-full max-w-[1777px] mx-auto">
          {/* Hero Content */}
          <div className="flex flex-col gap-10 items-start w-full lg:w-[1176px]">
          {/* Main Headline */}
          <h1 className="font-['Lexend',sans-serif] font-normal text-[#38342f] leading-[56px]">
            <span className="font-['Figtree',sans-serif] font-light text-5xl sm:text-6xl lg:text-[80px]">
              I design products that resolve{' '}
            </span>
            <span className="font-['Cormorant_Garamond',serif] italic text-6xl sm:text-7xl lg:text-[110px]">
              user problems
            </span>
            <span className="font-['Figtree',sans-serif] font-light text-5xl sm:text-6xl lg:text-[80px]">
              {' '}and business needs
            </span>
          </h1>

          {/* Badges Container */}
          <div className="flex flex-wrap gap-4 items-center">
            <Badge label="Product Designer" />
            <Badge label="Frontend Developer" />
            <Badge label="Design Strategy" />
            <Badge label="UX/UI" />
          </div>
        </div>

          {/* Clock Indicator */}
          <div className="flex flex-col gap-2 items-end justify-end h-full w-[107px] shrink-0 self-end">
            <div className="flex gap-4 items-end">
              <div className="w-4 h-4 shrink-0">
                <img 
                  alt="" 
                  className="w-full h-full object-contain" 
                  src={imgVector}
                  aria-hidden="true"
                />
              </div>
              <time 
                className="font-['Figtree',sans-serif] font-medium text-sm leading-[14px] text-[#38342f] whitespace-nowrap"
                dateTime={new Date().toISOString()}
              >
                {currentTime}
              </time>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section 
        id="about" 
        className="w-full px-4 sm:px-8 md:px-16 lg:px-[72px] py-0"
        aria-labelledby="about-heading"
      >
        <div className="w-full max-w-[1777px] mx-auto flex justify-center">
          <div className="flex flex-col lg:flex-row items-start justify-between gap-4 sm:gap-6 lg:gap-0 w-full max-w-[1322px]">
            {/* Avatar Column */}
            <div className="flex items-start shrink-0 w-auto lg:w-[72px]">
              <div className="relative rounded-full w-12 h-12 sm:w-16 sm:h-16 lg:w-[72px] lg:h-[72px] shrink-0">
                <img 
                  alt="Samuel Möder profile picture" 
                  className="absolute inset-0 w-full h-full object-cover rounded-full pointer-events-none" 
                  src={imgAvatarImg} 
                />
              </div>
            </div>

            {/* Content Column */}
            <div className="flex flex-col items-start gap-10 shrink-0 w-full max-w-[600px] sm:max-w-[700px] md:max-w-[800px] lg:max-w-[873px] lg:w-[873px] mx-auto lg:mx-0">
              <div className="flex flex-col gap-10 items-start font-['Figtree',sans-serif] font-normal text-xl leading-8 text-[#38342f] w-full">
                <p className="leading-8 text-left">
                  Hi, I'm Samuel, Son of God, devoted husband, and father of two, I am a Front-End Developer and Product Designer residing in Santiago, Chile. My passions lie at the intersection of creativity and technology.
                </p>
                <p className="leading-8 text-left">
                  Currently, I am working at Pivify Labs as a Design Lead and Product Manager on certains projects. What truly sets me apart is my commitment to simplicity, minimalism, and meticulous attention to detail.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Links */}
        <div className="w-full max-w-[1777px] mx-auto py-24 flex justify-center">
          <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between gap-8 lg:gap-0 w-full max-w-[1322px]">
            {/* Spacer para alinear con avatar (solo visible en desktop) */}
            <div className="hidden lg:block w-[72px] shrink-0"></div>

            {/* Content area - alineado con Content Column */}
            <div className="flex flex-col sm:flex-row gap-6 sm:gap-0 items-start sm:items-center justify-between w-full lg:w-[873px] shrink-0">
            {/* Read More Link - Alineado con Content Column */}
            <a 
              href="#more" 
              className="flex gap-2 items-center font-['Figtree',sans-serif] font-medium text-xl text-[#38342f] underline decoration-solid hover:opacity-80 transition-opacity"
              aria-label="Read more about Samuel"
            >
              <div className="w-4 h-4 shrink-0">
                <img 
                  alt="" 
                  className="w-full h-full object-contain" 
                  src={imgVector1}
                  aria-hidden="true"
                />
              </div>
              <span>read more</span>
            </a>

            {/* Email Link */}
            <a 
              href="mailto:hey@moder.digital" 
              className="flex gap-[14px] items-center font-['Figtree',sans-serif] font-medium text-xl leading-[14px] text-[#38342f] underline decoration-solid hover:opacity-80 transition-opacity"
              aria-label="Send email to hey@moder.digital"
            >
              <div className="w-4 h-4 shrink-0">
                <img 
                  alt="" 
                  className="w-full h-full object-contain" 
                  src={imgVector2}
                  aria-hidden="true"
                />
              </div>
              <span>hey@moder.digital</span>
            </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

