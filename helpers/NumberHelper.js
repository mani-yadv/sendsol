export default class NumberHelper {
    static formatKMB(num, precision = null) {
        const map = [
            { suffix: "T", threshold: 1e12 },
            { suffix: "B", threshold: 1e9 },
            { suffix: "M", threshold: 1e6 },
            { suffix: "K", threshold: 1e3 },
            { suffix: "", threshold: 1 }
        ];

        const found = map.find((x) => Math.abs(num) >= x.threshold);

        if (precision && found) {
            return (num / found.threshold).toFixed(precision) + found.suffix;
        }
        if (found) {
            return Math.round(num / found.threshold) + found.suffix;
        }

        return num;
    }

    static formatSol(lamports) {
        if (!lamports) return "0 SOL";

        // Convert to SOL (lamports to SOL)
        const sol = Math.floor((lamports / 1e9) * 1000) / 1000;

        if (sol === 0) return "0 SOL";

        if (sol >= 1_000_000) {
            const millions = Math.floor((sol / 1_000_000) * 1000) / 1000;
            return `${millions.toFixed(3)}M SOL`;
        }
        if (sol >= 1_000) {
            const thousands = Math.floor((sol / 1_000) * 1000) / 1000;
            return `${thousands.toFixed(3)}K SOL`;
        }
        return `${sol.toFixed(3)} SOL`;
    }
}
