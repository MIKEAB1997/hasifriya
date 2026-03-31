
import React, { useState } from 'react';
import { CheckCircle2, XCircle, BrainCircuit, RefreshCcw } from 'lucide-react';
import { QuizQuestion } from '../types';

interface QuizProps {
  questions: QuizQuestion[];
}

const Quiz: React.FC<QuizProps> = ({ questions }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);

  const handleSelect = (index: number) => {
    if (isAnswered) return;
    setSelectedAnswer(index);
    setIsAnswered(true);
    if (index === questions[currentQuestion].correctAnswer) {
      setScore(s => s + 1);
    }
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(q => q + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    } else {
      setShowResults(true);
    }
  };

  const restartQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setScore(0);
    setShowResults(false);
  };

  if (showResults) {
    const pct = Math.round((score / questions.length) * 100);
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center animate-fade-in">
        <div className="w-28 h-28 bg-primary/10 border border-primary/20 rounded-full flex items-center justify-center mb-8">
          <BrainCircuit className="w-14 h-14 text-primary" />
        </div>
        <h3 className="text-4xl font-black text-gray-900 mb-4 tracking-tight">סיימת את התרגול!</h3>
        <p className="text-xl text-gray-600 mb-3 font-medium">
          ענית נכונה על{' '}
          <span className="text-primary font-bold">{score}</span>
          {' '}מתוך{' '}
          <span className="text-gray-900 font-bold">{questions.length}</span>
          {' '}שאלות
        </p>
        <p className="text-gray-400 text-lg mb-10">{pct}% הצלחה</p>
        <button
          onClick={restartQuiz}
          className="flex items-center gap-3 bg-primary hover:bg-primary-dark text-white px-8 py-4 rounded-2xl font-bold transition-all shadow-lg shadow-primary/20 hover:-translate-y-0.5 text-lg"
        >
          <RefreshCcw className="w-5 h-5" />
          תרגל שוב
        </button>
      </div>
    );
  }

  const question = questions[currentQuestion];

  return (
    <div className="max-w-3xl mx-auto w-full p-6 sm:p-8 h-full flex flex-col">
      <div className="flex items-center justify-between mb-7">
        <h3 className="text-xl font-bold text-gray-900 flex items-center gap-3">
          <div className="bg-primary/10 border border-primary/20 p-2.5 rounded-xl">
            <BrainCircuit className="text-primary w-5 h-5" />
          </div>
          בדיקת ידע
        </h3>
        <span className="text-sm font-bold text-gray-500 bg-surface-light border border-gray-200 px-4 py-2 rounded-xl">
          שאלה {currentQuestion + 1} מתוך {questions.length}
        </span>
      </div>

      {/* Progress dots */}
      <div className="flex gap-1.5 mb-7">
        {questions.map((_, idx) => (
          <div
            key={idx}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              idx < currentQuestion ? 'bg-primary' :
              idx === currentQuestion ? 'bg-primary/60 flex-grow' : 'bg-gray-200'
            }`}
            style={{ width: idx === currentQuestion ? undefined : '24px' }}
          />
        ))}
      </div>

      {/* Question Card */}
      <div className="bg-surface-light border border-gray-200 rounded-[1.5rem] p-7 sm:p-8 shadow-sm mb-7">
        <h4 className="text-xl text-gray-900 font-bold mb-7 leading-snug">
          {question.question}
        </h4>

        <div className="space-y-3">
          {question.options.map((option, index) => {
            let btnClass = 'w-full text-right p-4 rounded-2xl border-2 transition-all duration-200 text-base font-medium ';

            if (!isAnswered) {
              btnClass += 'border-gray-200 bg-white hover:border-primary/50 hover:bg-primary/5 text-gray-800 cursor-pointer';
            } else {
              if (index === question.correctAnswer) {
                btnClass += 'border-emerald-500/70 bg-emerald-50 text-emerald-800 font-bold';
              } else if (index === selectedAnswer) {
                btnClass += 'border-red-500/70 bg-red-50 text-red-800 font-bold';
              } else {
                btnClass += 'border-gray-100 bg-gray-50 text-gray-400 opacity-60';
              }
            }

            return (
              <button
                key={index}
                onClick={() => handleSelect(index)}
                disabled={isAnswered}
                className={btnClass}
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="text-right flex-1">{option}</span>
                  {isAnswered && index === question.correctAnswer && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-none" />
                  )}
                  {isAnswered && index === selectedAnswer && index !== question.correctAnswer && (
                    <XCircle className="w-5 h-5 text-red-500 flex-none" />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Explanation */}
      {isAnswered && (
        <div className={`p-5 rounded-2xl mb-7 animate-fade-in border ${
          selectedAnswer === question.correctAnswer
            ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
            : 'bg-surface-light border-gray-200 text-gray-700'
        }`}>
          <p className="font-bold text-base mb-1.5">
            {selectedAnswer === question.correctAnswer ? 'תשובה נכונה!' : 'הסבר:'}
          </p>
          <p className="text-base leading-relaxed opacity-90">{question.explanation}</p>
        </div>
      )}

      {isAnswered && (
        <div className="flex justify-end animate-fade-in">
          <button
            onClick={nextQuestion}
            className="bg-primary hover:bg-primary-dark text-white px-8 py-3.5 rounded-2xl font-bold transition-all shadow-md hover:-translate-y-0.5 text-base"
          >
            {currentQuestion < questions.length - 1 ? 'לשאלה הבאה' : 'סיום תרגול'}
          </button>
        </div>
      )}
    </div>
  );
};

export default Quiz;
