import yargs from "yargs";
import parser from "yargs-parser";
import { validateArguments } from "../src";
import { ISchema } from "@xogeny/ts-schema";
import Ajv from "ajv";

describe("Test processing of JSON schema into argument specification", () => {
    it("should run yargs-parser", () => {
        const result = parser(["task", "--foo", "45"]);
        expect(result).toEqual({ _: ["task"], foo: 45 });
    });
    it("should validate argument", async () => {
        const errors = await validateArguments(["--foo", "45", "--bar.y", "7"], {
            properties: {
                foo: { type: "number" },
                bar: {
                    type: "object",
                    properties: {
                        y: { type: "number" },
                    },
                    required: ["y"],
                },
            },
        });
        expect(errors).toEqual([]);
    });
    it("should flag missing parameter", async () => {
        const errors = await validateArguments(["--foo", "45", "--bar.x", "7"], {
            properties: {
                foo: { type: "number" },
                bar: {
                    type: "object",
                    properties: {
                        y: { type: "number" },
                    },
                    required: ["y"],
                },
            },
        });
        expect(errors).toEqual([".bar should have required property 'y' (required)"]);
    });
    it("should validate", async () => {
        const ajv = new Ajv();
        var schema = {
            properties: {
                smaller: {
                    type: "number",
                    maximum: 6,
                },
                larger: { type: "number" },
            },
        };

        var validData = {
            smaller: 5,
            larger: 7,
        };

        const foo = ajv.validate(schema, validData); // true
        expect(foo).toEqual(true);
        expect(ajv.errors).toEqual(null);
    });
});
