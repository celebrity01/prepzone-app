import React from "react";
import { useAppContext } from "../types";

const NemaLogo: React.FC = () => (
  <div className="flex items-center">
    <span className="bg-green-500 text-white font-bold text-base px-3 py-1.5 rounded-md">
      NEMA
    </span>
    <span className="ml-2 text-white font-normal text-xl tracking-wide">
      PrepZone
    </span>
  </div>
);

const MttLogo: React.FC = () => (
  <div className="text-right">
    <span className="text-gray-400 text-xs font-semibold tracking-wider">
      POWERED BY
    </span>
    <div className="flex items-center justify-end">
      <span className="font-bold text-teal-300 text-lg">3MTT Partnership</span>
      <div className="ml-2 w-7 h-7 flex items-center justify-center bg-teal-400 rounded-full text-gray-900 font-black text-sm">
        3M
      </div>
    </div>
  </div>
);

const GlobeIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    {...props}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M10.5 21l-5.485-8.69a.75.75 0 01.328-1.015l.12-.059 7.5-3a.75.75 0 01.815.148L19.5 12m-9-3.75a.75.75 0 01.5-1.423l4.58-1.22a.75.75 0 01.964.964l-1.22 4.58a.75.75 0 01-1.423.5l-3-7.5zM15 12.75a3 3 0 11-6 0 3 3 0 016 0z"
    />
  </svg>
);

export const Header: React.FC = () => {
  const { t, language, changeLanguage, level, currentXp, xpToNextLevel } =
    useAppContext();
  const progressPercent =
    xpToNextLevel > 0 ? (currentXp / xpToNextLevel) * 100 : 0;

  return (
    <header className="w-full bg-gray-900 bg-opacity-30 backdrop-blur-sm p-4 sticky top-0 z-50 border-b border-gray-700/50">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center gap-4">
          <NemaLogo />
          <div className="hidden lg:flex items-center gap-3 bg-gray-900/50 py-1.5 px-4 rounded-full border border-gray-700">
            <span className="font-bold text-cyan-400">
              {t("levelLabel")} {level}
            </span>
            <div className="w-32 bg-gray-700 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-cyan-400 h-2.5 rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
            <span className="text-gray-300 font-mono text-sm">
              {currentXp}/{xpToNextLevel} {t("xpLabel")}
            </span>
          </div>
        </div>

        <div className="hidden md:flex items-center text-gray-300">
          <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
          <span className="font-semibold text-sm">
            {t("aiPoweredTraining")}
          </span>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={changeLanguage}
            aria-label={t("changeLanguageAriaLabel")}
            className="flex items-center gap-2 text-sm font-semibold text-gray-300 hover:text-white bg-gray-700/50 px-3 py-1.5 rounded-md transition-colors"
          >
            <GlobeIcon className="w-5 h-5" />
            <span>{language.toUpperCase()}</span>
          </button>
          <MttLogo />
        </div>
      </div>
    </header>
  );
};
