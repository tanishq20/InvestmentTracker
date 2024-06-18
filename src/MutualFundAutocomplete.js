import React, { useState } from "react";
import mutualFundList from "./MutualFundList.json";
import styles from "./MutualFundAutocomplete.module.css";

const MutualFundAutocomplete = ({ value, onChange }) => {
  const [inputValue, setInputValue] = useState(value || "");
  const [showList, setShowList] = useState(false);
  const [filteredMutualFunds, setFilteredMutualFunds] = useState([]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);

    // Filter the mutual fund list based on the input value
    const filteredList = mutualFundList.filter((fund) =>
      fund.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredMutualFunds(filteredList);
    setShowList(value !== ""); // Show the list only if the input value is not empty
  };

  const handleSelectMutualFund = (selectedFund) => {
    setInputValue(selectedFund);
    onChange({ target: { name: "name", value: selectedFund } });
    setFilteredMutualFunds([]);
    setShowList(false);
  };

  const handleClickOutside = (e) => {
    if (!e.target.closest("." + styles.autocompleteContainer)) {
      setShowList(false);
    }
  };

  const handleInputFocus = () => {
    setShowList(true);
  };

  document.addEventListener("mousedown", handleClickOutside);

  return (
    <div className={styles.autocompleteContainer}>
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onFocus={handleInputFocus}
        placeholder="Search or add mutual fund..."
      />
      {showList && (
        <div className={styles.autocompleteList}>
          {filteredMutualFunds.map((fund, index) => (
            <div
              key={index}
              onClick={() => handleSelectMutualFund(fund)}
              className={styles.autocompleteItem}
            >
              {fund}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MutualFundAutocomplete;
