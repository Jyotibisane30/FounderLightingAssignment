/// <reference types="Cypress" />
describe("testsuite to test Contact Us page", function () {
  beforeEach(() => {
    cy.visit(Cypress.env("url") + "/contact"); // This hook runs before each test case and navigate to application's contact page
    cy.wait(5000);
  });


  it("Validate the title and url of page", function () {
    cy.url().should("include", "contact");
    cy.title().should("eq", "Reach out to Founder and Lightning today");
  });


  it("Validate user can navigate to home page after clicking on home menu", function () {
    cy.get(".nav-link[aria-current='page']").click();
    // Verifying the URL has changed to the home page
    cy.url().should("eq", Cypress.env("url") + "/");
    // Verifying shown message is visible on home page
    cy.contains("We Invest in and Build B2B SaaS Companies").should("be.visible");
  });


  it("Validate user can navigate to about page after clicking on about menu", function () {
    cy.get(".nav-link[href='/about']").click();
    // Verifying the URL has changed to the about page
    cy.url().should("eq", Cypress.env("url") + "/about");
  });


  it("Validate user can navigate to our approach page after clicking on our approach menu", function () {
    cy.get("a[href='/approach']").click();
    // Verifying the URL has changed to the about page
    cy.url().should("eq", Cypress.env("url") + "/approach");
    cy.get('div.home-hero-r1').contains("We help you build EXACTLY").should("be.visible");
  });


  it("Validate user can navigate to our portfolio page after clicking on portfolio menu", function () {
    cy.get("a[href='/our-portfolio']").click();
    // Verifying the URL has changed to the portfolio page
    cy.url().should("eq", Cypress.env("url") + "/our-portfolio");
    cy.get('div.home-hero-r1').contains("We have HELPED").should("be.visible");
  });


  it("Validate Resources tab", function () {
    cy.get("#navbarDropdownMenuLink").trigger("mouseover");
    cy.get("a[href='/blog']").should("be.visible");
    cy.get("a[href='/resources/glossary']").should("be.visible"); 

  });

  it("Validate user can navigate to career page", function () {
    cy.get("a.nav-link[href='/careers']").click();
    // Verifying the URL has changed to the career page
    cy.url().should("eq", Cypress.env("url") + "/careers");
  });

  //This test case will fail as I have skipped verifying Captcha. I have always asked developer to bypass the captcha in application.
  it("Validate the form submission with valid data", function () {
    cy.fixture("validData.json").each((validdata) => {
      //first name textbox
      cy.get("input[name='firstname']").should("be.visible");
      cy.get("input[name='firstname']").clear({ force: true });
      cy.get("input[name='firstname']").type(validdata.firstName, { force: true }).should("have.value", validdata.firstName);

      //last name textbox
      cy.get("input[name='lastname']").should("be.visible");
      cy.get("input[name='lastname']").clear({ force: true });
      cy.get("input[name='lastname']").type(validdata.lastName, { force: true }).should("have.value", validdata.lastName);

      //Type valid email address
      cy.get("input[name='email']").clear({ force: true });
      cy.get("input[name='email']").type(validdata.email, { force: true }).should("have.value", validdata.email);

      //Type valid mobile number
      cy.get("input[name='mobilephone']").clear({ force: true });
      cy.get("input[name='mobilephone']").type(validdata.mobilNumber, { force: true }).should("have.value", validdata.mobilNumber);

      //Select value from dropdown
      cy.get("select[name='how_did_you_hear_about_us_']").should("be.visible");
      cy.get("select[name='how_did_you_hear_about_us_']").select("Referral", {force: true,});
      cy.get("select[name='how_did_you_hear_about_us_']").should("have.value", "Referral");

      //Enter Message
      cy.get("[name='message']").should("be.visible");
      cy.get("[name='message']").clear({ force: true });
      cy.get("[name='message']").type(validdata.message, { force: true }).should("have.value", validdata.message);

      //click send button
      cy.get('[value="Send Message >"]').click({ force: true });
      cy.contains("Thank you for your message. We'll get back to you as soon as possible.").should("be.visible");
    });
  });


  it("Validate the form submission with invalid data", function () {
    cy.fixture("invalidData.json").each((invalidData) => {
    cy.get("input[name='firstname']").clear({ force: true });
    cy.get("input[name='firstname']").type(invalidData.firstName, { force: true }).should("have.value", invalidData.firstName);
    cy.get("input[name='lastname']").clear({ force: true });
    cy.get("input[name='lastname']").type(invalidData.lastName, { force: true }).should("have.value", invalidData.lastName);

    // Type an invalid email address
    cy.get("input[name='email']").clear({ force: true });
    cy.get("input[name='email']").type(invalidData.email, { force: true }).should("have.value", invalidData.email);

    //Type an invalid mobile number
    cy.get("input[name='mobilephone']").should("be.visible");
    cy.get("input[name='mobilephone']").clear({ force: true });
    cy.get("input[name='mobilephone']").type(invalidData.mobilNumber, { force: true }).should("have.value", invalidData.mobilNumber);

    //select option from dropdown
    cy.get("select[name='how_did_you_hear_about_us_']").select("LinkedIn", {force: true});
    cy.get("select[name='how_did_you_hear_about_us_']").should("have.value", "LinkedIn");

    //Enter message
    cy.get("[name='message']").clear({ force: true });
    cy.get("[name='message']").type(invalidData.message, { force: true }).should("have.value", invalidData.message);
    cy.get('[value="Send Message >"]').click({ force: true });
    cy.get(".hs_email").should("be.visible").contains("Email must be formatted correctly.");
    cy.get(".hs-error-msg").should("be.visible").contains("Must contain only numbers, +()-. and x.");
    });
  });


  it("Validate the form submission with empty required fields", function () {
    cy.fixture("validData.json").each((validdata) => {
      //first name textbox
      cy.get("input[name='firstname']").should("be.visible");
      cy.get("input[name='firstname']").clear({ force: true });
      cy.get("input[name='firstname']").type(validdata.firstName, { force: true }).should("have.value", validdata.firstName);
      //last name textbox
      cy.get("input[name='lastname']").should("be.visible");
      cy.get("input[name='lastname']").clear({ force: true });
      cy.get("input[name='lastname']")
        .type(validdata.lastName, { force: true })
        .should("have.value", validdata.lastName);

      //click send button
      cy.get('[value="Send Message >"]').click({ force: true });
      cy.contains("Please complete all required fields.").should("be.visible");
    });
  });


  //footer links(find Us on social media) test
  it("should navigate to linkedIn page", () => {
    cy.get("a[href='https://www.linkedin.com/company/founderandlightning/']").should("have.attr", "target", "_blank");
    cy.get("a[href='https://www.linkedin.com/company/founderandlightning/']").invoke("removeAttr", "target").click();
    cy.origin("https://www.linkedin.com/company/founderandlightning/", () => {
        cy.url().should("include", "www.linkedin.com");
        cy.go("back");
    })

  });


  it("should navigate to twitter page", () => {
    cy.get("a[href='https://twitter.com/Founder_L']").should("have.attr", "target", "_blank");
    cy.get("a[href='https://twitter.com/Founder_L']").invoke("removeAttr", "target").click();
    cy.origin("https://twitter.com/Founder_L", () => {
        cy.url().should("include", "twitter.com");
        cy.go("back");
    })
  });



  it("should navigate to facebook page", () => {
    cy.get("a[href='https://www.facebook.com/founderandlightning/']").should(
      "have.attr",
      "target",
      "_blank"
    );
    cy.get("a[href='https://www.facebook.com/founderandlightning/']")
      .invoke("removeAttr", "target")
      .click();

      cy.origin("https://www.facebook.com/founderandlightning/", () => {
        cy.url().should("include", "www.facebook.com");
        cy.go("back"); // Go back to the original page
      })
  });

  it("should navigate to Instagram page", () => {
    cy.get("a[href='https://www.instagram.com/founderandlightning/']").should(
      "have.attr",
      "target",
      "_blank"
    );
    cy.get("a[href='https://www.instagram.com/founderandlightning/']")
      .invoke("removeAttr", "target")
      .click();

      cy.origin("https://www.instagram.com/founderandlightning/", () => {
        cy.url().should("include", "www.instagram.com");
        cy.go("back"); // Go back to the original page
      })
    
  });

  it("should display correct contact information", () => {
    cy.fixture("contactDetails.json").then((contactData) => {
      cy.get(".footer-data")
        .should("be.visible")
        .within(() => {
          cy.contains(contactData.email1).should("be.visible");
          cy.contains(contactData.email2).should("be.visible");
          cy.get(".col-lg-3")
            .contains(contactData.address1)
            .should("be.visible");
          cy.get(".col-lg-3")
            .contains(contactData.address2)
            .should("be.visible");
          cy.get(".col-lg-3")
            .contains(contactData.address3)
            .should("be.visible");
        });
    });
  });
});
