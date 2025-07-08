import React, { useState, useEffect } from 'react';
import '../styles/AiResumePage.css';

export default function AiResumePage() {
  const [personal, setPersonal] = useState({});
  const [sections, setSections] = useState({
    experience: [], education: [], skills: [], projects: []
  });
  const [aiOutput, setAiOutput] = useState('');

  useEffect(() => {
    const st = localStorage.getItem('resumeData');
    if (st) {
      const d = JSON.parse(st);
      setPersonal(d.personal || {});
      setSections(d.sections);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('resumeData', JSON.stringify({ personal, sections }));
  }, [personal, sections]);

  const savePersonal = (field, value) =>
    setPersonal(p => ({ ...p, [field]: { value: value.trim(), saved: true } }));

  const deletePersonal = (field) =>
    setPersonal(p => {
      const np = { ...p };
      delete np[field];
      return np;
    });

  const addEntry = (key) =>
    setSections(s => ({ ...s, [key]: [...s[key], { value: '', saved: false }] }));

  const handleEntryChange = (k, i, v) =>
    setSections(s => {
      const c = [...s[k]]; c[i].value = v;
      return { ...s, [k]: c };
    });

  const saveEntry = (k, i) =>
    setSections(s => {
      const c = [...s[k]]; if (c[i].value.trim()) c[i].saved = true;
      return { ...s, [k]: c };
    });

  const deleteEntry = (k, i) =>
    setSections(s => {
      const c = [...s[k]]; c.splice(i,1);
      return { ...s, [k]: c };
    });

  const addEducation = () =>
    setSections(s => ({
      ...s,
      education: [
        ...s.education,
        { institution: '', course: '', from: '', to: '', pursuing: false, saved: false }
      ]
    }));

  const handleEduChange = (i, field, value) =>
    setSections(s => {
      const arr = [...s.education];
      arr[i][field] = field === 'pursuing' ? value : value;
      return { ...s, education: arr };
    });

  const saveEdu = (i) =>
    setSections(s => {
      const arr = [...s.education];
      arr[i].saved = true;
      return { ...s, education: arr };
    });

  const deleteEdu = (i) =>
    setSections(s => {
      const arr = [...s.education];
      arr.splice(i, 1);
      return { ...s, education: arr };
    });

  const generateAIResume = async () => {
    const prompt = `
Generate ATS‑friendly resume:
Personal: ${JSON.stringify(personal)}
Experience: ${JSON.stringify(sections.experience.map(e => e.value))}
Education: ${JSON.stringify(sections.education.map(e => ({
        institution: e.institution,
        course: e.course,
        from: e.from,
        to: e.pursuing ? 'Present' : e.to
      })))}
Skills: ${JSON.stringify(sections.skills.map(e => e.value))}
Projects: ${JSON.stringify(sections.projects.map(e => e.value))}
`;
    const res = await fetch('/api/generate-resume', {
      method:'POST',
      headers:{ 'Content-Type':'application/json' },
      body: JSON.stringify({ prompt })
    });
    const { resumeText } = await res.json();
    setAiOutput(resumeText);
  };

  return (
    <div className="ai-resume-page">
      <h1>AiResume Builder</h1>
      <p>Generate your ATS‑friendly resume with AI.</p>

      {/* Personal */}
      <section>
        <h2>Personal Info</h2>
        {['name','email','phone','address'].map(field => (
          <div key={field} className="field-group">
            {personal[field]?.saved ? (
              <>
                <span className="saved-text">{personal[field].value}</span>
                <button className="btn-delete" onClick={() => deletePersonal(field)}>Delete</button>
              </>
            ) : (
              <>
                <input
                  placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                />
                <button className="btn-save"
                  onClick={() => {
                    const val = document.querySelector(
                      `input[placeholder="${field.charAt(0).toUpperCase()+field.slice(1)}"]`
                    ).value;
                    savePersonal(field, val);
                  }}>
                  Save
                </button>
              </>
            )}
          </div>
        ))}
      </section>

      {/* Experience */}
      <section>
        <h2>Experience</h2>
        {sections.experience.map((item,i) => (
          <div key={i} className="entry-group">
            {item.saved ? (
              <>
                <span className="saved-text">{item.value}</span>
                <button className="btn-delete" onClick={() => deleteEntry('experience',i)}>Delete</button>
              </>
            ) : (
              <>
                <input placeholder="Entry" value={item.value}
                  onChange={e => handleEntryChange('experience',i,e.target.value)} />
                <button className="btn-save" onClick={() => saveEntry('experience',i)}>Save</button>
              </>
            )}
          </div>
        ))}
        <button className="btn-add" onClick={() => addEntry('experience')}>+ Add Experience</button>
      </section>

      {/* Education */}
      <section>
        <h2>Education</h2>
        {sections.education.map((e,i) => (
          <div key={i} className="entry-group">
            {e.saved ? (
              <>
                <div className="saved-edu">
                  <strong>{e.institution}</strong>, {e.course}<br/>
                  {e.from} – {e.pursuing ? 'Present' : e.to}
                </div>
                <button className="btn-delete" onClick={() => deleteEdu(i)}>Delete</button>
              </>
            ) : (
              <>
                <input placeholder="Institution" value={e.institution}
                  onChange={ev => handleEduChange(i,'institution',ev.target.value)} />
                <input placeholder="Course" value={e.course}
                  onChange={ev => handleEduChange(i,'course',ev.target.value)} />
                <input placeholder="From Year" value={e.from}
                  onChange={ev => handleEduChange(i,'from',ev.target.value)} />
                {!e.pursuing && (
                  <input placeholder="To Year" value={e.to}
                    onChange={ev => handleEduChange(i,'to',ev.target.value)} />
                )}
                <label>
                  <input type="checkbox" checked={e.pursuing}
                    onChange={ev => handleEduChange(i,'pursuing',ev.target.checked)} />
                  Still Pursuing
                </label>
                <button className="btn-save" onClick={() => saveEdu(i)}>Save</button>
              </>
            )}
          </div>
        ))}
        <button className="btn-add" onClick={addEducation}>+ Add Education</button>
      </section>

      {/* Skills */}
      <section>
        <h2>Skills</h2>
        {sections.skills.map((item,i) => (
          <div key={i} className="entry-group">
            {item.saved ? (
              <>
                <span className="saved-text">{item.value}</span>
                <button className="btn-delete" onClick={() => deleteEntry('skills',i)}>Delete</button>
              </>
            ) : (
              <>
                <input placeholder="Skill" value={item.value}
                  onChange={e => handleEntryChange('skills',i,e.target.value)} />
                <button className="btn-save" onClick={() => saveEntry('skills',i)}>Save</button>
              </>
            )}
          </div>
        ))}
        <button className="btn-add" onClick={() => addEntry('skills')}>+ Add Skill</button>
      </section>

      {/* Projects */}
      <section>
        <h2>Projects</h2>
        {sections.projects.map((item,i) => (
          <div key={i} className="entry-group">
            {item.saved ? (
              <>
                <span className="saved-text">{item.value}</span>
                <button className="btn-delete" onClick={() => deleteEntry('projects',i)}>Delete</button>
              </>
            ) : (
              <>
                <input placeholder="Project detail" value={item.value}
                  onChange={e => handleEntryChange('projects',i,e.target.value)} />
                <button className="btn-save" onClick={() => saveEntry('projects',i)}>Save</button>
              </>
            )}
          </div>
        ))}
        <button className="btn-add" onClick={() => addEntry('projects')}>+ Add Project</button>
      </section>

      {/* Generate */}
      <button className="btn-generate" onClick={generateAIResume}>Generate Resume</button>

      {aiOutput && (
        <section className="output-section">
          <h2>Your AI Resume</h2>
          <pre>{aiOutput}</pre>
        </section>
      )}
    </div>
  );
}
