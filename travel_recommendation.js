function searchDestination() {
    let keyword = document.getElementById("searchInput").value;

    if(keyword.trim() === ""){
        alert("Please enter a destination.");
        return;
    }

    alert("Searching for: " + keyword);
}

function clearSearch() {
    document.getElementById("searchInput").value = "";
}