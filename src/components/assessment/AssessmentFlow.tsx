'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Check } from 'lucide-react';
import MouseControlTest from './MouseControlTest';
import FlickTest from './FlickTest';
import ReactionTest from './ReactionTest';
import ErgonomicsForm from './ErgonomicsForm';
import Report from './Report';
import { addAssessment, getAssessments } from '@/lib/storage';

type Step = 'intro' | 'mouse' | 'left' | 'right' | 'reaction' | 'ergo' | 'report';
const STEPS: Step[] = ['mouse', 'left', 'right', 'reaction', 'ergo'];

export default function AssessmentFlow() {
  const t = useTranslations('assessment');
  const [step, setStep] = useState<Step>('intro');
  const [scores, setScores] = useState({
    mouseControl: 0,
    leftPrecision: 0,
    rightPrecision: 0,
    ergonomics: 0,
    reaction: 0,
    reactionMs: 0,
  });
  const [history, setHistory] = useState(getAssessments);

  const stepIndex = STEPS.indexOf(step);

  const complete = (key: keyof typeof scores, value: number, next: Step, extra?: Partial<typeof scores>) => {
    const updated = { ...scores, [key]: value, ...extra };
    setScores(updated);
    if (next === 'report') {
      addAssessment(updated);
      setHistory(getAssessments());
    }
    setStep(next);
  };

  const restart = () => {
    setScores({ mouseControl: 0, leftPrecision: 0, rightPrecision: 0, ergonomics: 0, reaction: 0, reactionMs: 0 });
    setStep('intro');
  };

  if (step === 'intro') {
    return (
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {(['mouse_control', 'left_precision', 'right_precision', 'reaction', 'ergonomics'] as const).map((d, i) => (
            <div key={d} className="border border-neutral-800 rounded-lg p-4 text-center space-y-2">
              <span className="text-[#8B0000] font-bold text-lg">{String(i + 1).padStart(2, '0')}</span>
              <p className="text-sm text-neutral-300">{t(`dimensions.${d}`)}</p>
            </div>
          ))}
        </div>
        <div className="border border-neutral-800 rounded-lg p-6 text-sm text-neutral-400 space-y-2 leading-relaxed">
          <p>· {t('intro.tip1')}</p>
          <p>· {t('intro.tip2')}</p>
          <p>· {t('intro.tip3')}</p>
        </div>
        <div className="text-center">
          <button
            onClick={() => setStep('mouse')}
            className="px-12 py-4 bg-[#8B0000] hover:bg-[#A52A2A] rounded font-medium text-lg transition-colors"
          >
            {t('start')}
          </button>
          <p className="mt-3 text-xs text-neutral-600">{t('intro.free')}</p>
        </div>
      </div>
    );
  }

  if (step === 'report') {
    return (
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-10">{t('report.title')}</h2>
        <Report scores={scores} history={history} onRestart={restart} />
      </div>
    );
  }

  const stepTitles: Record<string, string> = {
    mouse: t('dimensions.mouse_control'),
    left: t('dimensions.left_precision'),
    right: t('dimensions.right_precision'),
    reaction: t('dimensions.reaction'),
    ergo: t('dimensions.ergonomics'),
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* 进度 */}
      <div className="flex items-center gap-2">
        {STEPS.map((s, i) => (
          <div key={s} className="flex-1 flex items-center gap-2">
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs shrink-0 ${
                i < stepIndex
                  ? 'bg-[#B8860B] text-black'
                  : i === stepIndex
                  ? 'bg-[#8B0000] text-white'
                  : 'bg-neutral-800 text-neutral-500'
              }`}
            >
              {i < stepIndex ? <Check className="w-4 h-4" /> : i + 1}
            </div>
            {i < STEPS.length - 1 && <div className={`h-px flex-1 ${i < stepIndex ? 'bg-[#B8860B]' : 'bg-neutral-800'}`} />}
          </div>
        ))}
      </div>

      <h2 className="text-2xl font-bold">{stepTitles[step]}</h2>

      {step === 'mouse' && (
        <MouseControlTest onDone={(s) => complete('mouseControl', s, 'left')} />
      )}
      {step === 'left' && (
        <FlickTest direction="left" onDone={(s) => complete('leftPrecision', s, 'right')} />
      )}
      {step === 'right' && (
        <FlickTest direction="right" onDone={(s) => complete('rightPrecision', s, 'reaction')} />
      )}
      {step === 'reaction' && (
        <ReactionTest onDone={(s, ms) => complete('reaction', s, 'ergo', { reactionMs: ms })} />
      )}
      {step === 'ergo' && (
        <ErgonomicsForm onDone={(s) => complete('ergonomics', s, 'report')} />
      )}
    </div>
  );
}
