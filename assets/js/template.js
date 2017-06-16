var Template = {
	
	displayScore: function(scores) {
            console.log("Scores are ", scores);
	    var high = document.getElementById('high');
	    var table = document.createElement('table');

	    for (var i = 0; i < scores.length; i++) {
	        var row = table.insertRow(i);

	        var cell1 = row.insertCell(0);
	        cell1.innerHTML = scores[i].name;

	        var cell2 = row.insertCell(1);
	        cell2.innerHTML = scores[i].value;
	    }

	    high.innerHTML = "";
	    high.appendChild(table);
	},

	displayName: function (name) {
		var input = document.getElementById('name');
		input.style.display = 'none';

		document.getElementById('saved-name').innerHTML = name;
	}

}
