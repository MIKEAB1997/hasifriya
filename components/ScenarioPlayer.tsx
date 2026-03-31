
import React, { useState } from 'react';
import { CheckCircle2, XCircle, ChevronLeft, ShieldAlert, Mail, Phone, Usb, Wifi, Eye, X } from 'lucide-react';
import { Scenario } from '../types';

interface ScenarioPlayerProps {
  scenario: Scenario;
  onClose: () => void;
}

const ScenarioPlayer: React.FC<ScenarioPlayerProps> = ({ scenario, onClose }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isFinished, setIsFinished] = useState(false);

  const step = scenario.steps[currentStepIndex];
  const isCorrect = selectedOption === step.correctOptionIndex;

  const handleOptionClick = (index: number) => {
    if (selectedOption !== null) return;
    setSelectedOption(index);
  };

  const handleNext = () => {
    if (currentStepIndex < scenario.steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
      setSelectedOption(null);
    } else {
      setIsFinished(true);
    }
  };

  const getIcon = (iconName: string) => {
    const cls = 'w-7 h-7';
    switch (iconName) {
      case 'mail': return <Mail className={cls} />;
      case 'phone': return <Phone className={cls} />;
      case 'usb': return <Usb className={cls} />;
      case 'wifi': return <Wifi className={cls} />;
      case 'eye': return <Eye className={cls} />;
      default: return <ShieldAlert className={cls} />;
    }
  };

  if (isFinished) {
    return (
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xl" dir="rtl">
        <div className="bg-white rounded-[2rem] w-full max-w-lg p-10 text-center shadow-2xl relative overflow-hidden border border-gray-200 animate-scale-in">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-blue-400" />
          <div className="w-24 h-24 bg-primary/10 border border-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-12 h-12 text-primary" />
          </div>
          <h2 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">כל הכבוד!</h2>
          <p className="text-lg text-gray-600 mb-8 font-medium leading-relaxed">
            סיימתם את התרחיש "{scenario.title}" בהצלחה.<br />
            אתם מוכנים יותר להתמודד עם איומי סייבר בעולם האמיתי.
          </p>
          <button
            onClick={onClose}
            className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-primary/20 hover:-translate-y-0.5"
          >
            חזרה למסך הראשי
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xl" dir="rtl">
      <div className="bg-white rounded-[2rem] w-full max-w-2xl flex flex-col shadow-2xl overflow-hidden border border-gray-200 animate-scale-in">

        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-surface-light">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary/10 border border-primary/20 rounded-2xl flex items-center justify-center text-primary">
              {getIcon(scenario.icon)}
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{scenario.title}</h2>
              <p className="text-sm text-gray-500 font-medium mt-0.5">
                שלב {currentStepIndex + 1} מתוך {scenario.steps.length}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2.5 text-gray-400 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-100 h-1">
          <div
            className="bg-primary h-1 transition-all duration-500"
            style={{ width: `${(currentStepIndex / scenario.steps.length) * 100}%` }}
          />
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 flex-grow overflow-y-auto custom-scroll max-h-[70vh]">
          {/* Context */}
          <div className="bg-surface-light border border-gray-200 rounded-2xl p-5 mb-7 text-gray-700 text-base leading-relaxed">
            {step.context}
          </div>

          <h3 className="text-xl font-bold text-gray-900 mb-5 leading-snug">{step.question}</h3>

          {/* Options */}
          <div className="space-y-3">
            {step.options.map((option, idx) => {
              let cls = 'w-full text-right p-4 rounded-2xl border-2 transition-all duration-200 text-base font-medium cursor-pointer ';

              if (selectedOption === null) {
                cls += 'border-gray-200 bg-white hover:border-primary/50 hover:bg-primary/5 text-gray-800';
              } else if (idx === step.correctOptionIndex) {
                cls += 'border-emerald-500/70 bg-emerald-50 text-emerald-800 font-bold';
              } else if (idx === selectedOption) {
                cls += 'border-red-500/70 bg-red-50 text-red-800 font-bold';
              } else {
                cls += 'border-gray-100 bg-gray-50 text-gray-400 opacity-50';
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleOptionClick(idx)}
                  disabled={selectedOption !== null}
                  className={cls}
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-right flex-1">{option}</span>
                    {selectedOption !== null && idx === step.correctOptionIndex && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-none" />
                    )}
                    {selectedOption === idx && idx !== step.correctOptionIndex && (
                      <XCircle className="w-5 h-5 text-red-500 flex-none" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Feedback */}
          {selectedOption !== null && (
            <div className={`mt-6 p-5 rounded-2xl border animate-fade-in ${
              isCorrect
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                : 'bg-red-50 border-red-200 text-red-800'
            }`}>
              <h4 className="font-bold text-lg mb-2 flex items-center gap-2">
                {isCorrect
                  ? <><CheckCircle2 className="w-5 h-5 text-emerald-600" /> תשובה נכונה!</>
                  : <><XCircle className="w-5 h-5 text-red-500" /> טעות, אבל מטעויות לומדים!</>
                }
              </h4>
              <p className="leading-relaxed text-base opacity-90">{step.explanation}</p>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={handleNext}
                  className={`flex items-center gap-2 px-7 py-3 rounded-xl font-bold transition-all shadow-md hover:-translate-y-0.5 ${
                    isCorrect
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                      : 'bg-primary hover:bg-primary-dark text-white'
                  }`}
                >
                  {currentStepIndex < scenario.steps.length - 1 ? 'לשלב הבא' : 'סיום תרחיש'}
                  <ChevronLeft className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScenarioPlayer;
