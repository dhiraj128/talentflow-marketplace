"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Clock, AlertTriangle } from "lucide-react";
import { QuizResults } from "./QuizResults";

export function QuizPlayer({ courseId }: { courseId: string }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [isFinished, setIsFinished] = useState(false);

  const questions = [
    {
      id: 1,
      text: "Which of the following is NOT a hook introduced in React 16.8?",
      options: [
        { id: "A", text: "useState" },
        { id: "B", text: "useLifecycle" },
        { id: "C", text: "useEffect" },
        { id: "D", text: "useContext" }
      ],
      correctAnswer: "B"
    },
    {
      id: 2,
      text: "What is the primary purpose of Server Components in modern React?",
      options: [
        { id: "A", text: "To replace all client-side state" },
        { id: "B", text: "To reduce client-side JavaScript bundle size and improve SEO" },
        { id: "C", text: "To make CSS styling easier" },
        { id: "D", text: "To handle user inputs more efficiently" }
      ],
      correctAnswer: "B"
    }
  ];

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setIsFinished(true);
    }
  };

  const handlePrev = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  if (isFinished) {
    // Calculate score
    const score = Object.keys(answers).reduce((acc, key) => {
      const qIndex = parseInt(key);
      if (answers[qIndex] === questions[qIndex].correctAnswer) return acc + 1;
      return acc;
    }, 0);
    
    return (
      <QuizResults 
        score={score} 
        totalQuestions={questions.length} 
        passingScore={80} 
        courseId={courseId} 
      />
    );
  }

  const q = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="max-w-3xl mx-auto py-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Mid-Term Assessment</h2>
        <div className="flex items-center gap-2 text-indigo-600 font-bold bg-indigo-50 dark:bg-indigo-900/30 px-4 py-2 rounded-lg">
          <Clock className="w-5 h-5" /> 42:15
        </div>
      </div>

      <div className="mb-8 space-y-2">
        <div className="flex justify-between text-sm font-medium">
          <span>Question {currentQuestion + 1} of {questions.length}</span>
          <span>{Math.round(progress)}% Completed</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <div className="bg-card border border-border/60 rounded-xl p-6 md:p-8 shadow-sm mb-6">
        <h3 className="text-xl font-medium mb-6 leading-relaxed">{q.text}</h3>
        
        <RadioGroup 
          value={answers[currentQuestion]} 
          onValueChange={(val) => setAnswers({ ...answers, [currentQuestion]: val })}
          className="space-y-4"
        >
          {q.options.map((opt) => (
            <div key={opt.id} className={`flex items-center space-x-3 border rounded-lg p-4 cursor-pointer transition-colors ${answers[currentQuestion] === opt.id ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-900/20' : 'border-border/60 hover:bg-muted/50'}`}>
              <RadioGroupItem value={opt.id} id={`opt-${opt.id}`} />
              <Label htmlFor={`opt-${opt.id}`} className="flex-1 cursor-pointer font-normal text-base">
                {opt.text}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      <div className="flex justify-between items-center">
        <Button variant="outline" onClick={handlePrev} disabled={currentQuestion === 0}>
          Previous
        </Button>
        
        <Button 
          onClick={handleNext} 
          disabled={!answers[currentQuestion]}
          className={currentQuestion === questions.length - 1 ? "bg-green-600 hover:bg-green-700" : "bg-indigo-600 hover:bg-indigo-700"}
        >
          {currentQuestion === questions.length - 1 ? "Submit Assessment" : "Next Question"}
        </Button>
      </div>
    </div>
  );
}
