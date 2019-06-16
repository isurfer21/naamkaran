phonon.options({
    navigator: {
        defaultPage: 'home',
        hashPrefix: '!',
        animatePages: true,
        enableBrowserBackButton: true,
        templateRootDirectory: '',
        useHash: true
    },
    i18n: null // for this example, we do not use internationalization
});

class StringUtils {
	static graft(pattern, list) {
		var formatted = pattern;
		if (Array.isArray(list)) {
			for (let i = 0; i < list.length; i++) {
				formatted = formatted.replace("[" + i + "]", list[i]);
			}
		} else {
			for (let prop in list) {
				formatted = formatted.replace(new RegExp('\\[' + prop + '\\]', 'g'), list[prop]);
			}
		}
		return formatted;
	}
}

class DatePattern {
	static culture = {
		en_US: '[M]/[D]/[Y]',
		en_GB: '[D]/[M]/[Y]',
		ja_JP: '[Y]/[M]/[D]'
	};
	static objectify(date) {
		var dateObj;
		if (typeof (date) != 'object') {
			var tarikh = date.split('-');
			dateObj = {
				Y: parseInt(tarikh[0]),
				M: parseInt(tarikh[1]),
				D: parseInt(tarikh[2])
			};
		} else {
			dateObj = date;
		}
		return dateObj;
	}
	static format(pattern, date) {
		var dateObj = this.objectify(date);
		return StringUtils.graft(pattern, dateObj);
	}
}

class CharType {
	static ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
	static VOWEL = 'AEIOU';
	static CONSONANT = 'BCDFGHJKLMNPQRSTVWXYZ';

	static isEmpty(data) {
		return typeof (data) == "string" && data == "";
	}
	static isDigit(char) {
		return char >= '0' && char <= '9';
	}
	static isAlphanumeric(char) {
		return char >= 'A' && char <= 'Z' || char >= 'a' && char <= 'z' || CharType.isDigit(char);
	}
	static isAlphabet(char) {
		return (CharType.ALPHABET.indexOf(char) > -1);
	}
	static isVowel(char) {
		return (CharType.VOWEL.indexOf(char) > -1);
	}
	static isConsonant(char) {
		return (CharType.CONSONANT.indexOf(char) > -1);
	}
}

class Chaldean {
	isNameLucky (moolank, bhagyank, namank) {
        var output;
        if (moolank == namank) {
            output = "is Extremely Lucky";
        }
        else if ((moolank == 3 || moolank == 6 || moolank == 9) && (namank == 3 || namank == 6 || namank == 9)) {
            output = "is Lucky";
        }
        else if ((moolank == 8) && (namank == 1 || namank == 3 || namank == 5 || namank == 6)) {
            output = "is Lucky";
        }
        else if ((moolank == 1 || moolank == 2 || moolank == 4 || moolank == 7) && (namank == 1 || namank == 2 || namank == 4 || namank == 7)) {
            output = "is Lucky";
        }
        else if ((moolank == 5) && (namank == 5)) {
            output = "is Lucky";
        }
        else if (namank == bhagyank) {
            output = "is Fairly Lucky";
        }
        else {
            output = "gives you absolutely new personality traits";
        }
        return output;
    };
}

class Approaches {
	static PYTHAGOREAN = [1, 2, 3, 4, 5, 8, 3, 5, 1, 1, 2, 3, 4, 5, 7, 8, 1, 2, 3, 4, 6, 6, 6, 5, 1, 7];
	static GEMATRIA = [1, 2, 3, 4, 5, 6, 7, 8, 9, 1, 2, 3, 4, 5, 6, 7, 8, 9, 1, 2, 3, 4, 5, 6, 7, 8];
}

class Numerology {
    static actualValue(numeral) {
		var remainder = numeral % 9;
		return (remainder == 0) ? 9 : remainder;
	}

	static sumDigit(numeral) {
		let sum = 0;
		if (numeral == 0) {
			return 0;
		}
		sum = Math.floor(numeral) % 10 + this.sumDigit(Math.floor(numeral / 10));
		return sum;
	}

	static sumNumber(numeral) {
		let sum = numeral;
		while ((numeral > 9) && (numeral != 11) && (numeral != 22)) {
			sum = this.sumDigit(numeral);
			numeral = sum;
		}
		return sum;
	}

	static sumCharacter(check, data) {
		for (var i = 0, sum = 0; i < data.length; i++) {
			var character = data[i];
			if (check(character))
				sum += Approaches.PYTHAGOREAN[CharType.ALPHABET.indexOf(character)];
		}
		return sum;
	}

	static sumAlphabet(data) {
		return this.sumCharacter(CharType.isAlphabet, data.toUpperCase());
	}
	static sumVowel(data) {
		return this.sumCharacter(CharType.isVowel, data.toUpperCase());
	}
	static sumConsonant(data) {
		return this.sumCharacter(CharType.isConsonant, data.toUpperCase());
	}
}

var app = phonon.navigator();

/**
 * The activity scope is not mandatory.
 * For the home page, we do not need to perform actions during
 * page events such as onCreate, onReady, etc
*/
app.on({page: 'home', preventClose: false, content: null}, function(activity) {
	var dateOfBirth, fullName;

	var onDobSubmit = function(e) {
		console.log('onDobSubmit');
		dateOfBirth = document.querySelector('#dob-input').value;
		document.querySelector('#dob-label').innerHTML = dateOfBirth;
		document.querySelector('#dob-input').value = '';
	}
	
	var onPanSubmit = function(e) {
		console.log('onPanSubmit');
		fullName = document.querySelector('#pan-input').value;
		document.querySelector('#pan-label').innerHTML = fullName;
		document.querySelector('#pan-input').value = '';
		genReport();
	}

	var genReport = function() {
		var o = {};
    	dob = DatePattern.objectify(dateOfBirth);
    	o.janmank = (!isNaN(dob.D)) ? Numerology.sumNumber(dob.D) : null;
		o.moolank = (!isNaN(dob.D)) ? Numerology.actualValue(dob.D) : null;
		o.bhagyank = (!(isNaN(dob.D) || isNaN(dob.M) || isNaN(dob.Y))) ? Numerology.actualValue(dob.D + dob.M + dob.Y) : null;
		o.namank = Numerology.actualValue(Numerology.sumAlphabet(fullName));
		o.swarank = Numerology.actualValue(Numerology.sumVowel(fullName));
		o.vyanjanank = Numerology.actualValue(Numerology.sumConsonant(fullName));
		renderReport(o);
	}

	var renderReport = function(o) {
		document.querySelector('#report-janmank').innerHTML = o.janmank;
		document.querySelector('#report-moolank').innerHTML = o.moolank;
		document.querySelector('#report-bhagyank').innerHTML = o.bhagyank;
		document.querySelector('#report-namank').innerHTML = o.namank;
		document.querySelector('#report-swarank').innerHTML = o.swarank;
		document.querySelector('#report-vyanjanank').innerHTML = o.vyanjanank;
	}

	activity.onCreate(function() {
        document.querySelector('#dob-submit').on('tap', onDobSubmit);
        document.querySelector('#pan-submit').on('tap', onPanSubmit);
    });
});

// Let's go!
app.start();
