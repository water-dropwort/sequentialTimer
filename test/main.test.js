const main = require("../src/main");

test("zeroPadding", () => {
    expect(main.zeroPadding(1)).toBe("01");
    expect(main.zeroPadding(12)).toBe("12");
});

test("msec2timeformat", () => {
    expect(main.msec2timeformat(59000)).toBe("00:00:59");
    expect(main.msec2timeformat(60000)).toBe("00:01:00");
    expect(main.msec2timeformat(59*60*1000+59*1000)).toBe("00:59:59");
    expect(main.msec2timeformat(59*60*1000+60*1000)).toBe("01:00:00");
});
