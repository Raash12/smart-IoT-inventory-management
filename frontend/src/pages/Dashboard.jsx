import React, { useEffect, useState } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';
import { db } from '../firebase'; // Import your Firestore configuration
import { collection, getDocs } from 'firebase/firestore'; // Import Firestore functions
import Sidebar from '../components/Sidebar';
import './Dashboard.css'; // Import CSS for styling

// Register the required components
ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

const Dashboard = () => {
    const [userData, setUserData] = useState(null);
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: [],
    });
    const token = localStorage.getItem('token'); // Retrieve token from localStorage

    useEffect(() => {
        fetchUserData();
        fetchChartData();
    }, []);

    const fetchUserData = async () => {
        if (!token) {
            console.error('No token found');
            return; // Exit if no token
        }

        try {
            const res = await fetch('http://localhost:5000/api/users/profile', {
                method: 'GET',
                headers: { 'Authorization': `Bearer ${token}` },
            });

            if (!res.ok) {
                const error = await res.text(); // Get error message from response
                throw new Error(`Failed to fetch user data: ${error}`);
            }

            const data = await res.json();
            setUserData(data);
        } catch (error) {
            console.error('Error fetching user data:', error);
            alert('Failed to fetch user data. Please check your token and try again.');
        }
    };

    const fetchChartData = async () => {
        try {
            const productCollection = collection(db, 'products'); // Reference to the 'products' collection
            const productSnapshot = await getDocs(productCollection);

            const categories = {};
            productSnapshot.forEach(doc => {
                const data = doc.data();
                // Assuming each product has a category and a quantity
                if (categories[data.category]) {
                    categories[data.category] += data.quantity; // Sum up quantities by category
                } else {
                    categories[data.category] = data.quantity;
                }
            });

            // Prepare chart data
            const labels = Object.keys(categories);
            const data = Object.values(categories);
            const chartData = {
                labels: labels,
                datasets: [
                    {
                        label: 'Product Count',
                        data: data,
                        backgroundColor: [
                            'rgba(75, 192, 192, 0.6)',
                            'rgba(255, 99, 132, 0.6)',
                            'rgba(255, 206, 86, 0.6)',
                            'rgba(54, 162, 235, 0.6)',
                        ],
                        borderWidth: 1,
                    },
                ],
            };
            setChartData(chartData);
        } catch (error) {
            console.error('Error fetching chart data:', error);
        }
    };

    return (
        <div className="dashboard-container">
            <Sidebar />
            <div className="dashboard-content">
                <h1>Dashboard</h1>
                {userData && (
                    <div className="user-info">
                        <h2>Welcome, {userData.username}</h2>
                        <p>Email: {userData.email}</p>
                    </div>
                )}

                <div className="charts-container">
                    <div className="chart">
                        <h3>Product Count by Category</h3>
                        {chartData.labels.length > 0 ? (
                            <Bar data={chartData} options={{ responsive: true }} />
                        ) : (
                            <p>No data available for the chart.</p>
                        )}
                    </div>
                    <div className="chart">
                        <h3>Distribution of Products</h3>
                        {chartData.labels.length > 0 ? (
                            <Pie data={chartData} options={{ responsive: true }} />
                        ) : (
                            <p>No data available for the chart.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;