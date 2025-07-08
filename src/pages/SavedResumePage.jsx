// src/pages/SavedResumePage.jsx
import React, { useEffect, useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import '../styles/SavedResumePage.css';

export default function SavedResumePage() {
  const [resumes, setResumes] = useState({});
  const printableRef = useRef();

  useEffect(() => {
    setResumes(JSON.parse(localStorage.getItem('resumes') || '{}'));
    // jsPDF needs html2canvas available globally
    window.html2canvas = html2canvas;
  }, []);

  const deleteResume = (name) => {
    const all = { ...resumes };
    delete all[name];
    localStorage.setItem('resumes', JSON.stringify(all));
    setResumes(all);
  };

  const downloadPdf = async (name) => {
    const data = resumes[name];
    if (!printableRef.current) return;

    printableRef.current.innerHTML = renderResumeHtml(name, data);
    const canvas = await html2canvas(printableRef.current, { scale: 2 });
    const img = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'pt', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    pdf.addImage(img, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`${name}.pdf`);
  };

  const renderResumeHtml = (name, data) => {
    const { personal, bio, sections } = data;
    const p = personal;
    const phone = p.phone?.saved ? p.phone.value : '';
    const email = p.email?.saved ? p.email.value : '';
    const address = p.address?.saved ? p.address.value : '';

    let html = `<div style="font-family:Arial;padding:20px;color:#000;line-height:1.4;">
      <h1 style="text-align:center;margin-bottom:5px;">${name}</h1>
      <div style="text-align:center;font-size:12px;margin-bottom:5px;">
        ${phone}${phone && email ? ' • ' : ''}${email}${(phone || email) && address ? ' • ' : ''}${address}
      </div>
      <hr />`;

    if (bio.saved) {
      html += `<h2>Bio</h2><p>${bio.value}</p><hr />`;
    }
    if (sections.experience.length) {
      html += `<h2>Experience</h2>`;
      sections.experience.forEach(e => {
        html += `<p><strong>${e.company}</strong> – ${e.title} (${e.from}–${e.pursuing ? 'Present' : e.to})</p>`;
      });
      html += `<hr />`;
    }
    if (sections.projects.length) {
      html += `<h2>Projects</h2>`;
      sections.projects.forEach(pj => {
        html += `<p><strong>${pj.name}</strong>: ${pj.details}</p>`;
      });
      html += `<hr />`;
    }
    if (sections.skills.length) {
      html += `<h2>Skills</h2><p>${sections.skills.map(s => s.skill).join(', ')}</p>`;
    }
    html += `</div>`;
    return html;
  };

  return (
    <div className="ai-resume-page">
      <h1>Saved Resumes</h1>
      {Object.keys(resumes).length === 0 ? (
        <p>No saved resumes yet.</p>
      ) : (
        <ul>
          {Object.keys(resumes).map(name => (
            <li key={name} className="saved-item">
              <span>{name}</span>
              <button className="btn-save" onClick={() => downloadPdf(name)}>Download PDF</button>
              <button className="btn-delete" onClick={() => deleteResume(name)}>Delete</button>
            </li>
          ))}
        </ul>
      )}
      <div ref={printableRef} style={{ position:'absolute', top: '-9999px', left: '-9999px' }} />
    </div>
  );
}
