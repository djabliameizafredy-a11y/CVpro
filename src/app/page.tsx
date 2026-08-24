'use client';

import React, { useSyncExternalStore } from 'react';
import { Landing } from '@/components/cv/Landing';
import { CvBuilderApp } from '@/components/cv/CvBuilderApp';

const STARTED_KEY = 'cv_builder_started_v1';
const STARTED_EVENT = 'cv-started-change';

function subscribeStarted(cb: () => void) {
  window.addEventListener(STARTED_EVENT, cb);
  window.addEventListener('storage', cb);
  return () => {
    window.removeEventListener(STARTED_EVENT, cb);
    window.removeEventListener('storage', cb);
  };
}

function getStartedSnapshot(): boolean {
  try {
    return localStorage.getItem(STARTED_KEY) === '1';
  } catch {
    return false;
  }
}

function getStartedServerSnapshot(): boolean {
  return false;
}

export default function Home() {
  const started = useSyncExternalStore(subscribeStarted, getStartedSnapshot, getStartedServerSnapshot);

  const handleStart = () => {
    try {
      localStorage.setItem(STARTED_KEY, '1');
    } catch {
      // ignore
    }
    window.dispatchEvent(new Event(STARTED_EVENT));
    window.scrollTo({ top: 0, behavior: 'auto' });
  };

  const handleBackHome = () => {
    try {
      localStorage.removeItem(STARTED_KEY);
    } catch {
      // ignore
    }
    window.dispatchEvent(new Event(STARTED_EVENT));
    window.scrollTo({ top: 0, behavior: 'auto' });
  };

  return started ? <CvBuilderApp onBackHome={handleBackHome} /> : <Landing onStart={handleStart} />;
}
