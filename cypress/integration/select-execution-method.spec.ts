import { executionOptions } from '../../src/helpers/execution-options';
import { getStepsForExecutionMethod } from '../../src/helpers/steps-per-execution-method';
import type { ExecutionMethod } from '../../src/helpers/types';

describe('Select execution method page', () => {
  it('loads correctly', () => {
    cy.visit('/run-report');

    executionOptions.forEach((executionOption, index) => {
      cy.get(`:nth-child(${index + 1}) > .surface-card`).should('have.text', executionOption.text);
    });
  });

  it('changes steps whenever different execution methods are selected', () => {
    const executionsMethods: ExecutionMethod[] = ['GitHub', 'Public URL', 'Upload'];

    executionsMethods.forEach((method) => {
      const steps = getStepsForExecutionMethod(method);
      const cardText = executionOptions.filter((o) => o.name === method)[0].text;

      // Select the execution method
      cy.contains(cardText).click();

      // Check if the steps are changed correctly
      steps.forEach((step, index) => {
        cy.get(`#pv_id_1 > ul > :nth-child(${index + 1})`).should((el) => {
          expect(el).to.contain(step.label);
        });
      });
    });
  });

  it('redirects to correct page whenever the next button is clicked', () => {
    const executionsMethods: ExecutionMethod[] = ['GitHub', 'Public URL', 'Upload'];

    executionsMethods.forEach((method) => {
      const steps = getStepsForExecutionMethod(method);
      const nextStep = steps[1];

      const cardText = executionOptions.filter((o) => o.name === method)[0].text;

      // Select the execution method
      cy.contains(cardText).click();

      // Click next button
      cy.get('.grid-nogutter > :nth-child(1)').contains('Next');
      cy.get('.grid-nogutter > :nth-child(1)').click();

      // Check if redirected to correct page
      cy.url().should('include', nextStep.to);

      // Click the back button to go back to starting point
      cy.get('.grid-nogutter > :nth-child(1)').contains('Back');
      cy.get('.grid-nogutter > :nth-child(1)').click();
    });
  });
});
