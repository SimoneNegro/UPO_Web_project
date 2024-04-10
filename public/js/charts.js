$(async function () {
    const response = await fetch("/admin/chartdata", {
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
});
