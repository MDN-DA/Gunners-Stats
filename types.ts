

export interface Fixture {
    mw: number | string | null;
    round: string | null;
    date: string | null;
    opponent: string | null;
    venue: 'Home' | 'Away' | string | null;
    league: 'PL' | 'UCL' | 'EFL' | 'FA' | 'FIFA' | 'CAN_START' | 'CAN_END' | null;
    result2425: 'W' | 'D' | 'L' | null;
    result2526: 'W' | 'D' | 'L' | null;
    score2425: string | null;
    score2526: string | null;
    mw2425?: number | null;
    pos2425: number | null;
    pos2526: number | null;
    pts2425: number | null;
    pts2526: number | null;
    isFifaBreak?: boolean;
    isCanBreak?: boolean;
    canType?: 'start' | 'end';
    isDuplicate?: boolean;
    correlated?: string;
    note?: string;
    postponed?: boolean;
    skipPostponed?: boolean;
    postponedReason?: string;
    matchDiff?: number | null;
    agg?: number | null;
}

export type Competition = 'all' | 'PL' | 'UCL' | 'FA' | 'EFL';
export type View = 'fixtures' | 'graphs';

export interface Stats {
    points2526: number;
    points2425: number;
    matchesPlayed: number;
}

export interface ProcessedData {
    stats: Stats;
    fixtures: Fixture[];
    cumulativeData: { name: string; diff: number, opponent: string | null }[];
    positionsData: { name:string; '24/25': number | null; '25/26': number | null, opponent: string | null }[];
    form: string[];
}

export interface OptaData {
    team: string;
    xPos: number;
    xPts: number;
    // UCL
    league?: string;
    qf?: string;
    sf?: string;
    final?: string;
    winner?: string;
    // PL
    title?: string;
    ucl?: string;
}

// Types for ESPN API Standings Data
export interface RecentEvent {
    result: 'win' | 'loss' | 'draw' | string;
}

export interface TeamLogo {
    href: string;
}

export interface Team {
    id: string;
    abbreviation: string;
    name: string;
    logos: TeamLogo[];
    recentEvents: RecentEvent[];
}

export interface Stat {
    name: string;
    value: number;
    displayValue: string;
}

export interface StandingEntry {
    team: Team;
    stats: Stat[];
    calculatedRank?: number;
}

export interface UCLGroup {
    standings: {
        entries: StandingEntry[];
    }
}