var userFormEl = document.querySelector("#user-form");
var nameInputEl = document.querySelector("#username");
var repoContainerEl = document.querySelector("#repos-container");
var repoSearchTerm = document.querySelector("#repo-search-term");

var getUserRepos = function(user) {
    //format the github api url
    var apiUrl = "https://api.github.com/users/" + user + "/repos";
    
    // make a request to the url
    fetch(apiUrl).then(function(response)  {
    response.json().then(function(data) {
       displayRepos(data, user);
        });
    });    
}; // end of getUserRepos


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
    // clear old content
    repoContainerEl.textContent = "";
    repoSearchTerm.textContent = searchTerm;

    //loop over repos
    for (var i=0; i <repos.length; i++) {
        //format repo name
        var repoName = repos[i].owner.login + "/" + repos[i].name;

        // create container for each repo
        var repoEl = document.createElement("div");
        repoEl.classList = "list-item flex-row justify-space-between align-center";
        //create span elemt to hold repo name
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
userFormEl.addEventListener("submit", formSubmitHandler);