var userFormEl = document.querySelector("#user-form");
var nameInputEl = document.querySelector("#username");
var repoSearchTerm = document.querySelector("#repo-search-term");
var repoContainerEl = document.querySelector("#repos-container");
var languageButtonsEl = document.querySelector("#language-buttons");

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

    fetch(apiUrl)
    .then(function(response) {
        if (response.ok) {
          response.json().then(function(data) {
            displayRepos(data, user);
          });
        } 
        else {
            alert("Error: " + response.status);
        }
    })
    .catch(function(error){
        alert("Unable to connect to GitHub");
    });
}

function displayRepos(repos, searchTerm){
    //console.log(repos);
    //console.log(searchTerm);

    if(repos.length === 0){
        repoContainerEl.textContent = "No repositories found.";
        return;
    }

    repoContainerEl.innerHTML = "";
    repoSearchTerm.textContent = searchTerm;

    for(var i=0; i<repos.length; i++){
        //format the repo name
        var repoName = repos[0].owner.login + "/" + repos[i].name;

        //create container for the repo
        var repoEl = document.createElement("a");
        repoEl.className = "list-item flex-row justify-space-between align-center";
        repoEl.setAttribute("href", "./single-repo.html?repo=" + repoName);

        //create span for the repo title
        var titleEl = document.createElement("span");
        titleEl.textContent = repoName;
        
        repoEl.appendChild(titleEl);

        //create span to hold the repo issue count
        var statusEl = document.createElement("span");
        statusEl.className = "flex-row align center";

        if(repos[i].open_issues_count > 0){
            statusEl.innerHTML = repos[i].open_issues_count + " issue(s)" + "<i class='fas fa-times status-icon icon-danger'></i>" ;
        }
        else{
            statusEl.innerHTML = "<i class='fas fa-check-square status-icon icon-success'></i>";
        }

        repoEl.appendChild(statusEl);

        repoContainerEl.appendChild(repoEl);
    }
}

function getFeaturedRepos(language){
    var apiUrl = "https://api.github.com/search/repositories?q=" + language + "+is:featured&sort=help-wanted-issues";

    fetch(apiUrl).then(function(response){
        if(response.ok){
            response.json().then(function(data){
                //console.log(data);
                displayRepos(data.items, language);
            })
        }
        else{
            console.log("Error: " + response.statusText);
        }
    });
}

function buttonClickHandler(event){

    var language = event.target.getAttribute("data-language");
    
    if(language){
        getFeaturedRepos(language);

        //Clear content, this will always execute first as getFeatured repos is async
        repoContainerEl.textContent = "";
    }
}

userFormEl.addEventListener("submit", handleFormSubmit);

languageButtonsEl.addEventListener("click", buttonClickHandler);