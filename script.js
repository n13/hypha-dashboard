const { JsonRpc } = require('eosjs'); // Require JsonRpc from eosjs

const accountInfo = document.getElementById('account-info');

// Parse the URL to get the account name
const urlParams = new URLSearchParams(window.location.search);
const accountName = urlParams.get('account');

// Replace 'https://mainnet.telos.net' with your actual EOSIO endpoint URL
const rpc = new JsonRpc('https://mainnet.telos.net');

// Function to fetch data from the EOSIO contract with pagination support
async function fetchData() {
    try {
        const rows = [];
        let more = true;
        let nextKey = '';

        while (more) {
            const response = await rpc.get_table_rows({
                json: true,
                code: 'vestng.hypha',
                scope: 'vestng.hypha',
                table: 'locks',
                index_position: 2,
                key_type: 'name',
                lower_bound: accountName,
                upper_bound: accountName,            
                limit: 100, 
                next_key: nextKey,
            });

            if (response.rows.length > 0) {
                rows.push(...response.rows);
            }

            more = response.more;
            nextKey = response.next_key;
        }

        return rows;
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

// tiersAndTotals data structure: the key is the tier id, has total amount and all 
// rows that contributed to the total amount
// tiersAndTotals = {
//     'launch': {
//         totalAmount: 4.0, // this is a number type
//         rows: [
//             {
//                 "lock_id": 0,
//                 "owner": "illumination",
//                 "tier_id": "launch",
//                 "amount": "2.00 HYPHA",
//                 "claimed_amount": "0.00 HYPHA",
//                 "note": "bdc51c7d17c6a2afcba1e4ff8551c83d10ae340499fe4a362d5133d29f41b9fa"
//               },{
//                 "lock_id": 1,
//                 "owner": "illumination",
//                 "tier_id": "launch",
//                 "amount": "2.00 HYPHA",
//                 "claimed_amount": "0.00 HYPHA",
//                 "note": "7ff98ed21ca44db421e7633a8d35d8b99d4fb9f9ea928906c5eb4961a2141e8f"
//               },
//         ],
//     }
// }
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
            <p>Total Amount: ${tierData.totalAmount.toFixed(2)} HYPHA</p>
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