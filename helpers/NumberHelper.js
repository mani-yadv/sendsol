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
}
