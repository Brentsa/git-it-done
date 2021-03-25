var issuesContainerEl = document.querySelector("#issues-container");

function getRepoIssues(repo){
    var apiUrl = "https://api.github.com/repos/"+ repo +"/issues?direction=asc"
    fetch(apiUrl)
    .then(function(response){
        if(response.ok){
            return response.json();
        }
        else{
            alert("Error: " + response.statusText);
        }
    })
    .then(function(data){
        displayIssues(data);
    })
    .catch(function(error){
        alert("Cannot connect to GitHub.");
    });
}

function displayIssues(issues){
    console.log(issues);

    if(issues.length === 0){
        issuesContainerEl.textContent = "This repo has no open issues!";
        return;
    }

    for(var i = 0; i<issues.length; i++){
        //create a link container to take users to the issue
        var issueEl = document.createElement("a");
        issueEl.classList = "list-item flex-row justify-space-between align-center";
        issueEl.setAttribute("href", issues[i].html_url);
        issueEl.setAttribute("target", "_blank");

        //create a title for the issue container in a span
        var titleEl = document.createElement("span");
        titleEl.textContent = issues[i].title; 
        issueEl.appendChild(titleEl);

        //create a span to declare a pull or issue type
        var typeEl = document.createElement("span");
        
        //check if the issue is a pull request
        if(issues[0].pull_request){
            typeEl.textContent = "(Pull Request)";
        }
        else{
            typeEl.textContent = "(Issue)";
        }

        issueEl.appendChild(typeEl);

        issuesContainerEl.appendChild(issueEl);
    }
}

getRepoIssues("brentsa/Coding-Quiz");