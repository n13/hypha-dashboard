const { JsonRpc } = require('eosjs'); // Require JsonRpc from eosjs

const accountInfo = document.getElementById('account-info');

// Parse the URL to get the account name
const urlParams = new URLSearchParams(window.location.search);
const accountName = urlParams.get('account');

// Replace 'https://mainnet.telos.net' with your actual EOSIO endpoint URL
const rpc = new JsonRpc('https://mainnet.telos.net');

// Function to fetch data from the EOSIO contract
async function fetchData() {
    try {
        // Make a request to the contract's table
        const response = await rpc.get_table_rows({
            json: true,
            code: 'vestng.hypha',
            scope: 'vestng.hypha',
            table: 'locks',
            index_position: 2,
            key_type: 'name',
            lower_bound: accountName,
            upper_bound: accountName,            
        });

        return response.rows;
    } catch (error) {
        throw error;
    }
}

// Function to calculate the list of tiers and total amounts
function calculateTiersAndTotals(data) {
    const tiersAndTotals = {};

    // Group the results by tier and calculate total amounts
    data.forEach(row => {
        const tierId = row.tier_id;
        if (!tiersAndTotals[tierId]) {
            tiersAndTotals[tierId] = {
                totalAmount: 0,
                rows: [],
            };
        }

        const amountParts = row.amount.split(' ');
        if (amountParts.length === 2 && amountParts[1] === 'HYPHA') {
            tiersAndTotals[tierId].totalAmount += parseFloat(amountParts[0]);
        }

        tiersAndTotals[tierId].rows.push(row);
    });

    return tiersAndTotals;
}

// Function to render the list of tiers and total amounts
function renderTiersAndTotals(tiersAndTotals) {
    // Get a reference to the HTML element where you want to display the results
    const resultsContainer = document.getElementById('results-container');
    const accountInfoDiv = document.getElementById('account-info');
    
    // Display the account name in the account-info div
    accountInfoDiv.textContent = `Account: ${accountName || 'N/A'}`;

    // Iterate through the tiers and total amounts
    for (const tierId in tiersAndTotals) {
        const tierData = tiersAndTotals[tierId];

        // Create a section for each tier
        const tierSection = document.createElement('div');
        tierSection.className = 'tier-section';

        // Display the tier information
        tierSection.innerHTML = `
            <h2>Tier: ${tierId}</h2>
            <p>Total Amount: ${tierData.totalAmount} HYPHA</p>
            <ul>
                ${tierData.rows.map(row => `<li>Lock ID: ${row.lock_id}, Owner: ${row.owner}</li>`).join('')}
            </ul>
        `;

        // Append the section to the results container
        resultsContainer.appendChild(tierSection);
    }
}

// Main function to fetch data and render tiers and totals when the page loads
async function main() {
    try {
        const data = await fetchData();
        const tiersAndTotals = calculateTiersAndTotals(data);
        renderTiersAndTotals(tiersAndTotals);
    } catch (error) {
        console.error('Error:', error);
    }
}

// Call the main function when the page loads
window.addEventListener('load', main);