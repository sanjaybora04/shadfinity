'use client'
import dynamic from 'next/dynamic';
import ErrorBoundary from './errorboundary';

// Dynamically import the client-side component with `ssr: false`
const ClientSideComponent = dynamic(() => import('./tts-widgit'), {
  ssr: false, // Ensures the component is only loaded on the client side
});

export default function TTSWidgit(){
  return (
      <ErrorBoundary>
        <ClientSideComponent />
      </ErrorBoundary>
  );
};
