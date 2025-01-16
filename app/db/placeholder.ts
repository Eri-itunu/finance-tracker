const usersData = [
    {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    password: 'bigsecret',
    },
    {
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@example.com',
    password: 'hashed_password_2',
    },
];



  const categoriesData = [
    // Default categories
    {  categoryName: 'Food & Drinks', userId: null },
    {  categoryName: 'Transport', userId: null },
    {  categoryName: 'Utilities', userId: null },
    {  categoryName: 'Entertainment', userId: null },
    // User-specific categories
    { categoryName: 'Gaming', userId: 1 },
    {   categoryName: 'Books', userId: 2 },
  ];

  const incomeData = [
    {  userId: 1, amount: '5000', source: 'Monthly Salary', type: 'recurring', date: '2025-01-01' },
    {  userId: 1, amount: '200', source: 'Freelance Project', type: 'One-off', date: '2025-01-01', },
    {  userId: 2, amount: '4500', source: 'Monthly Salary', type: 'recurring', date: '2025-01-01', },
    {  userId: 2, amount: '300', source: 'Consultation', type: 'One-off', date: '2025-01-01', },
  ];

  const spendingData = [
    {  userId: 1, amount: '50', categoryId: 1, itemName: 'Groceries' ,notes: 'Hello' ,date: '2025-01-01'},
    {  userId: 1, amount: '20', categoryId: 2, itemName: 'Gas' ,notes: 'Hello', date: '2025-01-01' },
    {  userId: 1, amount: '100', categoryId: 4, itemName: 'Concert Ticket' ,notes: 'Hello',date: '2025-01-01' },
    {  userId: 2, amount: '30', categoryId: 3, itemName: 'Electricity Bill' ,notes: 'Hello',date: '2025-01-01' },
    {  userId: 2, amount: '25', categoryId: 6, itemName: 'Books Purchase' ,notes: 'Hello',date: '2025-01-01' },
  ];

  const savingsData = [
    {  userId: 1, goalName: 'Vacation', targetAmount: '2000' },
    {  userId: 1, goalName: 'Emergency Fund', targetAmount: '5000' },
    {  userId: 2, goalName: 'New Laptop', targetAmount: '1500' },
  ];

  const savingsProgressData = [
    {  userId: 1, goalId: 1, amount: '200' ,date: '2025-01-01' },
    {  userId: 1, goalId: 1, amount: '300' ,date: '2025-01-01' },
     {  userId: 2, goalId: 2, amount: '1000',date: '2025-01-01'},
    {  userId: 2, goalId: 3, amount: '500' ,date: '2025-01-01' },
  ];

  
  export { incomeData, spendingData, savingsData, savingsProgressData, categoriesData, usersData };