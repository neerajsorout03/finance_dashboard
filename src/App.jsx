import "./App.css";
import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer
} from "recharts";
const data = [
  { name: "Jan", income: 4000, expense: 2400 },
  { name: "Feb", income: 3000, expense: 1398 },
  { name: "Mar", income: 5000, expense: 2800 },
  { name: "Apr", income: 4780, expense: 3908 },
];

function App() {

  const [transactions, setTransactions] = useState(() => {
  const saved = localStorage.getItem("transactions");
  return saved ? JSON.parse(saved) : [];
});

const [filter, setFilter] = useState("all");

const [search, setSearch] = useState("");
const [text, setText] = useState("");
const [amount, setAmount] = useState("");
const [role, setRole] = useState("admin");
const [darkMode, setDarkMode] = useState(true);
const addTransaction = () => {
  if (!text || !amount) return;

  const newTransaction = {
  text,
  amount: Number(amount),
  category: text, // simple use kar rahe
  date: new Date().toLocaleDateString(),
  type: Number(amount) > 0 ? "income" : "expense"
};
  setTransactions([...transactions, newTransaction]);
  setText("");
  setAmount("");
};
const amounts = transactions.map((t) => Number(t.amount));

const total = amounts.reduce((acc, item) => acc + item, 0);
const income = amounts
  .filter((item) => item > 0)
  .reduce((acc, item) => acc + item, 0);

const expense = amounts
  .filter((item) => item < 0)
  .reduce((acc, item) => acc + item, 0);
  const deleteTransaction = (index) => {
  const updated = transactions.filter((_, i) => i !== index);
  setTransactions(updated);
};
const filteredTransactions = transactions.filter((t) => {
  if (filter === "income" && t.amount <= 0) return false;
  if (filter === "expense" && t.amount >= 0) return false;

  if (
    search &&
    !t.text.toLowerCase().includes(search.toLowerCase())
  )
    return false;

  return true;
});
const highest = transactions.reduce(
  (max, t) => (t.amount > max ? t.amount : max),
  0
);
const categoryTotals = {};

transactions.forEach((t) => {
  if (t.amount < 0) {
    categoryTotals[t.category] =
      (categoryTotals[t.category] || 0) + Math.abs(t.amount);
  }
});

const highestCategory = Object.keys(categoryTotals).reduce(
  (a, b) => (categoryTotals[a] > categoryTotals[b] ? a : b),
  ""
);

const totalIncome = income;
const totalExpense = Math.abs(expense);
const monthlyData = {};

transactions.forEach((t) => {
  const month = new Date(t.date).toLocaleString("default", {
    month: "short",
  });

  if (!monthlyData[month]) {
    monthlyData[month] = { income: 0, expense: 0 };
  }

  if (t.amount > 0) {
    monthlyData[month].income += t.amount;
  } else {
    monthlyData[month].expense += Math.abs(t.amount);
  }
});

const monthKeys = Object.keys(monthlyData);
const currentMonth = monthKeys[monthKeys.length - 1];

const monthlyComparison = monthlyData[currentMonth] || {
  income: 0,
  expense: 0,
};
useEffect(() => {
  localStorage.setItem("transactions", JSON.stringify(transactions));
}, [transactions]);
const chartData = transactions.map((t, index) => ({
  name: t.text,
  income: t.amount > 0 ? t.amount : 0,
  expense: t.amount < 0 ? Math.abs(t.amount) : 0,
}));
  return (
    <div
  style={{
    padding: "30px",
    color: darkMode ? "white" : "black",
    background: darkMode ? "#0f172a" : "#f1f5f9",
  
    minHeight: "100vh",
    animation: "fadeIn 0.8s ease"
    
  }}
>
      <h1
  style={{
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    color: "#c5b222",
    fontWeight: "bold"
  }}
>
  💰 Finance Dashboard
</h1>
      <button
  onClick={() => setDarkMode(!darkMode)}
  style={{
    marginBottom: "10px",
    padding: "6px 10px",
    borderRadius: "5px",
    border: "none",
    cursor: "pointer"
  }}
>
  Toggle Theme
</button>
      <select
  value={filter}
  onChange={(e) => setFilter(e.target.value)}
  style={{
    marginBottom: "10px",
    padding: "8px",
    borderRadius: "5px"
  }}
>
  <option value="all">All</option>
  <option value="income">Income</option>
  <option value="expense">Expense</option>
</select>
      <input
  type="text"
  placeholder="Search..."
  value={search}
  onChange={(e) => setSearch(e.target.value)}
  style={{
    marginBottom: "20px",
    padding: "8px",
    borderRadius: "5px",
    border: "none"
  }}
/>
      <select
  value={role}
  onChange={(e) => setRole(e.target.value)}
  style={{ marginBottom: "20px", padding: "5px" }}
>
  <option value="admin">Admin</option>
  <option value="viewer">Viewer</option>
</select>
  {role === "admin" && (
      <div style={{ marginBottom: "30px" }}>
        
  <input
    type="text"
    placeholder="Enter title"
    value={text}
    onChange={(e) => setText(e.target.value)}
    style={{
  marginRight: "10px",
  padding: "8px",
  borderRadius: "5px",
  border: "none"
}}
  />

  <input
    type="number"
    placeholder="Amount (+ income, - expense)"
    value={amount}
    onChange={(e) => setAmount(e.target.value)}
    style={{
  marginRight: "10px",
  padding: "8px",
  borderRadius: "5px",
  border: "none"
}}
  />

  <button
  onClick={addTransaction}
  style={{
    padding: "8px 15px",
    background: "#22c55e",
    border: "none",
    borderRadius: "5px",
    color: "white",
    cursor: "pointer"
  }}
>
  Add
</button>
</div>
 )}


      <div style={{ display: "flex", gap: "20px", justifyContent: "center", marginTop: "20px" }}>
        <div style={cardStyle}>
          <h3>Total Balance</h3>
          <p>₹{total}</p>
        </div>

        <div style={cardStyle}>
          <h3>Income</h3>
          <p>₹{income}</p>
        </div>

        <div style={cardStyle}>
          <h3>Expenses</h3>
          <p>₹{Math.abs(expense)}</p>
        </div>
      </div>
      <div style={{ marginTop: "20px" }}>
        <div style={{ marginTop: "40px", textAlign: "center" }}>
  <h2 style={{ marginBottom: "25px", letterSpacing: "1px" }}>
    📊 Insights
  </h2>

  <div
    style={{
      display: "flex",
      justifyContent: "center",
      gap: "25px",
      flexWrap: "wrap"
    }}
  >
    {/* Highest Transaction */}
    <div
  style={insightCard}
  onMouseEnter={(e) =>
    (e.currentTarget.style.transform = "scale(1.05)")
  }
  onMouseLeave={(e) =>
    (e.currentTarget.style.transform = "scale(1)")
  }
>
      <h4 style={{ marginBottom: "8px" }}>💰 Highest Transaction</h4>
      <p style={{ fontSize: "18px", fontWeight: "bold" }}>
        ₹{highest}
      </p>
    </div>

    {/* Highest Category */}
    <div
  style={insightCard}
  onMouseEnter={(e) =>
    (e.currentTarget.style.transform = "scale(1.05)")
  }
  onMouseLeave={(e) =>
    (e.currentTarget.style.transform = "scale(1)")
  }
>
      <h4 style={{ marginBottom: "8px" }}>
        🔥 Highest Spending Category
      </h4>
      <p style={{ fontSize: "18px", fontWeight: "bold" }}>
        {highestCategory || "N/A"}
      </p>
    </div>

    {/* Saving Status */}
    <div
  style={insightCard}
  onMouseEnter={(e) =>
    (e.currentTarget.style.transform = "scale(1.05)")
  }
  onMouseLeave={(e) =>
    (e.currentTarget.style.transform = "scale(1)")
  }
>
      <h4 style={{ marginBottom: "8px" }}>📈 Status</h4>
      <p style={{ fontSize: "16px", fontWeight: "500" }}>
        {totalIncome > totalExpense
          ? "You are saving money 💰"
          : "Your expenses are high ⚠️"}
      </p>
    </div>

    {/* Monthly */}
    <div
  style={insightCard}
  onMouseEnter={(e) =>
    (e.currentTarget.style.transform = "scale(1.05)")
  }
  onMouseLeave={(e) =>
    (e.currentTarget.style.transform = "scale(1)")
  }
>
      <h4 style={{ marginBottom: "8px" }}>📅 Monthly</h4>
      <p style={{ fontSize: "15px" }}>
        This month: ₹{monthlyComparison.income} earned  
        <br />
        ₹{monthlyComparison.expense} spent
      </p>
    </div>
  </div>
</div>
<div
  style={{
    display: "flex",
    gap: "30px",
    marginTop: "40px",
    alignItems: "center"
  }}
>
  {/* LEFT SIDE - TRANSACTIONS */}
  <div style={{ flex: 1, maxWidth: "500px" }}>
    <h3>Transactions</h3>

    {filteredTransactions.map((t, index) => (
      <div
        key={index}
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: "#1e293b",
          padding: "10px 15px",
          borderRadius: "8px",
          marginBottom: "10px",
          transition: "0.2s",
          borderLeft:
            t.amount > 0
              ? "5px solid #22c55e"
              : "5px solid #ef4444"
        }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.transform = "scale(1.02)")
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.transform = "scale(1)")
        }
      >
        <div>
          <p style={{ margin: 0, fontWeight: "bold" }}>
            {t.text} ({t.category})
          </p>
          <p style={{ margin: 0, fontSize: "14px", opacity: 0.7 }}>
            ₹{t.amount} | {t.type}
          </p>
          <p style={{ margin: 0, fontSize: "12px", opacity: 0.5 }}>
            {t.date}
          </p>
        </div>

        <button
          onClick={() => deleteTransaction(index)}
          style={{
            background: "#ef4444",
            border: "none",
            color: "white",
            padding: "6px 10px",
            borderRadius: "6px",
            cursor: "pointer"
          }}
        >
          ❌
        </button>
      </div>
    ))}
  </div>

  {/* RIGHT SIDE - CHART */}
  <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
    <LineChart width={500} height={300} data={chartData}>
      <CartesianGrid stroke="#444" />
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Line type="monotone" dataKey="income" stroke="#4ade80" />
      <Line type="monotone" dataKey="expense" stroke="#f87171" />
    </LineChart>
  </div>
</div>
    </div>
    </div>
    
  );
}

const cardStyle = {
  background: "#1e293b",
  padding: "20px",
  borderRadius: "12px",
  width: "200px",
  boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
  textAlign: "center"
};
const insightCard = {
  background: "#1e293b",
  padding: "15px",
  borderRadius: "10px",
  width: "180px",
  boxShadow: "0 4px 10px rgba(0, 0, 0, 0.01)",
  textAlign: "center",
  transition: "0.3s",
  cursor: "pointer"
};
export default App;