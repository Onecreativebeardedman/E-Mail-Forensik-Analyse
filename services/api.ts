import { RiskLevel } from '../types';
import type { CaseAnalysis } from '../types';

// Utility to simulate network delay
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock API to upload a file
export const uploadEml = async (file: File): Promise<{ caseId: string }> => {
  await sleep(1500); // Simulate upload time
  if (file.size > 10 * 1024 * 1024) { // 10MB limit
    throw new Error('File size exceeds 10MB limit. Please upload a smaller file.');
  }
  if (!file.name.endsWith('.eml')) {
    throw new Error('Invalid file type. Only .eml files are accepted.');
  }
  const caseId = `case-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  console.log(`File uploaded: ${file.name}. Case ID: ${caseId}`);
  return { caseId };
};

// Mock scenarios for case details
const mockScenarios: CaseAnalysis[] = [
  // 1. High-risk Booking Scam
  {
    id: '',
    fileName: 'Booking Confirmation Scam.eml',
    submittedAt: '',
    overallScore: 82,
    riskLevel: RiskLevel.HIGH,
    stages: {
      technical: {
        title: 'Technical Analysis',
        score: 25,
        maxScore: 40,
        summary: 'Sender authentication failed critical checks.',
        details: [
          { label: 'SPF', value: 'Fail (IP mismatch)', pass: false },
          { label: 'DKIM', value: 'Fail (Signature invalid)', pass: false },
          { label: 'DMARC', value: 'Quarantine', pass: false },
          { label: 'PTR Record', value: 'Mismatch', pass: false },
        ],
      },
      enrichment: {
        title: 'Enrichment Analysis',
        score: 27,
        maxScore: 30,
        summary: 'Sender domain is very new and uses privacy protection.',
        details: [
          { label: 'ASN', value: 'Known spam source', pass: false },
          { label: 'Domain Age', value: '3 days', pass: false },
          { label: 'WHOIS Privacy', value: 'Enabled', pass: false },
          { label: 'GeoIP Mismatch', value: 'Yes (Sender in NG, Server in RU)', pass: false },
        ],
      },
      content: {
        title: 'Content Analysis (Gemini)',
        score: 30,
        maxScore: 30,
        summary: 'AI detected strong indicators of a phishing attempt.',
        details: [
          { label: 'Urgency', value: 'High', pass: false },
          { label: 'Suspicious Link', value: 'Detected', pass: false },
          { label: 'Tone', value: 'Threatening', pass: false },
          { label: 'Request', value: 'Payment to unknown wallet', pass: false },
        ],
      },
    },
    geminiSummary: 'The AI model identified urgent language demanding immediate payment to a cryptocurrency wallet to avoid account suspension. The writing style and grammar are inconsistent with official communications, strongly suggesting a phishing attack.',
  },
  // 2. Low-risk legitimate newsletter
  {
    id: '',
    fileName: 'Weekly Newsletter.eml',
    submittedAt: '',
    overallScore: 15,
    riskLevel: RiskLevel.LOW,
    stages: {
      technical: {
        title: 'Technical Analysis',
        score: 40,
        maxScore: 40,
        summary: 'All sender authentication checks passed.',
        details: [
          { label: 'SPF', value: 'Pass', pass: true },
          { label: 'DKIM', value: 'Pass', pass: true },
          { label: 'DMARC', value: 'Pass', pass: true },
          { label: 'PTR Record', value: 'Match', pass: true },
        ],
      },
      enrichment: {
        title: 'Enrichment Analysis',
        score: 30,
        maxScore: 30,
        summary: 'Sender domain is well-established and reputable.',
        details: [
          { label: 'ASN', value: 'Google Cloud', pass: true },
          { label: 'Domain Age', value: '12 years', pass: true },
          { label: 'WHOIS Privacy', value: 'Disabled', pass: true },
          { label: 'GeoIP Mismatch', value: 'No', pass: true },
        ],
      },
      content: {
        title: 'Content Analysis (Gemini)',
        score: 5,
        maxScore: 30,
        summary: 'AI analysis found no indicators of malicious intent.',
        details: [
          { label: 'Urgency', value: 'None', pass: true },
          { label: 'Suspicious Link', value: 'None', pass: true },
          { label: 'Tone', value: 'Informational', pass: true },
          { label: 'Request', value: 'None', pass: true },
        ],
      },
    },
    geminiSummary: 'The AI model classified the content as a standard promotional newsletter. It contains marketing language and links to the official company website. No malicious characteristics were detected.',
  },
    // 3. Medium-risk false invoice
  {
    id: '',
    fileName: 'Invoice-12345.eml',
    submittedAt: '',
    overallScore: 65,
    riskLevel: RiskLevel.MEDIUM,
    stages: {
      technical: {
        title: 'Technical Analysis',
        score: 35,
        maxScore: 40,
        summary: 'Most sender authentication checks passed.',
        details: [
          { label: 'SPF', value: 'Pass', pass: true },
          { label: 'DKIM', value: 'Pass', pass: true },
          { label: 'DMARC', value: 'Pass', pass: true },
          { label: 'PTR Record', value: 'Mismatch', pass: false },
        ],
      },
      enrichment: {
        title: 'Enrichment Analysis',
        score: 15,
        maxScore: 30,
        summary: 'Sender domain is relatively new.',
        details: [
          { label: 'ASN', value: 'Digital Ocean', pass: true },
          { label: 'Domain Age', value: '45 days', pass: false },
          { label: 'WHOIS Privacy', value: 'Enabled', pass: false },
          { label: 'GeoIP Mismatch', value: 'No', pass: true },
        ],
      },
      content: {
        title: 'Content Analysis (Gemini)',
        score: 25,
        maxScore: 30,
        summary: 'AI detected suspicious invoice details and an urgent call to action.',
        details: [
          { label: 'Urgency', value: 'Medium', pass: false },
          { label: 'Suspicious Link', value: 'Masked URL', pass: false },
          { label: 'Tone', value: 'Formal but demanding', pass: false },
          { label: 'Request', value: 'Payment via unfamiliar portal', pass: false },
        ],
      },
    },
    geminiSummary: 'The AI model flagged this email as suspicious. While appearing as a legitimate invoice, it uses a generic greeting, contains a link to a non-standard payment portal, and pressures the recipient to pay quickly to avoid late fees. The sender domain is also recently registered.',
  },
];


// Mock API to get case details
export const getCaseDetails = async (caseId: string, fileName: string): Promise<CaseAnalysis> => {
  await sleep(2500); // Simulate analysis time

  // Randomly pick a mock scenario to show different results
  const scenario = mockScenarios[Math.floor(Math.random() * mockScenarios.length)];
  
  const result: CaseAnalysis = {
    ...scenario,
    id: caseId,
    fileName: fileName,
    submittedAt: new Date().toISOString(),
  };

  console.log(`Analysis complete for case: ${caseId}`, result);
  return result;
};

// Mock API to "download" a ZIP export
export const exportZip = async (caseId: string): Promise<void> => {
  await sleep(750);
  console.log(`Generating and downloading ZIP export for case: ${caseId}`);
  // In a real app, this would trigger a file download, e.g.:
  // window.location.href = `/api/cases/${caseId}/export`;
  alert(`A ZIP export for case ${caseId} would start downloading now.`);
};

// Mock API to "download" a PDF report
export const getPdfReport = async (caseId: string): Promise<void> => {
  await sleep(800); // Simulate PDF generation
  console.log(`Generating PDF report for case: ${caseId}`);
  alert(`A PDF report for case ${caseId} would start downloading now. It would contain a summary of the analysis.`);
};

// Mock API to get an abuse draft
export const getAbuseDraft = async (caseId: string): Promise<{ draft: string }> => {
  await sleep(500);
  console.log(`Fetching abuse draft for case: ${caseId}`);
  const draft = `To: abuse@spam-source-isp.com
Subject: Phishing Report - Case ID: ${caseId}

Dear Abuse Team,

Please be advised that we have received a malicious email originating from your network. 
The forensic analysis indicates a high probability of a phishing attack.

Details:
- Case ID: ${caseId}
- Source IP: [Source IP from analysis]
- Timestamp: ${new Date().toUTCString()}

We have attached the original .eml file for your investigation. Please take appropriate action to mitigate this threat.

Regards,
E-Mail Forensics Analyzer`.trim();
  return { draft };
};