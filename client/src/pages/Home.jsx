import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Check,
  Compass,
  FileText,
  GraduationCap,
  Lock,
  ShieldCheck,
  Sparkles,
  Workflow,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import LeadForm from '../components/LeadForm.jsx';
import SamplePrompt from '../components/SamplePrompt.jsx';

const services = [
  {
    number: '01',
    icon: Compass,
    title: 'AI strategy & consulting',
    text: 'Turn broad interest in AI into a practical roadmap: identify useful applications, assess your data and choose a focused first project.',
    tags: 'Readiness assessment / AI roadmap',
  },
  {
    number: '02',
    icon: Workflow,
    title: 'Smarter engineering workflows',
    text: 'AI-assisted maintenance planning, technical document search and reporting, built around the way your engineering team works.',
    tags: 'Maintenance / knowledge / automation',
  },
  {
    number: '03',
    icon: GraduationCap,
    title: 'Training for the real world',
    text: 'Practical workshops that connect the fundamentals with everyday tasks onboard and ashore.',
    tags: 'Team workshops / practical learning',
  },
];

const promisePoints = [
  'Machinery troubleshooting, PMS and maintenance planning',
  'Superintendent reports, defect lists and repair specifications',
  'Dry docking, inspections, bunkers, root cause (5 Whys) and performance',
  'Technical emails, meeting summaries, CV and interview preparation',
];

const steps = [
  {
    number: '01',
    title: 'Understand your challenge',
    text: 'Start with your team, your workflows and the engineering problem worth solving.',
  },
  {
    number: '02',
    title: 'Define a focused pilot',
    text: 'Agree on a manageable use case, the data it needs and what success looks like.',
  },
  {
    number: '03',
    title: 'Build, learn, refine',
    text: 'Evaluate results with your engineers, develop team capability and plan the next step.',
  },
];

export default function Home() {
  return (
    <>
      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-copy">
            <span className="eyebrow">MarineAIQ · Practical AI for marine engineers</span>
            <h1>
              The next wave of engineering is <em>intelligent.</em>
            </h1>
            <p className="lead">
              Consulting, training and a ready-to-use prompt library — built on real marine
              experience, not AI theory.
            </p>
            <div className="hero-actions">
              <a className="button primary" href="#library">
                Get the prompt library <ArrowRight size={17} />
              </a>
              <a className="button outline" href="#contact">
                Start a conversation
              </a>
            </div>
            <div className="hero-proof">
              <span><Check size={15} /> Field-ready formats</span>
              <span><Check size={15} /> Engineer stays in the loop</span>
            </div>
          </div>

          <div className="hero-visual">
            <SamplePrompt />
          </div>
        </div>
      </section>

      <section className="section" id="services">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Start with the challenge</span>
            <h2>Find where AI actually helps.</h2>
            <p className="muted">
              You know the ocean. We help engineering teams take a practical first step — from
              understanding the possibilities to applying AI to real problems.
            </p>
          </div>
          <div className="cards-3">
            {services.map(({ number, icon: Icon, title, text, tags }) => (
              <article className="service-card" key={number}>
                <div className="service-top">
                  <span className="service-number">{number}</span>
                  <span className="icon-box"><Icon size={20} /></span>
                </div>
                <h3>{title}</h3>
                <p>{text}</p>
                <span className="card-tag">{tags}</span>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section library-section" id="library">
        <div className="container library-grid">
          <div className="library-copy">
            <span className="eyebrow">Founding release</span>
            <h2>100 AI prompts for marine engineers &amp; technical superintendents.</h2>
            <p className="lead">
              A field-ready library, not an AI theory course. Each prompt helps you define inputs,
              direct the output and apply your own professional filter.
            </p>
            <ul className="check-list">
              {promisePoints.map((point) => (
                <li key={point}><Check size={17} /> {point}</li>
              ))}
            </ul>
            <div className="price-row">
              <div>
                <span className="price">S$49</span>
                <span className="muted"> one-time purchase · team licences available</span>
              </div>
              <Link to="/checkout" className="button primary">
                Get launch access <ArrowUpRight size={16} />
              </Link>
            </div>
            <Link to="/library" className="text-link">
              <BookOpen size={15} /> Explore the library preview
            </Link>
          </div>

          <div className="library-panel">
            <div className="panel-head">
              <span className="eyebrow">25 free prompts</span>
              <h3>Start with the essentials.</h3>
              <p>A focused introduction to the prompt formats — from defect analysis to technical emails.</p>
            </div>
            <LeadForm variant="free" />
            <div className="panel-foot">
              <Lock size={14} /> The full library stays behind a professional licence.
            </div>
          </div>
        </div>
      </section>

      <section className="section" id="approach">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Our approach</span>
            <h2>From possibility to practical action.</h2>
            <p className="muted">A simple path for teams that want results without a big upfront commitment.</p>
          </div>
          <div className="steps">
            {steps.map((step) => (
              <article className="step" key={step.number}>
                <span className="step-number">{step.number}</span>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </article>
            ))}
          </div>
          <p className="steps-footer"><Sparkles size={16} /> The engineer stays in the loop.</p>
        </div>
      </section>

      <section className="section safety-section" id="safety">
        <div className="container safety-grid">
          <div>
            <span className="eyebrow light">Safety first</span>
            <h2>AI is a thinking partner, not the final authority.</h2>
            <p>
              MarineAIQ is built for high-consequence work. Use AI to structure information, explore
              options and communicate more clearly — never to replace manufacturer guidance, class
              and flag requirements, company procedures, risk assessment or professional judgement.
            </p>
          </div>
          <div className="safety-pillars">
            {['Verify', 'Contextualise', 'Own the decision'].map((word) => (
              <div className="safety-pillar" key={word}>
                <ShieldCheck size={20} />
                <span>{word}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section contact-section" id="contact">
        <div className="container contact-grid">
          <div>
            <span className="eyebrow">Let’s talk</span>
            <h2>The future is a conversation away.</h2>
            <p className="lead">
              Have an engineering challenge in mind, or curious where AI could fit? Tell us a little
              about your team and we will reply.
            </p>
            <div className="contact-aside">
              <FileText size={18} />
              <span>Prompt library (S$49) · team licences · workshops · consulting</span>
            </div>
          </div>
          <div className="contact-form-card">
            <LeadForm variant="contact" />
          </div>
        </div>
      </section>
    </>
  );
}
