#!/usr/bin/env node

/*  
    @luxedo/heatmap - Creates heatmaps from latitude and longitude data 
    Copyright (C) 2020 Luiz Eduardo Amaral 

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/
const fs = require("fs");
const heatmap = require("@luxedo/heatmap");
const args = require("yargs")
  .scriptName("heatmap")
  .usage(`Usage: $0 [-g] -i input_file -o output_file       $0 [-g] [--] file`)
  .option("geo", {
    alias: "g",
    type: "boolean",
    description: "Receives input as geographic data"
  })
  .option("input", {
    alias: "i",
    type: "string",
    description: "Input json file with the configurations"
  })
  .option("output", {
    alias: "o",
    type: "string",
    description: "Output png file"
  })
  .option("", {
    description: "Receives input from stdin and outputs to stdout"
  }).epilog(`Example:
echo '{"points": [{"px": 10, "py": 10, "value": 1, "sigma": 30}, 
  {"px": 120, "py": 30, "value": 0.6, "sigma": 50}, 
  {"px": 70, "py": 130, "value": 0.2, "sigma": 70}], 
  "width": 150, 
  "height": 150, 
  "method": "nearest"}' | heatmap -- > example3.png

   See https://github.com/luxedo/heatmap for configuration details.`).argv;

const main = (() => {
  let data;
  let out = "file";
  if (args.hasOwnProperty("o") || args.hasOwnProperty("i")) {
    if (!(args.hasOwnProperty("o") && args.hasOwnProperty("i")))
      throw Error("You must provide both -i (input_file) and -o (output_file)");
    data = JSON.parse(fs.readFileSync(args.i).toString());
  } else {
    data = JSON.parse(fs.readFileSync(0, "utf-8"));
    out = "stdout";
  }

  let Buf;
  if (args.hasOwnProperty("g")) {
    const { buf } = heatmap.drawGeoHeatmap(data);
    Buf = buf;
  } else {
    Buf = heatmap.drawHeatmap(data);
  }

  if (out == "file") fs.writeFileSync(args.o, Buf);
  else process.stdout.write(Buf);
})();
