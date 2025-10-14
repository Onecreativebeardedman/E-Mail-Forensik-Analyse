import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { FileUpload } from './components/FileUpload';
import { CaseDetails } from './components/CaseDetails';
import { Loader } from './components/Loader';
import { ErrorMessage } from './components/ErrorMessage';
import { Modal } from './components/Modal';
import { uploadEml, getCaseDetails, getAbuseDraft } from './services/api';
import type { CaseAnalysis } from './types';

const App: React.FC = () => {
  const [caseData, setCaseData] = useState<CaseAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingMessage, setLoadingMessage] = useState<string>('');

  const [isAbuseModalOpen, setIsAbuseModalOpen] = useState(false);
  const [abuseDraftContent, setAbuseDraftContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileUpload = useCallback(async (file: File) => {
    setIsLoading(true);
    setError(null);
    setCaseData(null);
    setLoadingMessage('Uploading and securing file...');

    try {
      const { caseId } = await uploadEml(file);
      setLoadingMessage('Performing forensic analysis...');
      const details = await getCaseDetails(caseId, file.name);
      setCaseData(details);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred.');
      }
    } finally {
      setIsLoading(false);
      setLoadingMessage('');
    }
  }, []);

  const handleReset = useCallback(() => {
    setCaseData(null);
    setError(null);
    setIsLoading(false);
  }, []);

  const handleShowAbuseDraft = useCallback(async (caseId: string) => {
    setIsSubmitting(true);
    try {
      const { draft } = await getAbuseDraft(caseId);
      setAbuseDraftContent(draft);
      setIsAbuseModalOpen(true);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Could not fetch abuse draft.');
      }
    } finally {
      setIsSubmitting(false);
    }
  }, []);


  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-sans">
      <Header />
      <main className="container mx-auto p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          {error && <ErrorMessage message={error} onClear={() => setError(null)} />}
          
          {isLoading && <Loader message={loadingMessage} />}

          {!isLoading && !caseData && !error && (
            <FileUpload onFileUpload={handleFileUpload} />
          )}

          {!isLoading && caseData && (
            <CaseDetails 
              caseData={caseData} 
              onReset={handleReset} 
              onShowAbuseDraft={handleShowAbuseDraft}
              isSubmitting={isSubmitting}
            />
          )}
        </div>
      </main>
       <footer className="text-center p-4 text-xs text-slate-400 dark:text-slate-600">
        <p>E-Mail Forensics Analyzer v0.1.2 | For demonstration purposes only.</p>
      </footer>
      <Modal
        isOpen={isAbuseModalOpen}
        onClose={() => setIsAbuseModalOpen(false)}
        title="Abuse Report Draft"
      >
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
          This is a pre-generated draft to report the malicious email. Copy and send it to the responsible abuse contact.
        </p>
        <pre className="bg-slate-100 dark:bg-slate-900 p-4 rounded-md text-xs text-slate-700 dark:text-slate-300 whitespace-pre-wrap font-mono">
          {abuseDraftContent}
        </pre>
      </Modal>
    </div>
  );
};

export default App;
