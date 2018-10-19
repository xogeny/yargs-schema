module.exports = {
    verbose: true,
    transform: {
        "^.+\\.tsx?$": "ts-jest",
    },
    testRegex: "(/test/.*|(\\.|/)(test|spec))\\Tests.(tsx?)$",
    moduleFileExtensions: ["js", "jsx", "ts", "tsx", "json", "node"],
};
