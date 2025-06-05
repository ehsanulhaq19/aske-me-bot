/// <reference types="react" />
/// <reference types="formik" />
/// <reference types="yup" />
/// <reference types="@chakra-ui/react" />
/// <reference types="react-icons" />

declare module '@chakra-ui/react' {}
declare module 'formik' {}
declare module 'yup' {}
declare module 'react-icons/fi' {}

interface FormikHelpers<Values> {
  setStatus: (status?: any) => void;
  setErrors: (errors: { [key in keyof Values]?: string }) => void;
  setSubmitting: (isSubmitting: boolean) => void;
  setTouched: (touched: { [key in keyof Values]?: boolean }) => void;
  setValues: (values: Values) => void;
  setFieldValue: (field: keyof Values, value: any) => void;
  setFieldError: (field: keyof Values, message: string) => void;
  setFieldTouched: (field: keyof Values, isTouched?: boolean) => void;
  validateForm: () => Promise<{ [key in keyof Values]?: string }>;
  validateField: (field: keyof Values) => Promise<string | undefined>;
  resetForm: (nextState?: Partial<{ values: Values }>) => void;
  submitForm: () => Promise<void>;
} 