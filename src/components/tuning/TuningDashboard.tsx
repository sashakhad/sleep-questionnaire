'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { BatchRunner } from '@/components/tuning/BatchRunner';
import { DecisionTreeView } from '@/components/tuning/DecisionTreeView';
import { PatientProfileInput } from '@/components/tuning/PatientProfileInput';
import { TuningWalkthrough } from '@/components/tuning/TuningWalkthrough';
import { defaultReviewScenario } from '@/lib/diagnosis-scenarios';
import {
  decodeEDSWeightOverrides,
  decodeThresholdOverrides,
  encodeEDSWeightOverrides,
  encodeThresholdOverrides,
  getTuningScenarioData,
  type TuningBatchScenarioResult,
  type TuningDiagnoseRequest,
  type TuningMode,
} from '@/lib/diagnosis-tuning';
import type { FullReportResult } from '@/lib/diagnosis-report-types';
import type {
  EDSWeightKey,
  EDSWeightsConfig,
  ThresholdConfig,
  ThresholdKey,
} from '@/lib/diagnosis-shared';

interface BatchResponseBody {
  results: TuningBatchScenarioResult[];
}

function getErrorMessage(responseBody: unknown, fallbackMessage: string): string {
  if (
    responseBody &&
    typeof responseBody === 'object' &&
    'error' in responseBody &&
    typeof responseBody.error === 'string'
  ) {
    return responseBody.error;
  }
  return fallbackMessage;
}

function isFullReportResult(responseBody: unknown): responseBody is FullReportResult {
  return (
    !!responseBody &&
    typeof responseBody === 'object' &&
    'metrics' in responseBody &&
    'avgWeeklySleep' in responseBody
  );
}

function isBatchResponseBody(responseBody: unknown): responseBody is BatchResponseBody {
  return (
    !!responseBody &&
    typeof responseBody === 'object' &&
    'results' in responseBody &&
    Array.isArray(responseBody.results)
  );
}

function updateNumericOverrideState<TKey extends string>(
  currentState: Partial<Record<TKey, number>>,
  key: TKey,
  value: number | null
): Partial<Record<TKey, number>> {
  const nextState = { ...currentState };
  if (value === null) {
    delete nextState[key];
    return nextState;
  }
  nextState[key] = value;
  return nextState;
}

export function TuningDashboard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialScenarioId = searchParams.get('scenario') ?? defaultReviewScenario.id;
  const initialMode = searchParams.get('mode') === 'custom' ? 'custom' : 'scenario';
  const [selectedScenarioId, setSelectedScenarioId] = useState(initialScenarioId);
  const [mode, setMode] = useState<TuningMode>(initialMode);
  const [thresholdOverrides, setThresholdOverrides] = useState<Partial<ThresholdConfig>>(() =>
    decodeThresholdOverrides(searchParams.get('thresholds'))
  );
  const [edsWeightOverrides, setEDSWeightOverrides] = useState<Partial<EDSWeightsConfig>>(() =>
    decodeEDSWeightOverrides(searchParams.get('weights'))
  );
  const [customData, setCustomData] = useState(() => getTuningScenarioData(initialScenarioId));
  const [isCustomProfileValid, setIsCustomProfileValid] = useState(true);
  const [report, setReport] = useState<FullReportResult | null>(null);
  const [reportLoading, setReportLoading] = useState(false);
  const [reportError, setReportError] = useState<string | null>(null);
  const [batchResults, setBatchResults] = useState<TuningBatchScenarioResult[] | null>(null);
  const [batchLoading, setBatchLoading] = useState(false);
  const [batchError, setBatchError] = useState<string | null>(null);
  const activeScenarioData = useMemo(() => getTuningScenarioData(selectedScenarioId), [selectedScenarioId]);
  const activeInputData = mode === 'scenario' ? activeScenarioData : customData;
  const hasOverrides =
    Object.keys(thresholdOverrides).length > 0 || Object.keys(edsWeightOverrides).length > 0;

  useEffect(() => {
    const nextParams = new URLSearchParams();
    nextParams.set('scenario', selectedScenarioId);

    if (mode === 'custom') {
      nextParams.set('mode', mode);
    }

    const encodedThresholds = encodeThresholdOverrides(thresholdOverrides);
    const encodedWeights = encodeEDSWeightOverrides(edsWeightOverrides);

    if (encodedThresholds) {
      nextParams.set('thresholds', encodedThresholds);
    }

    if (encodedWeights) {
      nextParams.set('weights', encodedWeights);
    }

    const nextQuery = nextParams.toString();
    const currentQuery = searchParams.toString();

    if (nextQuery === currentQuery) {
      return;
    }

    router.replace(nextQuery ? `/tuning?${nextQuery}` : '/tuning', { scroll: false });
  }, [edsWeightOverrides, mode, router, searchParams, selectedScenarioId, thresholdOverrides]);

  useEffect(() => {
    if (mode === 'custom' && !isCustomProfileValid) {
      setReportError('Fix the custom profile validation errors to rerun the algorithm.');
      setReportLoading(false);
      return;
    }

    const abortController = new AbortController();
    const timeoutId = window.setTimeout(async () => {
      try {
        setReportLoading(true);
        setReportError(null);

        const payload: TuningDiagnoseRequest = {
          data: activeInputData,
          thresholdOverrides,
          edsWeightOverrides,
        };

        const response = await fetch('/api/tuning/diagnose', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
          signal: abortController.signal,
        });

        const responseBody: unknown = await response.json().catch(() => null);
        if (!response.ok) {
          throw new Error(getErrorMessage(responseBody, 'Failed to generate tuning diagnosis'));
        }

        if (!isFullReportResult(responseBody)) {
          throw new Error('Unexpected tuning diagnosis response');
        }

        setReport(responseBody);
      } catch (error) {
        if (abortController.signal.aborted) {
          return;
        }
        setReportError(error instanceof Error ? error.message : 'Failed to generate tuning diagnosis');
      } finally {
        if (!abortController.signal.aborted) {
          setReportLoading(false);
        }
      }
    }, 300);

    return () => {
      abortController.abort();
      window.clearTimeout(timeoutId);
    };
  }, [activeInputData, edsWeightOverrides, isCustomProfileValid, mode, thresholdOverrides]);

  function handleThresholdChange(key: ThresholdKey, value: number | null) {
    setThresholdOverrides(currentState => updateNumericOverrideState(currentState, key, value));
  }

  function handleEDSWeightChange(key: EDSWeightKey, value: number | null) {
    setEDSWeightOverrides(currentState => updateNumericOverrideState(currentState, key, value));
  }

  function handleResetAll() {
    setThresholdOverrides({});
    setEDSWeightOverrides({});
  }

  async function handleRunAllScenarios() {
    try {
      setBatchLoading(true);
      setBatchError(null);

      const response = await fetch('/api/tuning/batch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          thresholdOverrides,
          edsWeightOverrides,
        }),
      });

      const responseBody: unknown = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(getErrorMessage(responseBody, 'Failed to generate batch tuning results'));
      }

      if (!isBatchResponseBody(responseBody)) {
        throw new Error('Unexpected tuning batch response');
      }

      setBatchResults(responseBody.results);
    } catch (error) {
      setBatchError(error instanceof Error ? error.message : 'Failed to generate batch tuning results');
    } finally {
      setBatchLoading(false);
    }
  }

  return (
    <div className='mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-6 lg:px-6'>
      <div className='space-y-2'>
        <p className='text-primary text-sm font-semibold tracking-wide uppercase'>
          Clinical Tuning
        </p>
        <h1 className='text-3xl font-bold tracking-tight'>Algorithm Tuning Dashboard</h1>
      </div>

      <TuningWalkthrough />

      <PatientProfileInput
        mode={mode}
        selectedScenarioId={selectedScenarioId}
        onModeChange={setMode}
        onScenarioChange={setSelectedScenarioId}
        onCustomDataChange={setCustomData}
        onCustomValidityChange={setIsCustomProfileValid}
      />

      <DecisionTreeView
        report={report}
        loading={reportLoading}
        error={reportError}
        thresholdOverrides={thresholdOverrides}
        edsWeightOverrides={edsWeightOverrides}
        onThresholdChange={handleThresholdChange}
        onEDSWeightChange={handleEDSWeightChange}
        onResetAll={handleResetAll}
      />

      <BatchRunner
        results={batchResults}
        loading={batchLoading}
        error={batchError}
        hasOverrides={hasOverrides}
        onRunAllScenarios={handleRunAllScenarios}
      />
    </div>
  );
}
