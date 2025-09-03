// src/pages/Dashboard/Worker/Withdrawals.jsx
import React, { useState, useEffect } from 'react';

function Withdrawals() {
  const userEmail = 'worker@example.com'; // Replace with actual worker email from AuthContext
  const userName = 'John Worker'; // Replace with actual worker name from AuthContext
  const [coins] = useState(300); // Example: User's current coins, replace with actual value
  const [withdrawCoin, setWithdrawCoin] = useState(0);
  const [withdrawAmount, setWithdrawAmount] = useState(0);
  const [paymentSystem, setPaymentSystem] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [isWithdrawButtonDisabled, setIsWithdrawButtonDisabled] = useState(false);

  const handleCoinChange = (e) => {
    const coinsToWithdraw = e.target.value;
    setWithdrawCoin(coinsToWithdraw);
    setWithdrawAmount(coinsToWithdraw / 20); // 20 coins = 1 dollar

    if (coinsToWithdraw > coins) {
      setIsWithdrawButtonDisabled(true);
      setStatusMessage('Insufficient coin');
    } else {
      setIsWithdrawButtonDisabled(false);
      setStatusMessage('');
    }
  };

  const handlePaymentSystemChange = (e) => {
    setPaymentSystem(e.target.value);
  };

  const handleAccountNumberChange = (e) => {
    setAccountNumber(e.target.value);
  };

  const handleWithdrawalSubmit = async (e) => {
    e.preventDefault();

    if (withdrawCoin <= 0 || withdrawCoin > coins) {
      setStatusMessage('Invalid coin amount.');
      return;
    }

    if (!paymentSystem || !accountNumber) {
      setStatusMessage('Please select a payment system and enter an account number.');
      return;
    }

    const withdrawalData = {
      worker_email: userEmail,
      worker_name: userName,
      withdrawal_coin: withdrawCoin,
      withdrawal_amount: withdrawAmount,
      payment_system: paymentSystem,
      account_number: accountNumber,
      withdraw_date: new Date().toISOString(),
      status: 'pending',
    };

    try {
      const response = await fetch('/api/withdrawals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(withdrawalData),
      });

      if (response.ok) {
        setStatusMessage('Withdrawal request submitted successfully!');
        setWithdrawCoin(0);
        setWithdrawAmount(0);
        setPaymentSystem('');
        setAccountNumber('');
      } else {
        setStatusMessage('Failed to submit the withdrawal request.');
      }
    } catch (err) {
      setStatusMessage('Error processing withdrawal.');
      console.error('Withdrawal error:', err);
    }
  };

  useEffect(() => {
    if (withdrawCoin > coins) {
      setIsWithdrawButtonDisabled(true);
      setStatusMessage('Insufficient coin');
    }
  }, [withdrawCoin, coins]);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-700 mb-6">Withdrawals</h2>

      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h3 className="text-xl font-semibold text-gray-800">Your Total Coins: {coins}</h3>
        <p className="text-gray-600">You can withdraw in multiples of 20 coins.</p>
        <p className="text-gray-600">1 Dollar = 20 Coins</p>
        <p className="text-gray-600">Withdrawal Amount: ${withdrawAmount}</p>
      </div>

      <form onSubmit={handleWithdrawalSubmit} className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Withdraw Your Earnings</h3>

        <div className="mb-4">
          <label htmlFor="withdrawCoin" className="block text-gray-700">Coin to Withdraw:</label>
          <input
            type="number"
            id="withdrawCoin"
            name="withdrawCoin"
            value={withdrawCoin}
            onChange={handleCoinChange}
            className="w-full p-3 border border-gray-300 rounded-md"
            min="0"
            max={coins}
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="withdrawAmount" className="block text-gray-700">Withdraw Amount ($):</label>
          <input
            type="number"
            id="withdrawAmount"
            name="withdrawAmount"
            value={withdrawAmount}
            className="w-full p-3 border border-gray-300 rounded-md"
            readOnly
          />
        </div>

        <div className="mb-4">
          <label htmlFor="paymentSystem" className="block text-gray-700">Payment System:</label>
          <select
            id="paymentSystem"
            name="paymentSystem"
            value={paymentSystem}
            onChange={handlePaymentSystemChange}
            className="w-full p-3 border border-gray-300 rounded-md"
            required
          >
            <option value="">Select Payment System</option>
            <option value="Bkash">Bkash</option>
            <option value="Rocket">Rocket</option>
            <option value="Nagad">Nagad</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="mb-4">
          <label htmlFor="accountNumber" className="block text-gray-700">Account Number:</label>
          <input
            type="text"
            id="accountNumber"
            name="accountNumber"
            value={accountNumber}
            onChange={handleAccountNumberChange}
            className="w-full p-3 border border-gray-300 rounded-md"
            required
          />
        </div>

        {statusMessage && <div className="mb-4 text-red-600">{statusMessage}</div>}

        <button
          type="submit"
          className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
          disabled={isWithdrawButtonDisabled}
        >
          Withdraw
        </button>
      </form>
    </div>
  );
}

export default Withdrawals;
