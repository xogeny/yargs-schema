import { yargsFromSchema } from "../src";
import { ISchema } from "@xogeny/ts-schema";

describe("Validate the yargsFromSchema functionality", () => {
    it("should generate a yargs specification from a basic JSON Schema", () => {
        const schema: ISchema = {
            type: "object",
            properties: {
                build: { type: "string", default: "build" },
                config: { type: "string", default: "config.toml" },
                cluster: { type: "number", default: 1 },
                dryrun: { type: "boolean", default: false },
            },
        };
        let values = yargsFromSchema(schema, true).parse(["--build", "dist", "--dryrun"]);
        delete values["$0"];
        expect(values).toEqual({
            _: [],
            build: "dist",
            config: "config.toml",
            cluster: 1,
            dryrun: true,
        });
    });
});
