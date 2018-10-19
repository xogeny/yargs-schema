import parser from "yargs";
import ajv from "ajv";
import { ISchema } from "@xogeny/ts-schema";

export interface ValidatedResult {
    result: {} | undefined;
    errors: string[];
}

// TODO: Better would be to walk the schema and express all the constraints
// described by the schema as yargs constraints so that you could generate a
// nice "help" message.  But this is simple and satisfies my immediate needs.
export async function validateArguments(args: string[], schema: ISchema): Promise<ValidatedResult> {
    const obj = parser(args).argv;
    delete obj["$0"];
    const validator = new ajv();
    await validator.validate(schema, obj);

    if (validator.errors) {
        const errors = validator.errors.map(
            e => `'${e.dataPath === "" ? "<root>" : e.dataPath}' ${e.message} (${e.keyword})`,
        );
        return {
            result: undefined,
            errors: errors,
        };
    }
    return {
        result: obj,
        errors: [],
    };
}
