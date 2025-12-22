import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <Link to="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-3xl font-bold text-foreground mb-6">Privacy Policy</h1>
        <p className="text-muted-foreground mb-4">Last updated: {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>

        <div className="prose prose-neutral dark:prose-invert max-w-none space-y-6 text-foreground">
          <section>
            <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
            <p className="text-muted-foreground">
              Welcome to Dishtail ("we," "our," or "us"). We are committed to protecting your personal information 
              and your right to privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard 
              your information when you visit our website and use our services.
            </p>
            <p className="text-muted-foreground">
              By using Dishtail, you agree to the collection and use of information in accordance with this policy. 
              If you do not agree with our policies, please do not use our services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">2. Information We Collect</h2>
            <h3 className="text-xl font-medium mb-2">Personal Information</h3>
            <p className="text-muted-foreground">When you create an account, we may collect:</p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-1">
              <li>Email address</li>
              <li>Password (encrypted)</li>
              <li>Saved recipes and preferences</li>
            </ul>

            <h3 className="text-xl font-medium mb-2 mt-4">Automatically Collected Information</h3>
            <p className="text-muted-foreground">When you visit our website, we automatically collect:</p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-1">
              <li>IP address and location data</li>
              <li>Browser type and version</li>
              <li>Device information</li>
              <li>Pages visited and time spent on pages</li>
              <li>Referring website addresses</li>
              <li>Search queries and ingredients entered</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">3. Use of Cookies and Third-Party Advertising</h2>
            <p className="text-muted-foreground">
              We use cookies and similar tracking technologies to enhance your experience on our website. 
              Additionally, we use third-party advertising services, including Google AdSense, to display 
              advertisements on our site.
            </p>
            <h3 className="text-xl font-medium mb-2 mt-4">Third-Party Cookies for Advertising</h3>
            <p className="text-muted-foreground">
              Third-party vendors, including Google, use cookies to serve ads based on your prior visits to 
              our website or other websites. Google's use of advertising cookies enables it and its partners 
              to serve ads to you based on your visit to our site and/or other sites on the Internet.
            </p>
            <p className="text-muted-foreground mt-2">
              You may opt out of personalised advertising by visiting{" "}
              <a href="https://www.google.com/settings/ads" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">
                Google Ads Settings
              </a>. Alternatively, you can opt out of third-party vendors' use of cookies by visiting{" "}
              <a href="https://www.aboutads.info/choices/" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">
                www.aboutads.info/choices
              </a>.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">4. How We Use Your Information</h2>
            <p className="text-muted-foreground">We use the information we collect to:</p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-1">
              <li>Provide and maintain our recipe search service</li>
              <li>Allow you to save and access your favourite recipes</li>
              <li>Improve and personalise your experience</li>
              <li>Send you updates and marketing communications (with your consent)</li>
              <li>Display relevant advertisements</li>
              <li>Analyse website usage and trends</li>
              <li>Detect, prevent, and address technical issues</li>
            </ul>
          </section>

          <section className="bg-secondary/30 p-6 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">5. For Users in the European Union (GDPR)</h2>
            <p className="text-muted-foreground">
              If you are a resident of the European Economic Area (EEA) or United Kingdom, you have certain 
              data protection rights under the General Data Protection Regulation (GDPR) and UK GDPR.
            </p>
            <h3 className="text-xl font-medium mb-2 mt-4">Your Rights</h3>
            <ul className="list-disc pl-6 text-muted-foreground space-y-1">
              <li><strong>Right to Access:</strong> You can request copies of your personal data</li>
              <li><strong>Right to Rectification:</strong> You can request correction of inaccurate data</li>
              <li><strong>Right to Erasure:</strong> You can request deletion of your personal data</li>
              <li><strong>Right to Restrict Processing:</strong> You can request we limit how we use your data</li>
              <li><strong>Right to Data Portability:</strong> You can request transfer of your data</li>
              <li><strong>Right to Object:</strong> You can object to our processing of your data</li>
              <li><strong>Right to Withdraw Consent:</strong> You can withdraw consent at any time</li>
            </ul>
            <h3 className="text-xl font-medium mb-2 mt-4">Legal Basis for Processing</h3>
            <p className="text-muted-foreground">We process your data based on:</p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-1">
              <li>Your consent (for marketing and personalised advertising)</li>
              <li>Performance of a contract (to provide our services)</li>
              <li>Legitimate interests (to improve our services and for security)</li>
            </ul>
            <p className="text-muted-foreground mt-4">
              To exercise these rights, please contact us at manish.baphna@gmail.com. We will respond within 
              30 days as required by law.
            </p>
          </section>

          <section className="bg-secondary/30 p-6 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">6. For Users in the United States (CCPA/CPRA)</h2>
            <p className="text-muted-foreground">
              If you are a California resident, you have specific rights under the California Consumer Privacy 
              Act (CCPA) and California Privacy Rights Act (CPRA).
            </p>
            <h3 className="text-xl font-medium mb-2 mt-4">Your Rights Under CCPA/CPRA</h3>
            <ul className="list-disc pl-6 text-muted-foreground space-y-1">
              <li><strong>Right to Know:</strong> You can request information about the personal data we collect, use, and share</li>
              <li><strong>Right to Delete:</strong> You can request deletion of your personal information</li>
              <li><strong>Right to Opt-Out:</strong> You can opt out of the sale or sharing of your personal information</li>
              <li><strong>Right to Non-Discrimination:</strong> We will not discriminate against you for exercising your rights</li>
              <li><strong>Right to Correct:</strong> You can request correction of inaccurate personal information</li>
              <li><strong>Right to Limit:</strong> You can limit the use of sensitive personal information</li>
            </ul>
            <h3 className="text-xl font-medium mb-2 mt-4">Categories of Personal Information Collected</h3>
            <p className="text-muted-foreground">
              In the past 12 months, we have collected: identifiers (email address), internet activity information 
              (browsing history, search history), and inferences (preferences based on usage).
            </p>
            <p className="text-muted-foreground mt-4">
              <strong>Do Not Sell My Personal Information:</strong> We do not sell your personal information. 
              However, we do use third-party advertising services that may constitute "sharing" under CPRA. 
              You may opt out of personalised advertising as described in Section 3.
            </p>
            <p className="text-muted-foreground mt-2">
              To exercise your rights, contact us at manish.baphna@gmail.com or call us. We will verify your 
              identity and respond within 45 days.
            </p>
          </section>

          <section className="bg-secondary/30 p-6 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">7. For Users in the United Kingdom</h2>
            <p className="text-muted-foreground">
              Users in the United Kingdom are protected under the UK General Data Protection Regulation (UK GDPR) 
              and the Data Protection Act 2018. You have the same rights as outlined in Section 5 for EU users.
            </p>
            <p className="text-muted-foreground mt-2">
              If you have concerns about how we handle your data, you have the right to lodge a complaint with 
              the Information Commissioner's Office (ICO) at{" "}
              <a href="https://ico.org.uk" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">
                ico.org.uk
              </a>.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">8. Data Retention</h2>
            <p className="text-muted-foreground">
              We retain your personal information for as long as your account is active or as needed to provide 
              you services. We will retain and use your information as necessary to comply with legal obligations, 
              resolve disputes, and enforce our agreements. Analytics data is typically retained for 26 months.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">9. Data Security</h2>
            <p className="text-muted-foreground">
              We implement appropriate technical and organisational security measures to protect your personal 
              information against unauthorised access, alteration, disclosure, or destruction. These measures 
              include encryption, secure servers, and regular security assessments.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">10. Children's Privacy</h2>
            <p className="text-muted-foreground">
              Our service is not directed to children under 16 years of age (or 13 in the US). We do not 
              knowingly collect personal information from children. If we become aware that we have collected 
              personal data from a child without parental consent, we will take steps to delete that information.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">11. International Data Transfers</h2>
            <p className="text-muted-foreground">
              Your information may be transferred to and processed in countries other than your own. We ensure 
              appropriate safeguards are in place for such transfers, including Standard Contractual Clauses 
              approved by the European Commission or UK government.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">12. Changes to This Policy</h2>
            <p className="text-muted-foreground">
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting 
              the new Privacy Policy on this page and updating the "Last updated" date. You are advised to 
              review this Privacy Policy periodically for any changes.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">13. Contact Us</h2>
            <p className="text-muted-foreground">
              If you have any questions about this Privacy Policy or our data practices, please contact us at:
            </p>
            <p className="text-muted-foreground mt-2">
              <strong>Email:</strong> manish.baphna@gmail.com<br />
              <strong>Contact Page:</strong>{" "}
              <Link to="/contact" className="text-primary hover:underline">Contact Us</Link>
            </p>
          </section>
        </div>
      </main>

      <footer className="border-t border-border py-6 mt-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground text-sm">
          <p>© {new Date().getFullYear()} Dishtail — Find Recipes by Ingredients</p>
        </div>
      </footer>
    </div>
  );
};

export default PrivacyPolicy;