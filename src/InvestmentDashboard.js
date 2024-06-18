import React from "react";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import jsPDF from "jspdf";
import styles from "./InvestmentDashboard.module.css";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const InvestmentDashboard = ({ investments }) => {
  const groupInvestmentsByFund = () => {
    return investments.reduce((acc, investment) => {
      if (!acc[investment.name]) {
        acc[investment.name] = [];
      }
      acc[investment.name].push(investment);
      return acc;
    }, {});
  };

  const calculateROI = (fundInvestments) => {
    const totalSIPAmount = fundInvestments.reduce(
      (acc, curr) =>
        acc + parseFloat(curr.sipAmount) * parseFloat(curr.sipDuration),
      0
    );
    const currentAmount = fundInvestments.reduce(
      (acc, curr) => acc + parseFloat(curr.currentAmount),
      0
    );
    return totalSIPAmount
      ? ((currentAmount - totalSIPAmount) / totalSIPAmount) * 100
      : 0;
  };

  const calculateMetrics = (fundInvestments) => {
    const totalSIPAmount = fundInvestments.reduce(
      (acc, curr) =>
        acc + parseFloat(curr.sipAmount) * parseFloat(curr.sipDuration),
      0
    );
    const currentAmount = fundInvestments.reduce(
      (acc, curr) => acc + parseFloat(curr.currentAmount),
      0
    );
    const annualizedReturn = (
      (Math.pow(
        currentAmount / totalSIPAmount,
        1 / (fundInvestments.length / 12)
      ) -
        1) *
      100
    ).toFixed(2);
    return {
      initialInvestment: totalSIPAmount.toFixed(2),
      currentMarketValue: currentAmount.toFixed(2),
      annualizedReturn,
    };
  };

  const calculateOverallPortfolio = () => {
    const totalInitialInvestment = investments.reduce(
      (acc, curr) =>
        acc + parseFloat(curr.sipAmount) * parseFloat(curr.sipDuration),
      0
    );
    const totalCurrentMarketValue = investments.reduce(
      (acc, curr) => acc + parseFloat(curr.currentAmount),
      0
    );
    const totalROI = totalInitialInvestment
      ? ((totalCurrentMarketValue - totalInitialInvestment) /
          totalInitialInvestment) *
        100
      : 0;
    const annualizedReturn = (
      (Math.pow(
        totalCurrentMarketValue / totalInitialInvestment,
        1 / (investments.length / 12)
      ) -
        1) *
      100
    ).toFixed(2);

    return {
      totalInitialInvestment: totalInitialInvestment.toFixed(2),
      totalCurrentMarketValue: totalCurrentMarketValue.toFixed(2),
      totalROI: totalROI.toFixed(2),
      annualizedReturn,
    };
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text(
      "Six-Month Portfolio Performance Analysis of Mutual Funds",
      14,
      16
    );
    let currentYPosition = 30;
    let availableSpace = 270; // Maximum height of the page
    let isFirstPage = true;

    Object.keys(groupedInvestments).forEach((fund, index) => {
      const fundInvestments = groupedInvestments[fund];
      const { initialInvestment, currentMarketValue, annualizedReturn } =
        calculateMetrics(fundInvestments);
      const roi = calculateROI(fundInvestments);

      const requiredSpace =
        50 + // Space for Fund header and metrics
        fundInvestments.length * 30 + // Space for each SIP
        40; // Extra space for margins

      if (!isFirstPage && currentYPosition + requiredSpace > availableSpace) {
        doc.addPage();
        currentYPosition = 20;
        availableSpace = 270;
      }

      doc.text(`Fund ${index + 1}: ${fund}`, 14, currentYPosition);
      fundInvestments.forEach((sip, sipIndex) => {
        doc.text(`SIP ${sipIndex + 1}:`, 20, (currentYPosition += 10));
        doc.text(`SIP Amount: ${sip.sipAmount}`, 25, (currentYPosition += 8));
        doc.text(
          `SIP Duration: ${sip.sipDuration} months`,
          25,
          (currentYPosition += 8)
        );
        doc.text(
          `Current Amount: ${sip.currentAmount}`,
          25,
          (currentYPosition += 8)
        );
      });

      doc.text(
        `Total Initial Investment: ${initialInvestment}`,
        20,
        (currentYPosition += 10)
      );
      doc.text(
        `Current Market Value: ${currentMarketValue}`,
        20,
        (currentYPosition += 8)
      );
      doc.text(`ROI: ${roi.toFixed(2)}%`, 20, (currentYPosition += 8));
      doc.text(
        `Annualized Return: ${annualizedReturn}%`,
        20,
        (currentYPosition += 8)
      );
      currentYPosition += 10;
      availableSpace -= requiredSpace;
      isFirstPage = false;
    });

    const overallMetrics = calculateOverallPortfolio();

    if (currentYPosition + 40 > availableSpace) {
      doc.addPage();
      currentYPosition = 20;
      availableSpace = 270;
    }

    doc.text("Overall Portfolio Analysis", 14, currentYPosition);
    doc.text(
      `Total Initial Investment: ${overallMetrics.totalInitialInvestment}`,
      20,
      (currentYPosition += 10)
    );
    doc.text(
      `Total Current Market Value: ${overallMetrics.totalCurrentMarketValue}`,
      20,
      (currentYPosition += 8)
    );
    doc.text(
      `Overall ROI: ${overallMetrics.totalROI}%`,
      20,
      (currentYPosition += 8)
    );
    doc.text(
      `Annualized Return: ${overallMetrics.annualizedReturn}%`,
      20,
      (currentYPosition += 8)
    );

    doc.save("investment-report.pdf");
  };

  const groupedInvestments = groupInvestmentsByFund();

  const roiData = Object.keys(groupedInvestments).map((fund) => ({
    fund,
    roi: calculateROI(groupedInvestments[fund]),
  }));

  const pieData = Object.keys(groupedInvestments).map((fund) => ({
    name: fund,
    value: groupedInvestments[fund].reduce(
      (acc, inv) => acc + parseFloat(inv.currentAmount),
      0
    ),
  }));

  const resetData = () => {
    localStorage.clear();
    window.location.reload();
  };

  return (
    <div className={styles.dashboard}>
      <div className={styles.halfPage}>
        <h2>Investment Dashboard</h2>
        <div className={styles.investmentFlex}>
          {roiData.map((roi, index) => (
            <LineChart
              key={index}
              width={300}
              height={300}
              data={[roi]}
              className={styles.lineChart}
            >
              <Line
                type="monotone"
                dataKey="roi"
                stroke="#8884d8"
                dot={{ r: 5, fill: "#8884d8" }}
                isAnimationActive={false}
              />
              <CartesianGrid stroke="#ccc" />
              <XAxis
                dataKey="fund"
                domain={["dataMin", "dataMax"]}
                tickFormatter={(tick) =>
                  tick.length > 10 ? `${tick.substring(0, 10)}...` : tick
                }
              />
              <YAxis />
              <Tooltip formatter={(value) => value.toFixed(2)} />
            </LineChart>
          ))}
        </div>
      </div>
      <div className={styles.halfPage}>
        <PieChart width={300} height={300} className={styles.pieChart}>
          <Pie
            data={pieData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={100}
            fill="#8884d8"
            label
          >
            {pieData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
        <div className={styles.buttonsContainer}>
          <button onClick={generatePDF} className={styles.downloadButton}>
            Download Report
          </button>
          <button onClick={resetData} className={styles.resetButton}>
            Reset Data
          </button>
        </div>
      </div>
    </div>
  );
};

export default InvestmentDashboard;
