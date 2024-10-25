// Gather browser and OS information
const userInfo = {
    userAgent: navigator.userAgent,
    platform: navigator.platform,
    language: navigator.language,
};

// Display the gathered information
document.getElementById('user-info').innerHTML = `
    <strong>User Agent:</strong> ${userInfo.userAgent}<br>
    <strong>Platform:</strong> ${userInfo.platform}<br>
    <strong>Language:</strong> ${userInfo.language}<br>
`;

// Function to fetch the user's IP address
async function fetchUserIP() {
    try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        return data.ip;
    } catch (error) {
        console.error('Error fetching IP address:', error);
    }
}

// Function to fetch geographic location based on IP
async function fetchLocation(ip) {
    try {
        const response = await fetch(`https://ipapi.co/${ip}/json/`);
        const locationData = await response.json();
        return locationData;
    } catch (error) {
        console.error('Error fetching location:', error);
    }
}

// Function to get the current time based on time zone
function getCurrentTime(timezone) {
    const options = {
        timeZone: timezone,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    };
    return new Intl.DateTimeFormat('en-US', options).format(new Date());
}

// Function to download the data as JSON
function downloadJSON(data, filename) {
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Main function to get IP, location, and current time
async function displayUserInfo() {
    const ip = await fetchUserIP();
    if (ip) {
        const location = await fetchLocation(ip);
        if (location) {
            const locationInfo = {
                ip: ip,
                city: location.city,
                region: location.region,
                country: location.country,
                timezone: location.timezone,
                latitude: location.latitude,
                longitude: location.longitude,
                current_time: getCurrentTime(location.timezone),
                user_agent: userInfo.userAgent,
                platform: userInfo.platform,
                language: userInfo.language,
            };

            // Display the combined info
            document.getElementById('location-display').innerHTML = `
                <strong>Location Information:</strong><br>
                ${JSON.stringify(locationInfo, null, 2).replace(/,/g, '<br>')}
            `;
            document.getElementById('time-display').innerHTML = `
                <strong>Current Time:</strong> ${locationInfo.current_time} (${locationInfo.timezone})
            `;

            // Add event listener for the download button
            document.getElementById('download-btn').onclick = () => downloadJSON(locationInfo, 'device.json');
        }
    }
}

displayUserInfo();
