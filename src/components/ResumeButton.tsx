import React, { useState } from 'react';
import './ResumeButton.css';
import { Download } from 'lucide-react';

interface ResumeButtonProps {
  isCompact?: boolean;
}

const ResumeButton = ({ isCompact = false }: ResumeButtonProps) => {
  const [isChecked, setIsChecked] = useState(false);

  const handleDownload = () => {
    if (!isChecked) {
      setIsChecked(true);
      const baseUrl = import.meta.env.BASE_URL || '/';
      setTimeout(() => {
        const link = document.createElement('a');
        link.href = `${baseUrl}Rohan_Mukka_Resume.pdf`;
        link.download = 'Rohan_Mukka_Resume.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setTimeout(() => {
          setIsChecked(false);
        }, 1500); 
      }, 3500);
    }
  };

  return (
    <label className={`resume-label ${isCompact ? 'compact' : ''}`}>
      <input 
        type="checkbox" 
        className="resume-input" 
        checked={isChecked}
        onChange={handleDownload}
        disabled={isChecked} 
      />
      <span className="resume-circle">
        <Download className="resume-icon" />
        <div className="resume-square"></div>
      </span>
      {!isCompact && (
        <>
          <p className="resume-title text-base font-semibold">Resume</p>
          <p className="resume-title text-base font-semibold">Resume</p>
        </>
      )}
    </label>
  );
};

export default ResumeButton;
