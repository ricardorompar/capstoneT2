import { Line } from 'react-chartjs-2';

const PastGraph = ({ dataObject }) => {
    const labels = Object.keys(dataObject);
    const data = Object.values(dataObject).map(value => parseFloat(value));

    const chartData = {
    labels,
    datasets: [
        {
        label: 'Closing Value',
        data,
        fill: false,
        backgroundColor: 'rgb(75, 192, 192)',
        borderColor: 'rgba(75, 192, 192, 0.2)',
        },
    ],
    };

    // Setup options for the chart
    const options = {
        scales: {
        y: {
            beginAtZero: false,
        },
        },
    };

    return <Line data={chartData} options={options} />;
};

export default PastGraph;