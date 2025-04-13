document.addEventListener("DOMContentLoaded", function () {
    const searchButton = document.getElementById("search-btn");
    const usernameInput = document.getElementById("user-input");
    const statsContainer = document.querySelector(".stats-container");

    const easyProgressCircle = document.querySelector(".easy-progress");
    const mediumProgressCircle = document.querySelector(".medium-progress");
    const hardProgressCircle = document.querySelector(".hard-progress");

    const easyLabel = document.getElementById("easy-label");
    const mediumLabel = document.getElementById("medium-label");
    const hardLabel = document.getElementById("hard-label");

    const cardStatsContainer = document.querySelector(".stats-cards");

    function validateUsername(username) {
        if (username.trim() === "") {
            alert("Username should not be empty");
            return false;
        }

        const regex = /^[a-zA-Z0-9_-]{1,15}$/;
        if (!regex.test(username)) {
            alert("Invalid Username (only 1–15 characters: a-z, A-Z, 0-9, _ or -)");
            return false;
        }

        return true;
    }

    function updateProgress(total, solved, label, circle) {
        const percentage = (solved / total) * 100;
        circle.style.setProperty("--progress-degree", `${percentage}%`);
        label.innerText = `${solved} / ${total}`;
    }

    function displayUserData(data) {
        const {
            totalQuestions,
            totalEasy,
            totalMedium,
            totalHard,
            totalSolved,
            easySolved,
            mediumSolved,
            hardSolved
        } = data;

        // Update progress circles
        updateProgress(totalEasy, easySolved, easyLabel, easyProgressCircle);
        updateProgress(totalMedium, mediumSolved, mediumLabel, mediumProgressCircle);
        updateProgress(totalHard, hardSolved, hardLabel, hardProgressCircle);

        
    }

    async function fetchUserDetails(username) {
        const url = `https://leetcode-stats-api.herokuapp.com/${username}`;

        try {
            searchButton.innerText = "Searching...";
            searchButton.disabled = true;

            const response = await fetch(url);

            if (!response.ok) {
                throw new Error("Unable to fetch the user data");
            }

            const data = await response.json();
            console.log("User data is", data);

            displayUserData(data);
        } catch (error) {
            statsContainer.innerHTML = `<p class="error">No data found. Please check the username.</p>`;
        } finally {
            searchButton.textContent = "Search";
            searchButton.disabled = false;
        }
    }

    searchButton.addEventListener("click", function () {
        const username = usernameInput.value.trim();
        if (validateUsername(username)) {
            fetchUserDetails(username);
        }
    });
});
