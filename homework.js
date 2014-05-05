function CustomPromise(url, type, customData, contentType) {

  return new Promise(function(resolve, reject) {
    var req = new XMLHttpRequest();
    req.open(type, url);
	if( '' != contentType ) {
            req.setRequestHeader('Content-Type', contentType);
        }
    req.onload = function() 
	{
      if (req.status == 200) {
        resolve(req.response);
      }
      else {
        reject(Error(req.statusText));
      }
    };

    req.onerror = function() {
      reject(Error("Network Error"));
    };
    // Make the request
    req.send(customData);
  });
}

var newTechtalk = {
	"date": "4\/21\/2014",
    "title": "AJAX",
    "lector": [
      "alena_karaba"
    ],
    "location": "K1\/3",
    "description": "some description",
    "level": "D1-D5",
    "notes": "",
    "attendees": [
      "alena_karaba"
    ],
    "tags": [
      "ajax",
      "xmlhttprequest",
      "promises"
    ]
};


var jsonNewTechtalk = JSON.stringify(newTechtalk);
CustomPromise("http://54.72.3.96:3000/techtalks/", "GET", "", "")
	.then(function (response){
		var allTechtalks = JSON.parse(response);
		document.getElementById('getAllTechtalks').innerHTML = "All Techtalks getting";
		var id = allTechtalks[0]["_id"];
		document.getElementById('getAllTechtalks').innerHTML = "<p>First techtalk ID : "+ id +";<p>"
		return id;
  }).then(function (firstID){
		var singleTechTalk = "";
		CustomPromise("http://54.72.3.96:3000/techtalks/" + firstID, "GET", "", "")
			.then(function (response){
				console.log('This talk has been read', JSON.parse(response));
				document.getElementById('singleTechtalks').innerHTML = "<p>First techtalk Title : "+ (JSON.parse(response))['title'] +";<p>";
			});				
		return firstID;
  }).then(function (firstID){
	CustomPromise("http://54.72.3.96:3000/techtalks/", "POST", jsonNewTechtalk, "")
		.then(function (response){
			var responseTechtalk = JSON.parse(response);
			var myId = responseTechtalk["_id"];
			if (myId != null && myId != undefined)
			{
				document.getElementById('postTechtalk').innerHTML = "Item added successful. ID: " + myId;	
			}
			else
			{
				document.getElementById('postTechtalk').innerHTML = "Item adding failed.";	
			}					
		})
		return firstID;
	}).then(function (firstID){
		var newTitle = JSON.stringify({"title" : "My New Title"});			
		CustomPromise("http://54.72.3.96:3000/techtalks/" + firstID, "PUT", newTitle, "application/json").then(function(response) {
			var updatedTitle = JSON.parse(response);
			document.getElementById('putTitle').innerHTML = "The new Title:" + updatedTitle["title"];	
		});
		return firstID;
	}).then(function (firstID){	
		CustomPromise("http://54.72.3.96:3000/techtalks/" + firstID, "DELETE", "", "").then(function(response) {
			document.getElementById('deleteTechtalk').innerHTML = "Delete: " + response;	
		});
	});
	
// 3. Load list of techtalks, get list of lectors, show in html Techtalks with full_name and email of lector. (create some error hadling if lector was not found).

CustomPromise("http://54.72.3.96:3000/techtalks/", "GET", "", "")
	.then(function (response){
		var allTechtalks = JSON.parse(response);		
		document.getElementById('getAllTechtalks2').innerHTML = "All Techtalks getting";
		var lector = allTechtalks[105]["lector"];
		
		if (lector != null && lector != undefined)
		{
			document.getElementById('lectorName').innerHTML = "<p>Lector Name : "+ lector +";<p>"
		}
		else
		{
			document.getElementById('lectorName').innerHTML = "Lector Not Found";	
		}			
		return lector;
  });
