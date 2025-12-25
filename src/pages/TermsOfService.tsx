import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const TermsOfService = () => {
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
        <h1 className="text-3xl font-bold text-foreground mb-6">Terms of Service</h1>
        <p className="text-muted-foreground mb-4">Last updated: {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>

        <div className="prose prose-neutral dark:prose-invert max-w-none space-y-6 text-foreground">
          <section>
            <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
            <p className="text-muted-foreground">
              Welcome to Dishtail. By accessing or using our website and services, you agree to be bound by 
              these Terms of Service ("Terms"). If you do not agree to these Terms, please do not use our services.
            </p>
            <p className="text-muted-foreground">
              We reserve the right to modify these Terms at any time. Your continued use of Dishtail after 
              any changes constitutes acceptance of the new Terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">2. Description of Service</h2>
            <p className="text-muted-foreground">
              Dishtail is a recipe discovery platform that helps users find recipes based on ingredients 
              they have available. Our service aggregates recipe information from various public sources 
              and uses artificial intelligence to match your ingredients with suitable recipes.
            </p>
          </section>

          <section className="bg-secondary/30 p-6 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">3. Recipe Content and Public Domain</h2>
            <h3 className="text-xl font-medium mb-2">Source of Recipes</h3>
            <p className="text-muted-foreground">
              The recipes displayed on Dishtail are sourced from publicly available information, including 
              but not limited to: public recipe databases, user-submitted content, and AI-generated suggestions 
              based on common culinary practices.
            </p>
            
            <h3 className="text-xl font-medium mb-2 mt-4">No Claim of Ownership</h3>
            <p className="text-muted-foreground">
              We do not claim ownership of recipes that are in the public domain or are traditional dishes 
              from various cultures. Recipes, as lists of ingredients and basic instructions, are generally 
              not protected by copyright. However, specific creative expressions, such as unique descriptions, 
              photographs, or distinctive presentations may be protected.
            </p>

            <h3 className="text-xl font-medium mb-2 mt-4">Attribution</h3>
            <p className="text-muted-foreground">
              Where possible, we provide attribution to original sources. If you believe we have used content 
              that infringes on your rights, please{" "}
              <Link to="/contact" className="text-primary hover:underline">contact us</Link>{" "}
              immediately with details of the alleged infringement.
            </p>

            <h3 className="text-xl font-medium mb-2 mt-4">User Acknowledgement</h3>
            <p className="text-muted-foreground">
              By using our service, you acknowledge that:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-1">
              <li>Recipes provided are for personal, non-commercial use</li>
              <li>We make no guarantee of the accuracy or completeness of any recipe</li>
              <li>You use recipe information at your own risk</li>
              <li>Traditional recipes belong to their respective cultural heritage</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">4. User Accounts</h2>
            <p className="text-muted-foreground">
              To access certain features, you may need to create an account. You agree to:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-1">
              <li>Provide accurate and complete registration information</li>
              <li>Maintain the security of your password and account</li>
              <li>Notify us immediately of any unauthorised use of your account</li>
              <li>Accept responsibility for all activities under your account</li>
            </ul>
            <p className="text-muted-foreground mt-4">
              We reserve the right to suspend or terminate accounts that violate these Terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">5. Acceptable Use</h2>
            <p className="text-muted-foreground">You agree not to:</p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-1">
              <li>Use the service for any unlawful purpose</li>
              <li>Attempt to gain unauthorised access to our systems</li>
              <li>Interfere with or disrupt the service</li>
              <li>Scrape, copy, or reproduce our content without permission</li>
              <li>Use automated systems to access the service without our consent</li>
              <li>Transmit viruses or malicious code</li>
              <li>Impersonate others or misrepresent your affiliation</li>
            </ul>
          </section>

          <section className="bg-destructive/10 p-6 rounded-lg border border-destructive/20">
            <h2 className="text-2xl font-semibold mb-4">6. Disclaimer of Warranties</h2>
            <p className="text-muted-foreground">
              <strong>THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, 
              EITHER EXPRESS OR IMPLIED.</strong>
            </p>
            <p className="text-muted-foreground mt-4">
              We do not warrant that:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-1">
              <li>The service will be uninterrupted or error-free</li>
              <li>Recipes will be suitable for your dietary needs or restrictions</li>
              <li>Nutritional information will be accurate</li>
              <li>Recipes will produce the expected results</li>
            </ul>
            
            <h3 className="text-xl font-medium mb-2 mt-4">Food Safety and Allergies</h3>
            <p className="text-muted-foreground">
              <strong>IMPORTANT:</strong> Always use your own judgement regarding food safety. Check for 
              allergens and dietary restrictions yourself. We are not responsible for any adverse reactions, 
              allergies, or health issues arising from preparing or consuming recipes found on our platform.
            </p>
          </section>

          <section className="bg-destructive/10 p-6 rounded-lg border border-destructive/20">
            <h2 className="text-2xl font-semibold mb-4">7. Limitation of Liability</h2>
            <p className="text-muted-foreground">
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, DISHTAIL AND ITS OPERATORS SHALL NOT BE LIABLE FOR 
              ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT 
              LIMITED TO:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-1">
              <li>Loss of profits or revenue</li>
              <li>Loss of data</li>
              <li>Personal injury or health issues</li>
              <li>Property damage</li>
              <li>Any other damages arising from use of our service</li>
            </ul>
            <p className="text-muted-foreground mt-4">
              Our total liability shall not exceed the amount you paid us in the twelve months prior to 
              the claim, or £100, whichever is less.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">8. Indemnification</h2>
            <p className="text-muted-foreground">
              You agree to indemnify and hold harmless Dishtail, its operators, affiliates, and their 
              respective officers, directors, employees, and agents from any claims, damages, losses, 
              liabilities, costs, or expenses (including legal fees) arising from:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-1">
              <li>Your use of the service</li>
              <li>Your violation of these Terms</li>
              <li>Your violation of any third-party rights</li>
              <li>Any content you submit to the service</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">9. Intellectual Property</h2>
            <p className="text-muted-foreground">
              The Dishtail name, logo, website design, and original content are protected by intellectual 
              property laws. You may not use our trademarks or copyrighted materials without our prior 
              written consent.
            </p>
            <p className="text-muted-foreground mt-2">
              User-submitted content remains the property of the respective users, but by submitting 
              content, you grant us a non-exclusive, royalty-free licence to use, display, and distribute 
              such content on our platform.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">10. Third-Party Links and Services</h2>
            <p className="text-muted-foreground">
              Our service may contain links to third-party websites or services, including ingredient 
              purchasing options. We are not responsible for the content, privacy practices, or terms 
              of any third-party sites. Your use of such sites is at your own risk.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">11. Termination</h2>
            <p className="text-muted-foreground">
              We may terminate or suspend your access to the service immediately, without prior notice, 
              for any reason, including breach of these Terms. Upon termination, your right to use the 
              service ceases immediately. Provisions that by their nature should survive termination 
              shall survive.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">12. Governing Law</h2>
            <p className="text-muted-foreground">
              These Terms shall be governed by and construed in accordance with the laws of England and 
              Wales, without regard to conflict of law principles. Any disputes shall be subject to the 
              exclusive jurisdiction of the courts of England and Wales.
            </p>
            <p className="text-muted-foreground mt-2">
              For users in the European Union or United States, nothing in these Terms affects your 
              statutory consumer rights that cannot be waived or limited by contract.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">13. Severability</h2>
            <p className="text-muted-foreground">
              If any provision of these Terms is found to be unenforceable or invalid, that provision 
              shall be limited or eliminated to the minimum extent necessary, and the remaining provisions 
              shall remain in full force and effect.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">14. Entire Agreement</h2>
            <p className="text-muted-foreground">
              These Terms, together with our Privacy Policy, constitute the entire agreement between 
              you and Dishtail regarding your use of the service and supersede any prior agreements.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">15. Contact Us</h2>
            <p className="text-muted-foreground">
              If you have any questions about these Terms of Service, please{" "}
              <Link to="/contact" className="text-primary hover:underline">contact us</Link>.
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

export default TermsOfService;