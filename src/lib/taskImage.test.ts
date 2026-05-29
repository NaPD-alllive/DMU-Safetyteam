import { MAX_TASK_IMAGE_BYTES, validateTaskImageFile } from './taskImage';

const assert = (condition: boolean, message: string) => {
  if (!condition) throw new Error(message);
};

assert(
  validateTaskImageFile({ type: 'image/jpeg', size: MAX_TASK_IMAGE_BYTES }) === undefined,
  'valid task image should pass'
);

assert(
  Boolean(validateTaskImageFile({ type: 'application/pdf', size: 1000 })),
  'non-image task attachment should fail'
);

assert(
  Boolean(validateTaskImageFile({ type: 'image/png', size: MAX_TASK_IMAGE_BYTES + 1 })),
  'oversized task image should fail'
);

console.log('task image tests passed');
