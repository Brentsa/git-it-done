var userFormEl = document.querySelector("#user-form");
var nameInputEl = document.querySelector("#username");
var repoSearchTerm = document.querySelector("#repo-search-term");
var repoContainerEl = document.querySelector("#repos-container");

function handleFormSubmit(event){
    event.preventDefault();

    var username = nameInputEl.value.trim();
    if(username){
        getUserRepos(username);
    }
    else{
        alert("Please enter a valid username.");
    }
    
    userFormEl.reset();
}

function getUserRepos(user){
    var apiUrl = "https://api.github.com/users/" + user + "/repos";

    fetch(apiUrl).then(function(response){
        response.json().then(function(data){
            displayRepos(data, user);
        });
    });
}

function displayRepos(repos, searchTerm){
    console.log(repos);
    console.log(searchTerm);

    repoContainerEl.innerHTML = "";
    repoSearchTerm.textContent = searchTerm;

    for(var i=0; i<repos.length; i++){
        //format the repo name
        var repoName = repos[0].owner.login + "/" + repos[i].name;

        //create container for the repo
        var repoEl = document.createElement("div");
        repoEl.className = "list-item flex-row justify-space-between align-center";

        //create span for the repo title
        var titleEl = document.createElement("span");
        titleEl.textContent = repoName;
        
        repoEl.appendChild(titleEl);

        //create span to hold the repo issue count
        var statusEl = document.createElement("span");
        statusEl.className = "flex-row align center";

        if(repos[i].open_issues_count > 0){
            statusEl.innerHTML = "<i class='fas fa-times status-icon icon-danger'></i>" + repos[i].open_issues_count + " issue(s)";
        }
        else{
            statusEl.innerHTML = "<i class='fas fa-check-square status-icon icon-success'></i>";
        }

        repoEl.appendChild(statusEl);

        repoContainerEl.appendChild(repoEl);
    }
}

userFormEl.addEventListener("submit", handleFormSubmit);