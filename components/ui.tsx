import React from 'react';
import { Fixture, Competition, View, OptaData, StandingEntry, UCLGroup, Stat, RecentEvent } from '../types';
import { clubLogos, competitionLogos, optaLogos } from '../constants';

// --- Helper Functions ---

export const getPoints = (result: string | null): number => {
    if (result === 'W') return 3;
    if (result === 'D') return 1;
    if (result === 'L') return 0;
    return 0;
};

const getResultDot = (result: 'W' | 'D' | 'L' | null, isForTable = false) => {
    const sizeClass = isForTable ? 'w-5 h-5 text-xs' : 'w-6 h-6 text-sm';
    const commonClasses = `inline-flex items-center justify-center ${sizeClass} font-bold rounded-full`;

    if (!result) return <span className={`${commonClasses} text-gray-400 bg-gray-200 dark:bg-gray-700 dark:text-gray-500`}>-</span>;
    
    let bgColor = '';
    let textColor = 'text-white';

    switch (result) {
        case 'W':
            bgColor = 'bg-green-500';
            textColor = 'text-black';
            break;
        case 'D':
            bgColor = 'bg-yellow-500';
            break;
        case 'L':
            bgColor = 'bg-red-500';
            break;
    }
    return <span className={`${commonClasses} ${bgColor} ${textColor}`}>{result}</span>;
};

const getScoreDisplay = (score: string | null, result: 'W' | 'D' | 'L' | null, isCleanSheet?: boolean) => {
    if (!score) return '-';
    let cssClass = '';
    
    switch (result) {
        case 'W': 
             cssClass = isCleanSheet ? 'bg-green-500 text-arsenal-red' : 'bg-green-500 text-black';
            break;
        case 'D': 
            cssClass = isCleanSheet ? 'bg-yellow-500 text-arsenal-red' : 'bg-yellow-500 text-white'; 
            break;
        case 'L': 
            cssClass = 'bg-red-500 text-white'; 
            break;
        default: 
            cssClass = 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200'; 
            break;
    }

    return <span className={`px-2 py-1 text-xs font-bold rounded-md ${cssClass}`}>{score}</span>;
};


// --- Components ---

export const SplashScreen: React.FC = () => {
    const cannonLogo = competitionLogos.all;

    return (
        <div 
            className="fixed inset-0 bg-arsenal-red flex flex-col items-center p-8 text-white z-[100] animate-fadeOut"
            style={{ animationFillMode: 'forwards', animationDelay: '2s', animationDuration: '0.5s' }}
        >
             <style>{`
                @keyframes fadeOut {
                    from { opacity: 1; }
                    to { opacity: 0; visibility: hidden; }
                }
                .animate-fadeOut {
                    animation-name: fadeOut;
                }
            `}</style>
            
            <div className="flex-1 flex flex-col items-center justify-center w-full px-4">
                <img 
                    src={cannonLogo} 
                    alt="Arsenal Cannon" 
                    className="w-full max-w-[200px] sm:max-w-xs mb-8" 
                />
                <div className="text-center">
                    <div className="flex items-center justify-center gap-2 sm:gap-4">
                        <h1 className="font-title text-3xl sm:text-4xl font-bold tracking-wider uppercase" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.3)'}}>Gunners Stats</h1>
                    </div>
                </div>
            </div>
            <p className="text-sm sm:text-lg text-gray-200 mt-auto pb-8">Your Data-Driven Companion for the 2025/26 Season.</p>
        </div>
    );
};

export const Header: React.FC = () => (
    <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 mb-6 p-4 sm:p-6 bg-arsenal-red rounded-lg text-white shadow-lg">
        <div className="rounded-md">
            <img className="w-24 h-24 object-contain" src={competitionLogos.all} alt="Gunners Stats Logo" />
        </div>
        <div className="text-center sm:text-left">
            <h1 className="font-title text-3xl sm:text-4xl md:text-5xl font-bold tracking-wider uppercase" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.3)'}}>Gunners Stats</h1>
            <p className="text-sm sm:text-base text-gray-200 mt-1">Your Data-Driven Companion for the 2025/26 Season.</p>
        </div>
    </div>
);

export const ThemeToggle: React.FC<{ theme: string; toggleTheme: () => void }> = ({ theme, toggleTheme }) => (
    <button
        onClick={toggleTheme}
        className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-800 text-xl transition-all hover:scale-110 shadow-sm"
        aria-label="Toggle theme"
    >
        {theme === 'light' ? '🌙' : '☀️'}
    </button>
);

export const StatCard: React.FC<{ title: string, value: number, isDiff?: boolean }> = ({ title, value, isDiff }) => {
    const displayValue = isDiff ? (value > 0 ? `+${value}` : value) : value;
    const colorClass = isDiff ? (value > 0 ? 'text-green-500' : value < 0 ? 'text-red-500' : 'text-gray-700 dark:text-gray-300') : 'text-arsenal-red dark:text-arsenal-gold';
    return (
        <div className="bg-white dark:bg-dark-card border-2 border-arsenal-red/40 dark:border-arsenal-red p-2 sm:p-4 rounded-lg text-center shadow-md hover:shadow-xl transition-shadow duration-300">
            <h3 className="text-xs sm:text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{title}</h3>
            <div className={`text-xl sm:text-3xl font-bold mt-1 ${colorClass}`}>{displayValue}</div>
        </div>
    );
};

const compLabels: { [key: string]: string } = {
    PL: 'PL',
    UCL: 'UCL',
    all: 'All',
    FA: 'FA Cup',
    EFL: 'EFL Cup',
    graphs: 'Stats'
};

export const FilterControls: React.FC<{
    activeFilter: Competition;
    setActiveFilter: (filter: Competition) => void;
    activeView: View;
    setActiveView: (view: View) => void;
    theme: string;
    toggleTheme: () => void;
}> = ({ activeFilter, setActiveFilter, activeView, setActiveView, theme, toggleTheme }) => {
    
    const competitionButtons: Competition[] = ['PL', 'UCL', 'all', 'FA', 'EFL'];
    const viewButton: 'graphs' = 'graphs';

    const handleFilterClick = (filter: Competition) => {
        setActiveFilter(filter);
        setActiveView('fixtures');
    };

    const handleViewClick = () => {
        setActiveView(activeView === 'fixtures' ? 'graphs' : 'fixtures');
    };
    
    const renderButton = (type: Competition | 'graphs') => {
        const isAllButton = type === 'all';
        const isGraphButton = type === 'graphs';
        const isActive = isGraphButton ? activeView === 'graphs' : activeView === 'fixtures' && activeFilter === type;
        
        const handleClick = isGraphButton ? handleViewClick : () => handleFilterClick(type as Competition);

        return (
            <button
                key={type}
                onClick={handleClick}
                className={`w-20 h-20 md:w-24 md:h-24 bg-white dark:bg-dark-card rounded-lg shadow-md hover:shadow-xl transition-all duration-300 flex justify-center items-center border-4 
                    ${isAllButton ? 'p-0 overflow-hidden' : 'p-2 sm:p-3'}
                    ${isActive ? 'border-arsenal-red dark:border-arsenal-gold' : 'border-transparent'}`}
                aria-label={`Filter by ${compLabels[type]}`}
            >
                <img 
                    src={competitionLogos[type]} 
                    alt={compLabels[type]} 
                    className={isAllButton 
                        ? 'w-full h-full object-cover' 
                        : 'h-12 md:h-16 object-contain'
                    }
                />
            </button>
        );
    };

    return (
        <div className="relative my-6">
            {/* Mobile Layout */}
            <div className="flex flex-col items-center gap-2 sm:gap-4 md:hidden">
                {/* Row 1: 3 buttons */}
                <div className="grid grid-cols-3 gap-2 sm:gap-4">
                    {competitionButtons.slice(0, 3).map(b => renderButton(b))}
                </div>
                
                {/* Row 2: 2 buttons, separator, 1 button */}
                <div className="flex items-center justify-center gap-2 sm:gap-4 w-full">
                    <div className="grid grid-cols-2 gap-2 sm:gap-4">
                        {competitionButtons.slice(3, 5).map(b => renderButton(b))}
                    </div>
                    <div className="w-2 h-20 bg-arsenal-red rounded-full"></div> {/* Vertical Separator */}
                    <div className="flex-shrink-0">
                        {renderButton(viewButton)}
                    </div>
                </div>
            </div>

            {/* Desktop Layout */}
            <div className="hidden md:flex flex-row items-center justify-center gap-4">
                <div className="flex flex-wrap justify-center gap-4">
                    {competitionButtons.map(b => renderButton(b))}
                </div>
                <div className="w-2 h-24 bg-arsenal-red rounded-full"></div>
                <div className="flex-shrink-0">
                    {renderButton(viewButton)}
                </div>
            </div>

            <div className="absolute top-1/2 -translate-y-1/2 right-2 hidden sm:block">
                <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
            </div>
        </div>
    );
};


export const FormDisplay: React.FC<{ form: string[] }> = ({ form }) => (
    <div className="bg-white dark:bg-dark-card p-4 rounded-lg border-2 border-arsenal-red/40 dark:border-arsenal-red h-full flex flex-col justify-center">
        <h3 className="text-center text-lg font-bold text-arsenal-red dark:text-arsenal-gold mb-3 uppercase tracking-wider">✅ Form Guide: Last 8 Results</h3>
        <div className="flex justify-center items-center gap-2 sm:gap-3">
            {form.length > 0 ? form.map((result, index) => {
                const resultClass = result === 'W' ? 'bg-green-500 text-black' : result === 'D' ? 'bg-yellow-500 text-white' : 'bg-red-500 text-white';
                return (
                    <div key={index} className={`w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center font-bold text-lg rounded-full shadow-md ${resultClass}`}>
                        {result}
                    </div>
                );
            }) : <p className="text-gray-500 dark:text-gray-400">No matches played yet.</p>}
        </div>
    </div>
);

export const Card: React.FC<{ title: React.ReactNode, children: React.ReactNode, className?: string, noOverflow?: boolean, contentClassName?: string }> = ({ title, children, className = '', noOverflow = false, contentClassName = '' }) => (
    <div className={`bg-white dark:bg-dark-card rounded-lg shadow-lg border-2 border-arsenal-red/40 dark:border-arsenal-red ${noOverflow ? '' : 'overflow-hidden'} ${className}`}>
      <h2 className="text-center text-md font-bold text-arsenal-red dark:text-arsenal-gold p-3 bg-gray-50 dark:bg-dark-card/50 border-b-2 border-arsenal-red/40 dark:border-b-arsenal-red uppercase tracking-wider">
        {title}
      </h2>
      <div className={`p-2 sm:p-4 ${contentClassName}`}>
        {children}
      </div>
    </div>
);

export const FixturesTable: React.FC<{ fixtures: Fixture[] }> = ({ fixtures }) => {
    const compColors: { [key: string]: string } = { PL: 'text-purple-600 dark:text-purple-400', UCL: 'text-blue-600 dark:text-blue-400', FA: 'text-red-600 dark:text-red-400', EFL: 'text-green-600 dark:text-green-400' };
    const compBorderColors: { [key: string]: string } = { PL: 'border-purple-500', UCL: 'border-blue-500', FA: 'border-red-500', EFL: 'border-green-500' };
    let matchCounter = 0;

    return (
    <div className="bg-white dark:bg-dark-card rounded-lg shadow-lg border-2 border-arsenal-red/40 dark:border-arsenal-red overflow-x-auto">
        <table className="w-full text-xs sm:text-sm text-gray-700 dark:text-gray-300">
            <thead className="bg-arsenal-red text-white uppercase tracking-wider text-left text-xs">
                <tr>
                    <th rowSpan={2} className="p-1 sm:p-1.5 text-center hidden sm:table-cell">#</th>
                    <th rowSpan={2} className="p-1 sm:p-1.5 text-center">MW/Rnd</th>
                    <th rowSpan={2} className="p-1 sm:p-1.5 hidden sm:table-cell">Date</th>
                    <th rowSpan={2} className="p-1 sm:p-1.5 text-center">Comp</th>
                    <th rowSpan={2} className="p-1 sm:p-1.5">Opponent</th>
                    <th rowSpan={2} className="p-1 sm:p-1.5 text-center">Venue</th>
                    <th colSpan={3} className="p-1 sm:p-1.5 text-center border-l-2 border-r-2 border-white/50">25/26</th>
                    <th colSpan={3} className="p-1 sm:p-1.5 text-center border-l-2 border-r-2 border-white/50 hidden lg:table-cell">24/25</th>
                    <th rowSpan={2} className="p-1 sm:p-1.5 text-center hidden lg:table-cell">+/-</th>
                    <th rowSpan={2} className="p-1 sm:p-1.5 text-center hidden lg:table-cell">Agg</th>
                </tr>
                <tr className="bg-arsenal-red-dark">
                    <th className="p-1 sm:p-1.5 text-center border-l-2 border-white/50">Res</th>
                    <th className="p-1 sm:p-1.5 text-center">Score</th>
                    <th className="p-1 sm:p-1.5 text-center border-r-2 border-white/50">Pts</th>
                    <th className="p-1 sm:p-1.5 text-center border-l-2 border-white/50 hidden lg:table-cell">Res</th>
                    <th className="p-1 sm:p-1.5 text-center hidden lg:table-cell">Score</th>
                    <th className="p-1 sm:p-1.5 text-center border-r-2 border-white/50 hidden lg:table-cell">Pts</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-dark-border">
                {fixtures.map((match, index) => {
                     if (match.isDuplicate) return null;
                     if (match.isFifaBreak) return <tr key={`break-${index}`}><td colSpan={14} className="text-center bg-[#2E96FF] text-white font-semibold py-1 text-[12px] h-2 tracking-widest">━━━━━━━━━━ FIFA International Break ━━━━━━━━━━</td></tr>;
                     if (match.isCanBreak) {
                        const text = match.canType === 'end' ? '━━━━━━━━━━━━━━━ CAN 🇲🇦 ‘25 🏆 ━━━━━━━━━━━━━━━' : '━━━━━━━━━━━━━━━ CAN 🇲🇦 ‘25 ━━━━━━━━━━━━━━━';
                        const gradient = match.canType === 'start' ? 'bg-gradient-to-r from-red-500 via-yellow-500 to-green-500' : 'bg-gradient-to-r from-green-500 via-yellow-500 to-red-500';
                        return <tr key={`break-${index}`}><td colSpan={14} className={`text-center ${gradient} text-white font-semibold py-1 text-[12px] h-2 tracking-widest`}>{text}</td></tr>;
                     }
                    
                    matchCounter++;
                    const isPremium = ['Liverpool', 'Manchester City', 'Chelsea', 'Tottenham Hotspur', 'Manchester United', 'Newcastle United', 'Bayern Munich', 'Inter Milan', 'Atlético Madrid'].includes(match.opponent || '');
                    const competitionBorderColor = compBorderColors[match.league || ''] || 'border-transparent';
                    const mwColor = compColors[match.league || ''] || '';

                    let rowClasses = 'transition-colors hover:bg-gray-100 dark:hover:bg-dark-border/50';
                    if (isPremium) rowClasses += ' bg-yellow-50 dark:bg-yellow-500/10';
                    if (match.postponed && !match.skipPostponed) rowClasses += ' italic';
                    if (!match.result2526) rowClasses += ' opacity-40 hover:opacity-100';
                    
                    const scoreParts = match.score2526 ? match.score2526.split('-').map(Number) : [null, null];
                    const conceded = match.venue === 'Home' ? scoreParts[1] : scoreParts[0];
                    const isCleanSheet = (match.result2526 === 'W' || match.result2526 === 'D') && conceded === 0;

                    const scoreParts2425 = match.score2425 ? match.score2425.split('-').map(Number) : [null, null];
                    const conceded2425 = match.venue === 'Home' ? scoreParts2425[1] : scoreParts2425[0];
                    const isCleanSheet2425 = (match.result2425 === 'W' || match.result2425 === 'D') && conceded2425 === 0;

                    return (
                        <tr key={index} className={rowClasses}>
                            <td className={`p-1 sm:p-1.5 text-center font-semibold border-l-4 ${isPremium ? 'border-yellow-400' : competitionBorderColor} hidden sm:table-cell`}>{matchCounter}</td>
                            <td className={`p-1 sm:p-1.5 text-center font-bold ${mwColor} whitespace-nowrap`}>{match.round || match.mw}</td>
                            <td className="p-1 sm:p-1.5 whitespace-nowrap hidden sm:table-cell">{match.date || '-'}</td>
                            <td className="p-1 sm:p-1.5"><img src={competitionLogos[match.league as keyof typeof competitionLogos] || ''} alt={match.league || ''} className="w-10 h-10 mx-auto object-contain" /></td>
                            <td className="p-1 sm:p-1.5">
                                <div className={`flex items-center justify-center sm:justify-start gap-1 sm:gap-2`}>
                                    <img src={clubLogos[match.opponent || '']} alt={match.opponent || ''} className="w-8 h-8 sm:w-10 h-10 object-contain" />
                                    <div className="hidden sm:block">
                                        <div className="font-bold">{match.opponent}</div>
                                        {match.correlated && <div className="text-[10px] text-gray-500">{match.correlated}</div>}
                                        {match.postponedReason && <div className="text-[10px] text-red-500">{match.postponedReason}</div>}
                                    </div>
                                </div>
                            </td>
                            <td className="p-1 sm:p-1.5 text-center whitespace-nowrap">{match.venue}</td>
                            {/* 25/26 Season */}
                            <td className="p-1 sm:p-1.5 text-center border-l-2 border-arsenal-red/20 dark:border-arsenal-red/40">{getResultDot(match.result2526)}</td>
                            <td className="p-1 sm:p-1.5 text-center">{getScoreDisplay(match.score2526, match.result2526, isCleanSheet)}</td>
                            <td className="p-1 sm:p-1.5 text-center font-semibold border-r-2 border-arsenal-red/20 dark:border-arsenal-red/40">{match.pts2526 ?? '-'}</td>
                            {/* 24/25 Season */}
                            <td className="p-1 sm:p-1.5 text-center hidden lg:table-cell">{getResultDot(match.result2425)}</td>
                            <td className="p-1 sm:p-1.5 text-center hidden lg:table-cell">{getScoreDisplay(match.score2425, match.result2425, isCleanSheet2425)}</td>
                            <td className="p-1 sm:p-1.5 text-center font-semibold border-r-2 border-arsenal-red/20 dark:border-arsenal-red/40 hidden lg:table-cell">{match.pts2425 ?? '-'}</td>
                            {/* Diffs */}
                            <td className={`p-1 sm:p-1.5 text-center font-bold hidden lg:table-cell ${match.matchDiff && match.matchDiff > 0 ? 'text-green-500' : match.matchDiff && match.matchDiff < 0 ? 'text-red-500' : ''}`}>
                                {match.matchDiff === null || match.matchDiff === undefined ? '-' : match.matchDiff > 0 ? `+${match.matchDiff}` : match.matchDiff}
                            </td>
                            <td className={`p-1 sm:p-1.5 text-center font-bold hidden lg:table-cell ${match.agg && match.agg > 0 ? 'text-green-500' : match.agg && match.agg < 0 ? 'text-red-500' : ''}`}>
                                {match.agg === null || match.agg === undefined ? '-' : match.agg > 0 ? `+${match.agg}` : match.agg}
                            </td>
                        </tr>
                    );
                })}
            </tbody>
        </table>
    </div>
)};

const difficultyMapping: { [key: string]: number } = { 'Liverpool': 1, 'Arsenal': 2, 'Manchester City': 3, 'Chelsea': 4, 'Manchester United': 5, 'Newcastle United': 6, 'Tottenham Hotspur': 7, 'Bournemouth': 8, 'Sunderland': 9, 'Crystal Palace': 10, 'Aston Villa': 11, 'Brighton & Hove Albion': 12, 'Brentford': 13, 'Fulham': 14, 'West Ham United': 15, 'Everton': 16, 'Wolverhampton Wanderers': 17, 'Nottingham Forest': 18, 'Leeds United': 19, 'Burnley': 20, 'Bayern Munich': 2, 'Inter Milan': 3, 'Atlético Madrid': 4, 'Athletic Club': 6, 'Olympiacos': 10, 'Club Brugge': 14, 'Slavia Praha': 16, 'Kairat Almaty': 20, 'Port Vale': 20, 'N/A': 10 };

const getDifficulty = (opponent: string | null) => {
    const position = difficultyMapping[opponent || 'N/A'] || 10;
    if (position <= 4) return { level: 'Very Hard', color: '#8b0000', score: 5 };
    if (position <= 8) return { level: 'Hard', color: '#ff0000', score: 4 };
    if (position <= 12) return { level: 'Medium', color: '#ff9800', score: 3 };
    if (position <= 16) return { level: 'Easy', color: '#558C55', score: 2 };
    return { level: 'Very Easy', color: '#024F15', score: 1 };
};

export const FixtureDifficulty: React.FC<{ fixtures: Fixture[] }> = ({ fixtures }) => {
    const nextFixtures = fixtures.filter(m => !m.result2526 && !m.isFifaBreak && !m.isCanBreak).slice(0, 6);

    const { summaryText, summaryColor } = React.useMemo(() => {
        if (nextFixtures.length === 0) return { summaryText: '', summaryColor: '' };

        const totalScore = nextFixtures.reduce((acc, match) => acc + getDifficulty(match.opponent).score, 0);
        const avgDifficulty = totalScore / nextFixtures.length;

        if (avgDifficulty <= 1.5) return { summaryText: 'Very Favorable', summaryColor: '#024F15' };
        if (avgDifficulty <= 2.5) return { summaryText: 'Favorable', summaryColor: '#558C55' };
        if (avgDifficulty <= 3.5) return { summaryText: 'Balanced', summaryColor: '#ff9800' };
        if (avgDifficulty <= 4.5) return { summaryText: 'Challenging', summaryColor: '#ff0000' };
        return { summaryText: 'Very Challenging', summaryColor: '#8b0000' };
    }, [nextFixtures]);
    
    const leftColumnFixtures = nextFixtures.slice(0, 3);
    const rightColumnFixtures = nextFixtures.slice(3, 6);

    const renderFixtureItem = (match: Fixture, fullIndex: number) => {
        const { level, color } = getDifficulty(match.opponent);
        return (
            <div key={fullIndex} className="flex items-center justify-between p-1.5 rounded-md bg-gray-50 dark:bg-dark-border/30" style={{ borderLeft: `4px solid ${color}`}}>
                <div className="flex items-center gap-2 flex-grow min-w-0">
                    <span className="text-gray-400 dark:text-gray-500 font-bold text-xs w-5 text-center">{fullIndex + 1}.</span>
                    <img src={competitionLogos[match.league as keyof typeof competitionLogos] || ''} alt={match.league || ''} className="w-6 h-6 object-contain flex-shrink-0" />
                    <img src={clubLogos[match.opponent || '']} alt={match.opponent || ''} className="w-8 h-8 object-contain flex-shrink-0" />
                    <span className="font-semibold text-xs truncate">{match.opponent} ({match.venue === 'Home' ? 'H' : 'A'})</span>
                </div>
                <span className="text-xs font-bold ml-2 flex-shrink-0" style={{ color }}>{level}</span>
            </div>
        );
    };


    return (
         <div className="bg-white dark:bg-dark-card p-3 rounded-lg border-2 border-arsenal-red/40 dark:border-arsenal-red">
            <h3 className="text-center text-lg font-bold text-arsenal-red dark:text-arsenal-gold mb-3 uppercase tracking-wider">🛣️ The Road Ahead: Next 6 Fixtures</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-3">
                <div className="space-y-1.5">
                    {leftColumnFixtures.map((match, index) => renderFixtureItem(match, index))}
                </div>
                <div className="space-y-1.5 mt-1.5 md:mt-0">
                     {rightColumnFixtures.map((match, index) => renderFixtureItem(match, index + 3))}
                </div>
            </div>
            {nextFixtures.length === 0 && <p className="text-center text-gray-500 text-sm mt-4">Season finished.</p>}
            {nextFixtures.length > 0 && (
                <div className="mt-3 text-center p-2 rounded-md" style={{ backgroundColor: summaryColor }}>
                    <p className="text-sm font-bold text-white">Overall Outlook: {summaryText}</p>
                </div>
            )}
        </div>
    );
};

export const ResultsHeatmap: React.FC<{ fixtures: Fixture[] }> = ({ fixtures }) => {
    const [trendFilter, setTrendFilter] = React.useState<'all' | 'better' | 'same' | 'worse'>('all');
    const playedMatches = fixtures.filter(m => m.result2526 && m.league === 'PL');

    const improvements = playedMatches.filter(m => m.result2425 && getPoints(m.result2526) > getPoints(m.result2425)).length;
    const same = playedMatches.filter(m => m.result2425 && getPoints(m.result2526) === getPoints(m.result2425)).length;
    const worse = playedMatches.filter(m => m.result2425 && getPoints(m.result2526) < getPoints(m.result2425)).length;

    const FilterButton: React.FC<{label: string, filter: typeof trendFilter}> = ({label, filter}) => {
        const isActive = trendFilter === filter;
        let activeClasses = '';
        if (isActive) {
            switch(filter) {
                case 'better': activeClasses = 'bg-green-500 text-white'; break;
                case 'same': activeClasses = 'bg-yellow-500 text-white'; break;
                case 'worse': activeClasses = 'bg-red-500 text-white'; break;
                default: activeClasses = 'bg-arsenal-red text-white';
            }
        } else {
            activeClasses = 'bg-gray-200 dark:bg-dark-border text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-dark-border/80';
        }
        return (
            <button onClick={() => setTrendFilter(filter)} className={`px-3 py-1 text-xs font-semibold rounded-full transition-colors ${activeClasses}`}>
                {label}
            </button>
        )
    }

    return (
        <Card title="🔄 HEAD-TO-HEAD (IMPROVEMENT)">
            <div className="flex justify-center gap-2 mb-3 border-b border-gray-200 dark:border-dark-border pb-3">
                <FilterButton label="All" filter="all" />
                <FilterButton label="Better" filter="better" />
                <FilterButton label="Same" filter="same" />
                <FilterButton label="Worse" filter="worse" />
            </div>
            <div className="overflow-x-auto pr-2">
                <table className="w-full text-xs">
                    <thead className="sticky top-0 bg-white dark:bg-dark-card z-10">
                        <tr className="border-b-2 border-gray-200 dark:border-dark-border">
                            <th className="p-1 text-left font-bold uppercase text-gray-500 dark:text-gray-400 tracking-wider">Opponent</th>
                            <th className="p-1 text-center font-bold uppercase text-gray-500 dark:text-gray-400 tracking-wider">24/25</th>
                            <th className="p-1 text-center font-bold uppercase text-gray-500 dark:text-gray-400 tracking-wider">25/26</th>
                            <th className="p-1 text-center font-bold uppercase text-gray-500 dark:text-gray-400 tracking-wider">Trend</th>
                        </tr>
                    </thead>
                    <tbody>
                        {playedMatches.length === 0 ? (
                             <tr><td colSpan={4} className="text-center p-4 text-gray-500">No Premier League matches played yet.</td></tr>
                        ) : playedMatches.map((match, index) => {
                            const diff = match.result2425 ? getPoints(match.result2526) - getPoints(match.result2425) : null;
                            let trendColor = diff !== null ? (diff > 0 ? 'text-green-500' : diff < 0 ? 'text-red-500' : 'text-yellow-500') : 'text-gray-400';
                            let trendBgColor = '';
                            if (diff !== null) {
                                if (diff > 0) trendBgColor = 'bg-green-100 dark:bg-green-800/40';
                                else if (diff < 0) trendBgColor = 'bg-red-100 dark:bg-red-800/40';
                                else trendBgColor = 'bg-yellow-100 dark:bg-yellow-800/40';
                            }
                            
                            const isVisible = trendFilter === 'all' || 
                                (trendFilter === 'better' && diff !== null && diff > 0) ||
                                (trendFilter === 'same' && diff === 0) ||
                                (trendFilter === 'worse' && diff !== null && diff < 0);

                            return (
                                <tr key={index} className={`border-b border-gray-100 dark:border-dark-border/50 last:border-b-0 transition-all duration-300 ${isVisible ? 'opacity-100' : 'opacity-20'} ${trendBgColor}`}>
                                    <td className="p-1 flex items-center gap-1">
                                        <img src={clubLogos[match.opponent || '']} alt={match.opponent || ''} className="w-6 h-6 object-contain" />
                                        <span className="font-semibold">{match.opponent} ({match.venue === 'Home' ? 'H' : 'A'})</span>
                                    </td>
                                    <td className="p-1 text-center">{getResultDot(match.result2425, true)}</td>
                                    <td className="p-1 text-center">{getResultDot(match.result2526, true)}</td>
                                    <td className={`p-1 text-center font-bold ${trendColor}`}>
                                        {diff === null ? '-' : diff > 0 ? `+${diff}` : (diff === 0 ? '=' : diff)}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
             <div className="flex justify-around mt-3 pt-3 border-t border-gray-200 dark:border-dark-border text-center text-xs">
                <div><div className="font-bold text-lg text-green-500">{improvements}</div><div className="text-gray-500 dark:text-gray-400">Better</div></div>
                <div><div className="font-bold text-lg text-yellow-500">{same}</div><div className="text-gray-500 dark:text-gray-400">Same</div></div>
                <div><div className="font-bold text-lg text-red-500">{worse}</div><div className="text-gray-500 dark:text-gray-400">Worse</div></div>
            </div>
        </Card>
    );
};


export const OptaTable: React.FC<{ title: string; data: OptaData[]; type: 'PL' | 'UCL' }> = ({ title, data, type }) => {
    return (
        <Card title={title}>
            <div className="text-[10px] text-gray-400 text-right mb-1">Last updated: 12/11/2025</div>
            <div className="overflow-x-auto">
                <table className="w-full text-[11px] sm:text-xs text-left">
                    <thead className="text-gray-500 dark:text-gray-400 uppercase text-[10px]">
                        <tr>
                            <th className="p-1">Team</th>
                            {type === 'PL' ? (
                                <>
                                    <th className="p-1 text-center">xPts</th>
                                    <th className="p-1 text-center">Title %</th>
                                    <th className="p-1 text-center">UCL %</th>
                                </>
                            ) : (
                                <>
                                    <th className="p-1 text-center">xPts</th>
                                    <th className="p-1 text-center">QF %</th>
                                    <th className="p-1 text-center">SF %</th>
                                    <th className="p-1 text-center">Final %</th>
                                    <th className="p-1 text-center">Win %</th>
                                </>
                            )}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-dark-border">
                        {data.map((row) => (
                            <tr key={row.team} className={`${row.team === 'Arsenal' ? 'bg-arsenal-highlight dark:bg-arsenal-red/20 font-bold' : 'hover:bg-gray-50 dark:hover:bg-dark-border/30'}`}>
                                <td className="p-1 font-semibold flex items-center gap-1.5">
                                    <img src={clubLogos[row.team]} alt={row.team} className="w-6 h-6 object-contain" />
                                    {row.team}
                                </td>
                                {type === 'PL' ? (
                                    <>
                                        <td className="p-1 text-center">{row.xPts.toFixed(2)}</td>
                                        <td className="p-1 text-center font-bold text-arsenal-red dark:text-arsenal-gold">{row.title}</td>
                                        <td className="p-1 text-center">{row.ucl}</td>
                                    </>
                                ) : (
                                    <>
                                        <td className="p-1 text-center">{row.xPts.toFixed(2)}</td>
                                        <td className="p-1 text-center">{row.qf}</td>
                                        <td className="p-1 text-center">{row.sf}</td>
                                        <td className="p-1 text-center">{row.final}</td>
                                        <td className="p-1 text-center font-bold text-arsenal-red dark:text-arsenal-gold">{row.winner}</td>
                                    </>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Card>
    );
};

export const LeagueTable: React.FC<{ title: string; standings: StandingEntry[] | UCLGroup[]; isUCL?: boolean }> = ({ title, standings, isUCL }) => {
    const [sortConfig, setSortConfig] = React.useState<{ key: string; direction: 'asc' | 'desc' } | null>({ key: 'rank', direction: 'asc' });

    if (!standings || standings.length === 0) {
        return <Card title={title}><p className="text-center text-gray-500">Standings not available.</p></Card>;
    }

    const getStatValue = (entry: StandingEntry, statName: string) => {
        return entry.stats.find((s: Stat) => s.name === statName)?.value ?? 0;
    };

    const hasFormData = React.useMemo(() => {
        const allEntries: StandingEntry[] = isUCL
            ? (standings as UCLGroup[]).flatMap(group => group?.standings?.entries || [])
            : (standings as StandingEntry[]);
        return allEntries.some(e => e.team.recentEvents?.length > 0);
    }, [standings, isUCL]);

    const standingsWithRank = React.useMemo(() => {
        if (!isUCL) return null;

        const allEntries = (standings as UCLGroup[]).flatMap(group => group?.standings?.entries || []);
        
        allEntries.sort((a, b) => {
            const aPts = getStatValue(a, 'points');
            const bPts = getStatValue(b, 'points');
            if (aPts !== bPts) return bPts - aPts;
            
            const aGD = getStatValue(a, 'pointDifferential');
            const bGD = getStatValue(b, 'pointDifferential');
            if (aGD !== bGD) return bGD - aGD;
            
            const aGF = getStatValue(a, 'pointsFor');
            const bGF = getStatValue(b, 'pointsFor');
            if (aGF !== bGF) return bGF - aGF;

            return a.team.name.localeCompare(b.team.name);
        });

        return allEntries.map((entry, index) => ({
            ...entry,
            calculatedRank: index + 1,
        }));
    }, [standings, isUCL]);

    const requestSort = (key: string) => {
        let direction: 'asc' | 'desc' = 'desc';
        if (sortConfig && sortConfig.key === key) {
            direction = sortConfig.direction === 'asc' ? 'desc' : 'asc';
        } else if (['rank', 'losses', 'pointsAgainst'].includes(key)) {
            direction = 'asc';
        }
        setSortConfig({ key, direction });
    };

    const sortedStandings = React.useMemo(() => {
        let sortableItems: StandingEntry[] = isUCL 
            ? [...(standingsWithRank || [])] 
            : [...(standings as StandingEntry[])];

        if (sortConfig !== null) {
            sortableItems.sort((a, b) => {
                const aValue = sortConfig.key === 'rank' && isUCL ? a.calculatedRank! : getStatValue(a, sortConfig.key);
                const bValue = sortConfig.key === 'rank' && isUCL ? b.calculatedRank! : getStatValue(b, sortConfig.key);
                
                if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
                if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
                
                // Secondary sort by goal difference
                if (sortConfig.key !== 'pointDifferential') {
                    const aGD = getStatValue(a, 'pointDifferential');
                    const bGD = getStatValue(b, 'pointDifferential');
                    if (aGD < bGD) return 1;
                    if (aGD > bGD) return -1;
                }
                
                // Tertiary sort by goals for
                if (sortConfig.key !== 'pointsFor') {
                    const aGF = getStatValue(a, 'pointsFor');
                    const bGF = getStatValue(b, 'pointsFor');
                    if (aGF < bGF) return 1;
                    if (aGF > bGF) return -1;
                }
                return 0;
            });
        }
        return sortableItems;
    }, [standings, standingsWithRank, sortConfig, isUCL]);

    const FormDot: React.FC<{ result: RecentEvent['result'] }> = ({ result }) => {
        const resultChar = result.charAt(0).toUpperCase();
        let color = '';
        switch (resultChar) {
            case 'W': color = 'bg-green-500'; break;
            case 'D': color = 'bg-yellow-500'; break;
            case 'L': color = 'bg-red-500'; break;
            default: color = 'bg-gray-400';
        }
        return <div className={`w-3 h-3 rounded-full ${color}`}></div>;
    };
    
    const headers: { key: string; label: string; className?: string, sortable: boolean }[] = [
        { key: 'rank', label: 'Pos', sortable: true },
        { key: 'club', label: 'Club', sortable: false },
        { key: 'gamesPlayed', label: 'P', sortable: false },
        { key: 'wins', label: 'W', sortable: true },
        { key: 'ties', label: 'D', sortable: true },
        { key: 'losses', label: 'L', sortable: true },
        { key: 'pointsFor', label: 'GF', sortable: true },
        { key: 'pointsAgainst', label: 'GA', sortable: true },
        { key: 'pointDifferential', label: 'GD', sortable: true },
        { key: 'points', label: 'Pts', sortable: true },
    ];

    if (hasFormData) {
        headers.push({ key: 'form', label: 'Form', sortable: false });
    }

    const renderTableBody = (entries: StandingEntry[]) => (
        <tbody className="divide-y divide-gray-200 dark:divide-dark-border">
            {entries.map((entry: StandingEntry, index: number) => (
                <React.Fragment key={entry.team.id}>
                <tr className={`${entry.team.abbreviation === 'ARS' ? 'bg-arsenal-highlight dark:bg-arsenal-red/20 font-bold' : 'hover:bg-gray-50 dark:hover:bg-dark-border/30'}`}>
                    <td className="p-1 text-center">{isUCL ? entry.calculatedRank : getStatValue(entry, 'rank')}</td>
                    <td className="p-1">
                        <div className="flex items-center gap-1.5">
                            <img src={entry.team.logos[0].href} alt={entry.team.name} className="w-6 h-6 object-contain flex-shrink-0" />
                            <span className="min-w-0">{entry.team.name}</span>
                        </div>
                    </td>
                    <td className="p-1 text-center">{getStatValue(entry, 'gamesPlayed')}</td>
                    <td className="p-1 text-center">{getStatValue(entry, 'wins')}</td>
                    <td className="p-1 text-center">{getStatValue(entry, 'ties')}</td>
                    <td className="p-1 text-center">{getStatValue(entry, 'losses')}</td>
                    <td className="p-1 text-center">{getStatValue(entry, 'pointsFor')}</td>
                    <td className="p-1 text-center">{getStatValue(entry, 'pointsAgainst')}</td>
                    <td className="p-1 text-center">{entry.stats.find((s: Stat) => s.name === 'pointDifferential')?.displayValue}</td>
                    <td className="p-1 text-center font-bold text-arsenal-red dark:text-arsenal-gold">{getStatValue(entry, 'points')}</td>
                    {hasFormData && (
                        <td className="p-1 text-center">
                            <div className="flex justify-center items-center gap-0.5">
                                {entry.team.recentEvents?.slice(0, 5).map((event: RecentEvent, i: number) => (
                                    <FormDot key={i} result={event.result} />
                                ))}
                            </div>
                        </td>
                    )}
                </tr>
                {!isUCL && index === 3 && (
                    <tr><td colSpan={headers.length} className="p-0"><div className="h-0.5 bg-black dark:bg-gray-600 my-1"></div></td></tr>
                )}
                {isUCL && index === 7 && (
                    <tr><td colSpan={headers.length} className="p-0"><div className="h-0.5 bg-black dark:bg-gray-600 my-1"></div></td></tr>
                )}
                 {isUCL && index === 23 && (
                    <tr><td colSpan={headers.length} className="p-0"><div className="h-px border-t-2 border-dashed border-gray-400 dark:border-gray-700 my-1"></div></td></tr>
                )}
                </React.Fragment>
            ))}
        </tbody>
    );
    
    return (
        <Card title={title} contentClassName="p-0 sm:p-0">
            <div className="overflow-auto max-h-[480px] p-2 sm:p-4">
                <table className="w-full text-[11px] sm:text-xs text-left">
                    <thead className="text-gray-500 dark:text-gray-400 uppercase text-[10px]">
                        <tr>
                            {headers.map(h => (
                                <th 
                                    key={h.key} 
                                    className={`p-1 ${h.sortable ? 'cursor-pointer hover:text-gray-800 dark:hover:text-gray-200' : ''} ${h.className || ''}`} 
                                    onClick={() => h.sortable && requestSort(h.key)}
                                >
                                    <div className="flex items-center justify-center">
                                        {h.label}
                                        {sortConfig && sortConfig.key === h.key && (
                                            <span className="ml-1 text-base">{sortConfig.direction === 'asc' ? '▲' : '▼'}</span>
                                        )}
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    {renderTableBody(sortedStandings)}
                </table>
            </div>
        </Card>
    );
};

export const Footer: React.FC = () => {
    const solidarityLinks = [
        { name: 'Palestine', url: 'https://flagcdn.com/w40/ps.png' },
        { name: 'Sudan', url: 'https://flagcdn.com/w40/sd.png' },
        { name: 'DR Congo', url: 'https://flagcdn.com/w40/cd.png' },
        { name: 'Yemen', url: 'https://flagcdn.com/w40/ye.png' },
        { name: 'Kashmir', url: 'https://upload.wikimedia.org/wikipedia/commons/4/4d/Flag_of_Azad_Kashmir.svg' },
        { name: 'Ethiopia', url: 'https://flagcdn.com/w40/et.png' }
    ];

    return (
        <div className="mt-12 pt-10 border-t border-gray-400 dark:border-dark-border text-sm">
            <div className="max-w-4xl mx-auto p-4 bg-gray-50 dark:bg-dark-card/50 border-l-4 border-arsenal-red text-gray-700 dark:text-gray-300 rounded-r-lg">
                <p className="font-semibold text-center mb-4">
                    In solidarity with the people of Palestine, Sudan, DR Congo, Yemen, Kashmir, and Ethiopia in their struggle for freedom and justice. ✊
                </p>
                <div className="flex justify-center items-center flex-wrap gap-x-6 gap-y-3">
                    {solidarityLinks.map(item => (
                        <div key={item.name} className="flex items-center gap-2 transition-transform hover:scale-110">
                            <img src={item.url} alt={`${item.name} flag`} className="h-5 w-auto object-contain rounded-sm shadow-md" />
                            <span className="font-semibold">{item.name}</span>
                        </div>
                    ))}
                </div>
                <p className="mt-4 pt-2 border-t border-gray-200 dark:border-dark-border/50 italic text-gray-500 dark:text-gray-400 text-center">
                    For a world where this struggle leads to a just and lasting peace for all. 🕊️
                </p>
            </div>
            <div className="mt-6 text-center text-arsenal-red dark:text-gray-600">
                <p className="font-bold text-lg tracking-wide"> Crafted with ❤️ for the Gunners by MDN | v26.88.105 </p>
            </div>
            <div className="mt-5 pt-5 border-t border-gray-200 dark:border-dark-border/50 text-center text-gray-500 dark:text-gray-400">
                <h4 className="font-bold text-base text-gray-600 dark:text-gray-300 mb-2">Install as a Progressive Web App (PWA)</h4>
                <p className="text-xs max-w-md mx-auto">
                    For the best experience, add this app to your home screen.
                    <br />
                    <strong>On Mobile:</strong> Use your browser's "Add to Home Screen" option.
                    <br />
                    <strong>On Desktop:</strong> Click the install icon in the address bar.
                </p>
            </div>
        </div>
    );
};
