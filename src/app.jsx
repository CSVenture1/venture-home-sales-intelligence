import { useState, useMemo } from 'react';
import { Search, ChevronDown, ChevronUp, TrendingUp, TrendingDown, AlertTriangle, BarChart3, Users, MapPin, Zap, Filter, X } from 'lucide-react';

// ─── Theme ───────────────────────────────────────────────────────────────────
const T = {
  bg: "#0A0D10",
  surface: "#11151A",
  surfaceHover: "#161B22",
  border: "#1E2530",
  borderLight: "#2A3240",
  accent: "#F0A830",
  accentDim: "#F0A83020",
  green: "#2DD4A8",
  greenDim: "#2DD4A815",
  red: "#F87171",
  redDim: "#F8717115",
  blue: "#60A5FA",
  purple: "#A78BFA",
  text: "#E8EDF3",
  muted: "#8B95A3",
  dim: "#4A5568"
};

// ─── Mock Data ───────────────────────────────────────────────────────────────
const LEAD_SOURCES = [
  "Referral", "Adnet LLC", "Modernize", "Energy Bill Cruncher", "Clean Energy Experts",
  "SolarReviews", "RGR Marketing", "Strategic Solar Solutions", "Zone 1 Remodeling",
  "Three Ships", "Bestguide", "Zarate", "EcoGen", "Leadbreakers", "Sunlynk",
  "Pro Remodel", "Lomanno A (Signal)", "Greenwatt Leads", "Lomanno B",
  "Lomanno C", "Studio 28", "Remix Dynamix", "Lead Force", "Allied Digital Media",
  "Call In", "Demand IQ", "Website", "Solar Incentive Pro", "Get the Referral",
  "Tesla Power Wall", "Solar Pro Marketing", "IGS Leads", "Live Admin",
  "Solcertain", "Lead Genesis", "Aurora", "Lead Locker Room", "Convert2Freedom"
];

const MARKETS = ["NY West", "NY East", "NJ", "CT", "MA/RI", "ME/NH", "MD"];

// Inside Sales Team 1: MA/RI, CT, ME/NH — Manager: Ben Vest
// Inside Sales Team 2: NY West, NY East, NJ, MD — Manager: Joseph Goodwin
const INSIDE_REPS = [
  // Team 1 — MA/RI / CT / ME/NH
  { name: "Ben Vest", role: "Manager", market: "MA/RI", team: 1 },
  { name: "Cortney Jetter", role: "FT", market: "MA/RI", team: 1 },
  { name: "David Hole", role: "FT", market: "CT", team: 1 },
  { name: "Miriam Davis", role: "FT", market: "ME/NH", team: 1 },
  { name: "Michael Freedman", role: "FT", market: "MA/RI", team: 1 },
  { name: "Cristian Hollingworth", role: "FT", market: "CT", team: 1 },
  { name: "Amy Vaugh", role: "FT", market: "ME/NH", team: 1 },
  { name: "Gerald Williams", role: "FT", market: "MA/RI", team: 1 },
  { name: "Rocio Lopez", role: "FT", market: "CT", team: 1 },
  { name: "Alex Ives", role: "FT", market: "ME/NH", team: 1 },
  { name: "Chris Clark", role: "FT", market: "MA/RI", team: 1 },
  { name: "Bobby Sheehan", role: "FT", market: "CT", team: 1 },
  { name: "Nathan Orton", role: "FT", market: "ME/NH", team: 1 },
  { name: "Lee Rogers", role: "FT", market: "MA/RI", team: 1 },
  { name: "Patrick Williams", role: "FT", market: "CT", team: 1 },
  { name: "Beau Danner", role: "FT", market: "ME/NH", team: 1 },
  // Team 2 — NY West / NY East / NJ / MD
  { name: "Joseph Goodwin", role: "Manager", market: "NY West", team: 2 },
  { name: "Chris Scaltro", role: "FT", market: "NY West", team: 2 },
  { name: "Gurvir Singh", role: "PT", market: "NY East", team: 2 },
  { name: "Adrienne Sadzinski", role: "FT", market: "NJ", team: 2 },
  { name: "Zachary Deraedt", role: "FT", market: "MD", team: 2 },
  { name: "Tiffany Dempsey", role: "FT", market: "NY West", team: 2 },
  { name: "Greg Cop", role: "PT", market: "NY East", team: 2 },
  { name: "Richard Anderson", role: "FT", market: "NJ", team: 2 },
  { name: "Tyler Blankenship", role: "FT", market: "MD", team: 2 },
  { name: "Isaiah Castillo", role: "FT", market: "NY West", team: 2 },
  { name: "Nadia El Deeb", role: "FT", market: "NY East", team: 2 },
  { name: "Lori Goldberg", role: "FT", market: "NJ", team: 2 },
  { name: "Yamilla Wallace", role: "FT", market: "MD", team: 2 },
];

const OUTSIDE_REPS = [
  // NY West
  { name: "Josh Rosen", role: "Rep", market: "NY West" },
  { name: "Arturo Bustamante", role: "Rep", market: "NY West" },
  { name: "Cole Gimbel", role: "Rep", market: "NY West" },
  { name: "Keith Hubbard", role: "Rep", market: "NY West" },
  { name: "Avanna Mair", role: "Rep", market: "NY West" },
  { name: "Maurice Haughton", role: "Rep", market: "NY West" },
  { name: "Kent Sednaoui", role: "Rep", market: "NY West" },
  // NJ
  { name: "Joe MacKinnon", role: "Rep", market: "NJ" },
  { name: "Boris Kaiser", role: "Rep", market: "NJ" },
  { name: "Alastair Cornell", role: "Rep", market: "NJ" },
  { name: "Fariza Masudova", role: "Rep", market: "NJ" },
  { name: "Piotr Sypytkowski", role: "Rep", market: "NJ" },
  // NY East
  { name: "Rubail Nasir", role: "Rep", market: "NY East" },
  { name: "Antonio Montiel", role: "Rep", market: "NY East" },
  { name: "Kin Dodd-Law", role: "Rep", market: "NY East" },
  { name: "Gert Ford", role: "Rep", market: "NY East" },
  { name: "Steven Paez", role: "Rep", market: "NY East" },
  { name: "Spencer Ganley", role: "Rep", market: "NY East" },
  { name: "Najib Meleschi", role: "Rep", market: "NY East" },
  { name: "Nicole Jones", role: "Rep", market: "NY East" },
  { name: "MD Tahsin", role: "Rep", market: "NY East" },
  // CT
  { name: "Skylar Ernst", role: "Rep", market: "CT" },
  { name: "Justin Robinson", role: "Closer+GTR", market: "CT" },
  { name: "Max McNamara", role: "Closer", market: "CT" },
  { name: "Claire Sharkey", role: "Rep", market: "CT" },
  { name: "Michael Ficarra", role: "Rep", market: "CT" },
  { name: "Dominick Nuzzo", role: "Rep", market: "CT" },
  { name: "Steve Platt", role: "Rep", market: "CT" },
  { name: "Darrid Sharkey", role: "Rep", market: "CT" },
  { name: "Suzanne Schulz", role: "Rep", market: "CT" },
  // MA/RI
  { name: "Kaya Ulcay", role: "Rep", market: "MA/RI" },
  { name: "Steven Spector", role: "Rep", market: "MA/RI" },
  { name: "Laureena Giorgi", role: "Rep", market: "MA/RI" },
  { name: "Zac Brown", role: "Rep", market: "MA/RI" },
  { name: "Isabel Mota", role: "Rep", market: "MA/RI" },
  { name: "Ian Griffith", role: "Rep", market: "MA/RI" },
  { name: "Nonni Muller", role: "Rep", market: "MA/RI" },
  { name: "Robel Mahari", role: "Rep", market: "MA/RI" },
  // ME/NH
  { name: "Nicholas Pagliaro", role: "Rep", market: "ME/NH" },
  { name: "Shane Gammell", role: "Closer+GTR", market: "ME/NH" },
  { name: "Shawn Davis", role: "Closer+GTR", market: "ME/NH" },
  { name: "Brian Graham", role: "Rep", market: "ME/NH" },
  { name: "Abubaker Elsheikh", role: "Rep", market: "ME/NH" },
  { name: "Nicole Barna", role: "Rep", market: "ME/NH" },
  { name: "Craig Enslin", role: "Rep", market: "ME/NH" },
  { name: "Justin Tinsman", role: "Rep", market: "ME/NH" },
  { name: "Alexis Loring", role: "Rep", market: "ME/NH" },
  { name: "Kiyanna Hutchins", role: "Rep", market: "ME/NH" },
  // MD
  { name: "Cameron Doherty", role: "Rep", market: "MD" },
  { name: "Mike Palmore", role: "Rep", market: "MD" },
  { name: "Abraham Boakye", role: "Rep", market: "MD" },
  { name: "Joe Flannery", role: "Rep", market: "MD" },
  { name: "Nicholas Karcz", role: "Rep", market: "MD" },
  { name: "Chris Alexander", role: "Rep", market: "MD" },
  { name: "Herbert Ngu", role: "Rep", market: "MD" },
];

// Seeded random for consistent mock data
function seededRandom(seed) {
  let s = seed;
  return function() {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

// ─── Per-Lead-Source Rep Performance Data ─────────────────────────────────────
// Each lead source gets a set of inside and outside reps who worked it,
// with individual metrics so the insights engine can flag specific issues.
function generateRepsBySource(sourceIndex) {
  const rng = seededRandom(sourceIndex * 997 + 31);

  // Pick 3-6 inside reps who worked this source (skip managers at index 0 and 16)
  const numInside = Math.floor(rng() * 4) + 3;
  const insidePerf = [];
  const usedInside = new Set();
  const managerIndices = new Set(INSIDE_REPS.map((r, i) => r.role === 'Manager' ? i : -1).filter(i => i >= 0));
  for (let j = 0; j < numInside; j++) {
    let idx = Math.floor(rng() * INSIDE_REPS.length);
    while (usedInside.has(idx) || managerIndices.has(idx)) idx = (idx + 1) % INSIDE_REPS.length;
    usedInside.add(idx);
    const rep = INSIDE_REPS[idx];
    const contacts = Math.floor(rng() * 40) + 10;
    const setRate = rng() * 0.45 + 0.2;        // 20-65% of contacts set
    const sitRate = rng() * 0.35 + 0.25;        // 25-60% of sets actually sit
    const sets = Math.floor(contacts * setRate);
    const sits = Math.floor(sets * sitRate);
    insidePerf.push({
      name: rep.name, market: rep.market,
      contacts, sets, sits, setRate, sitRate,
    });
  }

  // Pick 3-8 outside reps who ran appointments from this source
  const numOutside = Math.floor(rng() * 6) + 3;
  const outsidePerf = [];
  const usedOutside = new Set();
  for (let j = 0; j < numOutside; j++) {
    let idx = Math.floor(rng() * OUTSIDE_REPS.length);
    while (usedOutside.has(idx)) idx = (idx + 1) % OUTSIDE_REPS.length;
    usedOutside.add(idx);
    const rep = OUTSIDE_REPS[idx];
    const runs = Math.floor(rng() * 30) + 5;
    const netCloseRate = rng() * 0.4 + 0.1;     // 10-50%
    const cancelRate = rng() * 0.25 + 0.03;
    const closes = Math.floor(runs * netCloseRate);
    const cancels = Math.floor(closes * cancelRate);
    outsidePerf.push({
      name: rep.name, market: rep.market,
      runs, closes, cancels, netCloseRate, cancelRate,
    });
  }

  return { insidePerf, outsidePerf };
}

// ─── Insights Engine ─────────────────────────────────────────────────────────
// Analyzes per-source rep data and returns categorized bullet insights
function generateInsights(sourceData, repsBySource) {
  const insights = []; // { type: 'red'|'amber'|'green', text: string }
  const { insidePerf, outsidePerf } = repsBySource;

  // ── Outside rep flags ──────────────────────────────────────────────────
  // Flag: outside reps with 10+ runs and < 25% net close
  const lowCloseOutside = outsidePerf.filter(r => r.runs >= 10 && r.netCloseRate < 0.25);
  if (lowCloseOutside.length > 0) {
    const names = lowCloseOutside.map(r => `${r.name} (${(r.netCloseRate * 100).toFixed(0)}% on ${r.runs} runs)`).join(', ');
    insights.push({
      type: 'red',
      text: `Outside reps with 10+ run sample below 25% net close: ${names}. Review call recordings for objection handling gaps and consider ride-alongs with a top closer.`
    });
  }

  // Flag: outside reps with high cancel rate (>20%)
  const highCancelOutside = outsidePerf.filter(r => r.runs >= 8 && r.cancelRate > 0.20);
  if (highCancelOutside.length > 0) {
    const names = highCancelOutside.map(r => `${r.name} (${(r.cancelRate * 100).toFixed(0)}% cancel on ${r.closes} deals)`).join(', ');
    insights.push({
      type: 'red',
      text: `High cancellation reps on this source: ${names}. May indicate pressure-closing or poor expectation-setting during the sit.`
    });
  }

  // Flag: outside reps crushing it (10+ runs, >40% net)
  const topCloseOutside = outsidePerf.filter(r => r.runs >= 10 && r.netCloseRate > 0.40);
  if (topCloseOutside.length > 0) {
    const names = topCloseOutside.map(r => `${r.name} (${(r.netCloseRate * 100).toFixed(0)}% on ${r.runs} runs)`).join(', ');
    insights.push({
      type: 'green',
      text: `Top closers on this source: ${names}. Study their approach — what objection handling and value framing are they using that others aren't?`
    });
  }

  // ── Inside rep flags ───────────────────────────────────────────────────
  // Flag: inside reps making contact but setting < 50% AND sitting < 40%
  const lowSetAndSit = insidePerf.filter(r => r.contacts >= 10 && r.setRate < 0.50 && r.sitRate < 0.40);
  if (lowSetAndSit.length > 0) {
    const names = lowSetAndSit.map(r => `${r.name} (${(r.setRate * 100).toFixed(0)}% set, ${(r.sitRate * 100).toFixed(0)}% sit on ${r.contacts} contacts)`).join(', ');
    insights.push({
      type: 'red',
      text: `Inside reps with low set AND sit rates: ${names}. These reps are making contact but not converting — likely a pitch quality or qualification issue. Coaching priority.`
    });
  }

  // Flag: inside reps setting OK but very low sit rate (< 35%) — scheduling/confirmation issue
  const lowSitOnly = insidePerf.filter(r => r.contacts >= 10 && r.setRate >= 0.50 && r.sitRate < 0.35);
  if (lowSitOnly.length > 0) {
    const names = lowSitOnly.map(r => `${r.name} (${(r.setRate * 100).toFixed(0)}% set but only ${(r.sitRate * 100).toFixed(0)}% sit)`).join(', ');
    insights.push({
      type: 'amber',
      text: `Reps setting appointments but leads not showing: ${names}. The set is happening but sits are falling off — check confirmation call process and scheduling timing.`
    });
  }

  // Flag: inside reps with great set AND sit rates
  const topInside = insidePerf.filter(r => r.contacts >= 10 && r.setRate >= 0.55 && r.sitRate >= 0.50);
  if (topInside.length > 0) {
    const names = topInside.map(r => `${r.name} (${(r.setRate * 100).toFixed(0)}% set, ${(r.sitRate * 100).toFixed(0)}% sit)`).join(', ');
    insights.push({
      type: 'green',
      text: `Strong inside performers on this source: ${names}. High set-to-sit conversion suggests effective qualification and strong confirmation process.`
    });
  }

  // ── Source-level flags ─────────────────────────────────────────────────
  // Overall source close rate issue
  if (sourceData.sitToClose < 0.28) {
    insights.push({
      type: 'red',
      text: `Source-wide close rate is critically low at ${(sourceData.sitToClose * 100).toFixed(1)}%. This affects all reps running these leads — may indicate lead quality issue (price shoppers, low intent) rather than rep performance.`
    });
  }

  // Lead-to-set below benchmark
  if (sourceData.leadToSet < 0.22) {
    insights.push({
      type: 'red',
      text: `Lead-to-set rate of ${(sourceData.leadToSet * 100).toFixed(1)}% is well below the 25% benchmark. Contact quality from this source may be poor — check if leads have valid phone numbers and are actually interested.`
    });
  }

  // High cost per deal
  if (sourceData.costPerDeal > 500) {
    insights.push({
      type: 'amber',
      text: `Cost per deal of $${sourceData.costPerDeal} is above the $500 threshold. At current conversion rates, this source needs ${(1 / sourceData.overallConversion).toFixed(0)} leads per deal. Consider renegotiating CPL or reallocating budget.`
    });
  }

  // Set-to-sit dropping
  if (sourceData.setToSit < 0.70) {
    insights.push({
      type: 'amber',
      text: `Set-to-sit rate of ${(sourceData.setToSit * 100).toFixed(1)}% means nearly a third of appointments aren't happening. Check average days to sit (${sourceData.avgDaysSetToSit} days) — tighter scheduling could help.`
    });
  }

  // Trailing trend declining
  if (sourceData.leadToSet < sourceData.trail3LeadToSet - 0.04) {
    insights.push({
      type: 'amber',
      text: `Lead-to-set rate has dropped ${((sourceData.trail3LeadToSet - sourceData.leadToSet) * 100).toFixed(1)} points vs the 3-month trailing average. Trend is deteriorating — investigate if source quality has changed recently.`
    });
  }

  // Positive: high overall conversion
  if (sourceData.overallConversion > 0.10) {
    insights.push({
      type: 'green',
      text: `This is a top-tier source at ${(sourceData.overallConversion * 100).toFixed(1)}% overall conversion. Consider increasing budget allocation and protecting rep assignments to maintain performance.`
    });
  }

  // Positive: low cost per deal
  if (sourceData.costPerDeal < 200) {
    insights.push({
      type: 'green',
      text: `Cost per deal of $${sourceData.costPerDeal} is highly efficient. This source delivers strong ROI — prioritize lead volume from here.`
    });
  }

  // Cancellation flag
  if (sourceData.cancellationRate > 0.18) {
    insights.push({
      type: 'amber',
      text: `Cancellation rate of ${(sourceData.cancellationRate * 100).toFixed(1)}% on this source is elevated. Review whether reps are setting proper expectations during the close or if leads have buyer's remorse.`
    });
  }

  // Sort: red first, then amber, then green
  const order = { red: 0, amber: 1, green: 2 };
  insights.sort((a, b) => order[a.type] - order[b.type]);

  return insights;
}

function generateLeadSourceData() {
  return LEAD_SOURCES.map((source, i) => {
    const rng = seededRandom(i * 137 + 42);
    const isTopPerformer = i < 5;
    const leads = Math.floor(rng() * 180) + (isTopPerformer ? 120 : 30);
    const leadToSet = isTopPerformer ? rng() * 0.2 + 0.35 : rng() * 0.3 + 0.15;
    const setToSit = rng() * 0.2 + 0.65;
    const sitToClose = isTopPerformer ? rng() * 0.15 + 0.35 : rng() * 0.2 + 0.25;
    const costPerLead = Math.floor(rng() * 80) + 20;
    const costPerDeal = Math.floor(costPerLead / (leadToSet * setToSit * sitToClose));
    const cancellationRate = rng() * 0.2 + 0.05;
    const avgDaysSetToSit = Math.floor(rng() * 7) + 2;
    const avgDaysSitToClose = Math.floor(rng() * 12) + 5;
    const totalRevenue = Math.floor(leads * leadToSet * setToSit * sitToClose * (rng() * 20000 + 25000));
    const overallConversion = leadToSet * setToSit * sitToClose;

    // Trailing 3-month data
    const trail3LeadToSet = leadToSet + (rng() - 0.5) * 0.08;
    const trail3SetToSit = setToSit + (rng() - 0.5) * 0.06;
    const trail3SitToClose = sitToClose + (rng() - 0.5) * 0.06;

    // Trend direction
    const trend = leadToSet > trail3LeadToSet ? 'up' : leadToSet < trail3LeadToSet - 0.03 ? 'down' : 'flat';

    // Per-source rep breakdowns
    const repsBySource = generateRepsBySource(i);

    return {
      source, leads,
      leadToSet, setToSit, sitToClose, overallConversion,
      costPerLead, costPerDeal, cancellationRate,
      avgDaysSetToSit, avgDaysSitToClose, totalRevenue,
      trail3LeadToSet, trail3SetToSit, trail3SitToClose, trend,
      topInsideRep: INSIDE_REPS[Math.floor(rng() * (INSIDE_REPS.length - 2)) + 2].name,
      topOutsideRep: OUTSIDE_REPS[Math.floor(rng() * OUTSIDE_REPS.length)].name,
      primaryMarket: MARKETS[Math.floor(rng() * MARKETS.length)],
      repsBySource,
    };
  });
}

function generateRepData(reps, type) {
  return reps.map((rep, i) => {
    const rng = seededRandom(i * 251 + (type === 'inside' ? 100 : 500));
    const totalLeads = Math.floor(rng() * 60) + 20;
    const leadToSet = type === 'inside' ? rng() * 0.3 + 0.2 : null;
    const setToSit = rng() * 0.2 + 0.65;
    const sitToClose = type === 'outside' ? rng() * 0.2 + 0.3 : null;
    const revenue = Math.floor(rng() * 400000) + 80000;
    const avgCallsPerLead = Math.floor(rng() * 4) + 2;
    const cancellationRate = rng() * 0.15 + 0.05;

    return {
      ...rep, totalLeads, leadToSet, setToSit, sitToClose,
      revenue, avgCallsPerLead, cancellationRate,
      trend: rng() > 0.5 ? 'up' : 'down',
      score: Math.floor(rng() * 40) + 60
    };
  });
}

function generateMarketData() {
  return MARKETS.map((market, i) => {
    const rng = seededRandom(i * 313 + 77);
    const totalLeads = Math.floor(rng() * 500) + 200;
    const insideReps = INSIDE_REPS.filter(r => r.market === market || r.market === 'All').length;
    const outsideReps = OUTSIDE_REPS.filter(r => r.market === market).length;
    const leadToSet = rng() * 0.2 + 0.25;
    const setToSit = rng() * 0.15 + 0.7;
    const sitToClose = rng() * 0.15 + 0.3;
    const revenue = Math.floor(totalLeads * leadToSet * setToSit * sitToClose * (rng() * 15000 + 28000));
    const costPerDeal = Math.floor(rng() * 300) + 200;

    return {
      market, totalLeads, insideReps, outsideReps,
      leadToSet, setToSit, sitToClose, revenue, costPerDeal,
      topSource: LEAD_SOURCES[Math.floor(rng() * 10)],
      trend: rng() > 0.45 ? 'up' : 'down'
    };
  });
}

// ─── Utility Components ──────────────────────────────────────────────────────
function getColor(value, good, warning) {
  if (value >= good) return T.green;
  if (value >= warning) return T.accent;
  return T.red;
}

function Pct({ value, good, warning }) {
  const color = getColor(value, good, warning);
  return (
    <span style={{ fontFamily: "'JetBrains Mono', monospace", color, fontSize: '14px' }}>
      {(value * 100).toFixed(1)}%
    </span>
  );
}

function Mono({ children, color }) {
  return (
    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '14px', color: color || T.text }}>
      {children}
    </span>
  );
}

function TrendIcon({ trend }) {
  if (trend === 'up') return <TrendingUp size={14} color={T.green} />;
  if (trend === 'down') return <TrendingDown size={14} color={T.red} />;
  return <span style={{ color: T.dim }}>—</span>;
}

function Badge({ children, color }) {
  return (
    <span style={{
      display: 'inline-block', padding: '2px 8px', borderRadius: '4px',
      fontSize: '11px', fontWeight: '500', letterSpacing: '0.5px',
      backgroundColor: color + '20', color: color, textTransform: 'uppercase'
    }}>
      {children}
    </span>
  );
}

function KpiCard({ label, value, subtext, color, icon: Icon }) {
  return (
    <div style={{
      background: T.surface, borderRadius: '8px', padding: '16px 20px',
      border: `1px solid ${T.border}`, flex: 1, minWidth: '180px'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
        <span style={{ fontSize: '12px', color: T.muted, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</span>
        {Icon && <Icon size={16} color={T.dim} />}
      </div>
      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '24px', fontWeight: '600', color: color || T.text }}>
        {value}
      </div>
      {subtext && <div style={{ fontSize: '12px', color: T.muted, marginTop: '4px' }}>{subtext}</div>}
    </div>
  );
}

function FunnelBar({ l2s, s2s, s2c }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
      <div style={{
        width: `${Math.max(l2s * 100 * 0.7, 6)}px`, height: '10px',
        backgroundColor: getColor(l2s, 0.35, 0.25), borderRadius: '2px', transition: 'width 0.3s'
      }} />
      <div style={{
        width: `${Math.max(s2s * 100 * 0.5, 6)}px`, height: '10px',
        backgroundColor: getColor(s2s, 0.8, 0.7), borderRadius: '2px', transition: 'width 0.3s'
      }} />
      <div style={{
        width: `${Math.max(s2c * 100 * 1.0, 6)}px`, height: '10px',
        backgroundColor: getColor(s2c, 0.4, 0.3), borderRadius: '2px', transition: 'width 0.3s'
      }} />
    </div>
  );
}

// ─── Views ───────────────────────────────────────────────────────────────────

function LeadSourcesView({ data }) {
  const [selectedSource, setSelectedSource] = useState(null);
  const [sortBy, setSortBy] = useState('overallConversion');
  const [sortDir, setSortDir] = useState('desc');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMarket, setFilterMarket] = useState('All');

  const filtered = useMemo(() => {
    let d = [...data];
    if (searchTerm) d = d.filter(item => item.source.toLowerCase().includes(searchTerm.toLowerCase()));
    if (filterMarket !== 'All') d = d.filter(item => item.primaryMarket === filterMarket);
    d.sort((a, b) => {
      if (sortBy === 'source') return sortDir === 'asc' ? a.source.localeCompare(b.source) : b.source.localeCompare(a.source);
      const aVal = typeof a[sortBy] === 'number' ? a[sortBy] : parseFloat(a[sortBy]);
      const bVal = typeof b[sortBy] === 'number' ? b[sortBy] : parseFloat(b[sortBy]);
      return sortDir === 'asc' ? aVal - bVal : bVal - aVal;
    });
    return d;
  }, [data, sortBy, sortDir, searchTerm, filterMarket]);

  const handleSort = (field) => {
    if (sortBy === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortBy(field); setSortDir('desc'); }
  };

  const totalLeads = data.reduce((sum, d) => sum + d.leads, 0);
  const avgL2S = data.reduce((sum, d) => sum + d.leadToSet, 0) / data.length;
  const avgS2C = data.reduce((sum, d) => sum + d.sitToClose, 0) / data.length;
  const totalRev = data.reduce((sum, d) => sum + d.totalRevenue, 0);

  const selected = selectedSource ? data.find(d => d.source === selectedSource) : null;

  const SortHeader = ({ field, children, align }) => (
    <div
      onClick={() => handleSort(field)}
      style={{ textAlign: align || 'center', cursor: 'pointer', userSelect: 'none', display: 'flex', alignItems: 'center', justifyContent: align === 'left' ? 'flex-start' : 'center', gap: '4px' }}
    >
      {children}
      {sortBy === field && (sortDir === 'desc' ? <ChevronDown size={12} /> : <ChevronUp size={12} />)}
    </div>
  );

  return (
    <div>
      {/* KPIs */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <KpiCard label="Total Leads" value={totalLeads.toLocaleString()} subtext="Across all sources" icon={Zap} />
        <KpiCard label="Avg Lead→Set" value={`${(avgL2S * 100).toFixed(1)}%`} color={getColor(avgL2S, 0.35, 0.25)} icon={TrendingUp} />
        <KpiCard label="Avg Sit→Close" value={`${(avgS2C * 100).toFixed(1)}%`} color={getColor(avgS2C, 0.4, 0.3)} icon={BarChart3} />
        <KpiCard label="Total Revenue" value={`$${(totalRev / 1000000).toFixed(1)}M`} subtext="All sources combined" icon={TrendingUp} />
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '200px', maxWidth: '320px' }}>
          <Search size={16} color={T.dim} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text" placeholder="Search lead sources..."
            value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
            style={{
              width: '100%', background: T.surface, border: `1px solid ${T.border}`, borderRadius: '6px',
              color: T.text, padding: '8px 12px 8px 36px', fontSize: '14px', fontFamily: "'Outfit', sans-serif",
              outline: 'none', boxSizing: 'border-box'
            }}
          />
        </div>
        <select
          value={filterMarket} onChange={e => setFilterMarket(e.target.value)}
          style={{
            background: T.surface, border: `1px solid ${T.border}`, borderRadius: '6px',
            color: T.text, padding: '8px 12px', fontSize: '14px', fontFamily: "'Outfit', sans-serif"
          }}
        >
          <option value="All">All Markets</option>
          {MARKETS.map(m => <option key={m} value={m}>{m}</option>)}
        </select>
        <div style={{ fontSize: '13px', color: T.dim }}>
          {filtered.length} of {data.length} sources
        </div>
      </div>

      {/* Funnel Legend */}
      <div style={{
        background: T.surface, borderRadius: '8px', padding: '12px 20px', marginBottom: '16px',
        border: `1px solid ${T.border}`, display: 'flex', gap: '28px', alignItems: 'center', flexWrap: 'wrap'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '14px', height: '10px', backgroundColor: T.green, borderRadius: '2px' }} />
          <span style={{ fontSize: '13px', color: T.muted }}>Lead → Set</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '14px', height: '10px', backgroundColor: T.accent, borderRadius: '2px' }} />
          <span style={{ fontSize: '13px', color: T.muted }}>Set → Sit</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '14px', height: '10px', backgroundColor: T.red, borderRadius: '2px' }} />
          <span style={{ fontSize: '13px', color: T.muted }}>Sit → Close</span>
        </div>
        <span style={{ fontSize: '12px', color: T.dim }}>Bar width = conversion strength</span>
      </div>

      {/* Table */}
      <div style={{ background: T.surface, borderRadius: '8px', overflow: 'hidden', border: `1px solid ${T.border}` }}>
        <div style={{
          display: 'grid', gridTemplateColumns: '2fr 0.8fr 0.9fr 0.9fr 0.9fr 0.9fr 1.3fr 0.8fr 0.7fr',
          padding: '14px 20px', borderBottom: `1px solid ${T.border}`, backgroundColor: T.bg,
          fontSize: '12px', fontWeight: '600', color: T.muted, textTransform: 'uppercase', letterSpacing: '0.5px'
        }}>
          <SortHeader field="source" align="left">Source</SortHeader>
          <SortHeader field="leads">Leads</SortHeader>
          <SortHeader field="leadToSet">L→Set</SortHeader>
          <SortHeader field="setToSit">Set→Sit</SortHeader>
          <SortHeader field="sitToClose">Sit→Close</SortHeader>
          <SortHeader field="overallConversion">Overall</SortHeader>
          <div style={{ textAlign: 'center' }}>Funnel</div>
          <SortHeader field="costPerDeal">CPD</SortHeader>
          <div style={{ textAlign: 'center' }}>Trend</div>
        </div>

        {filtered.map((item, idx) => (
          <div key={item.source}>
            <div
              onClick={() => setSelectedSource(selectedSource === item.source ? null : item.source)}
              style={{
                display: 'grid', gridTemplateColumns: '2fr 0.8fr 0.9fr 0.9fr 0.9fr 0.9fr 1.3fr 0.8fr 0.7fr',
                padding: '14px 20px', cursor: 'pointer',
                borderBottom: idx < filtered.length - 1 || selectedSource === item.source ? `1px solid ${T.border}` : 'none',
                backgroundColor: selectedSource === item.source ? T.accentDim : 'transparent',
                transition: 'background-color 0.15s'
              }}
              onMouseEnter={e => { if (selectedSource !== item.source) e.currentTarget.style.backgroundColor = T.surfaceHover; }}
              onMouseLeave={e => { if (selectedSource !== item.source) e.currentTarget.style.backgroundColor = 'transparent'; }}
            >
              <div style={{ fontSize: '14px', fontWeight: selectedSource === item.source ? '500' : '400', display: 'flex', alignItems: 'center', gap: '8px' }}>
                {item.source}
                {item.overallConversion > 0.12 && <Badge color={T.green}>Top</Badge>}
              </div>
              <div style={{ textAlign: 'center' }}><Mono>{item.leads}</Mono></div>
              <div style={{ textAlign: 'center' }}><Pct value={item.leadToSet} good={0.35} warning={0.25} /></div>
              <div style={{ textAlign: 'center' }}><Pct value={item.setToSit} good={0.8} warning={0.7} /></div>
              <div style={{ textAlign: 'center' }}><Pct value={item.sitToClose} good={0.4} warning={0.3} /></div>
              <div style={{ textAlign: 'center' }}>
                <span style={{
                  fontFamily: "'JetBrains Mono', monospace", fontSize: '14px', fontWeight: '600',
                  color: getColor(item.overallConversion, 0.08, 0.05)
                }}>
                  {(item.overallConversion * 100).toFixed(1)}%
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <FunnelBar l2s={item.leadToSet} s2s={item.setToSit} s2c={item.sitToClose} />
              </div>
              <div style={{ textAlign: 'center' }}><Mono color={item.costPerDeal > 500 ? T.red : item.costPerDeal > 300 ? T.accent : T.green}>${item.costPerDeal}</Mono></div>
              <div style={{ textAlign: 'center', display: 'flex', justifyContent: 'center' }}><TrendIcon trend={item.trend} /></div>
            </div>

            {/* Expanded Detail */}
            {selectedSource === item.source && (() => {
              const insights = generateInsights(item, item.repsBySource);
              const insightColors = { red: T.red, amber: T.accent, green: T.green };
              const insightIcons = { red: '●', amber: '▲', green: '✦' };
              return (
              <div style={{ padding: '20px', backgroundColor: T.bg, borderBottom: `1px solid ${T.border}` }}>
                {/* Metrics row */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '24px' }}>
                  <div>
                    <h4 style={{ fontSize: '12px', fontWeight: '600', margin: '0 0 12px 0', color: T.muted, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Timing</h4>
                    <div style={{ fontSize: '14px', lineHeight: '2' }}>
                      <div>Set → Sit: <Mono color={T.accent}>{item.avgDaysSetToSit} days</Mono></div>
                      <div>Sit → Close: <Mono color={T.accent}>{item.avgDaysSitToClose} days</Mono></div>
                      <div>Cancel Rate: <Pct value={item.cancellationRate} good={0.08} warning={0.15} /></div>
                    </div>
                  </div>
                  <div>
                    <h4 style={{ fontSize: '12px', fontWeight: '600', margin: '0 0 12px 0', color: T.muted, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Trailing 3-Mo Avg</h4>
                    <div style={{ fontSize: '14px', lineHeight: '2' }}>
                      <div>L→Set: <Pct value={item.trail3LeadToSet} good={0.35} warning={0.25} /></div>
                      <div>Set→Sit: <Pct value={item.trail3SetToSit} good={0.8} warning={0.7} /></div>
                      <div>Sit→Close: <Pct value={item.trail3SitToClose} good={0.4} warning={0.3} /></div>
                    </div>
                  </div>
                  <div>
                    <h4 style={{ fontSize: '12px', fontWeight: '600', margin: '0 0 12px 0', color: T.muted, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Financials</h4>
                    <div style={{ fontSize: '14px', lineHeight: '2' }}>
                      <div>Cost/Lead: <Mono color={T.text}>${item.costPerLead}</Mono></div>
                      <div>Cost/Deal: <Mono color={item.costPerDeal > 500 ? T.red : T.green}>${item.costPerDeal}</Mono></div>
                      <div>Revenue: <Mono color={T.green}>${(item.totalRevenue / 1000).toFixed(0)}k</Mono></div>
                    </div>
                  </div>
                  <div>
                    <h4 style={{ fontSize: '12px', fontWeight: '600', margin: '0 0 12px 0', color: T.muted, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Top Performers</h4>
                    <div style={{ fontSize: '14px', lineHeight: '2' }}>
                      <div>Inside: <span style={{ color: T.accent }}>{item.topInsideRep}</span></div>
                      <div>Outside: <span style={{ color: T.accent }}>{item.topOutsideRep}</span></div>
                      <div>Market: <span style={{ color: T.blue }}>{item.primaryMarket}</span></div>
                    </div>
                  </div>
                </div>

                {/* Rep Breakdown Tables */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '20px' }}>
                  {/* Inside Reps on this source */}
                  <div style={{ background: T.surface, borderRadius: '6px', border: `1px solid ${T.border}`, overflow: 'hidden' }}>
                    <div style={{ padding: '10px 14px', borderBottom: `1px solid ${T.border}`, fontSize: '12px', fontWeight: '600', color: T.muted, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Inside Reps on {item.source}
                    </div>
                    <div style={{ fontSize: '12px' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '2fr 0.8fr 0.8fr 0.8fr', padding: '8px 14px', color: T.dim, borderBottom: `1px solid ${T.border}` }}>
                        <div>Rep</div><div style={{ textAlign: 'center' }}>Contacts</div><div style={{ textAlign: 'center' }}>Set %</div><div style={{ textAlign: 'center' }}>Sit %</div>
                      </div>
                      {item.repsBySource.insidePerf.map(r => (
                        <div key={r.name} style={{ display: 'grid', gridTemplateColumns: '2fr 0.8fr 0.8fr 0.8fr', padding: '6px 14px', borderBottom: `1px solid ${T.border}` }}>
                          <div style={{ color: T.text, fontSize: '13px' }}>{r.name}</div>
                          <div style={{ textAlign: 'center' }}><Mono>{r.contacts}</Mono></div>
                          <div style={{ textAlign: 'center' }}><Pct value={r.setRate} good={0.50} warning={0.35} /></div>
                          <div style={{ textAlign: 'center' }}><Pct value={r.sitRate} good={0.40} warning={0.30} /></div>
                        </div>
                      ))}
                    </div>
                  </div>
                  {/* Outside Reps on this source */}
                  <div style={{ background: T.surface, borderRadius: '6px', border: `1px solid ${T.border}`, overflow: 'hidden' }}>
                    <div style={{ padding: '10px 14px', borderBottom: `1px solid ${T.border}`, fontSize: '12px', fontWeight: '600', color: T.muted, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Outside Reps on {item.source}
                    </div>
                    <div style={{ fontSize: '12px' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '2fr 0.8fr 0.8fr 0.8fr', padding: '8px 14px', color: T.dim, borderBottom: `1px solid ${T.border}` }}>
                        <div>Rep</div><div style={{ textAlign: 'center' }}>Runs</div><div style={{ textAlign: 'center' }}>Net %</div><div style={{ textAlign: 'center' }}>Cancel %</div>
                      </div>
                      {item.repsBySource.outsidePerf.map(r => (
                        <div key={r.name} style={{ display: 'grid', gridTemplateColumns: '2fr 0.8fr 0.8fr 0.8fr', padding: '6px 14px', borderBottom: `1px solid ${T.border}` }}>
                          <div style={{ color: T.text, fontSize: '13px' }}>{r.name}</div>
                          <div style={{ textAlign: 'center' }}><Mono>{r.runs}</Mono></div>
                          <div style={{ textAlign: 'center' }}><Pct value={r.netCloseRate} good={0.35} warning={0.25} /></div>
                          <div style={{ textAlign: 'center' }}><Pct value={r.cancelRate} good={0.10} warning={0.18} /></div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Data-Driven Insights */}
                <div style={{
                  marginTop: '20px', padding: '16px', borderRadius: '6px',
                  border: `1px solid ${T.borderLight}`, background: T.surface
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                    <AlertTriangle size={14} color={T.accent} />
                    <span style={{ fontSize: '12px', fontWeight: '600', color: T.accent, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Diagnostic Insights ({insights.filter(i => i.type === 'red').length} issues, {insights.filter(i => i.type === 'amber').length} warnings, {insights.filter(i => i.type === 'green').length} strengths)
                    </span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {insights.map((insight, iIdx) => (
                      <div key={iIdx} style={{
                        display: 'flex', gap: '10px', alignItems: 'flex-start',
                        padding: '10px 12px', borderRadius: '4px',
                        backgroundColor: insightColors[insight.type] + '08',
                        borderLeft: `3px solid ${insightColors[insight.type]}`
                      }}>
                        <span style={{ color: insightColors[insight.type], fontSize: '12px', marginTop: '1px', flexShrink: 0 }}>
                          {insightIcons[insight.type]}
                        </span>
                        <span style={{ fontSize: '13px', lineHeight: '1.6', color: T.text }}>
                          {insight.text}
                        </span>
                      </div>
                    ))}
                    {insights.length === 0 && (
                      <div style={{ fontSize: '13px', color: T.muted }}>No significant flags for this source — performing within expected ranges.</div>
                    )}
                  </div>
                </div>
              </div>
              );
            })()}
          </div>
        ))}
      </div>
    </div>
  );
}

function RepPerformanceView({ insideData, outsideData }) {
  const [repType, setRepType] = useState('inside');
  const [sortBy, setSortBy] = useState('score');
  const [sortDir, setSortDir] = useState('desc');
  const [filterMarket, setFilterMarket] = useState('All');

  const activeData = repType === 'inside' ? insideData : outsideData;

  const filtered = useMemo(() => {
    let d = [...activeData];
    if (filterMarket !== 'All') d = d.filter(r => r.market === filterMarket || r.market === 'All');
    d.sort((a, b) => {
      const aVal = a[sortBy] ?? 0;
      const bVal = b[sortBy] ?? 0;
      return sortDir === 'asc' ? aVal - bVal : bVal - aVal;
    });
    return d;
  }, [activeData, sortBy, sortDir, filterMarket]);

  const avgScore = filtered.reduce((s, r) => s + r.score, 0) / filtered.length;
  const totalRev = filtered.reduce((s, r) => s + r.revenue, 0);
  const topPerformer = [...filtered].sort((a, b) => b.score - a.score)[0];

  return (
    <div>
      {/* KPIs */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <KpiCard label={`${repType === 'inside' ? 'Inside' : 'Outside'} Reps`} value={filtered.length} icon={Users} />
        <KpiCard label="Avg Score" value={avgScore.toFixed(0)} color={avgScore > 80 ? T.green : avgScore > 65 ? T.accent : T.red} icon={BarChart3} />
        <KpiCard label="Total Revenue" value={`$${(totalRev / 1000000).toFixed(1)}M`} icon={TrendingUp} />
        <KpiCard label="Top Performer" value={topPerformer?.name || '—'} subtext={`Score: ${topPerformer?.score || 0}`} color={T.accent} icon={Zap} />
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', borderRadius: '6px', overflow: 'hidden', border: `1px solid ${T.border}` }}>
          {['inside', 'outside'].map(type => (
            <button key={type} onClick={() => setRepType(type)} style={{
              padding: '8px 20px', fontSize: '14px', fontFamily: "'Outfit', sans-serif", border: 'none', cursor: 'pointer',
              backgroundColor: repType === type ? T.accent : T.surface, color: repType === type ? T.bg : T.muted,
              fontWeight: repType === type ? '600' : '400', transition: 'all 0.15s'
            }}>
              {type === 'inside' ? 'Inside Reps' : 'Outside Reps'}
            </button>
          ))}
        </div>
        <select value={filterMarket} onChange={e => setFilterMarket(e.target.value)} style={{
          background: T.surface, border: `1px solid ${T.border}`, borderRadius: '6px',
          color: T.text, padding: '8px 12px', fontSize: '14px', fontFamily: "'Outfit', sans-serif"
        }}>
          <option value="All">All Markets</option>
          {MARKETS.map(m => <option key={m} value={m}>{m}</option>)}
        </select>
      </div>

      {/* Table */}
      <div style={{ background: T.surface, borderRadius: '8px', overflow: 'hidden', border: `1px solid ${T.border}` }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: repType === 'inside' ? '2fr 1fr 1fr 1fr 1fr 1fr 0.8fr 0.8fr' : '2fr 1fr 1fr 1fr 1fr 1fr 0.8fr 0.8fr',
          padding: '14px 20px', borderBottom: `1px solid ${T.border}`, backgroundColor: T.bg,
          fontSize: '12px', fontWeight: '600', color: T.muted, textTransform: 'uppercase', letterSpacing: '0.5px'
        }}>
          <div>Rep</div>
          <div style={{ textAlign: 'center' }}>Market</div>
          <div style={{ textAlign: 'center' }}>Leads</div>
          <div style={{ textAlign: 'center' }}>{repType === 'inside' ? 'L→Set' : 'Sit→Close'}</div>
          <div style={{ textAlign: 'center' }}>Revenue</div>
          <div style={{ textAlign: 'center' }}>Cancel %</div>
          <div style={{ textAlign: 'center' }}>Score</div>
          <div style={{ textAlign: 'center' }}>Trend</div>
        </div>

        {filtered.map((rep, idx) => {
          const conversionVal = repType === 'inside' ? rep.leadToSet : rep.sitToClose;
          return (
            <div key={rep.name} style={{
              display: 'grid',
              gridTemplateColumns: repType === 'inside' ? '2fr 1fr 1fr 1fr 1fr 1fr 0.8fr 0.8fr' : '2fr 1fr 1fr 1fr 1fr 1fr 0.8fr 0.8fr',
              padding: '14px 20px',
              borderBottom: idx < filtered.length - 1 ? `1px solid ${T.border}` : 'none',
              transition: 'background-color 0.15s'
            }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = T.surfaceHover}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <div style={{ fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                {rep.name}
                {rep.role === 'Manager' && <Badge color={T.purple}>MGR</Badge>}
                {rep.role === 'PT' && <Badge color={T.dim}>PT</Badge>}
                {(rep.role === 'Closer' || rep.role === 'Closer+GTR') && <Badge color={T.blue}>Closer</Badge>}
                {rep.score >= 90 && <Badge color={T.green}>Star</Badge>}
              </div>
              <div style={{ textAlign: 'center', fontSize: '13px', color: T.muted }}>{rep.market}</div>
              <div style={{ textAlign: 'center' }}><Mono>{rep.totalLeads}</Mono></div>
              <div style={{ textAlign: 'center' }}>
                {conversionVal != null
                  ? <Pct value={conversionVal} good={repType === 'inside' ? 0.35 : 0.4} warning={repType === 'inside' ? 0.25 : 0.3} />
                  : <span style={{ color: T.dim }}>—</span>
                }
              </div>
              <div style={{ textAlign: 'center' }}><Mono color={T.green}>${(rep.revenue / 1000).toFixed(0)}k</Mono></div>
              <div style={{ textAlign: 'center' }}><Pct value={rep.cancellationRate} good={0.08} warning={0.12} /></div>
              <div style={{ textAlign: 'center' }}>
                <span style={{
                  fontFamily: "'JetBrains Mono', monospace", fontSize: '14px', fontWeight: '600',
                  color: rep.score >= 85 ? T.green : rep.score >= 70 ? T.accent : T.red
                }}>
                  {rep.score}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'center' }}><TrendIcon trend={rep.trend} /></div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function MarketOverviewView({ data }) {
  const totalRev = data.reduce((s, d) => s + d.revenue, 0);
  const totalLeads = data.reduce((s, d) => s + d.totalLeads, 0);

  return (
    <div>
      {/* KPIs */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <KpiCard label="Markets" value={data.length} icon={MapPin} />
        <KpiCard label="Total Leads" value={totalLeads.toLocaleString()} icon={Zap} />
        <KpiCard label="Combined Revenue" value={`$${(totalRev / 1000000).toFixed(1)}M`} icon={TrendingUp} />
        <KpiCard label="Best Market" value={data.sort((a, b) => (b.leadToSet * b.setToSit * b.sitToClose) - (a.leadToSet * a.setToSit * a.sitToClose))[0]?.market || '—'} color={T.green} icon={BarChart3} />
      </div>

      {/* Market Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '16px' }}>
        {data.map(m => {
          const overall = m.leadToSet * m.setToSit * m.sitToClose;
          return (
            <div key={m.market} style={{
              background: T.surface, borderRadius: '8px', padding: '20px',
              border: `1px solid ${T.border}`, transition: 'border-color 0.15s'
            }}
              onMouseEnter={e => e.currentTarget.style.borderColor = T.borderLight}
              onMouseLeave={e => e.currentTarget.style.borderColor = T.border}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <MapPin size={18} color={T.accent} />
                  <span style={{ fontSize: '18px', fontWeight: '500' }}>{m.market}</span>
                </div>
                <TrendIcon trend={m.trend} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                <div>
                  <div style={{ fontSize: '11px', color: T.dim, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>Leads</div>
                  <Mono>{m.totalLeads}</Mono>
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: T.dim, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>Revenue</div>
                  <Mono color={T.green}>${(m.revenue / 1000).toFixed(0)}k</Mono>
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: T.dim, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>Inside Reps</div>
                  <Mono>{m.insideReps}</Mono>
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: T.dim, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>Outside Reps</div>
                  <Mono>{m.outsideReps}</Mono>
                </div>
              </div>

              {/* Funnel Breakdown */}
              <div style={{ borderTop: `1px solid ${T.border}`, paddingTop: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '12px', color: T.muted }}>L→Set</span>
                  <Pct value={m.leadToSet} good={0.35} warning={0.25} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '12px', color: T.muted }}>Set→Sit</span>
                  <Pct value={m.setToSit} good={0.8} warning={0.7} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '12px', color: T.muted }}>Sit→Close</span>
                  <Pct value={m.sitToClose} good={0.4} warning={0.3} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: `1px solid ${T.border}`, paddingTop: '8px' }}>
                  <span style={{ fontSize: '12px', fontWeight: '500', color: T.text }}>Overall</span>
                  <span style={{
                    fontFamily: "'JetBrains Mono', monospace", fontSize: '14px', fontWeight: '600',
                    color: getColor(overall, 0.08, 0.05)
                  }}>
                    {(overall * 100).toFixed(1)}%
                  </span>
                </div>
              </div>

              <div style={{ marginTop: '12px', fontSize: '12px', color: T.dim }}>
                Top source: <span style={{ color: T.muted }}>{m.topSource}</span> · CPD: <Mono color={m.costPerDeal > 400 ? T.red : T.green}>${m.costPerDeal}</Mono>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Main App ────────────────────────────────────────────────────────────────
function App() {
  const [activeView, setActiveView] = useState('lead-sources');

  const leadSourceData = useMemo(() => generateLeadSourceData(), []);
  const insideRepData = useMemo(() => generateRepData(INSIDE_REPS, 'inside'), []);
  const outsideRepData = useMemo(() => generateRepData(OUTSIDE_REPS, 'outside'), []);
  const marketData = useMemo(() => generateMarketData(), []);

  const views = [
    { id: 'lead-sources', label: 'Lead Sources', icon: BarChart3 },
    { id: 'rep-performance', label: 'Rep Performance', icon: Users },
    { id: 'market-overview', label: 'Market Overview', icon: MapPin }
  ];

  return (
    <div style={{
      fontFamily: "'Outfit', sans-serif", background: T.bg, color: T.text,
      minHeight: '100vh', padding: '0'
    }}>
      {/* Top Nav */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '16px 28px', borderBottom: `1px solid ${T.border}`, background: T.surface
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '32px', height: '32px', borderRadius: '6px', backgroundColor: T.accent,
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <Zap size={18} color={T.bg} />
          </div>
          <div>
            <h1 style={{ fontSize: '18px', fontWeight: '600', margin: 0, letterSpacing: '-0.3px' }}>Venture Home Solar</h1>
            <span style={{ fontSize: '12px', color: T.muted }}>Sales Intelligence</span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '4px' }}>
          {views.map(v => {
            const Icon = v.icon;
            return (
              <button key={v.id} onClick={() => setActiveView(v.id)} style={{
                display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px',
                borderRadius: '6px', border: 'none', cursor: 'pointer', fontSize: '14px',
                fontFamily: "'Outfit', sans-serif",
                backgroundColor: activeView === v.id ? T.accentDim : 'transparent',
                color: activeView === v.id ? T.accent : T.muted,
                fontWeight: activeView === v.id ? '500' : '400',
                transition: 'all 0.15s'
              }}>
                <Icon size={16} />
                {v.label}
              </button>
            );
          })}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Badge color={T.green}>Mock Data</Badge>
          <span style={{ fontSize: '12px', color: T.dim }}>Phase 2 Prototype</span>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ padding: '24px 28px' }}>
        {activeView === 'lead-sources' && <LeadSourcesView data={leadSourceData} />}
        {activeView === 'rep-performance' && <RepPerformanceView insideData={insideRepData} outsideData={outsideRepData} />}
        {activeView === 'market-overview' && <MarketOverviewView data={marketData} />}
      </div>
    </div>
  );
}

export default App;
