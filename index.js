const fs = require("node:fs");

const data = {
    row1: [
        1, 2, 3, 4, 5
    ],
    row2: [
        "Hello", "World", undefined, "Are", "You"
    ],
    row3: [
        true, true, false, true, true
    ]
}

function jsonToCsv(data, filename) {
    let keys = Object.keys(data);

    let length = 0;
    for (let key in keys) {
        let currentLength = data[keys[key]].length;
        if (currentLength > length) {
            length = currentLength;
        }
    }

    let result = [];
    result.push(keys.join(";") + "\n");
    for (i = 0; i < length; i++) {
        let row = [];
        for (let key in data) {
            row.push(data[key][i]?.toString() || "");
        }
        result.push(row.join(";") + "\n");
    }
    
    result = result.join("");

    fs.writeFile(filename, result, (err) => {});
}

function CsvToJson(file) {
    let fileString = fs.readFileSync(file).toString();
    const rows = fileString.replace(/\r/g, "").trim().split("\n");
    
    let result = {};
    const keys = rows[0].split(";");
    for (let key of keys) {
        result[key] = [];
    }

    let cells = rows.map(row => row.split(";"));

    i = 0;
    for (let key of keys) {
        for (j = 1; j < rows.length; j++) {
            let currentCell = cells[j][i];

            if (!isNaN(parseInt(currentCell))) {
                result[key].push(parseInt(currentCell));
                continue;
            }
            
            if (currentCell.trim().toLowerCase() === 'true') {
                result[key].push(true);
                continue;
            }
        
            if (currentCell.trim().toLowerCase() === 'false') {
                result[key].push(false);
                continue;
            }

            result[key].push(currentCell);
        }
        i++;
    }

    return result;
}

jsonToCsv(data, "newfile.csv");
console.log(CsvToJson("file.csv"));