import { ChordAliases } from "../diagramCollection/ChordAliases";

test.each`
    name     | expected
    ${"Bbb"} | ${"A"}
    ${"Cb"}  | ${"B"}
    ${"C"}   | ${"C"}
    ${"D"}   | ${"D"}
    ${"E"}   | ${"E"}
    ${"F"}   | ${"F"}
    ${"G"}   | ${"G"}
`("get the alias for the chord", ({ name, expected }) => {
    const result = ChordAliases.getNoteAlias(name);
    expect(name).toMatchObject(expected);
});
