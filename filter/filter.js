// const films = [{
//         name: "Город Бога",
//         genre: "Драма",
//         year: "2002",
//         raiting: "8.0"
//     },{
//         name: "Донни Дарко",
//         genre: "Фантастика",
//         year: "2001",
//         raiting: "7.6"
//     },{
//         name: "Джокер",
//         genre: "Триллер",
//         year: "2019",
//         raiting: "8.0"
//     },{
//         name: "Джентельмены",
//         genre: "Триллер",
//         year: "2020",
//         raiting: "8.5"
//     }
// ]

const songs = [{
    artist: "Metallica",
    name: "The Four Horsemen",
    genre: "Метал",
    year: "1983",
    duration: "5"
},{
    artist: "Metallica",
    name: "King Nothing",
    genre: "Метал",
    year: "1986",
    duration: "5"
},{
    artist: "Depeche Mode",
    name: "And then...",
    genre: "Альтернатива",
    year: "1983",
    duration: "4"
},{
    artist: "Depeche Mode",
    name: "Dressed in black",
    genre: "Рок",
    year: "1986",
    duration: "3"
},{
    artist: "Depeche Mode",
    name: "Enjoy the silence",
    genre: "Поп",
    year: "1990",
    duration: "4"
},{
    artist: "AC/DC",
    name: "Who Made Who",
    genre: "Хард Рок",
    year: "1986",
    duration: "3"
},{
    artist: "AC/DC",
    name: "Thunderstruck",
    genre: "Хард Рок",
    year: "1990",
    duration: "4"
}
]

const properties = {
	'artist': "Жанр",
	'year': "Год",
	'duration': "Длительность"
};

function printFilms(arrSongs, selector ) {
	const startTemplate = '<table style="width:80%;"><tr style="background-color:#74F4EA;"><td style="border-radius:10%">Исполнитель</td><td style="border-radius:10%">Название</td><td style="border-radius:10%">Жанр</td><td style="border-radius:10%">Год</td><td style="border-radius:10%">Длительность</td></tr>';
	const lileTemplate = '<tr><td>{{artist}}</td><td>{{name}}</td><td>{{genre}}</td><td>{{year}}</td><td>{{duration}}</td></tr>';
	const endTemplate = '</table>';
	let output = startTemplate;
	for (let item of arrSongs) {
        let tmpLine;
        tmpLine = lileTemplate.replace('{{name}}', item.name);
        tmpLine = tmpLine.replace('{{artist}}', item.artist);
		tmpLine = tmpLine.replace('{{genre}}', item.genre);
		tmpLine = tmpLine.replace('{{year}}', item.year);
		tmpLine = tmpLine.replace('{{duration}}', item.duration);
		output += tmpLine;
	};
	output += endTemplate;
	$(selector).html(output);
}

function printFilters( arrSongs, arrProperties, selector ) {
	const startTemplate = '<br>{{name}}<br>';
	const lileTemplate = '<label><input type="checkbox" name="{{prop}}" value="{{name}}">{{name}}</label><br>';
	const endTemplate = '';
	let output = '';
	for (let prop in arrProperties) {
		let tmpLine = startTemplate.replace('{{name}}', arrProperties[prop]);
		let vals = [];
		for (let song of songs) {
			if (!vals.includes(song[prop])) {
				vals.push(song[prop]);
			}
		}
		vals.sort();
		vals.forEach(function(item, index, array) {
			tmpLine += lileTemplate.replace("{{prop}}", prop ).replaceAll("{{name}}",item);	
		});
		output += tmpLine;
	};
	output += endTemplate;
	$(selector).html(output);
}	 

function readCurFilters(selector, properties) {
	let result = [];
	for (let prop in properties) {
		result.push(prop);
		let searchIDs = $("#filters input[name='"+prop+"']:checkbox:checked").map(function(){
			return $(this).val();
		}).get(); 
		result[prop] = searchIDs;
	}
	return result;
}

function applyFilters( data, filter, properties) {
	let result = [];
	for (let song of data) {
		let ok = true;
		for (let prop in properties) {
			if (!filter[prop].length)
				continue;
			if (filter[prop].indexOf(song[prop]) == -1)
				ok = false;
		}
		if (ok) {
			result.push(song);
		};
	}
	return result;
}

$(document).ready(function() {
    printFilms(songs, '#songs');
    printFilters(songs, properties, '#filters');
    $('#filters input').change(function() {
        let curFilter = readCurFilters('#filters input', properties);
    let filtredContent = applyFilters(songs, curFilter, properties);
    $('#filters input:checkbox').prop('disabled', false);
    checkEmpty(songs, curFilter, properties);
    checkSame(songs, curFilter, properties);
    printFilms(filtredContent, '#songs');
    });
});

function checkEmpty(data, filter, properties) {
    let CheckboxList = $('#filters input:checkbox:not(:checked)').toArray();
    for (let checkbox of CheckboxList) {
        let tmpFilters = [];
        tmpFilters = $.extend(true, [], filter);
        tmpFilters[checkbox.name].push(checkbox.value);
        let filtredContent = applyFilters(songs, tmpFilters, properties);
        if (filtredContent.length == 0) {
            checkbox.disabled = true;
        }
    }
}
    
function checkSame(data, filter, properties) {
    let checkboxList = $('#filters input:checkbox:not(:checked)').toArray();
    for (let checkbox of checkboxList) {
        let tmpFilters = [];
        tmpFilters = $.extend(true, [], filter);
        tmpFilters[checkbox.name].push(checkbox.value);
        let NewContent = applyFilters(data, tmpFilters, properties);
        let filtredContent = applyFilters(data, filter, properties);
        let isSame = true;
        if (filtredContent.length != NewContent.length) {
            isSame = false;
        } else {
            let Res = [];
            for (let i = 0; i < filtredContent.length; i++) {
                Res.push(filtredContent[i] == NewContent[i]);
            }
            if (Res.indexOf(false) != -1) {
                isSame = false;
            }
        }
        if (isSame) {
            checkbox.disabled = true;
        }
    }
}