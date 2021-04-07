function initChart(selector, ...log) {
    new Chartist.Line(selector, {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        series: [...log]
    }, { low: Math.min(log), showArea: true });
};