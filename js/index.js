document.addEventListener("DOMContentLoaded", () => {
  const searchForm = document.getElementById("github-form");
  const searchInput = document.getElementById("search");
  const userList = document.getElementById("user-list");
  const reposList = document.getElementById("repos-list");

  // Dynamically create the toggle button
  const toggleSearchTypeButton = document.createElement("button");
  toggleSearchTypeButton.id = "toggleSearchType";
  toggleSearchTypeButton.textContent = "Toggle Search Type";
  searchForm.insertBefore(toggleSearchTypeButton, searchInput.nextSibling);

  toggleSearchTypeButton.addEventListener("click", function () {
    searchType = searchType === "users" ? "repos" : "users";
    searchInput.placeholder = `Enter GitHub ${
      searchType === "users" ? "username" : "repository"
    }`;
  });

  let searchType = "users"; // Default search type

  searchForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const searchTerm = searchInput.value.trim();

    if (searchType === "users") {
      searchUsers(searchTerm);
    } else if (searchType === "repos") {
      searchRepos(searchTerm);
    }
  });

  function searchUsers(username) {
    const url = `https://api.github.com/search/users?q=${username}`;

    fetch(url)
      .then((response) => response.json())
      .then((data) => displayUsers(data.items))
      .catch((error) => console.error("Error searching users:", error));
  }

  function searchRepos(repoName) {
    const url = `https://api.github.com/search/repositories?q=${repoName}`;

    fetch(url)
      .then((response) => response.json())
      .then((data) => displayRepos(data.items))
      .catch((error) => console.error("Error searching repositories:", error));
  }

  function displayUsers(users) {
    userList.innerHTML = "";
    reposList.innerHTML = "";

    users.forEach((user) => {
      const userElement = document.createElement("li");
      userElement.innerHTML = `
        <img src="${user.avatar_url}" alt="${user.login}" width="50">
        <p>${user.login}</p>
        <button class="view-profile">View Profile</button>
      `;
      const viewProfileButton = userElement.querySelector(".view-profile");

      viewProfileButton.addEventListener("click", () =>
        showUserProfile(user.login)
      );
      userList.appendChild(userElement);
    });
  }

  function displayRepos(repos) {
    reposList.innerHTML = "";
    userList.innerHTML = "";

    repos.forEach((repo) => {
      const repoElement = document.createElement("li");
      repoElement.innerHTML = `
        <h3>${repo.name}</h3>
        <p>${repo.description}</p>
        <a href="${repo.html_url}" target="_blank">View Repository on GitHub</a>
      `;
      reposList.appendChild(repoElement);
    });
  }

  function showUserProfile(username) {
    const url = `https://api.github.com/users/${username}`;

    fetch(url)
      .then((response) => response.json())
      .then((user) => {
        userList.innerHTML = "";
        reposList.innerHTML = "";

        const userElement = document.createElement("li");
        userElement.innerHTML = `
          <img src="${user.avatar_url}" alt="${user.login}" width="50">
          <p>${user.login}</p>
          <a href="${user.html_url}" target="_blank">View Profile on GitHub</a>
        `;
        userList.appendChild(userElement);

        // Fetch and display repositories for the user
        fetch(`https://api.github.com/users/${username}/repos`)
          .then((response) => response.json())
          .then((data) => displayRepos(data))
          .catch((error) =>
            console.error("Error fetching user repositories:", error)
          );
      })
      .catch((error) => console.error("Error fetching user profile:", error));
  }
});
