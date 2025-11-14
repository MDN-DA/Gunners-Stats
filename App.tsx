import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Fixture, Competition, View, Stats, ProcessedData, StandingEntry, UCLGroup } from './types';
import { fixtures, clubLogos, competitionLogos, optaPLData, optaUCLData } from './constants';
import { 
    Header, 
    StatCard, 
    FilterControls, 
    FixturesTable,
    FormDisplay,
    FixtureDifficulty,
    ResultsHeatmap,
    OptaTable,
    LeagueTable,
    Footer,
    ThemeToggle,
    getPoints,
    SplashScreen
} from './components/ui';
import { PositionChart, CumulativeChart, SeasonPhaseChart, SeasonStatsChart, HomeAwayChart } from './components/charts';

const App: React.FC = () => {
    const [activeFilter, setActiveFilter] = useState<Competition>('all');
    const [activeView, setActiveView] = useState<View>('fixtures');
    const [theme, setTheme] = useState<'light' | 'dark'>(localStorage.getItem('theme') as 'light' | 'dark' || 'light');
    const [plStandings, setPlStandings] = useState<StandingEntry[]>([]);
    const [uclStandings, setUclStandings] = useState<UCLGroup[]>([]);
    const [isSplashVisible, setSplashVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setSplashVisible(false);
        }, 2500); // show for 2.5 seconds

        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
    };

    const fetchStandings = useCallback(async () => {
        // PL Tables
        try {
            const plResponse = await fetch("https://site.web.api.espn.com/apis/v2/sports/soccer/eng.1/standings");
            if (plResponse.ok) {
                const plData = await plResponse.json();
                if (plData?.children?.[0]?.standings?.entries) {
                    setPlStandings(plData.children[0].standings.entries);
                }
            }
        } catch (error) {
            console.error("Failed to fetch PL standings:", error);
        }

        // UCL Tables
        try {
            const uclResponse = await fetch("https://site.web.api.espn.com/apis/v2/sports/soccer/uefa.champions/standings");
             if (uclResponse.ok) {
                const uclData = await uclResponse.json();
                if (Array.isArray(uclData?.children)) {
                    setUclStandings(uclData.children);
                }
            }
        } catch (error) {
            console.error("Failed to fetch UCL standings:", error);
        }
    }, []);

    useEffect(() => {
        fetchStandings();
    }, [fetchStandings]);


    const processedData: ProcessedData = useMemo(() => {
        let cumulativeDiff = 0;
        const cumulativeData: { name: string, diff: number, opponent: string | null }[] = [];
        const positionsData: { name: string, '24/25': number | null, '25/26': number | null, opponent: string | null }[] = [];
        const form: string[] = [];
        const processedFixtures: Fixture[] = [];
        
        fixtures.forEach(match => {
            if (match.isFifaBreak || match.isCanBreak || match.isDuplicate) {
                processedFixtures.push(match);
                return;
            }

            if (match.result2526) {
                form.push(match.result2526);
            }

            if (match.league === 'PL' && match.result2526) {
                const pts2425 = getPoints(match.result2425);
                const pts2526 = getPoints(match.result2526);
                const matchDiff = pts2526 - pts2425;
                cumulativeDiff += matchDiff;
                
                processedFixtures.push({ ...match, matchDiff, agg: cumulativeDiff });
                
                cumulativeData.push({ name: `MW${match.mw}`, diff: cumulativeDiff, opponent: match.opponent });
                positionsData.push({ name: `MW${match.mw}`, '24/25': match.pos2425, '25/26': match.pos2526, opponent: match.opponent });
            } else {
                processedFixtures.push({ ...match, matchDiff: null, agg: null });
            }
        });
        
        const playedPLMatches = fixtures.filter(m => m.result2526 !== null && m.league === 'PL');
        const lastMatch = playedPLMatches.length > 0 ? playedPLMatches[playedPLMatches.length - 1] : null;

        const stats: Stats = {
            points2526: lastMatch?.pts2526 ?? 0,
            points2425: lastMatch?.pts2425 ?? 0,
            matchesPlayed: playedPLMatches.length,
        };

        return {
            stats,
            fixtures: processedFixtures,
            cumulativeData,
            positionsData,
            form: form.slice(-8),
        };
    }, []);

    const filteredFixtures = useMemo(() => {
        if (activeFilter === 'all' || activeView === 'graphs') {
            return processedData.fixtures;
        }
        return processedData.fixtures.filter(match => match.league === activeFilter || match.isFifaBreak || match.isCanBreak);
    }, [activeFilter, activeView, processedData.fixtures]);

    return (
        <>
            {isSplashVisible && <SplashScreen />}
            <div className="p-2 sm:p-4 md:p-6">
                <div className="relative container max-w-screen-2xl mx-auto bg-white dark:bg-dark-card rounded-xl p-2 sm:p-4 md:p-6 shadow-2xl border-2 border-gray-200 dark:border-dark-border transition-colors duration-300">
                    <div className="absolute top-4 right-4 z-50 flex items-center gap-2">
                        <div id="google_translate_element"></div>
                    </div>
                    <Header />

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4 my-4 sm:my-6">
                        <StatCard title="Points 25/26" value={processedData.stats.points2526} />
                        <StatCard title="Points 24/25" value={processedData.stats.points2425} />
                        <StatCard title="Difference" value={processedData.stats.points2526 - processedData.stats.points2425} isDiff={true} />
                        <StatCard title="PL Matches Played" value={processedData.stats.matchesPlayed} />
                    </div>
                    
                    <FilterControls
                        activeFilter={activeFilter}
                        setActiveFilter={setActiveFilter}
                        activeView={activeView}
                        setActiveView={setActiveView}
                        theme={theme}
                        toggleTheme={toggleTheme}
                    />

                    {activeView === 'fixtures' ? (
                        <div className="mt-6">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                                <FormDisplay form={processedData.form} />
                                <FixtureDifficulty fixtures={fixtures} />
                            </div>
                            <FixturesTable fixtures={filteredFixtures} />
                        </div>
                    ) : (
                        <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Row 1: The Climb & Points Swing */}
                            <PositionChart data={processedData.positionsData} theme={theme} />
                            <CumulativeChart data={processedData.cumulativeData} theme={theme} />
                            
                            {/* Row 2: Season Breakdown & Home/Away */}
                            <SeasonPhaseChart fixtures={fixtures} />
                            <HomeAwayChart fixtures={fixtures} />
                            
                            {/* Row 3: League Tables */}
                            {/* Fix: Removed unsupported 'isPL' prop. The component correctly defaults to PL table rendering without it. */}
                            <LeagueTable title="🏆 Premier League - Table" standings={plStandings} />
                            <LeagueTable title="🏆 Champions League - Table" standings={uclStandings} isUCL={true} />
                            
                            {/* Row 4: OPTA Supercomputer */}
                            <OptaTable title="🖥️ OPTA (PL) Supercomputer" data={optaPLData} type="PL"/>
                            <OptaTable title="🖥️ OPTA (UCL) Supercomputer" data={optaUCLData} type="UCL"/>

                            {/* Row 5: H2H & All-Comp Stats */}
                            <ResultsHeatmap fixtures={fixtures} />
                            <SeasonStatsChart fixtures={fixtures} />
                       </div>
                    )}

                    <Footer />
                </div>
            </div>
        </>
    );
};

export default App;