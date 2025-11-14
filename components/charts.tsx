import React, { useState } from 'react';
import { LineChart, Line, BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine, Label } from 'recharts';
import { Fixture } from '../types';
import { chartLogos, stats2425AllComps } from '../constants';
import { Card } from './ui';

const CustomTooltip: React.FC<any> = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="p-2 bg-white/80 dark:bg-dark-card/80 backdrop-blur-sm text-gray-800 dark:text-gray-200 rounded-md border border-gray-300 dark:border-dark-border text-sm shadow-lg">
                <p className="font-bold">{payload[0].payload.opponent || label}</p>
                {payload.map((pld: any, index: number) => (
                    <p key={index} style={{ color: pld.color || pld.fill }}>
                        {pld.name}: {pld.value}{pld.unit || ''}
                    </p>
                ))}
            </div>
        );
    }
    return null;
};


const getOrdinal = (n: number) => {
    const s = ["th", "st", "nd", "rd"], v = n % 100;
    return s[(v - 20) % 10] || s[v] || s[0];
};

const CustomDot: React.FC<any> = (props) => {
    const { cx, cy, payload } = props;
    if (!payload.opponent) return null;

    const logo = chartLogos[payload.opponent];
    
    return (
        <g>
            {logo ? (
                <image href={logo} x={cx - 15} y={cy - 15} height="30" width="30" />
            ) : (
                 <circle cx={cx} cy={cy} r={4} fill="#b4191d" stroke="none" />
            )}
        </g>
    );
};

const ActiveCustomDot: React.FC<any> = (props) => {
    const { cx, cy, payload } = props;
    if (!payload || !payload.opponent) return null;

    const logo = chartLogos[payload.opponent];
    let strokeColor = '#b4191d'; // Default for PositionChart

    // Check if it's CumulativeChart by looking for 'diff' property
    if (payload.diff !== undefined) {
        strokeColor = payload.diff >= 0 ? '#16a34a' : '#dc2626';
    }

    return (
        <g>
            {logo ? (
                <>
                    <image href={logo} x={cx - 15} y={cy - 15} height="30" width="30" />
                    <circle cx={cx} cy={cy} r={16} fill="transparent" stroke={strokeColor} strokeWidth={2} />
                </>
            ) : (
                 <circle cx={cx} cy={cy} r={6} fill="white" stroke={strokeColor} strokeWidth={2} />
            )}
        </g>
    );
};

export const PositionChart: React.FC<{ data: { name: string; '24/25': number | null; '25/26': number | null, opponent: string | null }[], theme: 'light' | 'dark' }> = ({ data, theme }) => (
    <Card title="📈 The Climb: PL Position Tracker" contentClassName="h-80 overflow-x-auto">
        <div className="min-w-[600px] h-full">
            <ResponsiveContainer>
                <LineChart data={data} margin={{ top: 15, right: 20, left: -20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                    <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                    <YAxis reversed={true} domain={[1, 20]} tickCount={20} tickFormatter={(tick) => `${tick}${getOrdinal(tick)}`} tick={{ fontSize: 10 }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{fontSize: "12px"}}/>
                    <Line type="monotone" dataKey="24/25" stroke="#a0aec0" strokeWidth={2} dot={false} unit="th" />
                    <Line type="monotone" dataKey="25/26" stroke="#b4191d" strokeWidth={3} dot={<CustomDot />} activeDot={<ActiveCustomDot />} unit="th" />
                </LineChart>
            </ResponsiveContainer>
        </div>
    </Card>
);

export const CumulativeChart: React.FC<{ data: { name: string; diff: number, opponent: string | null }[], theme: 'light' | 'dark' }> = ({ data, theme }) => {
    const allDiffs = data.map(d => d.diff);
    const min = Math.min(...allDiffs, 0);
    const max = Math.max(...allDiffs, 0);
    
    let zeroPoint = 0.5;
    if (max - min !== 0) {
        if (max <= 0) {
            zeroPoint = 0; // All negative, zero is at the top
        } else if (min >= 0) {
            zeroPoint = 1; // All positive, zero is at the bottom
        } else {
            zeroPoint = max / (max - min);
        }
    }

    const gradientId = "colorDiff";
    const strokeGradientId = "strokeColorDiff";

    return (
    <Card title="⚔️ Points Swing: vs 24/25 Pace" contentClassName="h-80 overflow-x-auto">
        <div className="min-w-[600px] h-full">
            <ResponsiveContainer>
                <AreaChart data={data} margin={{ top: 15, right: 20, left: -10, bottom: 5 }}>
                    <defs>
                        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                             <stop offset={0} stopColor="#22c55e" stopOpacity={0.4} />
                             <stop offset={zeroPoint} stopColor="#22c55e" stopOpacity={0.4} />
                             <stop offset={zeroPoint} stopColor="#ef4444" stopOpacity={0.4} />
                             <stop offset={1} stopColor="#ef4444" stopOpacity={0.4} />
                        </linearGradient>
                        <linearGradient id={strokeGradientId} x1="0" y1="0" x2="0" y2="1">
                             <stop offset={0} stopColor="#16a34a" />
                             <stop offset={zeroPoint} stopColor="#16a34a" />
                             <stop offset={zeroPoint} stopColor="#dc2626" />
                             <stop offset={1} stopColor="#dc2626" />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2}/>
                    <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                    <YAxis tickFormatter={(tick) => tick > 0 ? `+${tick}` : tick} tick={{ fontSize: 10 }}/>
                    <Tooltip content={<CustomTooltip />} />
                    <ReferenceLine y={0} stroke="#4a5568" strokeWidth={2} />
                    <Area type="monotone" dataKey="diff" stroke={`url(#${strokeGradientId})`} strokeWidth={3} fillOpacity={1} fill={`url(#${gradientId})`} dot={<CustomDot />} activeDot={<ActiveCustomDot />} unit=" pts" />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    </Card>
    );
};

export const SeasonPhaseChart: React.FC<{ fixtures: Fixture[] }> = ({ fixtures }) => {
    const phases = [
        { name: 'MW 1-10', start: 1, end: 10 },
        { name: 'MW 11-19', start: 11, end: 19 },
        { name: 'MW 20-29', start: 20, end: 29 },
        { name: 'MW 30-38', start: 30, end: 38 }
    ];

    const getPointsAtMW = (season: '2425' | '2526', targetMw: number): number => {
        const ptsKey = season === '2425' ? 'pts2425' : 'pts2526';
        
        const relevantFixtures = fixtures
            .filter(f => f.league === 'PL' && typeof f.mw === 'number' && f.mw <= targetMw && f[ptsKey] != null)
            .sort((a, b) => (b.mw as number) - (a.mw as number));

        return relevantFixtures.length > 0 ? relevantFixtures[0][ptsKey] as number : 0;
    };

    let lastPts2425 = 0;
    let lastPts2526 = 0;

    const data = phases.map(phase => {
        const totalPtsAtEndOfPhase2425 = getPointsAtMW('2425', phase.end);
        const totalPtsAtEndOfPhase2526 = getPointsAtMW('2526', phase.end);

        const phasePts2425 = totalPtsAtEndOfPhase2425 > 0 ? totalPtsAtEndOfPhase2425 - lastPts2425 : 0;
        const phasePts2526 = totalPtsAtEndOfPhase2526 > 0 ? totalPtsAtEndOfPhase2526 - lastPts2526 : 0;
        
        lastPts2425 = totalPtsAtEndOfPhase2425;
        lastPts2526 = totalPtsAtEndOfPhase2526;

        return {
            name: phase.name,
            '24/25': phasePts2425,
            '25/26': phasePts2526,
        };
    });

    return (
    <Card title="⏱️ Season Breakdown: Points/Quarter" contentClassName="h-80">
        <ResponsiveContainer>
            <BarChart data={data} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2}/>
                <XAxis dataKey="name" tick={{ fontSize: 10 }}/>
                <YAxis tick={{ fontSize: 10 }}/>
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{fontSize: "12px"}}/>
                <Bar dataKey="24/25" fill="#a0aec0" unit=" pts" />
                <Bar dataKey="25/26" fill="#b4191d" unit=" pts" />
            </BarChart>
        </ResponsiveContainer>
    </Card>
    );
};

const SeasonStatsTooltip: React.FC<any> = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        // This is the desired, fixed order for display
        const leaguesInOrder = ["PL", "UCL", "FA", "EFL"] as const;

        // Group payload by season
        const payload2526 = payload.filter((p: any) => p.dataKey.includes('25/26'));
        const payload2425 = payload.filter((p: any) => p.dataKey.includes('24/25'));

        const total2526 = payload2526.reduce((sum: number, p: any) => sum + p.value, 0);
        const total2425 = payload2425.reduce((sum: number, p: any) => sum + p.value, 0);

        const renderSeasonStats = (season: '24/25' | '25/26', total: number, seasonPayload: any[]) => (
            <div>
                <p className="font-semibold text-gray-600 dark:text-gray-300">{season}: <span className="font-bold text-black dark:text-white">{total}</span></p>
                {leaguesInOrder.map(league => {
                    const pld = seasonPayload.find((p: any) => p.dataKey === `${league} ${season}`);
                    if (!pld || pld.value === 0) return null;
                    return (
                        <p key={pld.dataKey} style={{ color: pld.fill, marginLeft: '8px' }}>
                            {league}: {pld.value}
                        </p>
                    );
                })}
            </div>
        );

        return (
            <div className="p-2 bg-white/80 dark:bg-dark-card/80 backdrop-blur-sm rounded-md border border-gray-300 dark:border-dark-border text-sm shadow-lg">
                <p className="font-bold text-base mb-2 text-gray-900 dark:text-gray-100">{label}</p>
                <div className="grid grid-cols-2 gap-x-4">
                    {renderSeasonStats('25/26', total2526, payload2526)}
                    {renderSeasonStats('24/25', total2425, payload2425)}
                </div>
            </div>
        );
    }
    return null;
};


export const SeasonStatsChart: React.FC<{fixtures: Fixture[]}> = ({fixtures}) => {
    const leagues = ["PL", "UCL", "FA", "EFL"] as const;
    const leaguesToRender = ["PL", "UCL", "FA", "EFL"] as const; // Fixed order for rendering
    type League = typeof leagues[number];

    const [selectedLeagues, setSelectedLeagues] = useState<Record<League, boolean>>({ PL: true, UCL: true, FA: true, EFL: true });
    const [selectedSeasons, setSelectedSeasons] = useState({ '24/25': true, '25/26': true });

    const handleLeagueChange = (league: League) => {
        setSelectedLeagues(prev => ({...prev, [league]: !prev[league]}));
    };
    const handleSeasonChange = (season: '24/25' | '25/26') => {
        setSelectedSeasons(prev => ({...prev, [season]: !prev[season]}));
    };
    
    const stats2526 = {
        goals: { PL: 0, UCL: 0, FA: 0, EFL: 0 },
        conceded: { PL: 0, UCL: 0, FA: 0, EFL: 0 },
        cleanSheets: { PL: 0, UCL: 0, FA: 0, EFL: 0 },
    };

    fixtures.forEach(m => {
        if (!m.league || !m.score2526) return;

        const [homeScore, awayScore] = m.score2526.split('-').map(Number);
        if (isNaN(homeScore) || isNaN(awayScore)) return;

        const [scored, against] = m.venue === 'Home' ? [homeScore, awayScore] : [awayScore, homeScore];

        switch (m.league) {
            case 'PL':
            case 'UCL':
            case 'FA':
            case 'EFL':
                stats2526.goals[m.league] += scored;
                stats2526.conceded[m.league] += against;
                if (against === 0 && (m.result2526 === 'W' || m.result2526 === 'D')) {
                    stats2526.cleanSheets[m.league]++;
                }
                break;
        }
    });

    const data = [
        { name: 'Goals Scored' },
        { name: 'Goals Conceded' },
        { name: 'Clean Sheets' },
    ].map(item => {
        const statsItem: any = { name: item.name };
        leagues.forEach(l => {
            statsItem[`${l} 24/25`] = stats2425AllComps[item.name === 'Goals Scored' ? 'goals' : item.name === 'Goals Conceded' ? 'conceded' : 'cleanSheets'][l];
            statsItem[`${l} 25/26`] = stats2526[item.name === 'Goals Scored' ? 'goals' : item.name === 'Goals Conceded' ? 'conceded' : 'cleanSheets'][l];
        });
        return statsItem;
    });
    
    const colors = {
        PL: { s2526: '#8A2BE2', s2425: '#E6E6FA' },
        UCL: { s2526: '#0000FF', s2425: '#ADD8E6' },
        FA: { s2526: '#FF0000', s2425: '#FFB6C1' },
        EFL: { s2526: '#008000', s2425: '#98FB98' },
    };

    const Checkbox: React.FC<{label: string, checked: boolean, onChange: () => void}> = ({label, checked, onChange}) => (
        <label className="flex items-center space-x-2 cursor-pointer text-gray-700 dark:text-gray-300">
            <input type="checkbox" checked={checked} onChange={onChange} className="h-4 w-4 accent-arsenal-red rounded-sm focus:ring-arsenal-red focus:ring-2" />
            <span className="font-medium">{label}</span>
        </label>
    );

    const legendOrder: League[] = ['PL', 'UCL', 'FA', 'EFL'];

    return (
        <Card title="📊 Goal Diff & CS - By The Numbers">
            <div className="h-80">
                <ResponsiveContainer>
                <BarChart data={data} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2}/>
                    <XAxis dataKey="name" tick={{ fontSize: 10 }}/>
                    <YAxis tick={{ fontSize: 10 }} />
                    <Tooltip content={<SeasonStatsTooltip />} cursor={{fill: 'rgba(128,128,128,0.1)'}} />
                    {leaguesToRender.map(l => {
                        if (selectedLeagues[l] && selectedSeasons['24/25']) {
                            return <Bar key={`${l} 24/25`} dataKey={`${l} 24/25`} stackId="24/25" fill={colors[l].s2425} name={`${l} 24/25`} />;
                        }
                        return null;
                    })}
                    {leaguesToRender.map(l => {
                        if (selectedLeagues[l] && selectedSeasons['25/26']) {
                            return <Bar key={`${l} 25/26`} dataKey={`${l} 25/26`} stackId="25/26" fill={colors[l].s2526} name={`${l} 25/26`} />;
                        }
                        return null;
                    })}
                </BarChart>
            </ResponsiveContainer>
            </div>
            <div className="flex flex-col items-center justify-center mt-2 text-xs gap-y-1">
                {/* Custom Legend */}
                <div className="flex items-center justify-center gap-x-3 sm:gap-x-4">
                    {legendOrder.map(league => (
                        <div key={`${league}-2526`} className="flex items-center gap-1.5">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors[league].s2526 }}></div>
                            <span style={{ color: colors[league].s2526 }} className="font-semibold">{`${league} 25/26`}</span>
                        </div>
                    ))}
                </div>
                <div className="flex items-center justify-center gap-x-3 sm:gap-x-4">
                    {legendOrder.map(league => (
                        <div key={`${league}-2425`} className="flex items-center gap-1.5">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors[league].s2425, opacity: 0.9 }}></div>
                            <span style={{ color: colors[league].s2425 }} className="font-semibold">{`${league} 24/25`}</span>
                        </div>
                    ))}
                </div>
            </div>
             <div className="flex flex-col justify-center items-center gap-y-3 text-xs sm:text-sm mt-4 p-2 bg-gray-50 dark:bg-dark-border/20 rounded">
                <div className="flex flex-col gap-2">
                    <div className="flex justify-center gap-x-6">
                        <Checkbox label="PL" checked={selectedLeagues['PL']} onChange={() => handleLeagueChange('PL')} />
                        <Checkbox label="UCL" checked={selectedLeagues['UCL']} onChange={() => handleLeagueChange('UCL')} />
                    </div>
                     <div className="flex justify-center gap-x-6">
                        <Checkbox label="FA" checked={selectedLeagues['FA']} onChange={() => handleLeagueChange('FA')} />
                        <Checkbox label="EFL" checked={selectedLeagues['EFL']} onChange={() => handleLeagueChange('EFL')} />
                    </div>
                </div>
                <div className="w-full h-px bg-gray-300 dark:bg-gray-500 my-1"></div>
                <div className="flex items-center gap-4">
                    <span className="font-semibold text-gray-700 dark:text-gray-300">Seasons:</span>
                    <Checkbox label="24/25" checked={selectedSeasons['24/25']} onChange={() => handleSeasonChange('24/25')} />
                    <Checkbox label="25/26" checked={selectedSeasons['25/26']} onChange={() => handleSeasonChange('25/26')} />
                </div>
            </div>
        </Card>
    );
};

export const HomeAwayChart: React.FC<{ fixtures: Fixture[] }> = ({ fixtures }) => {
    // 25/26 stats (dynamic)
    const playedMatches2526 = fixtures.filter(f => f.result2526);
    const homeStats2526 = { W: 0, D: 0, L: 0 };
    const awayStats2526 = { W: 0, D: 0, L: 0 };
    playedMatches2526.forEach(match => {
        if (match.venue === 'Home' && match.result2526) {
            homeStats2526[match.result2526 as 'W' | 'D' | 'L']++;
        } else if (match.venue === 'Away' && match.result2526) {
            awayStats2526[match.result2526 as 'W' | 'D' | 'L']++;
        }
    });

    // 24/25 stats (hardcoded from user)
    const homeStats2425 = { W: 18, D: 7, L: 5 };
    const awayStats2425 = { W: 14, D: 9, L: 5 };
    
    const data = [
        { name: 'Home 25/26', Wins: homeStats2526.W, Draws: homeStats2526.D, Losses: homeStats2526.L },
        { name: 'Home 24/25', Wins: homeStats2425.W, Draws: homeStats2425.D, Losses: homeStats2425.L },
        { name: 'Away 25/26', Wins: awayStats2526.W, Draws: awayStats2526.D, Losses: awayStats2526.L },
        { name: 'Away 24/25', Wins: awayStats2425.W, Draws: awayStats2425.D, Losses: awayStats2425.L },
    ];

    return (
        <Card title="🏟️ Fortress &amp; Forays: Home vs. Away" contentClassName="h-80">
            <ResponsiveContainer>
                <BarChart data={data} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }} barCategoryGap="20%">
                    <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                    <XAxis type="number" allowDecimals={false} tick={{ fontSize: 10 }} />
                    <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={85} />
                    <Tooltip content={<CustomTooltip />} cursor={{fill: 'rgba(128,128,128,0.1)'}} />
                    <Legend wrapperStyle={{ fontSize: "12px" }} />
                    <Bar dataKey="Wins" fill="#22c55e" stackId="a" />
                    <Bar dataKey="Draws" fill="#facc15" stackId="a" />
                    <Bar dataKey="Losses" fill="#ef4444" stackId="a" />
                </BarChart>
            </ResponsiveContainer>
        </Card>
    );
};
