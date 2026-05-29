import { findManualSection, SYSTEM_MANUAL_SECTIONS } from './systemManual';

const assert = (condition: boolean, message: string) => {
  if (!condition) throw new Error(message);
};

assert(SYSTEM_MANUAL_SECTIONS.length >= 8, 'manual should cover major app areas');
assert(Boolean(findManualSection('facilities')), 'manual should include facility guide');
assert(Boolean(findManualSection('ledger')), 'manual should include ledger guide');
assert(Boolean(findManualSection('troubleshooting')), 'manual should include troubleshooting guide');
assert(
  SYSTEM_MANUAL_SECTIONS.every((section) => section.steps.length > 0 && section.notes.length > 0),
  'each manual section should include steps and notes',
);

console.log('system manual tests passed');
