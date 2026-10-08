import { ShieldCheck, Users, FileText, Sprout, Truck, Receipt, GraduationCap, BookOpen, ClipboardCheck, Scale, Search, MessageSquare, Milk, Bell, CalendarDays, TrendingUp, Database, BarChart3, RadioTower, Cpu, Send, MapPinned, Car, Hand, Camera, PenTool, CreditCard, ScanLine, HeartPulse, Activity, Stethoscope, Mic, AudioLines, Gamepad2, Droplets, Trophy, Globe, Table2, Hospital, FolderHeart } from 'lucide';
import { escapeHtml as html } from '../utils/helpers.js';

// Lucide pictograms explain each project's subject and workflow.
export const PROJECT_VISUALS = {
  clansure: { icon: ShieldCheck, color: '#91cbe4', title: 'Protection, brought together', steps: [[Users, 'Family'], [FileText, 'Policies'], [ShieldCheck, 'Coverage']] },
  'gt-companion': { icon: GraduationCap, color: '#c3b0f1', title: 'A shared path to learning', steps: [[BookOpen, 'Materials'], [Users, 'Learning'], [ClipboardCheck, 'Quizzes']] },
  'sattam-ai': { icon: Scale, color: '#dac4a4', title: 'Documents to grounded answers', steps: [[FileText, 'Legal PDFs'], [Search, 'Retrieval'], [MessageSquare, 'Answers']] },
  'srk-erp': { icon: Sprout, color: '#b0d49d', title: 'From the field to the ledger', steps: [[Sprout, 'Harvest'], [Truck, 'Transport'], [Receipt, 'Sales']] },
  'my-cow': { icon: Milk, color: '#d8c5a3', title: 'Every animal. Every milestone.', steps: [[Milk, 'Herd records'], [CalendarDays, 'Milestones'], [Bell, 'Reminders']] },
  'product-demand-forecast': { icon: TrendingUp, color: '#93cbd1', title: 'History becomes a forecast', steps: [[Database, 'Orders'], [Activity, 'ARIMA'], [TrendingUp, 'Forecast']] },
  'rf-detector': { icon: RadioTower, color: '#a9c5ee', title: 'A signal becomes an alert', steps: [[RadioTower, 'RF signal'], [Cpu, 'ESP8266'], [Send, 'Telegram']] },
  'road-accident-analysis': { icon: BarChart3, color: '#e4d08e', title: 'A clearer view of road safety', steps: [[Car, 'Accidents'], [BarChart3, 'Trends'], [MapPinned, 'Locations']] },
  'screen-drawing': { icon: Hand, color: '#d3b0ec', title: 'Your hand is the interface', steps: [[Camera, 'Webcam'], [Hand, 'Tracking'], [PenTool, 'Drawing']] },
  'upi-fraud-detection': { icon: ScanLine, color: '#e4ae9d', title: 'Explore transaction-risk signals', steps: [[CreditCard, 'Transaction'], [ScanLine, 'Classifier'], [ShieldCheck, 'Risk score']] },
  'heart-disease-prediction': { icon: HeartPulse, color: '#e9a6b5', title: 'A health-data classification study', steps: [[ClipboardCheck, 'Inputs'], [Activity, 'Classifier'], [HeartPulse, 'Prediction']] },
  'pneumonia-detection': { icon: Stethoscope, color: '#a9d0dd', title: 'An image-classification experiment', steps: [[ScanLine, 'X-ray'], [Cpu, 'DenseNet121'], [Stethoscope, 'Classification']] },
  'speech-recognition': { icon: Mic, color: '#c0b8ef', title: 'Sound becomes readable', steps: [[AudioLines, 'Audio'], [Cpu, 'Wav2Vec2'], [FileText, 'Transcript']] },
  'save-water-game': { icon: Gamepad2, color: '#89cadf', title: 'Play with a purpose', steps: [[Droplets, 'Water drops'], [Gamepad2, 'Catch'], [Trophy, 'Score']] },
  'web-scraper': { icon: Globe, color: '#a8d5ba', title: 'Find structure inside a webpage', steps: [[Globe, 'Webpage'], [Search, 'Extraction'], [Table2, 'Results']] },
  healthsurance: { icon: Hospital, color: '#91c7ce', title: 'Explore an insurance experience', steps: [[FolderHeart, 'Plans'], [FileText, 'Claims'], [Hospital, 'Dashboard']] }
};

function iconMarkup([tag, attributes, children = []], root = true) {
  const attrs = root ? { ...attributes, width: 48, height: 48, 'aria-hidden': 'true', focusable: 'false' } : attributes;
  return `<${tag} ${Object.entries(attrs).map(([key, value]) => `${key}="${html(String(value))}"`).join(' ')}>${children.map(child => iconMarkup(child, false)).join('')}</${tag}>`;
}

export const PROJECT_SCENES = {
  clansure: 'A family beneath a glass canopy, with policy folders, a model home and car in the foreground.',
  'gt-companion': 'Graduate trainees sharing knowledge across connected, warmly lit learning spaces.',
  'srk-erp': 'Coconut harvest baskets, a goods truck and a warehouse connected by a winding road.',
  'sattam-ai': 'An open law book, a magnifying glass and illuminated pages inside a legal archive.'
};

export function projectVisual(project) {
  const visual = PROJECT_VISUALS[project.id];
  if (!visual) return '';
  if (PROJECT_SCENES[project.id]) return `<figure class="project-visual project-scene" style="--project-accent:${visual.color}">
    <!-- <img class="project-scene-image" src="/images/projects/${project.id}-1440.webp" width="960" height="540" loading="lazy" decoding="async" alt="${html(PROJECT_SCENES[project.id])}"> -->
    ${project.id === 'sattam-ai' ? '<span class="project-scene-label">SATTAM AI<small>Legal knowledge assistant</small></span>' : ''}
    <figcaption class="visually-hidden">${html(visual.title)} — conceptual artwork</figcaption>
  </figure>`;
  return `<figure class="project-visual" style="--project-accent:${visual.color}">
    <div class="project-symbol">${iconMarkup(visual.icon)}</div>
    <figcaption>${html(visual.title)}</figcaption>
    <ol class="project-workflow">${visual.steps.map(([icon, label]) => `<li>${iconMarkup(icon)}<span>${html(label)}</span></li>`).join('')}</ol>
    <p class="project-stage">${html(project.badge)}</p>
  </figure>`;
}
