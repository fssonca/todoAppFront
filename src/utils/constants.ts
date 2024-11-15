export const API_BASE_URL =
  "https://3zti36h7re.execute-api.us-east-1.amazonaws.com/dev";

export const priorityConfig: {
  [key: number]: { label: string; textColor: string; borderColor: string };
} = {
  1: {
    label: "Lowest",
    textColor: "text-blue-700",
    borderColor: "border-blue-700",
  },
  2: {
    label: "Low",
    textColor: "text-blue-400",
    borderColor: "border-blue-400",
  },
  3: {
    label: "Medium",
    textColor: "text-yellow-500",
    borderColor: "border-yellow-500",
  },
  4: {
    label: "High",
    textColor: "text-orange-500",
    borderColor: "border-orange-500",
  },
  5: {
    label: "Highest",
    textColor: "text-red-600",
    borderColor: "border-red-600",
  },
};
