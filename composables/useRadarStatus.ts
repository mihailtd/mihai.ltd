// How far the hands-on evaluation has gone. Independent of any decision.
export type StageKey = "assess" | "trial";

// The verdict, once one has been made. Absent = still actively evaluating.
export type DecisionKey = "adopt" | "hold" | "reject";

// The effective, displayable status — same 5 values as before, now derived
// from `decision ?? stage` instead of being stored directly. This is what
// every filter pill, progress-bar segment, and treemap border color keys off.
export type StatusKey = "adopt" | "trial" | "assess" | "hold" | "reject";

export const getEffectiveStatus = (
  stage: StageKey,
  decision?: DecisionKey,
): StatusKey => decision ?? stage;

export interface StatusMeta {
  label: string;
  color: string;
  text: string;
  bg: string;
  ring: string;
}

// Ordered from most to least confidence — reused for filters, legends, and
// the stacked adoption-progress bar so they all agree on ordering.
export const radarStatusOrder: StatusKey[] = [
  "adopt",
  "trial",
  "assess",
  "hold",
  "reject",
];

export const radarStatusMeta: Record<StatusKey, StatusMeta> = {
  adopt: {
    label: "Adopt",
    color: "#10b981", // emerald-500
    text: "text-emerald-400",
    bg: "bg-emerald-500/15",
    ring: "ring-emerald-500/30",
  },
  trial: {
    label: "Trial",
    color: "#38bdf8", // sky-400
    text: "text-sky-400",
    bg: "bg-sky-500/15",
    ring: "ring-sky-500/30",
  },
  assess: {
    label: "Assess",
    color: "#eab308", // yellow-500
    text: "text-yellow-400",
    bg: "bg-yellow-500/15",
    ring: "ring-yellow-500/30",
  },
  hold: {
    label: "Hold",
    color: "#f97316", // orange-500
    text: "text-orange-400",
    bg: "bg-orange-500/15",
    ring: "ring-orange-500/30",
  },
  reject: {
    label: "Rejected",
    color: "#ef4444", // red-500
    text: "text-red-400",
    bg: "bg-red-500/15",
    ring: "ring-red-500/30",
  },
};

const defaultRadarStatusMeta: StatusMeta = {
  label: "Unknown",
  color: "#64748b", // slate-500
  text: "text-slate-400",
  bg: "bg-slate-500/15",
  ring: "ring-slate-500/30",
};

const isStatusKey = (value: string): value is StatusKey =>
  value in radarStatusMeta;

export const getRadarStatusMeta = (status?: string): StatusMeta =>
  status && isStatusKey(status)
    ? radarStatusMeta[status]
    : defaultRadarStatusMeta;

export const useRadarStatus = () => ({
  radarStatusOrder,
  radarStatusMeta,
  getRadarStatusMeta,
  getEffectiveStatus,
});
