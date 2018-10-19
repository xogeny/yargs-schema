import yargs from "yargs";
import { ISchema } from "@xogeny/ts-schema";

/**
 * This function, unlike `validateArguments`, is much more restrictive.  It
 * doesn't give you the full power of JSON Schema.  Instead, it is limited to
 * JSON Schemas that include **no nested values** and only the native Javascript
 * things (*i.e.,* "string", "number", "boolean").
 *
 * @param schema JSON Schema
 * @param strict Be strict, even if additionalProperties isn't set
 */
export function yargsFromSchema(schema: ISchema, strict?: boolean): yargs.Argv {
    if (schema.type !== "object") {
        throw new Error("yargsFromSchema only supports schemas that correspond to unnested objects");
    }

    if (!schema.properties) {
        throw new Error("yargsFromSchema requires properties to be specified");
    }

    const properties = schema.properties;
    const keys = Object.keys(properties);
    const required = schema.required || [];
    let ret = yargs.fail((msg, err) => {
        console.error(`Failure: ${msg}`);
    });

    keys.forEach(key => {
        const type = properties[key].type;
        if (type === "string" || type === "boolean" || type === "number") {
            const description = properties[key].description;
            const def = properties[key].default;
            if (description) ret = ret.describe(key, description);
            if (def !== undefined) ret = ret.default(key, def);
            if (type === "string") ret = ret.string(key);
            else if (type === "boolean") ret = ret.boolean(key);
            else if (type === "number") ret = ret.number(key);
            ret = ret.require(key, required.indexOf(key) >= 0);
        } else {
            throw new Error(`yargsFromSchema cannot currently handle properties of type ${type} (${key})`);
        }
    });

    // I think this devi
    if (schema.additionalProperties === true) {
        ret = ret.strict();
    } else if (schema.additionalProperties === false) {
    } else if (schema.additionalProperties === undefined) {
        if (strict) {
            ret = ret.strict();
        } else {
            console.warn(
                "No value provided for additionalProperties, default behavior (per JSON Schema specification) is to allow additional properties...is that really what you want?",
            );
        }
    } else {
        throw new Error("yargsFromSchema can only handle boolean values from 'additionalProperties'");
    }

    return ret;
}
