import React, { useEffect, useState } from 'react';
import { ArrowLeft, Eye, Image, LayoutDashboard, RotateCcw, Save, ShieldCheck } from 'lucide-react';
import { useApp } from '../context/useApp';

const sections = ['Hero & intro', 'Stats & features', 'Destinations', 'Services & process', 'Stories & CTA'];

const resolveImage = (source) => {
  if (!source) return '';
  if (/^(https?:|data:|blob:)/.test(source)) return source;
  return `${import.meta.env.BASE_URL}${source.replace(/^\/+/, '')}`;
};

const Field = ({ label, multiline = false, ...props }) => (
  <label className="cms-label">
    {label}
    {multiline ? <textarea className="cms-field min-h-28 resize-y" {...props} /> : <input className="cms-field" {...props} />}
  </label>
);

const Panel = ({ title, description, children }) => (
  <section className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-[0_14px_38px_rgba(6,45,85,0.055)] sm:p-7">
    <div className="border-b border-slate-100 pb-5">
      <h2 className="text-xl font-extrabold text-[#062d55]">{title}</h2>
      {description && <p className="mt-2 text-xs leading-6 text-slate-500">{description}</p>}
    </div>
    <div className="mt-6">{children}</div>
  </section>
);

export const CmsView = ({ onNavigate }) => {
  const { landingContent, saveLandingContent, resetLandingContent } = useApp();
  const [draft, setDraft] = useState(() => structuredClone(landingContent));
  const [activeSection, setActiveSection] = useState(sections[0]);

  useEffect(() => {
    setDraft(structuredClone(landingContent));
  }, [landingContent]);

  const updateObject = (section, field, value) => {
    setDraft((current) => ({ ...current, [section]: { ...current[section], [field]: value } }));
  };

  const updateItem = (section, index, field, value) => {
    setDraft((current) => ({
      ...current,
      [section]: current[section].map((item, itemIndex) => itemIndex === index ? { ...item, [field]: value } : item),
    }));
  };

  const publish = () => {
    saveLandingContent(structuredClone(draft));
  };

  const reset = () => {
    resetLandingContent();
  };

  return (
    <div className="min-h-screen bg-[#f4f8fb] text-slate-900">
      <section className="border-b border-slate-200 bg-white px-5 py-8 sm:px-8 lg:px-12">
        <div className="mx-auto flex max-w-[1380px] flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#eaf4ff] text-[#0868b5]"><LayoutDashboard className="h-6 w-6" /></span>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="font-display text-3xl font-semibold tracking-[-0.04em] text-[#062d55]">Landing Page CMS</h1>
                <span className="rounded-full bg-amber-100 px-3 py-1 text-[9px] font-extrabold uppercase tracking-[0.12em] text-amber-800">Local content manager</span>
              </div>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">Edit the live landing-page copy, cards, stories, and image paths. Changes are saved in this browser; production multi-user publishing will require a secured backend and media store.</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={() => onNavigate('landing')} className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-5 py-3 text-xs font-bold text-[#062d55]"><Eye className="h-4 w-4" /> Preview site</button>
            <button type="button" onClick={reset} className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-5 py-3 text-xs font-bold text-slate-600"><RotateCcw className="h-4 w-4" /> Restore defaults</button>
            <button type="button" onClick={publish} className="inline-flex items-center gap-2 rounded-full bg-[#0868b5] px-5 py-3 text-xs font-bold text-white shadow-lg shadow-blue-500/20"><Save className="h-4 w-4" /> Publish changes</button>
          </div>
        </div>
      </section>

      <div className="mx-auto grid max-w-[1380px] gap-7 px-5 py-8 sm:px-8 lg:grid-cols-[240px_1fr] lg:px-12 lg:py-12">
        <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-3 lg:sticky lg:top-28">
          <button type="button" onClick={() => onNavigate('landing')} className="mb-3 inline-flex items-center gap-2 px-3 py-2 text-xs font-bold text-slate-500"><ArrowLeft className="h-4 w-4" /> Back to website</button>
          <nav className="space-y-1" aria-label="CMS sections">
            {sections.map((section) => (
              <button key={section} type="button" onClick={() => setActiveSection(section)} className={`w-full rounded-xl px-4 py-3 text-left text-xs font-extrabold transition ${activeSection === section ? 'bg-[#eaf4ff] text-[#0868b5]' : 'text-slate-600 hover:bg-slate-50'}`}>{section}</button>
            ))}
          </nav>
          <div className="mt-4 flex items-start gap-2 rounded-xl bg-emerald-50 p-3 text-[10px] leading-5 text-emerald-800"><ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" /> Content remains private to this browser until a production CMS backend is connected.</div>
        </aside>

        <main className="space-y-6">
          {activeSection === 'Hero & intro' && (
            <>
              <Panel title="Hero content" description="This is the first message students see on the landing page.">
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Eyebrow" value={draft.hero.eyebrow} onChange={(event) => updateObject('hero', 'eyebrow', event.target.value)} />
                  <Field label="Hero image path or URL" value={draft.hero.image} onChange={(event) => updateObject('hero', 'image', event.target.value)} />
                  <Field label="Title — first line" value={draft.hero.titleLineOne} onChange={(event) => updateObject('hero', 'titleLineOne', event.target.value)} />
                  <Field label="Title — second line" value={draft.hero.titleLineTwo} onChange={(event) => updateObject('hero', 'titleLineTwo', event.target.value)} />
                  <Field label="Highlighted title" value={draft.hero.highlightedText} onChange={(event) => updateObject('hero', 'highlightedText', event.target.value)} />
                  <Field label="Trust line" value={draft.hero.trustLine} onChange={(event) => updateObject('hero', 'trustLine', event.target.value)} />
                  <div className="sm:col-span-2"><Field multiline label="Description" value={draft.hero.description} onChange={(event) => updateObject('hero', 'description', event.target.value)} /></div>
                  <Field label="Primary button" value={draft.hero.primaryCta} onChange={(event) => updateObject('hero', 'primaryCta', event.target.value)} />
                  <Field label="Secondary button" value={draft.hero.secondaryCta} onChange={(event) => updateObject('hero', 'secondaryCta', event.target.value)} />
                </div>
                <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
                  {draft.hero.image ? <img src={resolveImage(draft.hero.image)} alt="Current hero preview" className="h-60 w-full object-cover object-center" /> : <div className="flex h-60 items-center justify-center text-slate-400"><Image className="h-8 w-8" /></div>}
                </div>
              </Panel>
              <Panel title="Introduction">
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Eyebrow" value={draft.introduction.eyebrow} onChange={(event) => updateObject('introduction', 'eyebrow', event.target.value)} />
                  <Field label="Heading" value={draft.introduction.title} onChange={(event) => updateObject('introduction', 'title', event.target.value)} />
                  <div className="sm:col-span-2"><Field multiline label="Description" value={draft.introduction.description} onChange={(event) => updateObject('introduction', 'description', event.target.value)} /></div>
                </div>
              </Panel>
            </>
          )}

          {activeSection === 'Stats & features' && (
            <>
              <Panel title="Credibility statistics" description="Use only figures that the trust can verify.">
                <div className="grid gap-4 md:grid-cols-2">
                  {draft.stats.map((stat, index) => (
                    <div key={`${stat.label}-${index}`} className="grid gap-3 rounded-2xl bg-slate-50 p-4 sm:grid-cols-[0.4fr_1fr]">
                      <Field label="Value" value={stat.value} onChange={(event) => updateItem('stats', index, 'value', event.target.value)} />
                      <Field label="Label" value={stat.label} onChange={(event) => updateItem('stats', index, 'label', event.target.value)} />
                    </div>
                  ))}
                </div>
              </Panel>
              <Panel title="Why choose us cards">
                <div className="grid gap-4 md:grid-cols-2">
                  {draft.features.map((feature, index) => (
                    <div key={`${feature.title}-${index}`} className="space-y-3 rounded-2xl bg-slate-50 p-4">
                      <Field label={`Card ${index + 1} title`} value={feature.title} onChange={(event) => updateItem('features', index, 'title', event.target.value)} />
                      <Field multiline label="Description" value={feature.text} onChange={(event) => updateItem('features', index, 'text', event.target.value)} />
                    </div>
                  ))}
                </div>
              </Panel>
            </>
          )}

          {activeSection === 'Destinations' && (
            <Panel title="Study destinations" description="Paste a full image URL or a path inside the public folder, such as brand/photo.webp.">
              <div className="grid gap-5 xl:grid-cols-2">
                {draft.destinations.map((destination, index) => (
                  <div key={`${destination.code}-${index}`} className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
                    <img src={resolveImage(destination.image)} alt="" className="h-36 w-full object-cover" />
                    <div className="grid gap-3 p-4 sm:grid-cols-[0.35fr_1fr]">
                      <Field label="Code" value={destination.code} onChange={(event) => updateItem('destinations', index, 'code', event.target.value)} />
                      <Field label="Destination" value={destination.name} onChange={(event) => updateItem('destinations', index, 'name', event.target.value)} />
                      <div className="sm:col-span-2"><Field label="Image path or URL" value={destination.image} onChange={(event) => updateItem('destinations', index, 'image', event.target.value)} /></div>
                      <div className="sm:col-span-2"><Field multiline label="Short description" value={destination.note} onChange={(event) => updateItem('destinations', index, 'note', event.target.value)} /></div>
                    </div>
                  </div>
                ))}
              </div>
            </Panel>
          )}

          {activeSection === 'Services & process' && (
            <>
              <Panel title="Services">
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {draft.services.map((service, index) => <Field key={`${service.title}-${index}`} label={`Service ${index + 1}`} value={service.title} onChange={(event) => updateItem('services', index, 'title', event.target.value)} />)}
                </div>
              </Panel>
              <Panel title="Six-step process">
                <div className="grid gap-4 md:grid-cols-2">
                  {draft.process.map((step, index) => (
                    <div key={`${step.title}-${index}`} className="space-y-3 rounded-2xl bg-slate-50 p-4">
                      <Field label={`Step ${index + 1}`} value={step.title} onChange={(event) => updateItem('process', index, 'title', event.target.value)} />
                      <Field multiline label="Description" value={step.text} onChange={(event) => updateItem('process', index, 'text', event.target.value)} />
                    </div>
                  ))}
                </div>
              </Panel>
            </>
          )}

          {activeSection === 'Stories & CTA' && (
            <>
              <Panel title="Success stories" description="Replace the illustrative cards with approved student stories only after consent and verification.">
                <div className="grid gap-4 xl:grid-cols-2">
                  {draft.stories.map((story, index) => (
                    <div key={`${story.name}-${index}`} className="grid gap-3 rounded-2xl bg-slate-50 p-4 sm:grid-cols-2">
                      <Field label="Story title or approved name" value={story.name} onChange={(event) => updateItem('stories', index, 'name', event.target.value)} />
                      <Field label="Program" value={story.program} onChange={(event) => updateItem('stories', index, 'program', event.target.value)} />
                      <div className="sm:col-span-2"><Field multiline label="Quote" value={story.quote} onChange={(event) => updateItem('stories', index, 'quote', event.target.value)} /></div>
                      <div className="sm:col-span-2"><Field label="Institution or verification note" value={story.institution} onChange={(event) => updateItem('stories', index, 'institution', event.target.value)} /></div>
                    </div>
                  ))}
                </div>
              </Panel>
              <Panel title="Final call to action">
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Heading" value={draft.callToAction.title} onChange={(event) => updateObject('callToAction', 'title', event.target.value)} />
                  <Field label="Button" value={draft.callToAction.button} onChange={(event) => updateObject('callToAction', 'button', event.target.value)} />
                  <div className="sm:col-span-2"><Field multiline label="Description" value={draft.callToAction.description} onChange={(event) => updateObject('callToAction', 'description', event.target.value)} /></div>
                </div>
              </Panel>
            </>
          )}
        </main>
      </div>
    </div>
  );
};
