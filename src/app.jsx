import { useState, useMemo, useEffect } from 'react';
import { Search, ChevronDown, ChevronUp, TrendingUp, TrendingDown, AlertTriangle, BarChart3, Users, MapPin, Zap, Filter, X, Phone, Clock, Home, DollarSign, Calendar, Navigation, Star, CheckCircle } from 'lucide-react';

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
    const closedWon = Math.floor(runs * (rng() * 0.3 + 0.08));  // 8-38% closed won
    const csm = Math.floor(rng() * Math.max(runs * 0.25, 1)) + (runs > 15 ? 1 : 0); // upcoming contract signing meetings
    const csmCloseRate = rng() * 0.4 + 0.3;  // 30-70% of CSMs convert
    const projectedCloses = closedWon + Math.round(csm * csmCloseRate);
    const trueNetCloseRate = projectedCloses / runs;
    const cancelRate = rng() * 0.25 + 0.03;
    const cancels = Math.floor(closedWon * cancelRate);
    outsidePerf.push({
      name: rep.name, market: rep.market, role: rep.role,
      runs, closedWon, csm, csmCloseRate, projectedCloses, trueNetCloseRate, cancelRate, cancels,
    });
  }

  return { insidePerf, outsidePerf };
}

// ─── Insights Engine ─────────────────────────────────────────────────────────
// Analyzes per-source rep data and returns categorized bullet insights
function generateInsights(sourceData, repsBySource) {
  const insights = []; // { type: 'red'|'amber'|'green', text: string }
  const { insidePerf, outsidePerf } = repsBySource;

  // ── Outside rep flags (using True Net Close %) ──────────────────────
  // True Net Close = (Closed Won + projected CSM conversions) / Runs
  // Flag: outside reps with 10+ runs and < 25% true net close
  const lowCloseOutside = outsidePerf.filter(r => r.runs >= 10 && r.trueNetCloseRate < 0.25);
  if (lowCloseOutside.length > 0) {
    const names = lowCloseOutside.map(r => `${r.name} (${(r.trueNetCloseRate * 100).toFixed(0)}% true net on ${r.runs} runs — ${r.closedWon} won + ${Math.round(r.csm * r.csmCloseRate)} projected from ${r.csm} CSMs)`).join(', ');
    insights.push({
      type: 'red',
      text: `Outside reps with 10+ run sample below 25% true net close: ${names}. Review call recordings for objection handling gaps and consider ride-alongs with a top closer.`
    });
  }

  // Flag: outside reps with high cancel rate (>20%)
  const highCancelOutside = outsidePerf.filter(r => r.runs >= 8 && r.cancelRate > 0.20);
  if (highCancelOutside.length > 0) {
    const names = highCancelOutside.map(r => `${r.name} (${(r.cancelRate * 100).toFixed(0)}% cancel on ${r.closedWon} deals)`).join(', ');
    insights.push({
      type: 'red',
      text: `High cancellation reps on this source: ${names}. May indicate pressure-closing or poor expectation-setting during the sit.`
    });
  }

  // Flag: outside reps crushing it (10+ runs, >40% true net)
  const topCloseOutside = outsidePerf.filter(r => r.runs >= 10 && r.trueNetCloseRate > 0.40);
  if (topCloseOutside.length > 0) {
    const names = topCloseOutside.map(r => `${r.name} (${(r.trueNetCloseRate * 100).toFixed(0)}% true net on ${r.runs} runs — ${r.closedWon} won + ${Math.round(r.csm * r.csmCloseRate)} projected)`).join(', ');
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
    const revenue = Math.floor(rng() * 400000) + 80000;
    const avgCallsPerLead = Math.floor(rng() * 4) + 2;
    const cancellationRate = rng() * 0.15 + 0.05;

    // Outside reps: true net close calculation
    let runs = null, closedWon = null, csm = null, csmCloseRate = null, projectedCloses = null, trueNetCloseRate = null;
    if (type === 'outside') {
      runs = totalLeads;
      closedWon = Math.floor(runs * (rng() * 0.25 + 0.1));
      csm = Math.floor(rng() * Math.max(runs * 0.2, 1)) + (runs > 20 ? 1 : 0);
      csmCloseRate = rng() * 0.4 + 0.3;
      projectedCloses = closedWon + Math.round(csm * csmCloseRate);
      trueNetCloseRate = projectedCloses / runs;
    }

    return {
      ...rep, totalLeads, leadToSet, setToSit,
      runs, closedWon, csm, csmCloseRate, projectedCloses, trueNetCloseRate,
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
                      <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 0.6fr 0.6fr 0.5fr 0.6fr 0.8fr 0.6fr', padding: '8px 14px', color: T.dim, borderBottom: `1px solid ${T.border}` }}>
                        <div>Rep</div><div style={{ textAlign: 'center' }}>Runs</div><div style={{ textAlign: 'center' }}>Won</div><div style={{ textAlign: 'center' }}>CSMs</div><div style={{ textAlign: 'center' }}>Proj</div><div style={{ textAlign: 'center' }}>True Net %</div><div style={{ textAlign: 'center' }}>Cxl %</div>
                      </div>
                      {item.repsBySource.outsidePerf.map(r => (
                        <div key={r.name} style={{ display: 'grid', gridTemplateColumns: '1.8fr 0.6fr 0.6fr 0.5fr 0.6fr 0.8fr 0.6fr', padding: '6px 14px', borderBottom: `1px solid ${T.border}` }}>
                          <div style={{ color: T.text, fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            {r.name}
                            {(r.role === 'Closer' || r.role === 'Closer+GTR') && <Badge color={T.blue}>Closer</Badge>}
                          </div>
                          <div style={{ textAlign: 'center' }}><Mono>{r.runs}</Mono></div>
                          <div style={{ textAlign: 'center' }}><Mono>{r.closedWon}</Mono></div>
                          <div style={{ textAlign: 'center' }}><Mono color={T.blue}>{r.csm}</Mono></div>
                          <div style={{ textAlign: 'center' }}><Mono color={T.accent}>{r.projectedCloses}</Mono></div>
                          <div style={{ textAlign: 'center' }}><Pct value={r.trueNetCloseRate} good={0.35} warning={0.25} /></div>
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

                {/* Eligibility Roster — who can and cannot call/run from this source */}
                <div style={{ marginTop: '20px', padding: '16px', borderRadius: '6px', border: `1px solid ${T.borderLight}`, background: T.surface }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                    <Users size={14} color={T.red} />
                    <span style={{ fontSize: '12px', fontWeight: '600', color: T.red, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Eligibility Roster — {item.source}
                    </span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    {/* Outside Sales Eligibility */}
                    <div>
                      <div style={{ fontSize: '11px', color: T.muted, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '10px', fontWeight: '600' }}>
                        Outside Sales Reps
                      </div>
                      {(() => {
                        const eligibleNames = new Set(item.repsBySource.outsidePerf.map(r => r.name));
                        const byMarket = {};
                        OUTSIDE_REPS.forEach(r => {
                          if (!byMarket[r.market]) byMarket[r.market] = [];
                          byMarket[r.market].push({ ...r, eligible: eligibleNames.has(r.name) });
                        });
                        return Object.entries(byMarket).map(([market, reps]) => {
                          const eligibleCount = reps.filter(r => r.eligible).length;
                          return (
                            <div key={market} style={{ marginBottom: '12px' }}>
                              <div style={{ fontSize: '12px', color: T.accent, fontWeight: '500', marginBottom: '4px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span>{market}</span>
                                <span style={{ fontSize: '11px', fontFamily: "'JetBrains Mono', monospace", color: T.dim }}>{eligibleCount}/{reps.length}</span>
                              </div>
                              {reps.map(r => (
                                <div key={r.name} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '3px 0', fontSize: '13px' }}>
                                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: r.eligible ? T.green : T.red, flexShrink: 0 }} />
                                  <span style={{ color: r.eligible ? T.text : T.red, fontWeight: r.eligible ? '400' : '500' }}>
                                    {r.name}
                                  </span>
                                  {(r.role === 'Closer' || r.role === 'Closer+GTR') && <Badge color={T.blue}>Closer</Badge>}
                                  <span style={{ marginLeft: 'auto', fontSize: '11px', fontFamily: "'JetBrains Mono', monospace", color: r.eligible ? T.green : T.red }}>
                                    {r.eligible ? 'ELIGIBLE' : 'NOT ELIGIBLE'}
                                  </span>
                                </div>
                              ))}
                            </div>
                          );
                        });
                      })()}
                    </div>
                    {/* Inside Sales Eligibility */}
                    <div>
                      <div style={{ fontSize: '11px', color: T.muted, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '10px', fontWeight: '600' }}>
                        Inside Sales Reps (Apt Setters)
                      </div>
                      {(() => {
                        const eligibleNames = new Set(item.repsBySource.insidePerf.map(r => r.name));
                        const byMarket = {};
                        INSIDE_REPS.filter(r => r.role !== 'Manager').forEach(r => {
                          if (!byMarket[r.market]) byMarket[r.market] = [];
                          byMarket[r.market].push({ ...r, eligible: eligibleNames.has(r.name) });
                        });
                        return Object.entries(byMarket).map(([market, reps]) => {
                          const eligibleCount = reps.filter(r => r.eligible).length;
                          return (
                            <div key={market} style={{ marginBottom: '12px' }}>
                              <div style={{ fontSize: '12px', color: T.accent, fontWeight: '500', marginBottom: '4px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span>{market}</span>
                                <span style={{ fontSize: '11px', fontFamily: "'JetBrains Mono', monospace", color: T.dim }}>{eligibleCount}/{reps.length}</span>
                              </div>
                              {reps.map(r => (
                                <div key={r.name} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '3px 0', fontSize: '13px' }}>
                                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: r.eligible ? T.green : T.red, flexShrink: 0 }} />
                                  <span style={{ color: r.eligible ? T.text : T.red, fontWeight: r.eligible ? '400' : '500' }}>
                                    {r.name}
                                  </span>
                                  <span style={{ marginLeft: 'auto', fontSize: '11px', fontFamily: "'JetBrains Mono', monospace", color: r.eligible ? T.green : T.red }}>
                                    {r.eligible ? 'ELIGIBLE' : 'NOT ELIGIBLE'}
                                  </span>
                                </div>
                              ))}
                            </div>
                          );
                        });
                      })()}
                    </div>
                  </div>
                </div>

                {/* Depth Chart — who should get the most leads from this source by market */}
                <div style={{ marginTop: '20px', padding: '16px', borderRadius: '6px', border: `1px solid ${T.borderLight}`, background: T.surface }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                    <Users size={14} color={T.blue} />
                    <span style={{ fontSize: '12px', fontWeight: '600', color: T.blue, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Depth Chart — Priority Assignment by Market
                    </span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    {/* Outside depth chart — ranked by true net close % */}
                    <div>
                      <div style={{ fontSize: '11px', color: T.muted, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '10px' }}>
                        Outside Sales — by True Net Close %
                      </div>
                      {(() => {
                        const byMarket = {};
                        item.repsBySource.outsidePerf.forEach(r => {
                          if (!byMarket[r.market]) byMarket[r.market] = [];
                          byMarket[r.market].push(r);
                        });
                        Object.values(byMarket).forEach(arr => arr.sort((a, b) => b.trueNetCloseRate - a.trueNetCloseRate));
                        return Object.entries(byMarket).map(([market, reps]) => (
                          <div key={market} style={{ marginBottom: '10px' }}>
                            <div style={{ fontSize: '12px', color: T.accent, fontWeight: '500', marginBottom: '4px' }}>{market}</div>
                            {reps.map((r, ri) => (
                              <div key={r.name} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '3px 0', fontSize: '13px' }}>
                                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', color: ri === 0 ? T.green : T.dim, width: '18px' }}>#{ri + 1}</span>
                                <span style={{ color: ri === 0 ? T.text : T.muted, fontWeight: ri === 0 ? '500' : '400' }}>{r.name}</span>
                                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '12px', color: getColor(r.trueNetCloseRate, 0.35, 0.25), marginLeft: 'auto' }}>
                                  {(r.trueNetCloseRate * 100).toFixed(0)}%
                                </span>
                              </div>
                            ))}
                          </div>
                        ));
                      })()}
                    </div>
                    {/* Inside depth chart — ranked by contact-to-sit rate */}
                    <div>
                      <div style={{ fontSize: '11px', color: T.muted, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '10px' }}>
                        Inside Sales — by Contact to Sit Rate
                      </div>
                      {(() => {
                        const byMarket = {};
                        item.repsBySource.insidePerf.forEach(r => {
                          const contactToSit = r.setRate * r.sitRate;
                          if (!byMarket[r.market]) byMarket[r.market] = [];
                          byMarket[r.market].push({ ...r, contactToSit });
                        });
                        Object.values(byMarket).forEach(arr => arr.sort((a, b) => b.contactToSit - a.contactToSit));
                        return Object.entries(byMarket).map(([market, reps]) => (
                          <div key={market} style={{ marginBottom: '10px' }}>
                            <div style={{ fontSize: '12px', color: T.accent, fontWeight: '500', marginBottom: '4px' }}>{market}</div>
                            {reps.map((r, ri) => (
                              <div key={r.name} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '3px 0', fontSize: '13px' }}>
                                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', color: ri === 0 ? T.green : T.dim, width: '18px' }}>#{ri + 1}</span>
                                <span style={{ color: ri === 0 ? T.text : T.muted, fontWeight: ri === 0 ? '500' : '400' }}>{r.name}</span>
                                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '12px', color: getColor(r.contactToSit, 0.25, 0.15), marginLeft: 'auto' }}>
                                  {(r.contactToSit * 100).toFixed(0)}%
                                </span>
                              </div>
                            ))}
                          </div>
                        ));
                      })()}
                    </div>
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
          gridTemplateColumns: repType === 'inside' ? '2fr 1fr 1fr 1fr 1fr 0.8fr 0.8fr' : '1.8fr 0.8fr 0.7fr 0.6fr 0.5fr 0.6fr 0.8fr 0.6fr 0.8fr',
          padding: '14px 20px', borderBottom: `1px solid ${T.border}`, backgroundColor: T.bg,
          fontSize: '12px', fontWeight: '600', color: T.muted, textTransform: 'uppercase', letterSpacing: '0.5px'
        }}>
          <div>Rep</div>
          <div style={{ textAlign: 'center' }}>Market</div>
          {repType === 'inside' ? (
            <><div style={{ textAlign: 'center' }}>Leads</div>
            <div style={{ textAlign: 'center' }}>L→Set</div>
            <div style={{ textAlign: 'center' }}>Revenue</div>
            <div style={{ textAlign: 'center' }}>Score</div>
            <div style={{ textAlign: 'center' }}>Trend</div></>
          ) : (
            <><div style={{ textAlign: 'center' }}>Runs</div>
            <div style={{ textAlign: 'center' }}>Won</div>
            <div style={{ textAlign: 'center' }}>CSMs</div>
            <div style={{ textAlign: 'center' }}>Proj</div>
            <div style={{ textAlign: 'center' }}>True Net %</div>
            <div style={{ textAlign: 'center' }}>Cxl %</div>
            <div style={{ textAlign: 'center' }}>Revenue</div></>
          )}
        </div>

        {filtered.map((rep, idx) => {
          return (
            <div key={rep.name} style={{
              display: 'grid',
              gridTemplateColumns: repType === 'inside' ? '2fr 1fr 1fr 1fr 1fr 0.8fr 0.8fr' : '1.8fr 0.8fr 0.7fr 0.6fr 0.5fr 0.6fr 0.8fr 0.6fr 0.8fr',
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
                {(rep.role === 'Closer' || rep.role === 'Closer+GTR') && <Badge color={T.blue}>Closer</Badge>}
                {rep.score >= 90 && <Badge color={T.green}>Star</Badge>}
              </div>
              <div style={{ textAlign: 'center', fontSize: '13px', color: T.muted }}>{rep.market}</div>
              {repType === 'inside' ? (
                <><div style={{ textAlign: 'center' }}><Mono>{rep.totalLeads}</Mono></div>
                <div style={{ textAlign: 'center' }}><Pct value={rep.leadToSet} good={0.35} warning={0.25} /></div>
                <div style={{ textAlign: 'center' }}><Mono color={T.green}>${(rep.revenue / 1000).toFixed(0)}k</Mono></div>
                <div style={{ textAlign: 'center' }}>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '14px', fontWeight: '600', color: rep.score >= 85 ? T.green : rep.score >= 70 ? T.accent : T.red }}>{rep.score}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'center' }}><TrendIcon trend={rep.trend} /></div></>
              ) : (
                <><div style={{ textAlign: 'center' }}><Mono>{rep.runs}</Mono></div>
                <div style={{ textAlign: 'center' }}><Mono>{rep.closedWon}</Mono></div>
                <div style={{ textAlign: 'center' }}><Mono color={T.blue}>{rep.csm}</Mono></div>
                <div style={{ textAlign: 'center' }}><Mono color={T.accent}>{rep.projectedCloses}</Mono></div>
                <div style={{ textAlign: 'center' }}><Pct value={rep.trueNetCloseRate} good={0.35} warning={0.25} /></div>
                <div style={{ textAlign: 'center' }}><Pct value={rep.cancellationRate} good={0.10} warning={0.18} /></div>
                <div style={{ textAlign: 'center' }}><Mono color={T.green}>${(rep.revenue / 1000).toFixed(0)}k</Mono></div></>
              )}
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

// ─── IS Smart Assignments ────────────────────────────────────────────────────
// Landing page for inside sales reps booking appointments in real-time.
// Shows customer info, time slot selection, and ranked recommended outside reps.

const SAMPLE_CUSTOMERS = [
  { name: "Sarah Martinez", phone: "(555) 234-7890", bill: 240, address: "1425 Oak Street", city: "Stamford", state: "CT", zip: "06901", source: "Modernize", prevInquiries: 3, lastContact: "March 2024", status: "Warm - Previous Interest" },
  { name: "Robert Chen", phone: "(555) 891-3240", bill: 310, address: "87 Maple Avenue", city: "Albany", state: "NY", zip: "12203", source: "Referral", prevInquiries: 1, lastContact: "April 2024", status: "Hot - Referral" },
  { name: "Jessica Thompson", phone: "(555) 445-6712", bill: 185, address: "302 Pine Road", city: "Newark", state: "NJ", zip: "07102", source: "Energy Bill Cruncher", prevInquiries: 2, lastContact: "Feb 2024", status: "Warm - Callback" },
  { name: "David Kowalski", phone: "(555) 328-9901", bill: 275, address: "14 Harbor View Dr", city: "Portland", state: "ME", zip: "04101", source: "SolarReviews", prevInquiries: 0, lastContact: "New Lead", status: "New - Inbound" },
  { name: "Maria Gonzalez", phone: "(555) 672-1185", bill: 220, address: "509 Elm Street", city: "Worcester", state: "MA", zip: "01608", source: "Clean Energy Experts", prevInquiries: 4, lastContact: "Jan 2024", status: "Warm - Multiple Touches" },
  { name: "James Wilson", phone: "(555) 993-4478", bill: 290, address: "221 Sunset Blvd", city: "Baltimore", state: "MD", zip: "21201", source: "Adnet LLC", prevInquiries: 1, lastContact: "March 2024", status: "Warm - Previous Interest" },
];

const SAMPLE_INTERACTIONS = [
  [
    { type: "Call", date: "Mar 15, 2024", note: "Interested but wanted to wait until summer", rep: "Cortney Jetter" },
    { type: "Appointment", date: "Jan 8, 2024", note: "Met at home, concerned about financing options", rep: "Max McNamara" },
    { type: "Call", date: "Oct 22, 2023", note: "Initial inquiry, requested info packet", rep: "David Hole" },
  ],
  [
    { type: "Call", date: "Apr 2, 2024", note: "Referred by neighbor, very interested", rep: "Chris Scaltro" },
    { type: "Call", date: "Mar 28, 2024", note: "Left voicemail, neighbor has solar", rep: "Chris Scaltro" },
  ],
  [
    { type: "Call", date: "Feb 14, 2024", note: "Wants to reduce $185/mo bill, asked about timeline", rep: "Adrienne Sadzinski" },
    { type: "Appointment", date: "Dec 5, 2023", note: "No-show, rescheduled for Jan", rep: "Joe MacKinnon" },
    { type: "Call", date: "Nov 20, 2023", note: "First contact, interested in savings", rep: "Richard Anderson" },
  ],
  [
    { type: "Call", date: "Apr 10, 2024", note: "New inbound from SolarReviews, high intent", rep: "Alex Ives" },
  ],
  [
    { type: "Call", date: "Jan 30, 2024", note: "4th touch, ready to schedule appointment", rep: "Michael Freedman" },
    { type: "Call", date: "Dec 12, 2023", note: "Follow-up, still comparing quotes", rep: "Lee Rogers" },
    { type: "Appointment", date: "Oct 18, 2023", note: "Ran appointment, wanted to think it over", rep: "Kaya Ulcay" },
    { type: "Call", date: "Sep 5, 2023", note: "Initial inquiry, high electric bill", rep: "Gerald Williams" },
  ],
  [
    { type: "Call", date: "Mar 20, 2024", note: "Interested in Tesla Power Wall add-on", rep: "Zachary Deraedt" },
    { type: "Call", date: "Feb 8, 2024", note: "First contact from Adnet, qualified lead", rep: "Tyler Blankenship" },
  ],
];

// Map states to markets
const STATE_TO_MARKET = { CT: "CT", NY: "NY West", NJ: "NJ", ME: "ME/NH", NH: "ME/NH", MA: "MA/RI", RI: "MA/RI", MD: "MD" };

// Rep specialties / strengths (simulated tags)
const REP_TAGS = {};
OUTSIDE_REPS.forEach((r, i) => {
  const rng = seededRandom(i * 577 + 99);
  const allTags = ["High-income", "Financing", "First-time buyers", "Small systems", "Large systems", "Referrals", "Callbacks", "Power Wall", "High bill"];
  const t1 = allTags[Math.floor(rng() * allTags.length)];
  let t2 = allTags[Math.floor(rng() * allTags.length)];
  while (t2 === t1) t2 = allTags[Math.floor(rng() * allTags.length)];
  REP_TAGS[r.name] = [t1, t2];
});

// Rep home base cities (simulated)
const MARKET_CITIES = {
  "NY West": ["Rochester", "Buffalo", "Syracuse", "Ithaca", "Utica", "Canandaigua", "Batavia"],
  "NY East": ["Yonkers", "White Plains", "New Rochelle", "Mount Vernon", "Poughkeepsie", "Newburgh", "Kingston", "Middletown", "Beacon"],
  "NJ": ["Newark", "Jersey City", "Paterson", "Trenton", "Edison"],
  "CT": ["Stamford", "Hartford", "New Haven", "Bridgeport", "Waterbury", "Danbury", "Norwalk", "Greenwich", "Milford"],
  "MA/RI": ["Boston", "Worcester", "Springfield", "Cambridge", "Providence", "Lowell", "Quincy", "Brockton"],
  "ME/NH": ["Portland", "Bangor", "Lewiston", "Manchester", "Nashua", "Concord", "Dover", "Augusta", "Biddeford", "Scarborough"],
  "MD": ["Baltimore", "Annapolis", "Frederick", "Rockville", "Columbia", "Silver Spring", "Towson"],
};

function AppointmentAssignmentView({ leadSourceData, outsideRepData }) {
  const [customerIdx, setCustomerIdx] = useState(0);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [callSeconds, setCallSeconds] = useState(154);
  const [bookedRep, setBookedRep] = useState(null);

  const customer = SAMPLE_CUSTOMERS[customerIdx];
  const interactions = SAMPLE_INTERACTIONS[customerIdx] || [];
  const market = STATE_TO_MARKET[customer.state] || "CT";

  // Timer
  useEffect(() => {
    const interval = setInterval(() => setCallSeconds(s => s + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

  // Time slots
  const timeSlots = ["10:00 AM", "11:30 AM", "2:00 PM", "4:30 PM", "6:00 PM", "7:00 PM"];

  // Rank outside reps for this customer's market
  const rankings = useMemo(() => {
    const sourceData = leadSourceData.find(d => d.source === customer.source);
    const eligibleNames = sourceData ? new Set(sourceData.repsBySource.outsidePerf.map(r => r.name)) : new Set();
    const marketReps = OUTSIDE_REPS.filter(r => r.market === market);
    const repDataMap = {};
    outsideRepData.forEach(r => { repDataMap[r.name] = r; });
    const sourceRepMap = {};
    if (sourceData) sourceData.repsBySource.outsidePerf.forEach(r => { sourceRepMap[r.name] = r; });

    const rng = seededRandom(customer.name.length * 311 + market.length * 47);
    const cities = MARKET_CITIES[market] || ["Unknown"];

    return marketReps.map(rep => {
      const repData = repDataMap[rep.name] || {};
      const sourceRep = sourceRepMap[rep.name];
      const isEligible = eligibleNames.has(rep.name);
      const trueNet = sourceRep ? sourceRep.trueNetCloseRate : (repData.trueNetCloseRate || 0.2);
      const cancelRate = sourceRep ? sourceRep.cancelRate : (repData.cancellationRate || 0.15);
      const driveTime = Math.floor(rng() * 35) + 5; // 5-40 min
      const homeCity = cities[Math.floor(rng() * cities.length)];
      const todayAppts = Math.floor(rng() * 4);
      const overallRate = Math.round(trueNet * 100);

      // Composite
      const perfScore = Math.min(100, (trueNet / 0.5) * 70 + ((1 - cancelRate)) * 30);
      const eligScore = isEligible ? 100 : 20;
      const distScore = Math.max(0, (1 - driveTime / 45) * 100);
      const availScore = Math.max(0, ((4 - todayAppts) / 4) * 100);
      const composite = Math.round(perfScore * 0.45 + eligScore * 0.25 + distScore * 0.15 + availScore * 0.15);

      return {
        name: rep.name, role: rep.role, market: rep.market,
        trueNet, cancelRate, overallRate, driveTime, homeCity,
        todayAppts, isEligible, composite,
        tags: REP_TAGS[rep.name] || [],
        runs: sourceRep ? sourceRep.runs : (repData.runs || 0),
        closedWon: sourceRep ? sourceRep.closedWon : (repData.closedWon || 0),
      };
    }).sort((a, b) => b.composite - a.composite);
  }, [customer, market, leadSourceData, outsideRepData]);

  // Style constants
  const card = { background: T.surface, borderRadius: '10px', border: `1px solid ${T.border}`, padding: '24px' };
  const selectStyle = {
    background: T.surface, border: `1px solid ${T.border}`, borderRadius: '6px',
    color: T.text, padding: '8px 12px', fontSize: '14px', fontFamily: "'Outfit', sans-serif"
  };

  return (
    <div>
      {/* Header bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <h2 style={{ fontSize: '22px', fontWeight: '700', margin: 0, color: T.text }}>IS Smart Assignments</h2>
          <select value={customerIdx} onChange={e => { setCustomerIdx(Number(e.target.value)); setBookedRep(null); setSelectedSlot(null); }} style={selectStyle}>
            {SAMPLE_CUSTOMERS.map((c, i) => <option key={i} value={i}>{c.name} — {c.city}, {c.state}</option>)}
          </select>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: T.green, animation: 'pulse 2s infinite' }} />
          <span style={{ fontSize: '14px', color: T.muted }}>Call started <span style={{ fontFamily: "'JetBrains Mono', monospace", color: T.text }}>{formatTime(callSeconds)}</span> ago</span>
        </div>
      </div>

      {/* Two-column layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', alignItems: 'start' }}>

        {/* ── LEFT COLUMN ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

          {/* Customer Info Card */}
          <div style={card}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', border: `2px solid ${T.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Users size={18} color={T.muted} />
              </div>
              <span style={{ fontSize: '20px', fontWeight: '600', color: T.text }}>{customer.name}</span>
              <Badge color={T.blue}>{customer.source}</Badge>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
              <div>
                <div style={{ fontSize: '11px', color: T.dim, textTransform: 'uppercase', marginBottom: '4px' }}>Phone</div>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '16px', color: T.text }}>{customer.phone}</div>
              </div>
              <div>
                <div style={{ fontSize: '11px', color: T.dim, textTransform: 'uppercase', marginBottom: '4px' }}>Electric Bill</div>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '16px', color: T.green }}>${customer.bill}/month</div>
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <div style={{ fontSize: '11px', color: T.dim, textTransform: 'uppercase', marginBottom: '4px' }}>Address</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <MapPin size={14} color={T.muted} />
                <span style={{ fontSize: '15px', color: T.text }}>{customer.address}, {customer.city}, {customer.state} {customer.zip}</span>
              </div>
            </div>

            {/* Stats row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', padding: '14px 0 0', borderTop: `1px solid ${T.border}` }}>
              <div>
                <div style={{ fontSize: '11px', color: T.dim, textTransform: 'uppercase', marginBottom: '4px' }}>Previous Inquiries</div>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '20px', fontWeight: '600', color: T.text }}>{customer.prevInquiries}</div>
              </div>
              <div>
                <div style={{ fontSize: '11px', color: T.dim, textTransform: 'uppercase', marginBottom: '4px' }}>Last Contact</div>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '14px', color: T.text }}>{customer.lastContact}</div>
              </div>
              <div>
                <div style={{ fontSize: '11px', color: T.dim, textTransform: 'uppercase', marginBottom: '4px' }}>Status</div>
                <div style={{ fontSize: '13px', fontWeight: '500', color: customer.status.includes('Hot') ? T.green : T.accent }}>{customer.status}</div>
              </div>
            </div>
          </div>

          {/* Interaction History */}
          <div style={card}>
            <h3 style={{ fontSize: '16px', fontWeight: '600', margin: '0 0 16px 0', color: T.text }}>Interaction History</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
              {interactions.map((int, idx) => {
                const typeColor = int.type === 'Appointment' ? T.green : int.type === 'Call' ? T.accent : T.blue;
                return (
                  <div key={idx} style={{ display: 'flex', gap: '14px', paddingBottom: idx < interactions.length - 1 ? '16px' : '0', position: 'relative' }}>
                    {/* Timeline line */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '4px', flexShrink: 0 }}>
                      <div style={{ width: '4px', height: '100%', backgroundColor: typeColor, borderRadius: '2px' }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                        <span style={{ fontSize: '15px', fontWeight: '600', color: T.text }}>{int.type}</span>
                        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '12px', color: T.dim }}>{int.date}</span>
                      </div>
                      <div style={{ fontSize: '14px', color: T.muted, marginBottom: '4px' }}>{int.note}</div>
                      <div style={{ fontSize: '12px', color: T.dim }}>Rep: {int.rep}</div>
                    </div>
                  </div>
                );
              })}
              {interactions.length === 0 && <div style={{ fontSize: '13px', color: T.dim }}>No prior interactions — new lead.</div>}
            </div>
          </div>
        </div>

        {/* ── RIGHT COLUMN ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

          {/* Time Slot Selection */}
          <div style={card}>
            <h3 style={{ fontSize: '16px', fontWeight: '600', margin: '0 0 14px 0', color: T.text }}>Select Time Slot</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              {timeSlots.map(slot => (
                <button key={slot} onClick={() => setSelectedSlot(slot)} style={{
                  padding: '14px', borderRadius: '8px', fontSize: '15px', fontWeight: '500',
                  fontFamily: "'JetBrains Mono', monospace", cursor: 'pointer', transition: 'all 0.15s',
                  border: selectedSlot === slot ? `2px solid ${T.accent}` : `1px solid ${T.border}`,
                  backgroundColor: selectedSlot === slot ? T.accent : T.bg,
                  color: selectedSlot === slot ? T.bg : T.text,
                }}>
                  {slot}
                </button>
              ))}
            </div>
          </div>

          {/* Recommended Reps */}
          <div style={card}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: T.green }} />
              <h3 style={{ fontSize: '16px', fontWeight: '600', margin: 0, color: T.text }}>Recommended Reps</h3>
            </div>

            {/* Booked confirmation */}
            {bookedRep && (
              <div style={{
                padding: '16px', borderRadius: '8px', marginBottom: '16px',
                background: T.green + '15', border: `1px solid ${T.green}40`,
                display: 'flex', alignItems: 'center', gap: '12px'
              }}>
                <CheckCircle size={22} color={T.green} />
                <div>
                  <div style={{ fontSize: '15px', fontWeight: '600', color: T.green }}>Appointment Booked</div>
                  <div style={{ fontSize: '13px', color: T.muted }}>{bookedRep} — {selectedSlot || 'TBD'} — {customer.city}, {customer.state}</div>
                </div>
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {rankings.slice(0, 5).map((rep, idx) => (
                <div key={rep.name} style={{
                  background: T.bg, borderRadius: '10px', border: `1px solid ${T.border}`,
                  padding: '18px', transition: 'border-color 0.15s',
                  opacity: bookedRep && bookedRep !== rep.name ? 0.4 : 1,
                }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = T.accent}
                  onMouseLeave={e => e.currentTarget.style.borderColor = T.border}
                >
                  {/* Rep header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{
                        width: '28px', height: '28px', borderRadius: '50%',
                        backgroundColor: idx === 0 ? T.green : idx === 1 ? T.accent : T.dim,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '13px', fontWeight: '700', color: T.bg
                      }}>
                        {idx + 1}
                      </div>
                      <span style={{ fontSize: '17px', fontWeight: '600', color: T.text }}>{rep.name}</span>
                      {(rep.role === 'Closer' || rep.role === 'Closer+GTR') && <Badge color={T.blue}>Closer</Badge>}
                    </div>
                    <span style={{
                      fontFamily: "'JetBrains Mono', monospace", fontSize: '20px', fontWeight: '700',
                      color: rep.composite >= 65 ? T.green : rep.composite >= 45 ? T.accent : T.red
                    }}>
                      {rep.composite}%
                    </span>
                  </div>

                  {/* Stats row */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                    <div>
                      <div style={{ fontSize: '11px', color: T.dim, textTransform: 'uppercase', marginBottom: '2px' }}>Drive Time</div>
                      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '16px', fontWeight: '600', color: T.text }}>{rep.driveTime} min</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '11px', color: T.dim, textTransform: 'uppercase', marginBottom: '2px' }}>From</div>
                      <div style={{ fontSize: '14px', fontWeight: '500', color: T.text }}>{rep.homeCity}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '11px', color: T.dim, textTransform: 'uppercase', marginBottom: '2px' }}>Overall Rate</div>
                      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '16px', fontWeight: '600', color: T.text }}>{rep.overallRate}%</div>
                    </div>
                  </div>

                  {/* Tags */}
                  <div style={{ display: 'flex', gap: '6px', marginBottom: '14px', flexWrap: 'wrap' }}>
                    {rep.tags.map(tag => (
                      <span key={tag} style={{
                        padding: '3px 10px', borderRadius: '4px', fontSize: '12px',
                        backgroundColor: T.border, color: T.muted
                      }}>{tag}</span>
                    ))}
                    {!rep.isEligible && (
                      <span style={{ padding: '3px 10px', borderRadius: '4px', fontSize: '12px', backgroundColor: T.red + '20', color: T.red }}>Not Eligible</span>
                    )}
                    {rep.todayAppts >= 3 && (
                      <span style={{ padding: '3px 10px', borderRadius: '4px', fontSize: '12px', backgroundColor: T.red + '20', color: T.red }}>Full Today</span>
                    )}
                  </div>

                  {/* Book button */}
                  <button
                    onClick={() => setBookedRep(rep.name)}
                    disabled={!!bookedRep}
                    style={{
                      width: '100%', padding: '12px', borderRadius: '8px', border: 'none',
                      fontSize: '15px', fontWeight: '600', cursor: bookedRep ? 'default' : 'pointer',
                      fontFamily: "'Outfit', sans-serif",
                      backgroundColor: bookedRep === rep.name ? T.green : T.accent,
                      color: T.bg, opacity: bookedRep && bookedRep !== rep.name ? 0.3 : 1,
                      transition: 'all 0.15s'
                    }}
                  >
                    {bookedRep === rep.name ? 'Booked!' : `Book with ${rep.name.split(' ')[0]}`}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main App ────────────────────────────────────────────────────────────────
function App() {
  const [activeView, setActiveView] = useState('apt-assignment');

  const leadSourceData = useMemo(() => generateLeadSourceData(), []);
  const insideRepData = useMemo(() => generateRepData(INSIDE_REPS, 'inside'), []);
  const outsideRepData = useMemo(() => generateRepData(OUTSIDE_REPS, 'outside'), []);
  const marketData = useMemo(() => generateMarketData(), []);

  const views = [
    { id: 'apt-assignment', label: 'Smart Assignments', icon: Zap },
    { id: 'lead-sources', label: 'Lead Sources', icon: BarChart3 },
    { id: 'rep-performance', label: 'Rep Performance', icon: Users },
    { id: 'market-overview', label: 'Market Overview', icon: MapPin },
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
        {activeView === 'apt-assignment' && <AppointmentAssignmentView leadSourceData={leadSourceData} outsideRepData={outsideRepData} />}
      </div>
    </div>
  );
}

export default App;
