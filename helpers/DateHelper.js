import { formatDistanceToNow, format } from "date-fns";

// ---- Date Formatting ----
const formatToLocalDate = (date) => {
    if (!date) return "";
    return format(new Date(date), "MMM dd, yyyy");
};

const formatTimeAgo = (date) => {
    if (!date) return "";
    return formatDistanceToNow(new Date(date), { addSuffix: true });
};

const formatDuration = (days) => {
    if (!days) return "";
    return `${days} days`;
};

// ---- Date Calculations ----
const calculateEndDate = (startDate, durationDays) => {
    if (!startDate || !durationDays) return null;
    const date = new Date(startDate);
    return date.setDate(date.getDate() + durationDays);
};

export default {
    formatToLocalDate,
    formatTimeAgo,
    formatDuration,
    calculateEndDate
};
