import { helpers } from 'vuelidate/lib/validators';

export const nameRegex = helpers.regex('nameRegex', /^[a-zA-Z.\-'ßáéíóöőúüű ]*$/);
export const serviceNameRegex = helpers.regex('nameRegex', /^[a-zA-Z0-9.\-'_!?%=/*;()+",$ßáéíóöőúüű ]*$/);
