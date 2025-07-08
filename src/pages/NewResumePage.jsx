// src/pages/NewResumePage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/AiResumePage.css';

export default function NewResumePage() {
  const navigate = useNavigate();
  const [personal, setPersonal] = useState({});
  const [bio, setBio] = useState({ value: '', saved: false });
  const [sections, setSections] = useState({
    experience: [],
    education: [],
    skills: [],
    projects: []
  });

  // Load saved data on mount
  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('resumeData') || '{}');
    setPersonal(data.personal || {});
    setBio(data.bio || { value: '', saved: false });
    setSections(data.sections || {
      experience: [],
      education: [],
      skills: [],
      projects: []
    });
  }, []);

  // Sync personal + bio
  useEffect(() => {
    const base = JSON.parse(localStorage.getItem('resumeData') || '{}');
    localStorage.setItem(
      'resumeData',
      JSON.stringify({ ...base, personal, bio })
    );
  }, [personal, bio]);

  // Sync sections
  useEffect(() => {
    const base = JSON.parse(localStorage.getItem('resumeData') || '{}');
    localStorage.setItem(
      'resumeData',
      JSON.stringify({ ...base, sections })
    );
  }, [sections]);

  // Handlers for Personal Info
  const savePersonal = (field, val) =>
    setPersonal(p => ({ ...p, [field]: { value: val.trim(), saved: true } }));
  const deletePersonal = field =>
    setPersonal(p => {
      const copy = { ...p };
      delete copy[field];
      return copy;
    });

  // Handlers for Bio
  const saveBio = () => bio.value.trim() && setBio({ ...bio, saved: true });
  const deleteBio = () => setBio({ value: '', saved: false });

  // Experience handlers
  const addExperience = () =>
    setSections(s => ({
      ...s,
      experience: [
        ...s.experience,
        { company: '', title: '', from: '', to: '', pursuing: false, saved: false }
      ]
    }));
  const changeExp = (index, field, val) =>
    setSections(s => {
      const arr = [...s.experience];
      arr[index][field] = val;
      return { ...s, experience: arr };
    });
  const saveExp = index =>
    setSections(s => {
      const arr = [...s.experience];
      arr[index].saved = true;
      return { ...s, experience: arr };
    });
  const deleteExp = index =>
    setSections(s => {
      const arr = [...s.experience];
      arr.splice(index, 1);
      return { ...s, experience: arr };
    });

  // Projects handlers
  const addProject = () =>
    setSections(s => ({
      ...s,
      projects: [...s.projects, { name: '', details: '', saved: false }]
    }));
  const changeProj = (index, field, val) =>
    setSections(s => {
      const arr = [...s.projects];
      arr[index][field] = val;
      return { ...s, projects: arr };
    });
  const saveProj = index =>
    setSections(s => {
      const arr = [...s.projects];
      arr[index].saved = true;
      return { ...s, projects: arr };
    });
  const deleteProj = index =>
    setSections(s => {
      const arr = [...s.projects];
      arr.splice(index, 1);
      return { ...s, projects: arr };
    });

  // Skills handlers
  const addSkill = () =>
    setSections(s => ({
      ...s,
      skills: [...s.skills, { skill: '', saved: false }]
    }));
  const changeSkill = (index, val) =>
    setSections(s => {
      const arr = [...s.skills];
      arr[index].skill = val;
      return { ...s, skills: arr };
    });
  const saveSkill = index =>
    setSections(s => {
      const arr = [...s.skills];
      arr[index].saved = true;
      return { ...s, skills: arr };
    });
  const deleteSkill = index =>
    setSections(s => {
      const arr = [...s.skills];
      arr.splice(index, 1);
      return { ...s, skills: arr };
    });

  // Save resume as named entry
  const saveResume = () => {
    const name = prompt('Enter a name for this resume:');
    if (!name) return;
    const all = JSON.parse(localStorage.getItem('resumes') || '{}');
    all[name] = { personal, bio, sections };
    localStorage.setItem('resumes', JSON.stringify(all));
    navigate('/saved');
  };

  return (
    <div className="ai-resume-page">
      <h1>New Resume</h1>

      {/* Personal Info Section */}
      <section>
        <h2>Personal Info</h2>
        {['name', 'email', 'phone', 'address'].map(field => (
          <div key={field} className="field-group">
            {personal[field]?.saved ? (
              <>
                <span className="saved-text">{personal[field].value}</span>
                <button className="btn-delete" onClick={() => deletePersonal(field)}>Delete</button>
              </>
            ) : (
              <>
                <input placeholder={field.charAt(0).toUpperCase() + field.slice(1)} />
                <button className="btn-save" onClick={() => {
                  const input = document.querySelector(`input[placeholder="${field.charAt(0).toUpperCase() + field.slice(1)}"]`);
                  if (input) savePersonal(field, input.value);
                }}>Save</button>
              </>
            )}
          </div>
        ))}
      </section>

      {/* Bio Section */}
      <section>
        <h2>Bio</h2>
        <div className="field-group">
          {bio.saved ? (
            <>
              <p className="saved-text">{bio.value}</p>
              <button className="btn-delete" onClick={deleteBio}>Delete</button>
            </>
          ) : (
            <>
              <textarea
                placeholder="Tell us about yourself..."
                value={bio.value}
                onChange={e => setBio({ value: e.target.value, saved: false })}
              />
              <button className="btn-save" onClick={saveBio}>Save</button>
            </>
          )}
        </div>
      </section>

      {/* Experience Section */}
      <section>
        <h2>Experience</h2>
        {sections.experience.map((exp, i) => (
          <div key={i} className="entry-group">
            {exp.saved ? (
              <>
                <div className="saved-edu">
                  <strong>{exp.company}</strong> – {exp.title}<br />
                  {exp.from} – {exp.pursuing ? 'Present' : exp.to}
                </div>
                <button className="btn-delete" onClick={() => deleteExp(i)}>Delete</button>
              </>
            ) : (
              <>
                <div className="side-by-side">
                  <input placeholder="Company" value={exp.company} onChange={e => changeExp(i, 'company', e.target.value)} />
                  <input placeholder="Title" value={exp.title} onChange={e => changeExp(i, 'title', e.target.value)} />
                </div>
                <div className="side-by-side">
                  <input placeholder="From Year" value={exp.from} onChange={e => changeExp(i, 'from', e.target.value)} />
                  {!exp.pursuing && (
                    <input placeholder="To Year" value={exp.to} onChange={e => changeExp(i, 'to', e.target.value)} />
                  )}
                </div>
                <label>
                  <input type="checkbox" checked={exp.pursuing} onChange={e => changeExp(i, 'pursuing', e.target.checked)} />
                  Still Pursuing
                </label>
                <button className="btn-save" onClick={() => saveExp(i)}>Save</button>
              </>
            )}
          </div>
        ))}
        <button className="btn-add" onClick={addExperience}>+ Add Experience</button>
      </section>

      {/* Projects Section */}
      <section>
        <h2>Projects</h2>
        {sections.projects.map((proj, i) => (
          <div key={i} className="entry-group">
            {proj.saved ? (
              <>
                <div className="saved-edu">
                  <strong>{proj.name}</strong><br />{proj.details}
                </div>
                <button className="btn-delete" onClick={() => deleteProj(i)}>Delete</button>
              </>
            ) : (
              <>
                <input placeholder="Project Name" value={proj.name} onChange={e => changeProj(i, 'name', e.target.value)} />
                <input placeholder="Project Details" value={proj.details} onChange={e => changeProj(i, 'details', e.target.value)} />
                <button className="btn-save" onClick={() => saveProj(i)}>Save</button>
              </>
            )}
          </div>
        ))}
        <button className="btn-add" onClick={addProject}>+ Add Project</button>
      </section>

      {/* Skills Section */}
      <section>
        <h2>Skills</h2>
        {sections.skills.map((s, i) => (
          <div key={i} className="entry-group">
            {s.saved ? (
              <>
                <span className="saved-text">{s.skill}</span>
                <button className="btn-delete" onClick={() => deleteSkill(i)}>Delete</button>
              </>
            ) : (
              <>
                <input placeholder="Skill" value={s.skill} onChange={e => changeSkill(i, e.target.value)} />
                <button className="btn-save" onClick={() => saveSkill(i)}>Save</button>
              </>
            )}
          </div>
        ))}
        <button className="btn-add" onClick={addSkill}>+ Add Skill</button>
      </section>

      {/* Save Resume Button */}
      <button className="btn-generate" onClick={saveResume}>
        Save Resume
      </button>
    </div>
  );
}
