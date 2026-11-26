// Demo content only. Replace with your own reviewed, engineer-approved prompts.
import { slugify } from '../utils/index.js';

const p = (title, category, summary, body, tags, access = 'pro') => ({
  title,
  slug: slugify(title),
  category,
  summary,
  body,
  tags,
  access,
  featured: access === 'free',
  order: 0,
});

export const seedPrompts = [
  p(
    'Machinery troubleshooting — first-pass triage',
    'Troubleshooting',
    'Structure an evidence-based first look at a machinery fault before any action is taken.',
    `You are assisting a marine engineer. Keep the engineer in the loop and do not replace the maker's manual, class requirements or company procedures.

Equipment: [engine / pump / purifier, make and model]
Symptom: [what was observed, when]
Running hours and last overhaul: [hours, date]
Recent changes: [fuel, load, maintenance, weather]

List the most likely causes in order. For each cause: the checks that would confirm or rule it out, the safe sequence of those checks, and what must be verified against the maker's manual before acting. End with the information that is still missing.`,
    ['troubleshooting', 'machinery', 'starter'],
    'free',
  ),
  p(
    'Alarm log interpretation',
    'Troubleshooting',
    'Turn a raw alarm list into a timeline and a short list of plausible root causes.',
    `You are reviewing an alarm log with a marine engineer. Treat alarm text as a clue, not a diagnosis.

Alarm log: [paste timestamps, alarm IDs and text]
Equipment state: [running / stopped / manoeuvring]
Recent work: [last maintenance or calibration]

1. Build a timeline of the first event and follow-on alarms.
2. Separate primary alarms from consequences.
3. List plausible causes with the evidence for and against each.
4. State which checks are low-risk to perform and which need permission or a permit.
5. Name the manual sections and company procedures to verify before acting.`,
    ['alarms', 'diagnostics', 'log'],
  ),
  p(
    'Five Whys for a repeating defect',
    'Troubleshooting',
    'Drive a recurring defect to contributing causes without stopping at the first answer.',
    `Facilitate a Five Whys analysis with a ship's engineering team.

Defect: [what failed, how it was found]
Repeat history: [dates and intervals]
Conditions: [load, fuel, temperature, humidity, crew changes]
Checks already done: [results]

Work through each "why" as a separate branch where more than one cause is plausible. Mark each answer as [observed], [assumed] or [unknown]. Finish with a short list of corrective actions and the evidence needed to confirm each one.`,
    ['root cause', '5 whys', 'defect'],
  ),
  p(
    'Vibration reading review',
    'Troubleshooting',
    'Compare vibration trends against baseline and suggest verification steps.',
    `Help an engineer review vibration data. Do not declare a fault from a single reading.

Baseline readings: [date, location, velocity / acceleration]
Current readings: [date, location, values]
Machine: [type, speed, bearing arrangement]
Operating change: [load, alignment work, fuel]

Compare current values with the baseline and any maker limits the engineer supplies. Identify which readings need a repeat measurement, which need spectral analysis, and what contextual information (load, temperature, shaft position) must be captured with the next reading.`,
    ['vibration', 'condition monitoring', 'bearings'],
  ),
  p(
    'Planned maintenance task builder',
    'Maintenance & PMS',
    'Turn an OEM interval into a clear, checkable planned-maintenance job card.',
    `Draft a planned-maintenance job card for a marine engineer to review.

Equipment: [make, model, serial]
Task source: [maker manual section / PMS / class requirement]
Interval: [hours or calendar]
Ship constraints: [port / sea, available personnel, spares]

Include: prerequisites and permits, tools and spares, a step-by-step sequence, acceptance criteria, readings to record, safety cautions, and the fields the engineer must sign off. Flag anything where the maker's instruction is not available to you and must be inserted before use.`,
    ['pms', 'maintenance', 'job card'],
    'free',
  ),
  p(
    'Overdue PMS backlog triage',
    'Maintenance & PMS',
    'Rank overdue maintenance by risk and operational impact, not by date alone.',
    `You are helping a chief engineer prioritise an overdue PMS backlog.

Backlog: [task, due date, equipment, criticality]
Ship status: [trading / port / dry dock / laid up]
Upcoming operations: [voyage, cargo, survey]
Spares on board: [key items]

Group tasks into: safety or class-critical, reliability-critical, and deferrable with conditions. For each group, give the reasoning and what the engineer must check against class, flag or company rules before deferring anything. Produce a suggested sequence for the next seven days.`,
    ['pms', 'planning', 'priorities'],
  ),
  p(
    'Spares and consumables check',
    'Maintenance & PMS',
    'Prepare a spares list for a planned job and spot likely missing items.',
    `Prepare a spares and consumables list for a maintenance job.

Job: [task and equipment]
Maker part references: [if known]
Stock on board: [list with quantities]
Lead time / port constraint: [days, port]

List required items with quantity, part reference where known, and whether they are on board. Highlight items with no reference yet and say where the engineer should confirm them (parts manual, previous order, maker). Add consumables and special tools that are easy to miss.`,
    ['spares', 'logistics', 'planning'],
  ),
  p(
    'Lubrication change-over plan',
    'Maintenance & PMS',
    'Draft a lubrication change-over checklist with sampling and disposal notes.',
    `Help an engineer plan a lubrication oil change-over.

Equipment: [make, model]
Current grade and hours: [grade, running hours]
Recommended grade: [from maker manual]
Sampling history: [recent results, if any]
Constraints: [port, tank capacity, disposal]

Produce a step-by-step plan with sampling points, flushing or topping-up notes, records to keep, and the checks that must be confirmed against the maker's manual. Flag disposal and environmental requirements to verify locally.`,
    ['lube oil', 'sampling', 'maintenance'],
  ),
  p(
    'Daily engineering report draft',
    'Reporting & Documentation',
    'Turn rough engine-room notes into a clear daily report without inventing figures.',
    `Draft a daily engineering report from the engineer's notes. Use only the figures supplied; mark anything missing as [not recorded]. Do not calculate values that were not provided.

Notes: [paste rough notes]
Running hours: [values]
Fuel and bunkers: [figures]
Faults and defects: [list]
Operations: [manoeuvring, port, cargo work]

Structure: overview, running hours and consumption, faults and actions, outstanding items, and handover notes for the next watch. Keep the tone factual and concise.`,
    ['report', 'daily', 'documentation'],
    'free',
  ),
  p(
    'Defect list for the superintendent',
    'Reporting & Documentation',
    'Convert a defect note into a superintendent-ready list with status and impact.',
    `Rewrite these defect notes for a technical superintendent.

Defect notes: [paste notes]
Impact on operation: [known effect]
Temporary repair: [yes / no, details]
Parts ordered: [yes / no, ETA]

For each defect give: equipment, observed symptom, when found, current status, operational impact, temporary measures, parts and ETA, and what decision is needed from the superintendent. Separate confirmed facts from the engineer's assessment.`,
    ['superintendent', 'defects', 'report'],
  ),
  p(
    'Repair specification writer',
    'Reporting & Documentation',
    'Define the scope, acceptance criteria and unknowns for a repair work order.',
    `Draft a repair specification for a shore contractor or dockyard.

Equipment: [make, model, serial]
Defect and history: [symptoms, previous repairs]
Requested work: [what the engineer wants done]
Constraints: [class, flag, maker, warranty]

Include scope of work, exclusions, required standards or references, inspection and test requirements, acceptance criteria, documentation to be handed over, and a list of items the engineer must confirm before the work order is issued.`,
    ['repairs', 'specification', 'dockyard'],
  ),
  p(
    'Technical email in plain language',
    'Reporting & Documentation',
    'Write a short, factual email to a maker, superintendent or class surveyor.',
    `Write a concise technical email. Audience: [maker / superintendent / class / contractor]. Purpose: [ask / report / confirm].

Background: [paste notes]
Questions or decisions needed: [list]
Attachments: [list]

Use short paragraphs, a clear subject line, and numbered questions. Keep facts and requests separate. Do not add technical claims that are not in the notes. End with a clear next step and deadline if one was supplied.`,
    ['email', 'communication', 'reporting'],
    'free',
  ),
  p(
    'Dry-dock scope preparation',
    'Dry Dock & Surveys',
    'Group planned dock work into a scope that is easy to brief and price.',
    `Organise a dry-dock work list for review by a superintendent.

Work items: [paste list]
Class / statutory items: [list]
Maker recommendations: [list]
Ship constraints: [dock duration, budget focus]

Group the work by system and by mandatory versus discretionary. For each item note the reason, expected inspections, and what must be confirmed with class or the maker. Highlight items with incomplete scope so they are not accidentally priced as fixed work.`,
    ['dry dock', 'scope', 'class'],
  ),
  p(
    'Survey finding response',
    'Dry Dock & Surveys',
    'Turn a survey observation into a close-out plan with evidence requirements.',
    `Help an engineer respond to a survey finding.

Finding: [paste the exact observation]
Reference: [class / flag / company rule, if known]
Immediate action taken: [details]
Target close-out date: [date]

Restate the finding in plain language, list the evidence needed to demonstrate close-out, and draft a short action plan. Mark any rule reference that you cannot verify and must be checked with the surveyor or the rule text.`,
    ['survey', 'class', 'close-out'],
  ),
  p(
    'PDM / BDM document gap check',
    'Dry Dock & Surveys',
    'Check a planned-maintenance document set for gaps before an audit.',
    `Review this planned-maintenance documentation for gaps. Do not assume compliance.

Equipment list: [paste]
Documents available: [manuals, PMS, drawings, test records]
Audit scope: [class / company / internal]

List missing or outdated documents by equipment, note where a maker's instruction is needed, and suggest a realistic order for closing the gaps. Clearly separate "missing document" from "document present but not verified".`,
    ['pdm', 'bdm', 'audit'],
  ),
  p(
    'Dry-dock handover notes',
    'Dry Dock & Surveys',
    'Prepare ship-to-yard handover notes that reduce rework and disputes.',
    `Prepare handover notes for a ship going to dry dock.

Work list: [paste]
Known access constraints: [tanks, spaces, permits]
Isolation requirements: [systems]
Ship staff available: [names / roles]

Structure the notes by system. Include access requirements, isolations, tests needed before and after work, and points where the yard must confirm scope with the engineer. Highlight anything that depends on a drawing or manual not yet checked.`,
    ['dry dock', 'handover', 'safety'],
  ),
  p(
    'Bunker quantity reconciliation',
    'Bunkers & Performance',
    'Frame a bunker reconciliation with the right figures and open questions.',
    `Help an engineer reconcile a bunker delivery. Use only supplied numbers and flag missing ones.

BDN quantity: [figure]
Tank soundings before / after: [figures]
Meter readings: [figures]
Density and temperature: [figures]
Voyage / consumption since last bunker: [figures]

Lay out a simple reconciliation table in text, show the difference, and list the checks that could explain it (soundings, density correction, meters, leakage, consumption). Do not conclude theft or loss; state what evidence is needed before any claim.`,
    ['bunkers', 'bdn', 'reconciliation'],
  ),
  p(
    'Fuel consumption variance review',
    'Bunkers & Performance',
    'Separate measurement error from operational causes in a consumption variance.',
    `Review a fuel consumption variance with a marine engineer.

Planned consumption: [figure and basis]
Actual consumption: [figure]
Speed and draught: [figures]
Weather and currents: [description]
Engine settings: [figures]
Recent maintenance or cleaning: [details]

List possible contributors in groups: measurement, operating conditions, machinery condition, and reporting error. For each, say what data would confirm or rule it out. End with the top three checks worth doing first.`,
    ['fuel', 'performance', 'variance'],
  ),
  p(
    'Noon report sanity check',
    'Bunkers & Performance',
    'Check a noon report for internal consistency before it is sent.',
    `Check this noon report for internal consistency. Do not invent missing figures.

Noon report: [paste]
Previous noon report: [paste]

Look for: impossible speed/distance combinations, consumption inconsistent with running hours, bunker figures that do not reconcile, and missing entries. List each issue with the exact fields involved and ask for clarification where needed.`,
    ['noon report', 'data quality', 'performance'],
    'free',
  ),
  p(
    'Propulsion performance baseline',
    'Bunkers & Performance',
    'Define a repeatable baseline for comparing engine performance over time.',
    `Help an engineer define a simple propulsion performance baseline.

Ship and engine: [details]
Clean hull / clean propeller date: [date or unknown]
Typical draught and speed: [figures]
Available measurements: [fuel flow, shaft power, RPM, scavenge pressure, exhaust temp]

List the minimum set of readings to capture, the conditions under which they are comparable, and how to record them so future comparisons are meaningful. Mark anything that requires maker guidance to interpret.`,
    ['performance', 'baseline', 'monitoring'],
  ),
  p(
    'Technical meeting agenda',
    'Careers & Communication',
    'Turn a list of topics into a focused engineering meeting agenda.',
    `Create a short agenda for a technical meeting on board or with shore management.

Topics: [paste]
Attendees and roles: [list]
Time available: [minutes]
Decisions needed: [list]

Group topics by priority, allocate realistic time, and write a clear outcome for each item (decision, action owner, or information only). Add a short list of pre-read documents the engineer should circulate.`,
    ['meeting', 'agenda', 'communication'],
  ),
  p(
    'Toolbox talk outline',
    'Careers & Communication',
    'Build a short, practical toolbox talk for a maintenance job.',
    `Prepare a toolbox talk for a ship's engineering team.

Job: [task]
Location: [space]
Hazards identified: [list]
Controls in place: [permits, isolations, PPE]
Recent incidents or near misses: [if any]

Structure: task summary, step-by-step hazards, controls, emergency actions, and questions to ask the team. Keep it short and specific. Mark anything that must be checked against the ship's safety management system before the talk is given.`,
    ['toolbox talk', 'safety', 'team'],
    'free',
  ),
  p(
    'CV bullet rewrite for engineers',
    'Careers & Communication',
    'Turn engineering duties into clear, evidence-based CV bullets.',
    `Rewrite these engineering duties as CV bullets. Keep every claim factual and tied to the notes supplied. Do not invent numbers, ship names or qualifications.

Duties: [paste]
Equipment and systems: [list]
Scope: [rank, vessel type, fleet size]
Known outcomes: [figures or facts]

Use short action-led bullets. Where a result is not quantified, leave a bracketed prompt for the engineer to add a real figure rather than guessing.`,
    ['cv', 'career', 'writing'],
  ),
  p(
    'Interview preparation — technical',
    'Careers & Communication',
    'Prepare for a technical interview without memorising scripted answers.',
    `Help a marine engineer prepare for a technical interview.

Role: [position]
Equipment focus: [systems]
Experience: [paste brief background]
Job description: [paste or summarise]

Suggest the topics most likely to come up, and for each, a short framework for answering: what was observed, what was checked, what was decided, and what the engineer would do differently. Mark areas where the candidate should review a maker manual or company procedure before the interview.`,
    ['interview', 'career', 'technical'],
  ),
];
