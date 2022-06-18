const parser = require("../src/parser");

test("parseTime", () => {
    expect(parser.parseTime("1min")).toEqual(["1min",60000]);
    expect(parser.parseTime("1sec")).toEqual(["1sec",1000]);
    expect(parser.parseTime("5min")).toEqual(["5min",300000]);
    expect(parser.parseTime("5sec")).toEqual(["5sec",5000]);
    expect(() => {parser.parseTime("min")}).toThrow();
    expect(() => {parser.parseTime("1")}).toThrow();
    expect(() => {parser.parseTime("1hour")}).toThrow();
});

test("parseSequence", () => {
    expect(parser.parseSequence("1min")).toEqual([["1min",60000]]);
    expect(parser.parseSequence("1 min > 1 sec > 5min > 5 sec")).toEqual([["1min",60000],["1sec",1000],["5min",300000],["5sec",5000]]);
    expect(() => {parser.parseSequence("1min > 1 sec > 1 hour")}).toThrow();
    expect(() => {parser.parseSequence("1min < 1 sec < 1 hour")}).toThrow();
});
