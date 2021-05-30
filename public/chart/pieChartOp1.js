// Set new default font family and font color to mimic Bootstrap's default styling
Chart.defaults.global.defaultFontFamily = 'Nunito', '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
Chart.defaults.global.defaultFontColor = '#858796';

// 데이터 가져오기
var ctx = document.getElementById("pieChartOp1");

var optionNum = new Array();
for (var i=0;i<2;i++)
{
  optionNum[i] = Number(document.getElementById("optionS-" + 1 + i).value);
}

var pieChartOp1 = new Chart(ctx, {
  type: 'doughnut',
  data: {
    labels: ["남성", "여성"],
    datasets: [{
      data: [optionNum[0], optionNum[1]],
      backgroundColor: ['#4e73df', '#ff4646'],
      hoverBackgroundColor: ['#2e59d9', '#eb3232'],
      hoverBorderColor: "rgba(234, 236, 244, 1)",
    }],
  },
  options: {
    maintainAspectRatio: false,
    tooltips: {
      backgroundColor: "rgb(255,255,255)",
      bodyFontColor: "#858796",
      borderColor: '#dddfeb',
      borderWidth: 1,
      xPadding: 15,
      yPadding: 15,
      displayColors: false,
      caretPadding: 10,
    },
    legend: {
      display: false
    },
    cutoutPercentage: 80,
  },
});
