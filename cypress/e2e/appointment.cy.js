const HomePage = {
  url: 'https://katalon-demo-cura.herokuapp.com/',
  makeAppointmentBtn: '#btn-make-appointment',
  menuToggleBtn: '#menu-toggle',
  sidebar: '#sidebar-wrapper',
  historyLink: 'a[href="history.php#history"]'
};

const LoginPage = {
  usernameInput: '#txt-username',
  passwordInput: '#txt-password',
  loginBtn: '#btn-login',
  demoUsername: 'John Doe',
  demoPassword: 'ThisIsNotAPassword'
};

const AppointmentPage = {
  facilityDropdown: '#combo_facility',
  hospitalReadmissionCheckbox: '#chk_hospotal_readmission',
  medicaidRadio: '#radio_program_medicaid',
  visitDateInput: '#txt_visit_date',
  commentInput: '#txt_comment',
  bookAppointmentBtn: '#btn-book-appointment',
};

const AppointmentConfirmationPage = {
  facilityValue: '#facility',
  hospitalReadmissionValue: '#hospital_readmission',
  programValue: '#program',
  visitDateValue: '#visit_date',
  commentValue: '#comment',
};

const HistoryPage = {
  noAppointmentText: '.col-sm-12 > p'
};

function login() {
  cy.get(LoginPage.usernameInput).type(LoginPage.demoUsername);
  cy.get(LoginPage.passwordInput).type(LoginPage.demoPassword);
  cy.get(LoginPage.loginBtn).click();
}

describe('Cura Healthcare Service Appointment Scenarios', () => {

  beforeEach(() => {
    cy.visit(HomePage.url);
  });

  // Scenario 1: Make an Appointment
  it('should make an appointment and validate the details', () => {
    cy.get(HomePage.makeAppointmentBtn).click();
    login();

    cy.get(AppointmentPage.facilityDropdown).select('Seoul CURA Healthcare Center');
    cy.get(AppointmentPage.hospitalReadmissionCheckbox).check();
    cy.get(AppointmentPage.medicaidRadio).check();

    cy.get(AppointmentPage.visitDateInput).click();
    cy.get('.datepicker-days .day').contains('30').click();

    cy.get(AppointmentPage.visitDateInput).invoke('val').then((capturedDate) => {
      cy.get(AppointmentPage.commentInput).type('CURA Healthcare Service');
      cy.get(AppointmentPage.bookAppointmentBtn).click();
      cy.get(AppointmentConfirmationPage.facilityValue).should('have.text', 'Seoul CURA Healthcare Center');
      cy.get(AppointmentConfirmationPage.hospitalReadmissionValue).should('have.text', 'Yes');
      cy.get(AppointmentConfirmationPage.programValue).should('have.text', 'Medicaid');
      cy.get(AppointmentConfirmationPage.visitDateValue).should('have.text', capturedDate); // Now 'capturedDate' will be defined
      cy.get(AppointmentConfirmationPage.commentValue).should('have.text', 'CURA Healthcare Service');
    });
  });

  // Scenario 2: Appointment history empty
  it('should show an empty appointment history for a new login', () => {
    cy.get(HomePage.makeAppointmentBtn).click();
    login();
    cy.get(HomePage.menuToggleBtn).click();
    cy.get(HomePage.sidebar).should('have.class', 'active');
    cy.contains('History').click();
    cy.get(HistoryPage.noAppointmentText).should('be.visible').and('have.text', 'No appointment.');
  });
});