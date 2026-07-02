let traveldestination ={};

const resultDiv = document.createElement('div');
resultDiv.id = "result";
resultDiv.className = "overlay-content";
const boxcontentDiv = document.getElementById('box-content');
resultDiv.innerHTML = '';

const searchForm = document.getElementById('searchForm');
const searchInput = document.getElementById('searchInput');
const clearBtn = document.getElementById('btnClear');

searchForm.addEventListener('submit', (event) => {
    event.preventDefault();
    searchDestination();
});

clearBtn.addEventListener('click', () => {
    searchInput.value = '';
    clearSearch();
});

function searchDestination() {
    const btnSearch = document.getElementById('btnSearch');
    const keyword = document.getElementById("searchInput").value.toLowerCase();

    // alert("Searching for: " + keyword);
    fetch('travel_recommendation_api.json')
      .then(response => response.json())
      .then(data => {
         traveldestination = data;    
      })
      .catch(error => {
        console.error('Error:', error);
        resultDiv.innerHTML = '<p>An error occurred while fetching data.</p>';
      });
    
    if(keyword.trim() === ""){
        alert("Please enter a destination or keyword.");
        return;
    }

    let results = [];

    switch (keyword) {
    case "beach":
    case "beaches":
        results = traveldestination.beaches;
        break;

    case "temple":
    case "temples":
        results = traveldestination.temples;
        break;

    default:
    {// Find country by name
        const country = traveldestination.countries.find(
            c => c.name.toLowerCase() === keyword
        );
    
        if (country) {
            results = country.cities;
        }
        break;
    }
}


    // If no matches
    if (!results || results.length === 0) {
        resultDiv.innerHTML = `<p>No recommendations found for this "${keyword}".</p>`;
        return;
    }

    // Display results
    const span = document.createElement('span');
    span.id = "resultHeader";
    span.innerHTML = `
        <h1>Search Results</h1>
    `;
    resultDiv.append(span);
    
    results.forEach(destination => {
        const div = document.createElement('div');
        div.classList.add('destinationDetails');
        
        const localTimeSpan = document.createElement('span');
        localTimeSpan.classList.add('currentTime');

        div.innerHTML = `
        <img src="${destination.imageUrl}" alt="${destination.name}">
        <h3>${destination.name}</h3>
        <p>${destination.description}</p>
        `;

        div.append(localTimeSpan);

    function updateClock() {
  
        // Check if the element exists
        if (!localTimeSpan) {
            console.error("Element with class 'currentTime' not found.");
            return;
        }

        // Check if destination and timeZone exist
        if (!destination || !destination.timeZone) {
            localTimeSpan.innerText = "Time zone unavailable.";
            return;
        }

        try {
            const options = {
                timeZone: destination.timeZone,
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: true
            };

            const currentTime = new Date().toLocaleTimeString("en-US", options);

            localTimeSpan.innerText = `Current time in ${destination.name}: ${currentTime}`;
        } catch (error) {
            console.error(error);
            localTimeSpan.innerText = "Invalid time zone.";
        }
    }

        updateClock();
        setInterval(updateClock, 1000);
        resultDiv.append(div);
    });
    
    boxcontentDiv.replaceWith(resultDiv);
    document.getElementById("searchInput").value = "";
}


function clearSearch() {
    document.getElementById('result').innerHTML = '';
    resultDiv.replaceWith(boxcontentDiv);
}
