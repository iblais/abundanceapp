/**
 * Abundance Recode - Ultra Enhanced Version
 * Main entry point that loads the App component
 */

import dynamic from 'next/dynamic';

// Dynamic import to avoid SSR issues with Firebase
const App = dynamic(() => import('../components/App'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-purple-600 flex items-center justify-center mx-auto mb-4 animate-pulse">
          <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
          </svg>
        </div>
        <p className="text-gray-400">Loading your abundance...</p>
      </div>
    </div>
  ),
});

export default function Home() {
  return <App />;
}
