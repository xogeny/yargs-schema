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
        const { result, errors } = await validateArguments(["--foo", "45", "--bar.y", "7"], {
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
        expect(result).toEqual({ _: [], foo: 45, bar: { y: 7 } });
    });
    it("should flag missing parameter", async () => {
        const { result, errors } = await validateArguments(["--foo", "45", "--bar.x", "7"], {
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
        expect(errors).toEqual(["'.bar' should have required property 'y' (required)"]);
        expect(result).toEqual(undefined);
    });
    it("should flag extra positional argument", async () => {
        const { errors } = await validateArguments(["positional", "--foo", "45", "--bar.y", "7"], {
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
            additionalProperties: false,
        });
        expect(errors).toEqual(["'<root>' should NOT have additional properties (additionalProperties)"]);
    });
    it("should validate positional argument", async () => {
        const { result, errors } = await validateArguments(["positional", "--foo", "45", "--bar.y", "7"], {
            properties: {
                foo: { type: "number" },
                bar: {
                    type: "object",
                    properties: {
                        y: { type: "number" },
                    },
                    required: ["y"],
                },
                _: { type: "array", items: [{ type: "string" }] },
            },
            additionalProperties: false,
        });
        expect(errors).toEqual([]);
        expect(result).toEqual({ _: ["positional"], foo: 45, bar: { y: 7 } });
    });
    it("should flag second positional argument", async () => {
        const { errors } = await validateArguments(["positional", "also", "--foo", "45", "--bar.y", "7"], {
            properties: {
                foo: { type: "number" },
                bar: {
                    type: "object",
                    properties: {
                        y: { type: "number" },
                    },
                    required: ["y"],
                },
                _: { type: "array", maxItems: 1, items: [{ type: "string" }] },
            },
            additionalProperties: false,
        });
        expect(errors).toEqual(["'._' should NOT have more than 1 items (maxItems)"]);
    });
    it("should validate a simple schema", async () => {
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
