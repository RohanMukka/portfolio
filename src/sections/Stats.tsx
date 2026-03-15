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
              className="p-8 rounded-3xl glass-card border border-glass-border flex flex-col h-full hover:border-primary-text/20 transition-all duration-300"
            >
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 rounded-full bg-surface-subtle/50 border border-white/5 shadow-inner">
                  <Activity className="w-6 h-6 text-electric-cyan" />
                </div>
                <h3 className="text-2xl font-display font-bold text-primary-text">GitHub Contributions</h3>
              </div>
              
              <div className="flex-grow flex items-center justify-center w-full overflow-x-auto overflow-y-hidden pb-4 custom-scrollbar">
                <div className="min-w-[750px] flex justify-center">
                  <GitHubCalendar 
                    username="rohanmukka" 
                    colorScheme="dark"
                    theme={{
                      dark: ['#161b22', '#0e4429', '#006d32', '#26a641', '#39d353'],
                    }}
                    fontSize={14}
                    blockSize={14}
                    blockMargin={5}
                  />
                </div>
              </div>
            </motion.div>

            {/* LeetCode Stats */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="p-8 rounded-3xl glass-card border border-glass-border flex flex-col h-full hover:border-primary-text/20 transition-all duration-300"
            >
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 rounded-full bg-surface-subtle/50 border border-white/5 shadow-inner">
                  <BrainCircuit className="w-6 h-6 text-primary-purple" />
                </div>
                <h3 className="text-2xl font-display font-bold text-primary-text">LeetCode Progress</h3>
              </div>

              {loading || !lcStats ? (
                <div className="flex-grow flex items-center justify-center min-h-[250px]">
                  <div className="w-10 h-10 rounded-full border-2 border-primary-purple border-t-transparent animate-spin" />
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4 flex-grow">
                  <div className="col-span-2 p-6 rounded-2xl bg-surface-subtle/30 border border-white/5 flex items-center justify-between hover:bg-white/5 transition-colors">
                    <div>
                      <p className="text-sm text-primary-secondary mb-1">Total Solved</p>
                      <p className="text-5xl font-display font-bold text-primary-text">{lcStats.totalSolved}</p>
                    </div>
                    <Trophy className="w-16 h-16 text-primary-orange opacity-80" />
                  </div>
                  
                  <div className="p-5 rounded-2xl bg-surface-subtle/30 border border-white/5 hover:bg-white/5 transition-colors flex flex-col justify-center">
                    <p className="text-sm text-primary-secondary mb-1">Easy</p>
                    <p className="text-3xl font-display font-bold text-primary-green tracking-tight">{lcStats.easySolved} <span className="text-sm font-normal text-primary-secondary">/ {lcStats.totalEasy}</span></p>
                  </div>
                  
                  <div className="p-5 rounded-2xl bg-surface-subtle/30 border border-white/5 hover:bg-white/5 transition-colors flex flex-col justify-center">
                    <p className="text-sm text-primary-secondary mb-1">Medium</p>
                    <p className="text-3xl font-display font-bold text-primary-orange tracking-tight">{lcStats.mediumSolved} <span className="text-sm font-normal text-primary-secondary">/ {lcStats.totalMedium}</span></p>
                  </div>

                  <div className="p-5 rounded-2xl bg-surface-subtle/30 border border-white/5 hover:bg-white/5 transition-colors flex flex-col justify-center">
                    <p className="text-sm text-primary-secondary mb-1">Hard</p>
                    <p className="text-3xl font-display font-bold text-primary-pink tracking-tight">{lcStats.hardSolved} <span className="text-sm font-normal text-primary-secondary">/ {lcStats.totalHard}</span></p>
                  </div>

                  <div className="p-5 rounded-2xl bg-surface-subtle/30 border border-white/5 hover:bg-white/5 transition-colors flex flex-col justify-center">
                    <p className="text-sm text-primary-secondary mb-1">Acceptance Rate</p>
                    <p className="text-3xl font-display font-bold text-electric-cyan tracking-tight">{lcStats.acceptanceRate}%</p>
                  </div>
                  <div className="col-span-2 mt-4 p-6 rounded-2xl bg-surface-subtle/30 border border-white/5 hover:bg-white/5 transition-colors">
                    <div className="flex items-center gap-2 mb-4">
                      <CalendarIcon className="w-5 h-5 text-electric-cyan" />
                      <h4 className="text-lg font-display font-bold text-primary-text">Submissions in Last Year</h4>
                    </div>
                    <div className="w-full flex justify-center overflow-x-auto custom-scrollbar pb-2">
                      <div className="min-w-[650px] flex justify-center">
                        {lcStats.calendar && lcStats.calendar.length > 0 ? (
                          <ActivityCalendar 
                            data={lcStats.calendar} 
                            theme={{
                              dark: ['#161b22', '#0e4429', '#006d32', '#26a641', '#39d353'],
                            }}
                            colorScheme="dark"
                            fontSize={14}
                            blockSize={14}
                            blockMargin={5}
                            hideColorLegend={false}
                            hideTotalCount={true}
                          />
                        ) : (
                          <p className="text-sm text-primary-secondary">No submission data found.</p>
                        )}
                      </div>
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
