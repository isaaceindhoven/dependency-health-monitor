import 'cypress-file-upload';

import { getStepsForExecutionMethod } from '../../src/helpers/steps-per-execution-method';
import { executionOptions } from '../../src/helpers/execution-options';

describe('Paste or upload page', () => {
  beforeEach(() => {
    cy.visit('/run-report');

    // Find the correct execution method card & click it
    const uploadOption = executionOptions.filter((option) => option.name === 'Upload')[0];

    cy.get(`:nth-child(2) > .surface-card`).should('have.text', uploadOption.text);
    cy.get(`:nth-child(2) > .surface-card`).click();

    // Find the next button, check if enabled and click it
    cy.get('.grid-nogutter > :nth-child(1)').contains('Next');
    cy.get('.grid-nogutter > :nth-child(1)').should('not.be.disabled');
    cy.get('.grid-nogutter > :nth-child(1)').click();
  });

  it('loads correctly', () => {
    // Text area & upload area are loaded
    cy.get('textarea').should('be.visible');
    cy.get('.p-fileupload').should('be.visible');

    // Current step is highlighted
    cy.get('#pv_id_1 > ul > .p-highlight').should((el) => {
      const activeStep = getStepsForExecutionMethod('Upload')[1];
      expect(el).to.contain(activeStep.label);
    });

    // All other steps are disabled
    cy.get('#pv_id_1 > ul > .p-disabled').should((el) => {
      expect(el).to.have.lengthOf(getStepsForExecutionMethod('Upload').length - 1);
    });
  });

  it('enables the next button whenever a correct package.json is pasted in the textarea and the textarea is left', () => {
    // Confirm that next button is disabled
    cy.get('.grid-nogutter > :nth-child(2)').contains('Next');
    cy.get('.grid-nogutter > :nth-child(2)').should('be.disabled');

    cy.fixture('example.package').then((packageJSON) => {
      // Write package.json and leave text area
      cy.get('textarea').focus().clear().type(JSON.stringify(packageJSON, undefined, 2)).blur();

      // Check if next button is enabled
      cy.get('.grid-nogutter > :nth-child(2)').should('not.be.disabled');
    });
  });

  it('shows error whenever wrong package.json is pasted in the textarea and the textarea is left', () => {
    // Confirm that next button is disabled
    cy.get('.grid-nogutter > :nth-child(2)').contains('Next');
    cy.get('.grid-nogutter > :nth-child(2)').should('be.disabled');

    // Write package.json and leave text area
    cy.get('textarea').focus().clear().type('{"test": 2').blur();

    // Check if error is given
    cy.get('.p-error').should('have.length', 1);

    // Check if next button is disabled
    cy.get('.grid-nogutter > :nth-child(2)').should('be.disabled');
  });

  it('enables the next button whenever a correct package.json is uploaded', () => {
    // Confirm that next button is disabled
    cy.get('.grid-nogutter > :nth-child(2)').contains('Next');
    cy.get('.grid-nogutter > :nth-child(2)').should('be.disabled');

    // Confirm that the upload button is disabled
    cy.get('.p-fileupload-buttonbar > :nth-child(2)').should('contain.text', 'Upload');
    cy.get('.p-fileupload-buttonbar > :nth-child(2)').should('be.disabled');

    // Upload file to the input field
    cy.get('input[type="file"]').attachFile('../fixtures/example.package.json');

    // Check if upload button is enabled & click it
    cy.get('.p-fileupload-buttonbar > :nth-child(2)').should('not.be.disabled');
    cy.get('.p-fileupload-buttonbar > :nth-child(2)').click();

    // Confirm that next button is enabled
    cy.get('.grid-nogutter > :nth-child(2)').contains('Next');
    cy.get('.grid-nogutter > :nth-child(2)').should('not.be.disabled');

    // Confirm that the uploaded file is seen as text in the textarea field
    cy.fixture('example.package').then((packageJSON) => {
      cy.get('textarea').should('have.value', JSON.stringify(packageJSON, undefined, 2));
    });
  });
});
