import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { GitHubCalendar } from 'react-github-calendar';
import { ActivityCalendar } from 'react-activity-calendar';
import { Activity, Trophy, BrainCircuit, Calendar as CalendarIcon } from 'lucide-react';

interface LeetCodeStats {
  status: string;
  totalSolved: number;
  totalQuestions: number;
  easySolved: number;
  totalEasy: number;
  mediumSolved: number;
  totalMedium: number;
  hardSolved: number;
  totalHard: number;
  acceptanceRate: number;
  ranking: number;
  calendar: { date: string; count: number; level: 0 | 1 | 2 | 3 | 4 }[];
}

const Stats = () => {
  const [lcStats, setLcStats] = useState<LeetCodeStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  useEffect(() => {
    const currentTheme = (document.documentElement.getAttribute('data-theme') as 'light' | 'dark') || 'dark';
    setTheme(currentTheme);

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'data-theme') {
          const newTheme = document.documentElement.getAttribute('data-theme') as 'light' | 'dark';
          setTheme(newTheme || 'dark');
        }
      });
    });

    observer.observe(document.documentElement, { attributes: true });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    fetch('https://leetcode-api-faisalshohag.vercel.app/rohan_mukka')
      .then((res) => res.json())
      .then((data) => {
        let acceptanceRate = 0;
        if (data.totalSubmissions && data.totalSubmissions.length > 0) {
            const allSubs = data.totalSubmissions.find((s: any) => s.difficulty === "All");
            if (allSubs && allSubs.submissions > 0) {
                acceptanceRate = parseFloat(((allSubs.count / allSubs.submissions) * 100).toFixed(2));
            }
        }

        let calendarData: { date: string; count: number; level: 0 | 1 | 2 | 3 | 4 }[] = [];
        if (data.submissionCalendar) {
            const calendarObj = typeof data.submissionCalendar === "string" ? JSON.parse(data.submissionCalendar) : data.submissionCalendar;
            const entries = Object.entries(calendarObj);
            const dateMap = new Map<string, number>();
            
            entries.forEach(([timestampStr, count]) => {
                const timestamp = parseInt(timestampStr, 10);
                const date = new Date(timestamp * 1000);
                const dateStr = date.toISOString().split('T')[0];
                dateMap.set(dateStr, (dateMap.get(dateStr) || 0) + (count as number));
            });

            const today = new Date();
            const oneYearAgo = new Date();
            oneYearAgo.setFullYear(today.getFullYear() - 1);

            for (let d = new Date(oneYearAgo); d <= today; d.setDate(d.getDate() + 1)) {
                const dStr = d.toISOString().split('T')[0];
                const val = dateMap.get(dStr) || 0;
                let level = 0;
                if (val > 0) level = 1;
                if (val > 2) level = 2;
                if (val > 4) level = 3;
                if (val > 6) level = 4;
                calendarData.push({ date: dStr, count: val, level: level as 0|1|2|3|4 });
            }
        }

        setLcStats({
          status: "success",
          totalSolved: data.totalSolved,
          totalQuestions: data.totalQuestions,
          easySolved: data.easySolved,
          totalEasy: data.totalEasy,
          mediumSolved: data.mediumSolved,
          totalMedium: data.totalMedium,
          hardSolved: data.hardSolved,
          totalHard: data.totalHard,
          acceptanceRate: acceptanceRate,
          ranking: data.ranking,
          calendar: calendarData
        });
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching LeetCode stats:', err);
        setLoading(false);
      });
  }, []);

  return (
    <section id="stats" className="py-32 px-6 relative overflow-hidden flex items-center justify-center">
      <div className="max-w-7xl mx-auto w-full relative z-10">
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
        >
            <h2 className="text-4xl md:text-6xl font-display font-bold text-primary-text mb-6">
              Activity & Stats
            </h2>
            <p className="text-primary-secondary text-xl max-w-2xl mx-auto">
              A glimpse into my daily coding activity and problem-solving milestones.
            </p>
        </motion.div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            {/* GitHub Heatmap */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className={`p-8 rounded-xl border bg-transparent flex flex-col h-full col-span-1 ${theme === 'dark' ? 'border-[#30363d]' : 'border-gray-200 shadow-sm'}`}
            >
              <div className="w-full h-full flex items-center justify-center overflow-x-auto pb-4">
                <div className="min-w-fit px-4">
                  <GitHubCalendar 
                    username="rohanmukka" 
                    colorScheme={theme}
                    theme={{
                      light: ['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39'],
                      dark: ['#161b22', '#0e4429', '#006d32', '#26a641', '#39d353'],
                    }}
                    fontSize={12}
                    blockSize={11}
                    blockMargin={4}
                    showWeekdayLabels={true}
                  />
                </div>
              </div>
            </motion.div>

            {/* LeetCode Stats */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className={`p-8 rounded-3xl glass-card border flex flex-col h-full transition-all duration-300 ${theme === 'dark' ? 'bg-[#282828] border-gray-700/50 hover:border-gray-500/50' : 'bg-white border-gray-200 hover:border-gray-300 shadow-sm'}`}
            >
              <div className="flex items-center gap-4 mb-6">
                <h3 className={`text-lg font-bold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>Solved Problems</h3>
              </div>

              {loading || !lcStats ? (
                <div className="flex-grow flex items-center justify-center min-h-[250px]">
                  <div className="w-10 h-10 rounded-full border-2 border-primary-purple border-t-transparent animate-spin" />
                </div>
              ) : (
                <div className="flex flex-col gap-8 flex-grow">
                  <div className="flex items-center gap-8">
                    {/* Ring Chart */}
                    <div className="relative flex items-center justify-center flex-shrink-0" style={{ width: "120px", height: "120px" }}>
                      <svg width="120" height="120" className="transform -rotate-90">
                        {/* Base Track */}
                        <circle cx="60" cy="60" r="54" fill="none" stroke={theme === 'dark' ? "#444444" : "#f3f4f6"} strokeWidth="4" />
                        
                        {/* Easy Arc */}
                        {lcStats.totalSolved > 0 && (
                          <circle 
                            cx="60" cy="60" r="54" fill="none" stroke="#2cb55d" strokeWidth="4" strokeLinecap="round"
                            strokeDasharray={`${(lcStats.easySolved / lcStats.totalSolved) * (2 * Math.PI * 54)} ${2 * Math.PI * 54}`}
                            strokeDashoffset={0}
                          />
                        )}
                        {/* Medium Arc */}
                        {lcStats.totalSolved > 0 && (
                          <circle 
                            cx="60" cy="60" r="54" fill="none" stroke="#ffb800" strokeWidth="4" strokeLinecap="round"
                            strokeDasharray={`${(lcStats.mediumSolved / lcStats.totalSolved) * (2 * Math.PI * 54)} ${2 * Math.PI * 54}`}
                            strokeDashoffset={-((lcStats.easySolved / lcStats.totalSolved) * (2 * Math.PI * 54))}
                          />
                        )}
                        {/* Hard Arc */}
                        {lcStats.totalSolved > 0 && (
                          <circle 
                            cx="60" cy="60" r="54" fill="none" stroke="#ef4743" strokeWidth="4" strokeLinecap="round"
                            strokeDasharray={`${(lcStats.hardSolved / lcStats.totalSolved) * (2 * Math.PI * 54)} ${2 * Math.PI * 54}`}
                            strokeDashoffset={-(((lcStats.easySolved + lcStats.mediumSolved) / lcStats.totalSolved) * (2 * Math.PI * 54))}
                          />
                        )}
                      </svg>
                      <div className="absolute flex flex-col items-center justify-center">
                        <span className={`text-3xl font-bold leading-none mb-1 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{lcStats.totalSolved}</span>
                        <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Solved</span>
                      </div>
                    </div>

                    {/* Bars */}
                    <div className="flex flex-col flex-grow justify-center gap-4">
                      {/* Easy */}
                      <div className="flex flex-col gap-1.5">
                        <div className="flex justify-between items-end text-sm">
                          <span className="text-[#2cb55d] font-medium">Easy</span>
                          <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}><span className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{lcStats.easySolved}</span>/{lcStats.totalEasy}</span>
                        </div>
                        <div className={`w-full rounded-full h-1.5 overflow-hidden ${theme === 'dark' ? 'bg-[#444444]' : 'bg-gray-200'}`}>
                          <div className="bg-[#2cb55d] h-full rounded-full" style={{ width: `${(lcStats.easySolved / lcStats.totalEasy) * 100}%` }}></div>
                        </div>
                      </div>
                      
                      {/* Medium */}
                      <div className="flex flex-col gap-1.5">
                        <div className="flex justify-between items-end text-sm">
                          <span className="text-[#ffb800] font-medium">Medium</span>
                          <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}><span className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{lcStats.mediumSolved}</span>/{lcStats.totalMedium}</span>
                        </div>
                        <div className={`w-full rounded-full h-1.5 overflow-hidden ${theme === 'dark' ? 'bg-[#444444]' : 'bg-gray-200'}`}>
                          <div className="bg-[#ffb800] h-full rounded-full" style={{ width: `${(lcStats.mediumSolved / lcStats.totalMedium) * 100}%` }}></div>
                        </div>
                      </div>

                      {/* Hard */}
                      <div className="flex flex-col gap-1.5">
                        <div className="flex justify-between items-end text-sm">
                          <span className="text-[#ef4743] font-medium">Hard</span>
                          <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}><span className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{lcStats.hardSolved}</span>/{lcStats.totalHard}</span>
                        </div>
                        <div className={`w-full rounded-full h-1.5 overflow-hidden ${theme === 'dark' ? 'bg-[#444444]' : 'bg-gray-200'}`}>
                          <div className="bg-[#ef4743] h-full rounded-full" style={{ width: `${(lcStats.hardSolved / lcStats.totalHard) * 100}%` }}></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Submission Calendar */}
                  <div className="mt-auto overflow-x-auto pb-4">
                    <div className="min-w-fit flex justify-center px-4">
                      {lcStats.calendar && lcStats.calendar.length > 0 ? (
                        <ActivityCalendar 
                          data={lcStats.calendar} 
                          theme={{
                            light: ['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39'],
                            dark: ['#282828', '#0e4429', '#006d32', '#26a641', '#39d353'],
                          }}
                          colorScheme={theme}
                          fontSize={12}
                          blockSize={11}
                          blockMargin={4}
                          hideColorLegend={true}
                          hideTotalCount={true}
                          showWeekdayLabels={true}
                        />
                      ) : (
                        <p className="text-sm text-primary-secondary">No submission data found.</p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Stats;
