import React from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { BrandMark } from './layout/BrandMark';
import { BigButton } from './layout/BigButton';

interface Props {
  title: string;
  subtitle?: string;
  progress?: number;
  step?: number;
  totalSteps?: number;
  onBack?: () => void;
  onNext: () => void;
  nextLabel?: string;
  backLabel?: string;
  nextDisabled?: boolean;
  hideBack?: boolean;
  isLastStep?: boolean; // Keep for compatibility
  children: React.ReactNode;
}

export const AssessmentLayout: React.FC<Props> = ({
  title,
  subtitle,
  progress,
  step,
  totalSteps,
  onBack,
  onNext,
  nextLabel,
  backLabel,
  nextDisabled,
  hideBack,
  isLastStep,
  children,
}) => {
  const { t } = useTranslation();

  const finalNextLabel = nextLabel || (isLastStep ? t('common.finish') : t('common.next'));
  const finalBackLabel = backLabel || t('common.back');

  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      minHeight: '100vh', background: 'var(--bg-color)',
    }}>
      {/* HEADER */}
      <header style={{
        padding: '20px 40px',
        borderBottom: '1px solid var(--border-color)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        gap: 32, background: '#fff',
      }}>
        <BrandMark />
        <div style={{ flex: 1, textAlign: 'center' }}>
          <div style={{ fontSize: 'var(--fs-lg)', fontWeight: 700, letterSpacing: '-0.01em', color: 'var(--text-color)' }}>
            {title}
          </div>
          {subtitle && (
            <div style={{ fontSize: 15, color: 'var(--ink-500)', marginTop: 2 }}>{subtitle}</div>
          )}
        </div>
        <div style={{ minWidth: 160, textAlign: 'left', direction: 'ltr' }}>
          {step != null && totalSteps != null && (
            <div style={{
              fontSize: 15, color: 'var(--ink-500)',
              fontVariantNumeric: 'tabular-nums',
            }}>
              שלב {step} מתוך {totalSteps}
            </div>
          )}
        </div>
      </header>

      {/* PROGRESS BAR */}
      {progress != null && (
        <div style={{ height: 4, background: 'var(--ink-100)', position: 'relative' }}>
          <div style={{
            position: 'absolute', top: 0, right: 0, height: '100%',
            width: `${progress * 100}%`,
            background: 'var(--primary-color)',
            transition: 'width var(--dur-slow) var(--ease)',
          }}/>
        </div>
      )}

      {/* MAIN */}
      <main style={{ flex: 1, padding: '48px 40px', overflow: 'auto' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', width: '100%' }}>
          {children}
        </div>
      </main>

      {/* FOOTER */}
      <footer style={{
        padding: '20px 40px',
        borderTop: '1px solid var(--border-color)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        gap: 24, background: '#fff',
      }}>
        {!hideBack && onBack ? (
          <BigButton variant="secondary" onClick={onBack} icon={<ArrowRight size={24}/>}>
            {finalBackLabel}
          </BigButton>
        ) : <div/>}
        <BigButton variant="primary" onClick={onNext} disabled={nextDisabled}
                   iconEnd={<ArrowLeft size={24}/>}>
          {finalNextLabel}
        </BigButton>
      </footer>
    </div>
  );
};
