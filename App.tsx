import React, { useState, useCallback, ReactNode, useEffect } from "react";
import {
  GameState,
  Scenario,
  Category,
  Question,
  GameHistoryItem,
  AppContext,
  useAppContext,
} from "./types";
import { SCENARIO_CATEGORIES } from "./constants";
import { translations, languageNames, Language } from "./translations";
import {
  generateInitialScenario,
  generateNextQuestion,
  generateGameSummary,
  generateScenarioImage,
} from "./services/geminiService";
import { getScenarioImage } from "./static/images";
import { Header } from "./components/Header";
import { LoadingSpinner } from "./components/LoadingSpinner";

// --- ICONS ---
const CheckCircleIcon: React.FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6 inline-block mr-2 text-teal-400"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);
const StartIcon: React.FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6 inline-block mr-2"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

// --- SCREENS ---
const LanguageFlags: Record<Language, string> = {
  en: "🇺🇸",
  ha: "🇳🇬",
  ig: "🇳🇬",
  yo: "🇳🇬",
};

const LanguageSelectionScreen: React.FC<{
  onSelect: (lang: Language) => void;
}> = ({ onSelect }) => (
  <div className="text-center w-full max-w-4xl mx-auto animate-fade-in">
    <div className="mb-12">
      <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-green-500 rounded-full mb-6 shadow-2xl">
        <svg
          className="w-10 h-10 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
          />
        </svg>
      </div>
      <h1 className="text-5xl md:text-6xl font-black text-white mb-4 bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
        Select Your Language
      </h1>
      <p className="text-xl text-gray-300 mb-2 max-w-2xl mx-auto leading-relaxed">
        Choose your preferred language to begin your emergency preparedness
        training
      </p>
      <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        <span>Powered by AI • Interactive Training • Real-time Feedback</span>
      </div>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {(Object.keys(languageNames) as Language[]).map((lang, index) => (
        <button
          key={lang}
          onClick={() => onSelect(lang)}
          className="group relative bg-gradient-to-br from-gray-800/70 to-gray-900/70 backdrop-blur-xl p-8 rounded-2xl border border-gray-700/50 hover:border-blue-500/50 cursor-pointer transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 text-white shadow-2xl hover:shadow-blue-500/25"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-green-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="relative z-10">
            <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
              {LanguageFlags[lang]}
            </div>
            <h3 className="text-xl font-bold mb-2 group-hover:text-blue-400 transition-colors">
              {languageNames[lang]}
            </h3>
            <div className="w-12 h-1 bg-gradient-to-r from-blue-500 to-green-500 rounded-full mx-auto group-hover:w-16 transition-all duration-300"></div>
          </div>
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500/20 to-green-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"></div>
        </button>
      ))}
    </div>

    <div className="mt-12 flex items-center justify-center gap-8 text-gray-400">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
          <svg
            className="w-4 h-4 text-green-400"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <span className="text-sm">Multi-language Support</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
          <svg
            className="w-4 h-4 text-blue-400"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <span className="text-sm">Certified Training</span>
      </div>
    </div>
  </div>
);

const WelcomeScreen: React.FC<{ onStart: () => void }> = ({ onStart }) => {
  const { t } = useAppContext();
  return (
    <div className="text-center w-full max-w-6xl mx-auto animate-fade-in">
      <div className="mb-8">
        <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-red-500 via-orange-500 to-yellow-500 rounded-full mb-8 shadow-2xl animate-pulse">
          <svg
            className="w-12 h-12 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        </div>
        <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight">
          {t("welcomeTitle1")}{" "}
          <span className="bg-gradient-to-r from-blue-400 via-green-400 to-teal-400 bg-clip-text text-transparent">
            {t("welcomeTitle2")}
          </span>
        </h1>
        <p className="text-xl md:text-2xl text-gray-300 mb-4 max-w-4xl mx-auto leading-relaxed font-light">
          {t("welcomeSubtitle")}
        </p>
        <div className="flex items-center justify-center gap-2 text-sm text-gray-400 mb-12">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span>NEMA Certified • AI-Powered • Interactive Learning</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {[
          {
            key: "feature1",
            icon: "🎯",
            color: "from-blue-500 to-cyan-500",
            description:
              "Practice with authentic Nigerian emergency scenarios based on real situations",
          },
          {
            key: "feature2",
            icon: "🚨",
            color: "from-red-500 to-pink-500",
            description:
              "Dynamic scenarios powered by advanced AI technology for realistic training",
          },
          {
            key: "feature3",
            icon: "🧠",
            color: "from-purple-500 to-indigo-500",
            description:
              "Learn from NEMA-certified protocols and best practices for emergency response",
          },
          {
            key: "feature4",
            icon: "⏱️",
            color: "from-green-500 to-teal-500",
            description:
              "Challenge yourself with timed responses or practice at your own pace",
          },
        ].map((feature, index) => (
          <div
            key={feature.key}
            className="group bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-xl p-6 rounded-2xl border border-gray-700/50 hover:border-blue-500/50 transition-all duration-500 transform hover:scale-105 hover:-translate-y-1 shadow-xl"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div
              className={`w-14 h-14 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}
            >
              {feature.icon}
            </div>
            <div className="mb-3">
              <div className="flex items-center text-white group-hover:text-blue-300 transition-colors mb-2">
                <CheckCircleIcon />
                <span className="font-bold text-lg">{t(feature.key)}</span>
              </div>
              <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors leading-relaxed">
                {feature.description}
              </p>
            </div>
            <div
              className={`w-full h-1 bg-gradient-to-r ${feature.color} rounded-full opacity-30 group-hover:opacity-100 transition-opacity duration-300`}
            ></div>
          </div>
        ))}
      </div>

      <div className="relative max-w-2xl mx-auto">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-green-500/20 rounded-3xl blur-2xl"></div>
        <div className="relative bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl p-10 rounded-3xl border border-gray-700/50 shadow-2xl">
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-white mb-3 bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
              {t("readyTitle")}
            </h2>
            <p className="text-lg text-gray-300 leading-relaxed">
              {t("readySubtitle")}
            </p>
          </div>

          <div className="relative">
            {/* Animated rings around button */}
            <div className="absolute inset-0 rounded-2xl">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/30 to-green-500/30 animate-pulse-ring"></div>
              <div
                className="absolute inset-0 rounded-2xl bg-gradient-to-r from-red-500/20 to-orange-500/20 animate-pulse-ring"
                style={{ animationDelay: "0.5s" }}
              ></div>
            </div>

            <button
              onClick={onStart}
              className="group relative w-full bg-gradient-to-r from-red-600 via-orange-500 to-yellow-500 hover:from-red-500 hover:via-orange-400 hover:to-yellow-400 text-white font-black py-6 px-10 rounded-2xl text-xl transition-all duration-500 transform hover:scale-110 hover:-translate-y-1 shadow-2xl hover:shadow-red-500/30 overflow-hidden border-2 border-yellow-400/50 hover:border-yellow-300"
            >
              {/* Animated background gradient */}
              <div className="absolute inset-0 bg-gradient-to-r from-red-500 via-orange-400 to-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-gradient"></div>

              {/* Shimmer effect */}
              <div className="absolute inset-0 -skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-[shimmer_1.5s_ease-in-out] transition-opacity duration-300"></div>

              {/* Emergency alert effect */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-400 to-red-500 opacity-0 group-hover:opacity-100 animate-pulse"></div>
              <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-yellow-400 opacity-0 group-hover:opacity-100 animate-pulse"></div>

              <div className="relative flex items-center justify-center gap-4">
                {/* Emergency icon with rotation */}
                <div className="relative">
                  <div className="w-8 h-8 bg-white/20 rounded-full absolute -inset-1 animate-ping group-hover:animate-pulse"></div>
                  <div className="relative transform group-hover:rotate-12 transition-transform duration-300">
                    <svg
                      className="w-6 h-6 text-white drop-shadow-lg"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z"
                      />
                    </svg>
                  </div>
                </div>

                {/* Button text with enhanced styling */}
                <span className="text-shadow font-black uppercase tracking-wider relative">
                  {t("startButton")}
                  <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-yellow-300 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                </span>

                {/* Animated arrow */}
                <div className="relative">
                  <svg
                    className="w-6 h-6 text-white transform group-hover:translate-x-1 transition-transform duration-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                  <div className="absolute inset-0 text-white animate-pulse opacity-50">
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1}
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  </div>
                </div>

                {/* Emergency pulse indicator */}
                <div className="flex gap-1 ml-2">
                  <div className="w-2 h-2 bg-yellow-300 rounded-full animate-pulse"></div>
                  <div
                    className="w-2 h-2 bg-yellow-300 rounded-full animate-pulse"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-yellow-300 rounded-full animate-pulse"
                    style={{ animationDelay: "0.4s" }}
                  ></div>
                </div>
              </div>

              {/* Sound wave effect */}
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="flex items-center gap-1">
                  <div className="w-1 h-3 bg-white/60 rounded-full animate-[wave_1s_ease-in-out_infinite]"></div>
                  <div
                    className="w-1 h-4 bg-white/60 rounded-full animate-[wave_1s_ease-in-out_infinite]"
                    style={{ animationDelay: "0.1s" }}
                  ></div>
                  <div
                    className="w-1 h-5 bg-white/60 rounded-full animate-[wave_1s_ease-in-out_infinite]"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                  <div
                    className="w-1 h-4 bg-white/60 rounded-full animate-[wave_1s_ease-in-out_infinite]"
                    style={{ animationDelay: "0.3s" }}
                  ></div>
                  <div
                    className="w-1 h-3 bg-white/60 rounded-full animate-[wave_1s_ease-in-out_infinite]"
                    style={{ animationDelay: "0.4s" }}
                  ></div>
                </div>
              </div>
            </button>

            {/* Emergency status indicator */}
            <div className="absolute -top-3 -right-3 w-6 h-6 bg-red-500 border-2 border-white rounded-full flex items-center justify-center animate-bounce">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-center gap-4 text-sm text-gray-400">
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              Free Training
            </span>
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              No Registration
            </span>
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
                  clipRule="evenodd"
                />
              </svg>
              Instant Start
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

interface CategorySelectionScreenProps {
  onSelect: (category: Category) => void;
  onBack: () => void;
  timerDuration: number | null;
  onTimerChange: (duration: number | null) => void;
}
const CategorySelectionScreen: React.FC<CategorySelectionScreenProps> = ({
  onSelect,
  onBack,
  timerDuration,
  onTimerChange,
}) => {
  const { t } = useAppContext();
  const timerOptions = [null, 15, 20, 30];

  const categoryColors = {
    floodResponse: "from-blue-500 to-cyan-500",
    urbanFire: "from-red-500 to-orange-500",
    roadAccident: "from-yellow-500 to-amber-500",
    marketplaceStampede: "from-purple-500 to-pink-500",
  };

  return (
    <div className="w-full max-w-7xl mx-auto animate-fade-in">
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-teal-500 rounded-full mb-6 shadow-2xl">
          <svg
            className="w-8 h-8 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            />
          </svg>
        </div>
        <h2 className="text-4xl md:text-5xl font-black text-white mb-4 bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
          {t("chooseScenarioTitle")}
        </h2>
        <p className="text-xl text-gray-300 mb-2 max-w-3xl mx-auto leading-relaxed">
          {t("chooseScenarioSubtitle")}
        </p>
        <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span>
            Choose your training scenario • Customizable difficulty • Real-time
            feedback
          </span>
        </div>
      </div>

      <div className="relative max-w-4xl mx-auto mb-12">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-green-500/10 rounded-3xl blur-2xl"></div>
        <div className="relative bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl p-8 rounded-3xl border border-gray-700/50 shadow-2xl">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold text-white mb-3 bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
              {t("timerSettingsTitle")}
            </h3>
            <p className="text-gray-400 text-sm">
              Configure your response time limit for each question
            </p>
          </div>
          <div className="flex justify-center">
            <div className="inline-flex bg-gray-900/50 rounded-2xl p-2 border border-gray-600">
              {timerOptions.map((opt, index) => (
                <button
                  key={opt ?? "none"}
                  onClick={() => onTimerChange(opt)}
                  className={`px-6 py-3 text-sm font-semibold rounded-xl transition-all duration-300 ${
                    timerDuration === opt
                      ? "bg-gradient-to-r from-blue-600 to-green-600 text-white shadow-lg transform scale-105"
                      : "text-gray-300 hover:text-white hover:bg-gray-700/50"
                  }`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {opt === null ? (
                    <div className="flex items-center gap-2">
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {t("noTimer")}
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {opt}s
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {SCENARIO_CATEGORIES.map((cat, index) => {
          const colorClass =
            categoryColors[cat.key as keyof typeof categoryColors] ||
            "from-gray-500 to-gray-600";
          return (
            <div
              key={cat.key}
              onClick={() => onSelect(cat)}
              className="group relative bg-gradient-to-br from-gray-800/70 to-gray-900/70 backdrop-blur-xl rounded-3xl border border-gray-700/50 hover:border-blue-500/50 cursor-pointer transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 shadow-2xl hover:shadow-blue-500/25 overflow-hidden"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-green-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              <div className="relative p-8">
                <div className="flex items-start mb-6">
                  <div
                    className={`w-16 h-16 bg-gradient-to-br ${colorClass} rounded-2xl flex items-center justify-center text-white shadow-2xl group-hover:scale-110 transition-transform duration-300 mr-6`}
                  >
                    <cat.icon className="w-8 h-8" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors">
                      {t(`${cat.key}_title`)}
                    </h3>
                    <p className="text-gray-300 leading-relaxed group-hover:text-gray-200 transition-colors">
                      {t(`${cat.key}_description`)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-3 h-3 bg-gradient-to-r ${colorClass} rounded-full`}
                    ></div>
                    <span className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
                      Interactive Training
                    </span>
                  </div>
                  <div className="flex items-center text-blue-400 font-semibold group-hover:text-blue-300 transition-colors">
                    <span className="mr-2">{t("startTrainingLink")}</span>
                    <svg
                      className="w-5 h-5 transform group-hover:translate-x-1 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  </div>
                </div>

                <div
                  className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${colorClass} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`}
                ></div>
              </div>

              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-blue-500/10 to-green-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"></div>
            </div>
          );
        })}
      </div>

      <div className="text-center">
        <button
          onClick={onBack}
          className="group relative bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 text-white font-semibold py-3 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-xl border border-gray-600/50 hover:border-gray-500/50"
        >
          <div className="flex items-center gap-3">
            <svg
              className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 17l-5-5m0 0l5-5m-5 5h12"
              />
            </svg>
            {t("backButton")}
          </div>
        </button>
      </div>
    </div>
  );
};

interface GameScreenProps {
  scenario: Scenario;
  categoryTitle: string;
  safetyScore: number;
  questionCount: number;
  timerDuration: number | null;
  onAnswer: (
    isCorrect: boolean,
    choiceIndex: number,
    timeRemaining: number,
    timerDuration: number | null,
  ) => void;
  onNextQuestion: (context: string) => void;
  onEndGame: () => void;
}
const GameScreen: React.FC<GameScreenProps> = ({
  scenario,
  categoryTitle,
  safetyScore,
  questionCount,
  timerDuration,
  onAnswer,
  onNextQuestion,
  onEndGame,
}) => {
  const [userChoice, setUserChoice] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState<boolean>(false);
  const [isLoadingNext, setIsLoadingNext] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState(timerDuration ?? 15);
  const [isTimeUp, setIsTimeUp] = useState(false);
  const { t } = useAppContext();

  const { questionData } = scenario;
  const isCorrect = userChoice === questionData.correctChoiceIndex;

  const safetyColor =
    safetyScore > 60
      ? "bg-green-500"
      : safetyScore > 30
        ? "bg-yellow-500"
        : "bg-red-500";
  const timerColor =
    timeLeft > 10
      ? "text-green-400"
      : timeLeft > 5
        ? "text-yellow-400"
        : "text-red-400";

  const handleAnswerClick = useCallback(
    (index: number) => {
      if (showFeedback) return;
      setUserChoice(index);
      setShowFeedback(true);
      const correct = index === questionData.correctChoiceIndex;
      onAnswer(correct, index, timeLeft, timerDuration);
    },
    [showFeedback, onAnswer, timeLeft, questionData, timerDuration],
  );

  useEffect(() => {
    if (!timerDuration || showFeedback) return;

    if (timeLeft <= 0) {
      setIsTimeUp(true);
      let incorrectChoiceIndex = questionData.choices.findIndex(
        (_, i) => i !== questionData.correctChoiceIndex,
      );
      if (incorrectChoiceIndex === -1) incorrectChoiceIndex = 0; // Fallback
      handleAnswerClick(incorrectChoiceIndex);
      return;
    }

    const timerId = setInterval(() => {
      setTimeLeft((t) => t - 1);
    }, 1000);

    return () => clearInterval(timerId);
  }, [timeLeft, showFeedback, questionData, handleAnswerClick, timerDuration]);

  const handleNext = async () => {
    if (userChoice === null) return;
    setIsLoadingNext(true);
    const context = `${t("context_previousQuestion")} "${questionData.question}". ${t("context_myChoice")} "${questionData.choices[userChoice]}". ${isCorrect ? t("context_correct") : t("context_incorrect")}. ${t("context_feedback")} "${questionData.feedback[userChoice]}".`;
    await onNextQuestion(context);
    setUserChoice(null);
    setShowFeedback(false);
    setIsLoadingNext(false);
    setTimeLeft(timerDuration ?? 15);
    setIsTimeUp(false);
  };

  const getButtonClass = (index: number) => {
    if (!showFeedback) return "bg-gray-700 hover:bg-blue-600";
    if (index === questionData.correctChoiceIndex)
      return "bg-green-600 scale-105 ring-2 ring-white";
    if (index === userChoice) return "bg-red-600";
    return "bg-gray-600 opacity-50";
  };

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col items-center animate-fade-in">
      <div className="w-full bg-gray-800/50 backdrop-blur-md p-4 rounded-t-lg border-b border-gray-700 flex justify-between items-center mb-6">
        <div>
          <span className="font-bold text-white">
            {t("safetyScoreLabel")}: {safetyScore}%
          </span>
          <div className="w-48 h-2.5 bg-gray-700 rounded-full mt-1 overflow-hidden">
            <div
              className={`${safetyColor} h-full rounded-full transition-all duration-500`}
              style={{ width: `${safetyScore}%` }}
            ></div>
          </div>
        </div>
        <div className="text-right flex items-center gap-6">
          <div>
            <h2 className="text-xl font-bold text-white">{categoryTitle}</h2>
            <p className="text-sm text-gray-300">
              {t("questionCountLabel")} #{questionCount}
            </p>
          </div>
          {timerDuration && (
            <div className="text-center w-20">
              <div className={`text-4xl font-black ${timerColor}`}>
                {timeLeft}
              </div>
              <div className="text-xs text-gray-400 uppercase tracking-widest">
                {t("timerLabel")}
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="w-full aspect-video bg-black rounded-lg shadow-2xl mb-6 overflow-hidden border-2 border-gray-700">
        <img
          src={scenario.imageUrl}
          alt="Scenario"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="bg-gray-800 bg-opacity-70 backdrop-blur-md p-6 rounded-lg w-full border border-gray-700">
        <p className="text-xl md:text-2xl text-white font-semibold mb-6 text-center">
          {questionData.question}
        </p>
        <div className="grid grid-cols-1 gap-4 mb-4">
          {questionData.choices.map((choice, index) => (
            <button
              key={index}
              disabled={showFeedback}
              onClick={() => handleAnswerClick(index)}
              className={`text-white font-semibold p-4 rounded-lg transition-all duration-300 w-full text-left ${getButtonClass(index)} disabled:cursor-not-allowed`}
            >
              <span className="mr-3">{String.fromCharCode(65 + index)}.</span>
              {choice}
            </button>
          ))}
        </div>
        {showFeedback && userChoice !== null && (
          <div
            className={`p-4 rounded-lg mt-4 border-2 animate-fade-in ${isCorrect ? "bg-green-900 border-green-500" : "bg-red-900 border-red-500"}`}
          >
            <p className="font-bold text-lg text-white mb-2">
              {isTimeUp
                ? t("timesUp")
                : isCorrect
                  ? t("feedbackCorrect")
                  : t("feedbackIncorrect")}
            </p>
            <p className="text-gray-200">{questionData.feedback[userChoice]}</p>
            <div className="flex justify-end mt-4">
              <button
                onClick={handleNext}
                disabled={isLoadingNext}
                className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-6 rounded-lg transition-all disabled:bg-gray-500 flex items-center justify-center"
              >
                {isLoadingNext ? <LoadingSpinner /> : t("nextButton")}
              </button>
              <button
                onClick={onEndGame}
                className="ml-4 bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-6 rounded-lg transition-all"
              >
                {t("endButton")}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

interface GameOverScreenProps {
  summary: string;
  safetyScore: number;
  xpEarned: number;
  baseXp: number;
  bonusXp: number;
  leveledUp: boolean;
  onRestart: () => void;
  onBackToScenarios: () => void;
}
const GameOverScreen: React.FC<GameOverScreenProps> = ({
  summary,
  safetyScore,
  xpEarned,
  baseXp,
  bonusXp,
  leveledUp,
  onRestart,
  onBackToScenarios,
}) => {
  const { t } = useAppContext();
  return (
    <div className="text-center text-white bg-gray-800/50 backdrop-blur-md border-2 border-gray-700 p-8 rounded-lg max-w-2xl mx-auto animate-fade-in">
      <h2
        className={`text-4xl font-black mb-4 ${safetyScore > 0 ? "text-green-400" : "text-red-400"}`}
      >
        {safetyScore > 0 ? t("gameOverComplete") : t("gameOverFailed")}
      </h2>
      <p className="text-lg mb-2">
        {t("finalScoreLabel")}:{" "}
        <span className="font-bold text-2xl">{safetyScore}%</span>
      </p>

      {xpEarned > 0 && (
        <div className="bg-gray-900/50 my-6 p-4 rounded-lg border border-gray-700 text-left">
          <h3 className="font-bold text-lg text-yellow-300 mb-2">
            {t("xpEarned")}
          </h3>
          <div className="space-y-1">
            <p className="text-md">
              {t("baseXp")}:{" "}
              <span className="font-bold float-right">+{baseXp}</span>
            </p>
            {bonusXp > 0 && (
              <p className="text-md text-cyan-400">
                {t("bonusXp")}:{" "}
                <span className="font-bold float-right">+{bonusXp}</span>
              </p>
            )}
            <p className="text-lg font-bold mt-2 border-t border-gray-600 pt-2">
              {t("totalXpEarned")}:{" "}
              <span className="text-yellow-300 float-right">+{xpEarned}</span>
            </p>
          </div>
        </div>
      )}

      {leveledUp && (
        <div className="mb-6 text-green-300 font-black text-2xl animate-pulse">
          🎉 {t("levelUp")} 🎉
        </div>
      )}

      <div className="bg-gray-900/70 p-6 rounded-lg text-left my-6 border border-gray-600">
        <h3 className="font-bold text-xl text-blue-300 mb-3">
          {t("performanceAnalysisTitle")}
        </h3>
        <p className="text-gray-200 whitespace-pre-wrap">
          {summary || t("noSummary")}
        </p>
      </div>

      <div className="mt-8 flex justify-center gap-4">
        <button
          onClick={onRestart}
          className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-6 rounded-lg transition-colors"
        >
          {t("tryAgainButton")}
        </button>
        <button
          onClick={onBackToScenarios}
          className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-3 px-6 rounded-lg transition-colors"
        >
          {t("newScenarioButton")}
        </button>
      </div>
    </div>
  );
};

const LoadingScreen: React.FC<{ message: string }> = ({ message }) => (
  <div className="flex flex-col items-center justify-center text-white">
    <LoadingSpinner />
    <p className="text-xl mt-4 font-semibold">{message}</p>
  </div>
);

const ErrorScreen: React.FC<{ message: string; onRetry: () => void }> = ({
  message,
  onRetry,
}) => {
  const { t } = useAppContext();
  return (
    <div className="text-center text-white bg-red-900 bg-opacity-50 border-2 border-red-500 p-8 rounded-lg">
      <h2 className="text-3xl font-bold text-red-400 mb-4">
        {t("errorTitle")}
      </h2>
      <p className="text-lg mb-6">{message}</p>
      <button
        onClick={onRetry}
        className="bg-yellow-500 text-black font-bold py-2 px-6 rounded-lg hover:bg-yellow-400 transition-colors"
      >
        {t("tryAgainButton")}
      </button>
    </div>
  );
};

const AppContent: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.WELCOME);
  const [currentScenario, setCurrentScenario] = useState<Scenario | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null,
  );
  const [loadingMessage, setLoadingMessage] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  // Game state
  const [safetyScore, setSafetyScore] = useState(100);
  const [questionCount, setQuestionCount] = useState(1);
  const [gameHistory, setGameHistory] = useState<GameHistoryItem[]>([]);
  const [gameOverSummary, setGameOverSummary] = useState("");
  const [timerDuration, setTimerDuration] = useState<number | null>(15);

  // XP/Level state
  const { level, currentXp, setLevel, setCurrentXp } = useAppContext();
  const [xpGained, setXpGained] = useState(0);
  const [bonusXp, setBonusXp] = useState(0);
  const [leveledUp, setLeveledUp] = useState(false);

  const { t } = useAppContext();

  const resetGameState = () => {
    setCurrentScenario(null);
    setSelectedCategory(null);
    setGameHistory([]);
    setQuestionCount(1);
    setSafetyScore(100);
    setGameOverSummary("");
    setXpGained(0);
    setBonusXp(0);
    setLeveledUp(false);
  };

  const handleStart = () => setGameState(GameState.CATEGORY_SELECTION);
  const handleBackToWelcome = () => setGameState(GameState.WELCOME);

  const handleEndGame = useCallback(async () => {
    if (!selectedCategory) return;
    setGameState(GameState.LOADING);
    setLoadingMessage(t("loadingSummary"));

    if (safetyScore > 0) {
      const baseXP = 100;
      const totalXpEarned = baseXP + bonusXp;
      setXpGained(totalXpEarned);

      let newXp = currentXp + totalXpEarned;
      let newLevel = level;
      let xpToNext = newLevel * 150;
      let didLevelUp = false;

      while (newXp >= xpToNext) {
        newLevel++;
        newXp -= xpToNext;
        xpToNext = newLevel * 150;
        didLevelUp = true;
      }
      setLevel(newLevel);
      setCurrentXp(newXp);
      setLeveledUp(didLevelUp);
    } else {
      setXpGained(0);
      setLeveledUp(false);
    }

    // Generate summary
    try {
      const summaryPrompt = `${t("summaryPrompt_start")} '${t(`${selectedCategory.key}_title`)}'. ${t("summaryPrompt_middle")} ${JSON.stringify(gameHistory)}`;
      const summary = await generateGameSummary(summaryPrompt);
      setGameOverSummary(summary);
    } catch (e) {
      console.error("Failed to generate summary:", e);
      setGameOverSummary(t("noSummaryError"));
    } finally {
      setGameState(GameState.GAME_OVER);
    }
  }, [
    selectedCategory,
    gameHistory,
    t,
    safetyScore,
    currentXp,
    level,
    bonusXp,
    setCurrentXp,
    setLevel,
  ]);

  const handleAnswer = useCallback(
    (
      isCorrect: boolean,
      choiceIndex: number,
      timeRemaining: number,
      timerDuration: number | null,
    ) => {
      const newHistoryItem: GameHistoryItem = {
        question: currentScenario!.questionData.question,
        userChoice: currentScenario!.questionData.choices[choiceIndex],
        correctChoice:
          currentScenario!.questionData.choices[
            currentScenario!.questionData.correctChoiceIndex
          ],
        isCorrect: isCorrect,
      };
      setGameHistory((prev) => [...prev, newHistoryItem]);

      if (isCorrect && timerDuration) {
        const timeElapsed = timerDuration - timeRemaining;
        if (timeElapsed <= 10) {
          setBonusXp((prev) => prev + 20);
        }
      }

      if (!isCorrect) {
        setSafetyScore((prev) => {
          const newScore = Math.max(0, prev - 25);
          if (newScore === 0) {
            setTimeout(() => handleEndGame(), 2000);
          }
          return newScore;
        });
      }
    },
    [currentScenario, handleEndGame],
  );

  const handleSelectCategory = useCallback(
    async (category: Category) => {
      resetGameState();
      setSelectedCategory(category);
      setGameState(GameState.LOADING);
      setLoadingMessage(t("loadingMission"));
      setError(null);
      try {
        const categoryTitle = t(`${category.key}_title`);
        const systemInstruction = t("systemInstruction");
        const imageGenerationPrompt = `A realistic, cinematic photograph of a "${categoryTitle}" scenario in Nigeria. The image should be suitable for a disaster preparedness training simulation. Do not include text. The scene should focus on the environment and potential hazards, not on people in distress. High-resolution, 16:9 aspect ratio.`;

        // Use static image based on category key
        const imageUrl = getScenarioImage(category.key);

        // Generate only the question data
        const questionData = await generateInitialScenario(
          categoryTitle,
          systemInstruction,
        );

        const scenario: Scenario = { imageUrl, questionData };

        setCurrentScenario(scenario);
        setGameState(GameState.GAME);
      } catch (e) {
        const err = e as Error;
        setError(err.message || t("errorUnknown"));
        setGameState(GameState.ERROR);
      }
    },
    [t],
  );

  const handleNextQuestion = useCallback(
    async (context: string) => {
      if (!selectedCategory) return;
      setQuestionCount((prev) => prev + 1);
      try {
        const categoryTitle = t(`${selectedCategory.key}_title`);
        const systemInstruction = t("systemInstruction");
        const nextQuestionData = await generateNextQuestion(
          categoryTitle,
          systemInstruction,
          context,
        );
        setCurrentScenario((prev) => {
          if (!prev) return null;
          return { ...prev, questionData: nextQuestionData };
        });
      } catch (e) {
        const err = e as Error;
        setError(err.message || t("errorNextQuestion"));
        setGameState(GameState.ERROR);
      }
    },
    [selectedCategory, t],
  );

  const handleRetry = () => {
    setError(null);
    resetGameState();
    setGameState(GameState.WELCOME);
  };

  const handleBackToScenarios = () => {
    resetGameState();
    setGameState(GameState.CATEGORY_SELECTION);
  };

  const renderContent = (): ReactNode => {
    switch (gameState) {
      case GameState.WELCOME:
        return <WelcomeScreen onStart={handleStart} />;
      case GameState.CATEGORY_SELECTION:
        return (
          <CategorySelectionScreen
            onSelect={handleSelectCategory}
            onBack={handleBackToWelcome}
            timerDuration={timerDuration}
            onTimerChange={setTimerDuration}
          />
        );
      case GameState.LOADING:
        return <LoadingScreen message={loadingMessage} />;
      case GameState.GAME:
        if (currentScenario && selectedCategory) {
          return (
            <GameScreen
              scenario={currentScenario}
              categoryTitle={t(`${selectedCategory.key}_title`)}
              onAnswer={handleAnswer}
              onNextQuestion={handleNextQuestion}
              onEndGame={handleEndGame}
              safetyScore={safetyScore}
              questionCount={questionCount}
              timerDuration={timerDuration}
            />
          );
        }
        return (
          <ErrorScreen
            message={t("errorMissingScenario")}
            onRetry={handleRetry}
          />
        );
      case GameState.GAME_OVER:
        return (
          <GameOverScreen
            summary={gameOverSummary}
            safetyScore={safetyScore}
            xpEarned={xpGained}
            baseXp={safetyScore > 0 ? 100 : 0}
            bonusXp={bonusXp}
            leveledUp={leveledUp}
            onRestart={() => handleSelectCategory(selectedCategory!)}
            onBackToScenarios={handleBackToScenarios}
          />
        );
      case GameState.ERROR:
        return (
          <ErrorScreen
            message={error || t("errorUnknown")}
            onRetry={handleRetry}
          />
        );
      default:
        setGameState(GameState.WELCOME);
        return <WelcomeScreen onStart={handleStart} />;
    }
  };

  return (
    <div
      className="min-h-screen bg-gray-900 text-gray-100 font-sans bg-cover bg-center bg-fixed bg-particles"
      style={{
        backgroundImage:
          "linear-gradient(to bottom right, #020617, #1e293b, #0f172a)",
      }}
    >
      <Header />
      <main
        className="container mx-auto p-4 md:p-8 flex items-center justify-center"
        style={{ minHeight: "calc(100vh - 80px)" }}
      >
        {renderContent()}
      </main>
    </div>
  );
};

export default function App() {
  const [language, setLanguage] = useState<Language | null>(null);
  const [level, setLevel] = useState(1);
  const [currentXp, setCurrentXp] = useState(0);

  useEffect(() => {
    const savedLevel = localStorage.getItem("userLevel");
    const savedXp = localStorage.getItem("userXp");
    if (savedLevel) setLevel(parseInt(savedLevel, 10));
    if (savedXp) setCurrentXp(parseInt(savedXp, 10));
  }, []);

  useEffect(() => {
    localStorage.setItem("userLevel", level.toString());
    localStorage.setItem("userXp", currentXp.toString());
  }, [level, currentXp]);

  const handleSelectLanguage = (lang: Language) => {
    setLanguage(lang);
  };

  const changeLanguage = () => {
    setLanguage(null);
  };

  if (!language) {
    return (
      <div
        className="min-h-screen bg-gray-900 text-gray-100 font-sans bg-cover bg-center bg-fixed bg-particles"
        style={{
          backgroundImage:
            "linear-gradient(to bottom right, #020617, #1e293b, #0f172a)",
        }}
      >
        <div className="w-full bg-gray-900 bg-opacity-30 backdrop-blur-sm p-4 sticky top-0 z-50 border-b border-gray-700/50">
          <div className="container mx-auto flex justify-center items-center">
            <div className="flex items-center">
              <span className="bg-green-500 text-white font-bold text-base px-3 py-1.5 rounded-md">
                NEMA
              </span>
              <span className="ml-2 text-white font-normal text-xl tracking-wide">
                PrepZone
              </span>
            </div>
          </div>
        </div>
        <main
          className="container mx-auto p-4 md:p-8 flex items-center justify-center"
          style={{ minHeight: "calc(100vh - 80px)" }}
        >
          <LanguageSelectionScreen onSelect={handleSelectLanguage} />
        </main>
      </div>
    );
  }

  const t = (key: string) => translations[language][key] || key;
  const xpToNextLevel = level * 150;

  const contextValue = {
    language,
    t,
    changeLanguage,
    level,
    currentXp,
    xpToNextLevel,
    setLevel,
    setCurrentXp,
  };

  return (
    <AppContext.Provider value={contextValue}>
      <AppContent />
    </AppContext.Provider>
  );
}
