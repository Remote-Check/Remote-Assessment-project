import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AssessmentLayout } from '../AssessmentLayout';

interface Props {
  onComplete: (data: any) => void;
}

export const OrientationTask: React.FC<Props> = ({ onComplete }) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    date: '',
    month: '',
    year: '',
    day: '',
    place: '',
    city: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const isComplete = Object.values(formData).every(val => val.trim() !== '');

  return (
    <AssessmentLayout
      title={t('orientation_task.title')}
      onNext={() => onComplete(formData)}
      isLastStep={true}
      nextDisabled={!isComplete}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '600px', margin: '0 auto' }}>
        <p style={{ fontSize: '1.2rem', fontWeight: 600 }}>{t('orientation_task.instr')}</p>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label htmlFor="date">{t('orientation_task.date')}</label>
            <input
              type="text"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              style={{ padding: '12px', fontSize: '1.2rem', border: '2px solid var(--border-color)', borderRadius: '8px' }}
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label htmlFor="month">{t('orientation_task.month')}</label>
            <input
              type="text"
              id="month"
              name="month"
              value={formData.month}
              onChange={handleChange}
              style={{ padding: '12px', fontSize: '1.2rem', border: '2px solid var(--border-color)', borderRadius: '8px' }}
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label htmlFor="year">{t('orientation_task.year')}</label>
            <input
              type="text"
              id="year"
              name="year"
              value={formData.year}
              onChange={handleChange}
              style={{ padding: '12px', fontSize: '1.2rem', border: '2px solid var(--border-color)', borderRadius: '8px' }}
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label htmlFor="day">{t('orientation_task.day')}</label>
            <input
              type="text"
              id="day"
              name="day"
              value={formData.day}
              onChange={handleChange}
              style={{ padding: '12px', fontSize: '1.2rem', border: '2px solid var(--border-color)', borderRadius: '8px' }}
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label htmlFor="place">{t('orientation_task.place')}</label>
            <input
              type="text"
              id="place"
              name="place"
              value={formData.place}
              onChange={handleChange}
              style={{ padding: '12px', fontSize: '1.2rem', border: '2px solid var(--border-color)', borderRadius: '8px' }}
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label htmlFor="city">{t('orientation_task.city')}</label>
            <input
              type="text"
              id="city"
              name="city"
              value={formData.city}
              onChange={handleChange}
              style={{ padding: '12px', fontSize: '1.2rem', border: '2px solid var(--border-color)', borderRadius: '8px' }}
            />
          </div>
        </div>
      </div>
    </AssessmentLayout>
  );
};
