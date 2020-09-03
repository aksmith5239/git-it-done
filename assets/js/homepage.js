var userFormEl = document.querySelector("#user-form");
var nameInputEl = document.querySelector("#username");
var repoContainerEl = document.querySelector("#repos-container");
var repoSearchTerm = document.querySelector("#repo-search-term");
var languageButtonsEl = document.querySelector("#language-buttons");

var getUserRepos = function(user) {
    //format the github api url
    var apiUrl = "https://api.github.com/users/" + user + "/repos";
    
    // make a request to the url
    fetch(apiUrl).then(function(response)  {
        if(response.ok) {
            response.json().then(function(data) {
                displayRepos(data, user);
                 });
        } else {
            alert("Error: " + response.statusText);
        }
    })
    .catch(function(error) {
        //Notice the catch() getting chained on to the .then()method
        alert("Unable to connect to GitHub");
    });    
}; // end of getUserRepos

var getFeaturedRepos = function(language) {
    var apiUrl = "https://api.github.com/search/repositories?q="+ language + "+is:featured&sort=help-wanted-issues";
    fetch(apiUrl).then(function(response){
        if(response.ok) {
            response.json().then(function(data){
                displayRepos(data.items, language);
            });
        } else {
            alert("Error: " + response.statusText);
        }
    });
};

var formSubmitHandler = function(event) {
        event.preventDefault();
    var username = nameInputEl.value.trim();

    if (username) {
        getUserRepos(username);
        nameInputEl.value = "";
    }else {
        alert("Please enter a GitHub username");
    }

} // end of formSubmitHandler

var displayRepos = function(repos, searchTerm) {
    if(repos.length === 0) {
        repoContainerEl.textContent = "No repositories found.";
        return;
    }
    // clear old content
    repoContainerEl.textContent = "";
    repoSearchTerm.textContent = searchTerm;

    //loop over repos
    for (var i=0; i <repos.length; i++) {
        //format repo name
        var repoName = repos[i].owner.login + "/" + repos[i].name;

        // create container for each repo
        var repoEl = document.createElement("a");
        repoEl.classList = "list-item flex-row justify-space-between align-center";
        //create span elemt to hold repo name
        repoEl.setAttribute("href", "./single-repo.html?repo=" +repoName)
        var titleEl = document.createElement("span");
        titleEl.textContent = repoName;
        
        //append to container
        repoEl.appendChild(titleEl);
        
        var statusEl = document.createElement("span");
        statusEl.classList = "flex-row align-center";

        //check if current rep has issues or not
        if (repos[i].open_issues_count > 0) {
            statusEl.innerHTML = "<i class='fas fa-times status-icon icon-danger'></i>" + repos[i].open_issues_count + " issue(s)";
        } else {
            statusEl.innerHTML = "<i class='fas fa-check-square status-icon icon-success'></i>";
        }
         //append status to the container
         repoEl.appendChild(statusEl);
        //append container to the DOM
        repoContainerEl.appendChild(repoEl);

    }
}

var buttonClickHandler = function(event) {
    var language = event.target.getAttribute("data-language");
    getFeaturedRepos(language);
    //clear old content
    repoContainerEl.textContent = "";
} 
userFormEl.addEventListener("submit", formSubmitHandler);
languageButtonsEl.addEventListener("click", buttonClickHandler);