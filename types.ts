import React, { createContext, useContext } from 'react';
import { Language } from './translations';

export enum GameState {
  LANGUAGE_SELECTION,
  WELCOME,
  CATEGORY_SELECTION,
  LOADING,
  GAME,
  GAME_OVER,
  ERROR,
}

export interface Question {
  question: string;
  choices: string[];
  correctChoiceIndex: number;
  feedback: string[];
}

export interface Scenario {
  imageUrl: string;
  questionData: Question;
}

export interface Category {
  key: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
}

export interface GameHistoryItem {
  question: string;
  userChoice: string;
  correctChoice: string;
  isCorrect: boolean;
}

// --- APP CONTEXT ---
interface AppContextType {
  language: Language;
  t: (key: string) => string;
  changeLanguage: () => void;
  level: number;
  currentXp: number;
  xpToNextLevel: number;
  setLevel: React.Dispatch<React.SetStateAction<number>>;
  setCurrentXp: React.Dispatch<React.SetStateAction<number>>;
}
export const AppContext = createContext<AppContextType | null>(null);

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error("useAppContext must be used within an AppProvider");
    }
    return context;
};
