import React, { useState } from "react";
import InvestmentForm from "./InvestmentForm";
import InvestmentDashboard from "./InvestmentDashboard";
import styles from "./LandingPage.module.css";
import useLocalStorage from "./useLocalStorage";

const LandingPage = () => {
  const [investments, setInvestments] = useLocalStorage("investments", []);

  const handleNewInvestment = (investment) => {
    setInvestments([...investments, investment]);
  };

  return (
    <div className={styles.landingPage}>
      <h1>Welcome to the Investment Tracker</h1>
      <InvestmentForm onAddInvestment={handleNewInvestment} />
      {investments.length > 0 && (
        <InvestmentDashboard investments={investments} />
      )}
    </div>
  );
};

export default LandingPage;
