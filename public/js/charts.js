$(async function () {
    const response = await fetch("/staff/chartdata", {
        method: "GET",
        cache: "default",
        credentials: "same-origin",
        headers: {
            "Content-Type": "application/json",
        },
    });
    const chartData = await response.json();

    const myChart = new Chart("myChart", chartData);
    myChart.update();

    const lineResponse = await fetch("/staff/linechartpermonth", {
        method: "GET",
        cache: "default",
        credentials: "same-origin",
        headers: {
            "Content-Type": "application/json",
        },
    });
    const lineChartPerMonth = await lineResponse.json();

    const myLineChart = new Chart("lineChartPerMonth", lineChartPerMonth);
    myLineChart.update();
});
