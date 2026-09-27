import { SvgBuilder } from "../src/svgBuilder";
import { ChordDiagram } from "../src/models/chordDiagram";
import { Instrument } from "../src/models/instrument";

const diagram = new ChordDiagram({
    frets: [1, 3, 1, 1, 1, 1],
    fingers: [1, 3, 1, 1, 1, 1],
    baseFret: 7,
    variation: 4,
});
const chordTones = ["B", "D", "F#", "A"];

const instrument: Instrument = {
    stringsCount: 6,
    fretsOnDiagram: 4,
    name: "Guitar",
    tuning: ["E", "A", "D", "G", "B", "E"],
};

const container = document.getElementById("container");

const themes = [
    { name: "Light", description: "Quiet, paper-bright", className: "light" },
    { name: "Dark", description: "Low-glare, high-contrast", className: "dark" },
];

themes.forEach((theme) => {
    const panel = document.createElement("section");
    panel.className = `theme-panel ${theme.className}`;

    const heading = document.createElement("div");
    heading.className = "panel-topline";
    heading.innerHTML = `<h2>${theme.name}</h2><span>${theme.description}</span>`;
    panel.appendChild(heading);

    const example = document.createElement("div");
    example.className = "chord-example";
    const builder = new SvgBuilder();
    builder.settings.neck.useRoman = true;
    builder.settings.neck.grid.color = theme.className === "dark" ? "#647168" : "#b8c2b9";
    builder.settings.neck.strings.color = theme.className === "dark" ? "#c2ccc3" : "#69766d";
    builder.settings.neck.nut.color = theme.className === "dark" ? "#cad2cb" : "#48584c";
    builder.settings.neck.stringName.color = theme.className === "dark" ? "#c2ccc3" : "#69766d";
    builder.settings.neck.baseFret.color = theme.className === "dark" ? "#c2ccc3" : "#69766d";
    builder.settings.neck.stringInfo.color = theme.className === "dark" ? "#c2ccc3" : "#69766d";
    builder.settings.dot.fillColor = theme.className === "dark" ? "#a7c6a8" : "#405e4a";
    builder.settings.dot.strokeColor = theme.className === "dark" ? "#dce8dc" : "#324b3a";
    builder.settings.fingering.color = theme.className === "dark" ? "#202723" : "#fffefa";

    const title = document.createElement("div");
    title.className = "chord-title";
    title.innerHTML = '<span class="chord-name">B<span class="chord-quality">m7</span></span><span class="variation">7th-position voicing</span>';
    example.append(title);

    const staff = document.createElement("div");
    staff.className = "staff-preview";
    staff.appendChild(builder.buildStaff(diagram, instrument, chordTones));
    example.appendChild(staff);

    const fretboard = document.createElement("div");
    fretboard.className = "fretboard-preview";
    fretboard.appendChild(builder.build(diagram, instrument, chordTones));
    example.appendChild(fretboard);

    const noteList = document.createElement("p");
    noteList.className = "note-list";
    noteList.innerHTML = '<span>CHORD TONES</span><strong>B</strong><strong>D</strong><strong>F#</strong><strong>A</strong>';
    example.appendChild(noteList);

    panel.appendChild(example);
    container?.appendChild(panel);
});