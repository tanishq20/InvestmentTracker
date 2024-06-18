import React, { useState } from "react";
import styles from "./InvestmentForm.module.css";
import MutualFundAutocomplete from "./MutualFundAutocomplete";

const InvestmentForm = ({ onAddInvestment }) => {
  const [investmentType, setInvestmentType] = useState("");
  const [investmentDetails, setInvestmentDetails] = useState({
    name: "",
    sipAmount: "",
    sipDuration: "",
    currentAmount: "",
    startDate: "", // Added startDate to state
  });

  const handleTypeChange = (e) => {
    setInvestmentType(e.target.value);
    setInvestmentDetails({
      ...investmentDetails,
      type: e.target.value,
      name: "",
      sipAmount: "",
      sipDuration: "",
      currentAmount: "",
      startDate: "", // Reset startDate on type change
    });
  };

  const handleDetailChange = (e) => {
    const { name, value } = e.target;
    setInvestmentDetails({ ...investmentDetails, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const investment = {
      ...investmentDetails,
    };
    onAddInvestment(investment);
    setInvestmentDetails({
      name: "",
      sipAmount: "",
      sipDuration: "",
      currentAmount: "",
      startDate: "", // Reset startDate on form submit
    });
    setInvestmentType("");
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <label>
        Investment Type:
        <select
          value={investmentType}
          onChange={handleTypeChange}
          className={styles.selectInput}
        >
          <option value="">Select</option>
          <option value="mutual-fund">Mutual Fund</option>
        </select>
      </label>
      {investmentType && (
        <>
          <label>
            Name:
            <MutualFundAutocomplete
              value={investmentDetails.name}
              onChange={handleDetailChange}
              className={styles.textInput}
            />
          </label>
          <label>
            SIP Amount:
            <input
              type="number"
              name="sipAmount"
              value={investmentDetails.sipAmount}
              onChange={handleDetailChange}
              required
              className={styles.textInput}
            />
          </label>
          <label>
            SIP Duration (months):
            <input
              type="number"
              name="sipDuration"
              value={investmentDetails.sipDuration}
              onChange={handleDetailChange}
              required
              className={styles.textInput}
            />
          </label>
          <label>
            Current Amount:
            <input
              type="number"
              name="currentAmount"
              value={investmentDetails.currentAmount}
              onChange={handleDetailChange}
              required
              className={styles.textInput}
            />
          </label>
          <label>
            Start Date:
            <input
              type="date"
              name="startDate"
              value={investmentDetails.startDate}
              onChange={handleDetailChange}
              required
              className={styles.textInput}
            />
          </label>
          <button type="submit" className={styles.submitButton}>
            Add Investment
          </button>
        </>
      )}
    </form>
  );
};

export default InvestmentForm;
