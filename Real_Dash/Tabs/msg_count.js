const SHEET_ID = '173SDpk1XVIOiPfkUHDGCaZ_JIk0oO6vCw6MSF6BD6_4';
const API_KEY = 'AIzaSyD44Cq-92iMcRwR0yMJ8Cxa93YQ36nwV6g';
const RANGE = 'B1:E41'; // Fetch data from rows 1 to 41 and columns B to E

let allData = []; // Store all fetched data
let currentRowIndex = 0; // Start from the first row
let fetchingData = true; // Flag to indicate if data should be fetched

async function fetchSensorData() {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${RANGE}?key=${API_KEY}&t=${new Date().getTime()}`;
    console.log(`Fetching data from URL: ${url}`);

    try {
        const response = await fetch(url);
        if (!response.ok) {
            const errorText = await response.text(); // Capture the error response body
            console.error(`HTTP error! status: ${response.status}, details: ${errorText}`);
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Data fetched:', data);

        if (!data.values || !data.values.length) {
            throw new Error('No data found');
        }

        // Store the fetched data
        allData = data.values;
        currentRowIndex = 0; // Reset the index when new data is fetched
    } catch (error) {
        console.error('Error fetching data from Google Sheets:', error);
    }
}

const thresholdValues = {
    temperature: 28,
    humidity: 80,
    methane: 500,
    smoke: 90
};

function checkSensorValues(sensorData) {
    const messages = [];
    if (sensorData.temperature > thresholdValues.temperature) {
        messages.push(`Temperature is high: ${sensorData.temperature}°C`);
    }
    if (sensorData.humidity > thresholdValues.humidity) {
        messages.push(`Humidity is high: ${sensorData.humidity}%`);
    }
    if (sensorData.methane > thresholdValues.methane) {
        messages.push(`Methane level is high: ${sensorData.methane} ppm`);
    }
    if (sensorData.smoke > thresholdValues.smoke) {
        messages.push(`Smoke level is high: ${sensorData.smoke} ppm`);
    }
    return messages;
}

async function processRowData(index) {
    if (index >= allData.length) {
        console.log('No more rows to process.');
        fetchingData = false; // Stop further fetching and processing
        return;
    }

    const values = allData[index];
    const sensorData = {
        temperature: parseFloat(values[0]),
        humidity: parseFloat(values[1]),
        methane: parseFloat(values[2]),
        smoke: parseFloat(values[3])
    };

    console.log(`Processing row ${index + 1}:`, sensorData);

    // Check sensor values for the row
    const rowMessages = checkSensorValues(sensorData);

    // Save messages and message count in localStorage
    localStorage.setItem('alertMessages', JSON.stringify(rowMessages));
    localStorage.setItem('alertMessageCount', rowMessages.length);
    console.log('Saved alert messages and count to localStorage.');

    // Update alert messages on mesg.html
    if (document.body.classList.contains('messages-page')) {
        updateAlertMessages(rowMessages);
    }

    // Move to the next row
    currentRowIndex++;
}

function updateAlertMessages(messages) {
    const messagesContainer = document.querySelector('.messages-container');
    if (messagesContainer) {
        messagesContainer.innerHTML = ''; // Clear previous messages

        if (messages.length > 0) {
            messages.forEach((msg, index) => {
                const messageElement = document.createElement('div');
                messageElement.classList.add('message');
                messageElement.textContent = `${index + 1}. ${msg}`;
                messagesContainer.appendChild(messageElement);
            });
        } else {
            const noMessagesElement = document.createElement('div');
            noMessagesElement.classList.add('no-messages');
            noMessagesElement.textContent = 'No current alerts';
            messagesContainer.appendChild(noMessagesElement);
        }

        console.log('Updated alert messages on mesg.html:', messages);
    }
}

// Function to handle processing rows with delays
async function updateMessages() {
    if (!fetchingData) {
        console.log('Data fetching has been stopped.');
        return; // Stop further processing
    }

    if (allData.length === 0) {
        await fetchSensorData(); // Fetch new data if not already fetched
    }

    if (currentRowIndex < allData.length) {
        await processRowData(currentRowIndex);
        setTimeout(() => {
            updateMessages(); // Continue with the next row after 5 seconds
        }, 5000); // Delay of 5 seconds per row
    } else {
        console.log('Processing complete for current data set.');
        fetchingData = false; // Stop further fetching and processing
    }
}

// Initialize and update messages periodically
document.addEventListener('DOMContentLoaded', () => {
    updateMessages(); // Initial call to fetch and process data
});

// Periodically update alert messages
document.addEventListener('DOMContentLoaded', () => {
    const messagesContainer = document.createElement('div');
    messagesContainer.classList.add('messages-container');

    document.body.appendChild(messagesContainer);

    function updateAlertMessages() {
        const messages = JSON.parse(localStorage.getItem('alertMessages')) || [];
        messagesContainer.innerHTML = ''; // Clear previous messages

        messages.forEach((msg, index) => {
            const messageElement = document.createElement('div');
            messageElement.classList.add('message');
            messageElement.textContent = `${index + 1}. ${msg}`;
            messagesContainer.appendChild(messageElement);
        });
    }

    // Call updateAlertMessages periodically to fetch the latest messages
    setInterval(updateAlertMessages, 5000); // Update every 5 seconds
    updateAlertMessages(); // Initial call to populate messages on page load
});

document.addEventListener('DOMContentLoaded', () => {
    function updateMessageCount() {
        const messageCount = localStorage.getItem('alertMessageCount') || '0';
        const messageCountSpan = document.querySelector('#message-tab .msg_count');
        if (messageCountSpan) {
            messageCountSpan.textContent = messageCount;
        }
    }

    // Call updateMessageCount periodically to fetch the latest count
    setInterval(updateMessageCount, 5000); // Update every 5 seconds
    updateMessageCount(); // Initial call to update message count on page load
});