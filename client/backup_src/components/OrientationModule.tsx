import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AssessmentLayout } from './AssessmentLayout';
import '../styles/orientation.css';

interface Props {
  onComplete: () => void;
}

export const OrientationModule: React.FC<Props> = ({ onComplete }) => {
  const { t } = useTranslation();
  const [step, setStep] = useState(1);

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      onComplete();
    }
  };

  const handleBack = step > 1 ? () => setStep(step - 1) : undefined;

  return (
    <AssessmentLayout
      title={t('orientation.title')}
      onNext={handleNext}
      onBack={handleBack}
      isLastStep={step === 3}
    >
      <div className="instruction-box">
        {step === 1 && (
          <>
            <p>{t('orientation.step1_welcome')}</p>
            <p>{t('orientation.step1_instruction')}</p>
          </>
        )}
        {step === 2 && (
          <>
            <p>{t('orientation.step2_navigation')}</p>
            <p>{t('orientation.step2_back')}</p>
          </>
        )}
        {step === 3 && (
          <p>{t('orientation.ready_to_start')}</p>
        )}
      </div>
    </AssessmentLayout>
  );
};
