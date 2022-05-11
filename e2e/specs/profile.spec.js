describe('Profile', () => {
  before(() => {
    cy.intercept('http://localhost:8000/**')
  })
  it('should allow user to connect', () => {
    cy.visit('/')
    cy.contains('Connect').click()
    cy.contains('MetaMask').click()
    cy.acceptMetamaskAccess()

    // replace with data-testid when design system supports it
    cy.contains('0x', {
      timeout: 15000,
    }).click()
    cy.contains('My Profile').should('be.visible')
    cy.contains('0x').click()
    cy.contains('My Profile').should('not.be.visible')
  })

  it('should allow user to search profile', () => {
    cy.visit('/')
    cy.contains('Connect').click()
    cy.contains('MetaMask').click()

    cy.get('[placeholder="Search for a name"]').type('jefflau')
    cy.get('[data-testid="search-button"]', {
      timeout: 100000,
    }).click()

    cy.get('[data-testid="address-profile-button-eth"]', {
      timeout: 25000,
    }).should('has.text', '0x866...95eEE')
  })
  it('should allow user to search profile pt 2', () => {
    cy.visit('/')
    cy.contains('Connect').click()
    cy.contains('MetaMask').click()

    cy.get('[placeholder="Search for a name"]').type('jefflau')
    cy.get('[data-testid="search-button"]', {
      timeout: 100000,
    }).click()

    cy.get('[data-testid="address-profile-button-eth"]', {
      timeout: 25000,
    }).should('has.text', '0x866...95eEE')
  })
})
