import { helpers } from '@vuelidate/validators';

const containsUppercase = helpers.withMessage(
    "Must contain at least 1 upper case character",
    (value: string) => /[A-Z]/.test(value)
);

const containsLowercase = helpers.withMessage(
    "Must contain at least 1 lower case character",
    (value: string) => /[a-z]/.test(value)
);

const containsNumber = helpers.withMessage(
    "Must contain at least 1 number",
    (value: string) => /[0-9]/.test(value)
);

export {containsUppercase, containsLowercase, containsNumber};