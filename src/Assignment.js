const colors = [
	"dark",
	"light",
	"grey",
	"red",
	"blue",
	"green",
	"yellow",
	"brown",
	"purple",
	"orange",
	"white",
	"black",
	"beige",
	"rose",
];

const symbols = [
	"shirt",
	"pants",
	"shoes",
	"hat"
];

const gestures = [
	"left hand 1 finger up",
	"left hand peace sign",
	"left hand w sign",
	"left hand three fingers up",
	"left hand four fingers up",
	"left hand up",
	"right hand 1 finger up",
	"right hand peace sign",
	"right hand w sign",
	"right hand three fingers up",
	"right hand four fingers up",
	"right hand up",
	"left hand drinks",
	"left hand shakes head",
	"left hand grabs ear",
	"right hand in your hear",
	"right hand above your left hand",
	"right hand makes a fist",
	"right hand takes your hand for your mouth",
	"right hand closes one eye",
	"right hand grabs your mustache",
	"right hand grabs your beard",
	"right hand 1 finger in your right noise",
	"right hand behind your head",
	"right hand above your head",
	"left hand 1 finger in your right noise",
	"left hand touches your tooth",
	"left hand touches your tongue",
	"left hand takes your right elbow",
	"left hand shakes right hand",
	"left hand holds to your front",
	"have a shoe in the left hand",
	"have a pen in the left hand",
	"have a phone in the left hand",
	"left hand holds your right feet",
	"left hand holds your left feet",
	"left hand touches your left knee",
	"left hand touches your right knee",
	"left hand closes one eye",
	"left hand makes a fist",
	"left hand touches your shoulder",
	"have a watch in the left hand",
	"left hand in your front",
	"left hand in your back pocket",
	"left hand, bust up",
	"left hand before your eyebrows",
	"left hand on your belly",
	"left hand around your neck",
	"hold a bag in the left hand",
];

class Assignment {
	getColor(ordinal) {
		return colors[ordinal];
	}
	
	getSymbol(ordinal) {
		if(ordinal > symbols.length) {
			ordinal = symbols.length;
		}
		return symbols[ordinal];
	}
	
	getGesture(ordinal) {
		return gestures[ordinal];
	}
    
    updateChallenge(hash, difficulty=1) {
    	if(difficulty < 1) {
    		difficulty = 1;
    	}
    
    	let difficultyModulo = 16;
    	if(difficulty >= 3) {
    		difficultyModulo = 49;
    	} else if(difficulty >= 2) {
    		difficultyModulo = 49;
    	} else {
    		difficultyModulo = 46;
    	}
    	if(difficultyModulo > gestures.length) {
	    	difficultyModulo = gestures.length;
    	}
    	
    	let symbol = ""
    	let color = ""
    	let challenge = this.getGesture(parseInt(hash.substring(0,2), 16) % difficultyModulo);
    	
    	
    	
    	var i;    	
    	for(i = 0; (i < difficulty) && (i < symbols.length); i++) {
    		color	= this.getColor(parseInt(hash[2 * i], 16) % colors.length);
    		symbol	= this.getSymbol(i);
    		challenge += ", " + color + " " + symbol;
    	}
    	
    	return challenge.charAt(0).toUpperCase() + challenge.slice(1);
    }
}
