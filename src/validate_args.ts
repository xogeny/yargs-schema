import yargs from "yargs";
import ajv from "ajv";
import { ISchema } from "@xogeny/ts-schema";

export interface ValidatedResult {
    result: {} | undefined;
    errors: string[];
}

/**
 * This function takes a very wide open approach to argument parsing.  It
 * takes the command line arguments and builds them into an object without any
 * (initial) regard for what possible keys and values there should be.  It then
 * validates the resulting object against a JSON Schema.  This gives you the
 * full power of JSON Schema and makes the JSON Schema the "single source of
 * truth" with respect to what constitutes valid command line arguments.
 *
 * This function returns the command line arguments represented as an object
 * *or* a list of errors the resulted during validation.
 *
 * @param args Command line arguments (e.g., ["positional1", "positional2", "--foo", "5", "--bar", "run"])
 * @param schema A JSON Schema to validate the resulting object against
 */
export async function validateArguments(args: string[], schema: ISchema): Promise<ValidatedResult> {
    const obj = yargs(args).argv;
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
