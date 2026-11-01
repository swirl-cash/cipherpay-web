'use client';

import { useTranslations } from 'next-intl';
import { LogoMark } from '@/components/Logo';
import { AnimatedSection, StaggerChildren, StaggerItem } from '@/components/AnimatedSection';

const LAYERS = [
  {
    key: 'online' as const,
    num: '01',
    tech: 'BOLT12 OFFERS · ONION MESSAGES',
  },
  {
    key: 'inPerson' as const,
    num: '02',
    tech: 'BLINDED PATHS · 3 HOPS',
  },
  {
    key: 'agents' as const,
    num: '03',
    tech: 'SUBMARINE SWAPS · LOOP-OUT',
  },
] as const;

export function UseCasesSection() {
  const t = useTranslations('landing.useCases');

  return (
    <section id="use-cases" style={{ borderTop: '1px solid var(--cp-border)', padding: '80px 24px' }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <AnimatedSection>
          <div
            className="section-title"
            style={{
              textAlign: 'center',
              marginBottom: 8,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
            }}
          >
            <LogoMark size={8} /> {t('title')}
          </div>
          <h2 style={{ fontSize: 24, fontWeight: 700, textAlign: 'center', marginBottom: 12 }}>
            {t('subtitle')}
          </h2>
          <p style={{ fontSize: 12, color: 'var(--cp-text-muted)', textAlign: 'center', maxWidth: 520, margin: '0 auto 48px', lineHeight: 1.8 }}>
            {t('intro')}
          </p>
        </AnimatedSection>

        <StaggerChildren className="steps-grid">
          {LAYERS.map((layer) => (
            <StaggerItem key={layer.key} className="step-col">
              <div className="step-header">
                <div className="step-title">
                  <span style={{ color: 'var(--cp-cyan)', marginRight: 8 }}>{layer.num}</span>
                  {t(`${layer.key}Title`)}
                </div>
                <div className="step-desc">{t(`${layer.key}Desc`)}</div>
              </div>
              <div className="step-preview" aria-hidden="true">
                <div className="step-preview-bar">
                  <span style={{ fontSize: 7, color: 'var(--cp-cyan)', fontWeight: 700, letterSpacing: 1 }}>
                    LAYER {layer.num}
                  </span>
                  <span style={{ fontSize: 7, color: 'var(--cp-text-dim)', letterSpacing: 1 }}>ACTIVE</span>
                </div>
                <div style={{ padding: '14px 12px', display: 'flex', alignItems: 'center', minHeight: 56 }}>
                  <code style={{ fontSize: 9, letterSpacing: 1, color: 'var(--cp-text-muted)' }}>
                    {layer.tech}
                  </code>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerChildren>
      </div>
    </section>
  );
}
