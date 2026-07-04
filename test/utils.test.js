const { tambah } = require("../utils");

test("2 + 2 harus sama dengan 4", () => {
    expect(tambah(2, 2)).toBe(4);
});