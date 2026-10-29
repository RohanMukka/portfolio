import React, { useEffect, useState } from 'react';
import './ResumeButton.css';
import { Download } from 'lucide-react';
import { RESUME_FILE, RESUME_URL } from '../lib/resume';

interface ResumeButtonProps {
  isCompact?: boolean;
}

// A plain download link: the file starts downloading on the click itself,
// and the button's fill animation plays alongside as feedback.
const ResumeButton = ({ isCompact = false }: ResumeButtonProps) => {
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (!playing) return;
    const timer = window.setTimeout(() => setPlaying(false), 1400);
    return () => window.clearTimeout(timer);
  }, [playing]);

  return (
    <a
      href={RESUME_URL}
      download={RESUME_FILE}
      aria-label="Resume (PDF)"
      onClick={() => setPlaying(true)}
      className={`resume-label ${isCompact ? 'compact' : ''} ${playing ? 'is-playing' : ''}`}
    >
      <span className="resume-circle">
        <Download className="resume-icon" aria-hidden="true" />
        <span className="resume-square" />
      </span>
      {!isCompact && (
        <>
          <span className="resume-title text-base font-semibold">Resume</span>
          <span className="resume-title text-base font-semibold">Resume</span>
        </>
      )}
    </a>
  );
};

export default ResumeButton;
