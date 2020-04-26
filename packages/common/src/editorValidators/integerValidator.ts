import { Constants } from '../constants';
import { EditorValidatorOutput } from '../interfaces/editorValidatorOutput.interface';
import { EditorValidator } from '../interfaces/editorValidator.interface';

interface IntegerValidatorOptions {
  editorArgs: any;
  errorMessage?: string;
  minValue?: string | number;
  maxValue?: string | number;
  required?: boolean;
  validator?: EditorValidator;
}

export function integerValidator(inputValue: any, options: IntegerValidatorOptions): EditorValidatorOutput {
  let intNumber = !isNaN(inputValue as number) ? parseInt(inputValue, 10) : null;
  if (intNumber !== null && isNaN(intNumber)) {
    intNumber = null;
  }
  const errorMsg = options.errorMessage;
  const isRequired = options.required;
  const minValue = options.minValue;
  const maxValue = options.maxValue;
  const mapValidation = {
    '{{minValue}}': minValue,
    '{{maxValue}}': maxValue
  };
  let isValid = true;
  let outputMsg = '';

  if (options.validator) {
    return options.validator(inputValue, options.editorArgs);
  } else if (isRequired && inputValue === '') {
    isValid = false;
    outputMsg = errorMsg || Constants.VALIDATION_REQUIRED_FIELD;
  } else if (inputValue && (isNaN(inputValue as number) || !/^[+-]?\d+$/.test(inputValue))) {
    isValid = false;
    outputMsg = errorMsg || Constants.VALIDATION_EDITOR_VALID_INTEGER;
  } else if (minValue !== undefined && maxValue !== undefined && intNumber !== null && (intNumber < minValue || intNumber > maxValue)) {
    // MIN & MAX Values provided
    // when decimal value is bigger than 0, we only accept the decimal values as that value set
    // for example if we set decimalPlaces to 2, we will only accept numbers between 0 and 2 decimals
    isValid = false;
    outputMsg = errorMsg || Constants.VALIDATION_EDITOR_INTEGER_BETWEEN.replace(/{{minValue}}|{{maxValue}}/gi, (matched) => mapValidation[matched]);
  } else if (minValue !== undefined && intNumber !== null && intNumber <= minValue) {
    // MIN VALUE ONLY
    // when decimal value is bigger than 0, we only accept the decimal values as that value set
    // for example if we set decimalPlaces to 2, we will only accept numbers between 0 and 2 decimals
    isValid = false;
    outputMsg = errorMsg || Constants.VALIDATION_EDITOR_INTEGER_MIN.replace(/{{minValue}}/gi, (matched) => mapValidation[matched]);
  } else if (maxValue !== undefined && intNumber !== null && intNumber >= maxValue) {
    // MAX VALUE ONLY
    // when decimal value is bigger than 0, we only accept the decimal values as that value set
    // for example if we set decimalPlaces to 2, we will only accept numbers between 0 and 2 decimals
    isValid = false;
    outputMsg = errorMsg || Constants.VALIDATION_EDITOR_INTEGER_MAX.replace(/{{maxValue}}/gi, (matched) => mapValidation[matched]);
  }

  return { valid: isValid, msg: outputMsg };
}
