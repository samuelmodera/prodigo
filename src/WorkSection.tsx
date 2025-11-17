import React from 'react';

interface WorkBadgeProps {
  label: string;
}

const WorkBadge: React.FC<WorkBadgeProps> = ({ label }) => {
  return (
    <div className="border border-[rgba(45,48,48,0.6)] rounded-full px-4 py-2 shrink-0">
      <p className="font-['Figtree',sans-serif] font-normal text-sm leading-6 text-[#38342f] whitespace-nowrap">
        {label}
      </p>
    </div>
  );
};

interface WorkSectionProps {
  id: string;
  title: string;
  badges: string[];
  imageSrc: string;
  imageAlt: string;
  year: string;
  firstParagraph: string;
  secondParagraph: string | React.ReactNode;
}

export default function WorkSection({
  id,
  title,
  badges,
  imageSrc,
  imageAlt,
  year,
  firstParagraph,
  secondParagraph,
}: WorkSectionProps) {
  return (
    <section 
      id={id}
      className="w-full bg-[#f6f3f1] px-4 sm:px-8 md:px-16 lg:px-[72px] py-16 sm:py-20 md:py-24 lg:py-[96px]"
      aria-labelledby={`${id}-heading`}
    >
      <div className="flex flex-col items-start w-full max-w-[1777px] mx-auto">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 lg:gap-0 w-full h-auto lg:h-[104px] pb-12 sm:pb-16 lg:pb-[64px] lg:pt-0">
          {/* Title */}
          <h2 
            id={`${id}-heading`}
            className="font-['Figtree',sans-serif] font-normal text-3xl sm:text-4xl lg:text-[40px] leading-[40px] text-[#38342f] whitespace-nowrap"
          >
            {title}
          </h2>

          {/* Badges Container */}
          <div className="flex flex-wrap gap-4 items-center justify-end w-full lg:w-auto">
            {badges.map((badge, index) => (
              <WorkBadge key={index} label={badge} />
            ))}
          </div>
        </div>

        {/* Image Section */}
        <div className="bg-[rgba(47,101,92,0.3)] overflow-hidden relative w-full mb-12 sm:mb-16">
          <div className="relative w-full aspect-[1777/998]">
            <div className="absolute top-4 left-4 right-4 sm:top-8 sm:left-8 sm:right-8 md:top-16 md:left-16 md:right-16 lg:top-[64px] lg:left-[64px] lg:right-[64px] bottom-0 rounded-t-2xl overflow-hidden">
              <img 
                alt={imageAlt}
                className="w-full h-full object-cover object-top rounded-t-2xl pointer-events-none" 
                src={imageSrc} 
              />
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="flex flex-col lg:flex-row items-start justify-between gap-4 sm:gap-6 lg:gap-0 w-full max-w-[1322px] pt-12 sm:pt-16 lg:pt-[64px]">
          {/* Year Column */}
          <div className="flex items-start shrink-0 w-auto lg:w-[72px]">
            <div className="flex gap-2 items-center">
              <p className="font-['Figtree',sans-serif] font-normal text-lg sm:text-xl lg:text-[23px] leading-[40px] text-[#38342f] whitespace-nowrap">
                {year}
              </p>
            </div>
          </div>

          {/* Content Column */}
          <div className="flex flex-col items-start gap-10 shrink-0 w-full max-w-[600px] sm:max-w-[700px] md:max-w-[800px] lg:max-w-[873px] lg:w-[873px] mx-auto lg:mx-0">
            <div className="flex flex-col gap-10 items-start font-['Figtree',sans-serif] font-normal text-[#38342f] w-full">
              <p className="text-xl leading-8 text-left">
                {firstParagraph}
              </p>
              {typeof secondParagraph === 'string' ? (
                <p className="text-base leading-8 text-left">
                  {secondParagraph}
                </p>
              ) : (
                <div className="text-base leading-8 text-left">
                  {secondParagraph}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

