describe('Voting Flow', () => {
  beforeEach(() => {
    // Visit the home page before each test
    cy.visit('http://localhost:3000')
  })

  it('should display the home page with ministers', () => {
    // Check if the main title is visible
    cy.contains('Who is working? Know your Ministers').should('be.visible')
    
    // Check if the national satisfaction meter is present
    cy.contains('National Satisfaction Meter').should('be.visible')
    
    // Check if trending ministers section is present
    cy.contains('Trending Ministers').should('be.visible')
    
    // Check if all ministers section is present
    cy.contains('All Ministers').should('be.visible')
  })

  it('should navigate to a minister detail page', () => {
    // Wait for ministers to load
    cy.get('[data-testid="minister-card"]').first().click()
    
    // Should be on minister detail page
    cy.url().should('include', '/minister/')
    
    // Should see minister information
    cy.get('h1').should('be.visible')
    cy.contains('Satisfied').should('be.visible')
    cy.contains('Not Satisfied').should('be.visible')
  })

  it('should allow voting on a minister', () => {
    // Navigate to a minister page
    cy.get('[data-testid="minister-card"]').first().click()
    
    // Click the "Satisfied" button
    cy.contains('Satisfied').click()
    
    // Should show success state
    cy.contains('Satisfied').should('have.class', 'bg-green-100')
    
    // Should disable the "Not Satisfied" button
    cy.contains('Not Satisfied').should('be.disabled')
  })

  it('should prevent duplicate voting on the same day', () => {
    // Navigate to a minister page
    cy.get('[data-testid="minister-card"]').first().click()
    
    // Vote once
    cy.contains('Satisfied').click()
    
    // Try to vote again
    cy.contains('Satisfied').click()
    
    // Should still be in voted state (no change)
    cy.contains('Satisfied').should('have.class', 'bg-green-100')
  })

  it('should display trending ministers', () => {
    // Check if trending section has at least one minister
    cy.get('[data-testid="trending-minister"]').should('have.length.at.least', 1)
  })

  it('should show national satisfaction meter', () => {
    // Check if the meter is visible
    cy.get('[data-testid="national-meter"]').should('be.visible')
    
    // Should show a percentage
    cy.get('[data-testid="national-meter"]').should('contain', '%')
  })
}) 