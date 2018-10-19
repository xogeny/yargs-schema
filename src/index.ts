import parser from "yargs";
import ajv from "ajv";
import { ISchema } from "@xogeny/ts-schema";

export async function validateArguments(args: string[], schema: ISchema) {
    const obj = parser(args).argv;
    const validator = new ajv();
    await validator.validate(schema, obj);
    if (validator.errors) {
        return validator.errors.map(e => `'${e.dataPath === "" ? "<root>" : e.dataPath}' ${e.message} (${e.keyword})`);
    }
    return [];
}
