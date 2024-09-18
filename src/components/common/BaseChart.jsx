import React from 'react';
import { Line, Bar, Pie, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
);

const chartComponents = {
  line: Line,
  bar: Bar,
  pie: Pie,
  doughnut: Doughnut,
};

const BaseChart = ({ chartType = 'line', data, options }) => {
  const ChartComponent = chartComponents[chartType] || Line;

  return <ChartComponent data={data} options={options} />;
};

export default BaseChart;
