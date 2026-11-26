import { useState } from 'react';
import { Check, Copy, RotateCcw } from 'lucide-react';

const fields = [
  {
    key: 'equipment',
    label: 'Equipment',
    placeholder: 'engine / pump / purifier, make and model',
  },
  {
    key: 'symptom',
    label: 'Symptom',
    placeholder: 'what was observed, when',
  },
  {
    key: 'hours',
    label: 'Running hours & last overhaul',
    placeholder: 'hours, date',
  },
  {
    key: 'changes',
    label: 'Recent changes',
    placeholder: 'fuel, load, maintenance',
  },
];

const buildPrompt = (values) => `You are assisting a marine engineer.
Equipment: [${values.equipment || 'engine / pump / purifier, make and model'}]
Symptom: [${values.symptom || 'what was observed, when'}]
Running hours and last overhaul: [${values.hours || 'hours, date'}]
Recent changes: [${values.changes || 'fuel, load, maintenance'}]

List the most likely causes in order, the checks that would confirm or rule out each, and what I should verify against the maker's manual before acting.`;

function Highlighted({ text }) {
  return text.split(/(\[[^\]]+\])/g).map((part, index) =>
    part.startsWith('[') && part.endsWith(']') ? (
      <span className="prompt-placeholder" key={index}>{part}</span>
    ) : (
      <span key={index}>{part}</span>
    ),
  );
}

export default function SamplePrompt() {
  const [values, setValues] = useState({ equipment: '', symptom: '', hours: '', changes: '' });
  const [copied, setCopied] = useState(false);
  const prompt = buildPrompt(values);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="sample-card">
      <div className="sample-card-head">
        <div>
          <span className="eyebrow">Sample prompt</span>
          <h3>Machinery troubleshooting</h3>
        </div>
        <button className="button outline small" onClick={copy}>
          {copied ? <Check size={15} /> : <Copy size={15} />}
          {copied ? 'Copied' : 'Copy prompt'}
        </button>
      </div>

      <div className="sample-fields">
        {fields.map((field) => (
          <label key={field.key}>
            <span>{field.label}</span>
            <input
              value={values[field.key]}
              onChange={(event) =>
                setValues((current) => ({ ...current, [field.key]: event.target.value }))
              }
              placeholder={field.placeholder}
            />
          </label>
        ))}
      </div>

      <pre className="sample-output">
        <Highlighted text={prompt} />
      </pre>

      <div className="sample-card-foot">
        <p>Fill the red fields. Review every answer against your procedures.</p>
        <button
          className="text-button"
          onClick={() => setValues({ equipment: '', symptom: '', hours: '', changes: '' })}
        >
          <RotateCcw size={13} /> Reset
        </button>
      </div>
    </div>
  );
}
