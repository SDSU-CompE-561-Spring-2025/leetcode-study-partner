"use client";

import React from "react";
import { useInView } from "react-intersection-observer";

const Section = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section
      ref={ref}
      className={`transition-opacity duration-700 ease-in-out ${
        inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      } space-y-4`}
    >
      <h2 className="text-lg font-semibold">{title}</h2>
      {children}
    </section>
  );
};

export function TermsAndConditions() {
  return (
    <section className="px-4 py-10 md:px-8 md:py-16 lg:py-20 text-foreground">
      <div className="mx-auto max-w-4xl space-y-12 text-sm text-left leading-relaxed">
        <header className="space-y-2 border-b border-muted-foreground/20 pb-4">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            Terms and Conditions
          </h1>
          <p className="text-muted-foreground">
            <strong>Last updated:</strong> April 30, 2025
          </p>
          <p>
            Please read these terms and conditions carefully before using our service.
          </p>
        </header>

        <Section title="Interpretation and Definitions">
          <h3 className="font-semibold">Interpretation</h3>
          <p>
            The words of which the initial letter is capitalized have meanings defined under the following conditions. The following definitions shall have the same meaning regardless of whether they appear in singular or plural.
          </p>
          <h3 className="font-semibold">Definitions</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Affiliate</strong> means an entity that controls, is controlled by, or is under common control with a party...</li>
            <li><strong>Country</strong> refers to: California, United States</li>
            <li><strong>Company</strong> refers to MeetCode.</li>
            <li><strong>Device</strong> means any device that can access the service...</li>
            <li><strong>Service</strong> refers to the website.</li>
            <li><strong>Terms and conditions</strong> means these terms...</li>
            <li><strong>Third-party social media service</strong> means services provided by a third-party...</li>
            <li><strong>Website</strong> refers to MeetCode, accessible from http://localhost:3000</li>
            <li><strong>you</strong> means the individual accessing or using the service...</li>
          </ul>
        </Section>

        <Section title="Acknowledgment">
          <p>
            These are the terms and conditions governing the use of this service and the agreement that operates between you and the company. These terms set out the rights and obligations of all users regarding use of the service.
          </p>
          <p>
            Your access to and use of the service is conditioned on your acceptance of and compliance with these terms. These terms apply to all visitors, users, and others who access or use the service.
          </p>
        </Section>

        <Section title="User Accounts and Interaction">
          <p>
            When you create an account with us, you must provide information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the terms, which may result in immediate termination of your account.
          </p>
          <p>
            You are responsible for safeguarding the password that you use to access the service and for any activities or actions under your password.
          </p>
          <p>
            You agree not to disclose your password to any third party. You must notify us immediately upon becoming aware of any security breach or unauthorized use of your account.
          </p>
          <p>
            You agree to use interaction features respectfully and lawfully. Harassment, abuse, impersonation, or harmful behavior toward others is prohibited. We may suspend or remove accounts at our discretion.
          </p>
        </Section>

        <Section title="Links to Other Websites">
          <p>
            Our service may contain links to third-party websites or services that are not owned or controlled by the company. We are not responsible for the content, privacy policies, or practices of any third-party websites.
          </p>
          <p>
            We recommend reviewing the terms and conditions and privacy policies of any third-party services you visit.
          </p>
        </Section>

        <Section title="Termination">
          <p>
            We may terminate or suspend your access immediately, without prior notice or liability, for any reason including if you breach these terms. Upon termination, your right to use the service will cease immediately.
          </p>
        </Section>

        <Section title="Limitation of Liability">
          <p>
            To the maximum extent permitted by applicable law, the company shall not be liable for any indirect, incidental, special, or consequential damages, including loss of data or profits, business interruption, or personal injury.
          </p>
          <p>
            In no event shall our total liability exceed the amount you paid through the service or $100 if no purchase was made.
          </p>
        </Section>

        <Section title="“As Is” and “As Available” Disclaimer">
          <p>
            The service is provided to you "as is" and "as available" with all faults and without warranty. We make no representations that the service will meet your needs, be uninterrupted, or be free from errors or harmful components.
          </p>
        </Section>

        <Section title="Governing Law">
          <p>
            These terms shall be governed by the laws of California, United States, excluding conflict of law principles. You may also be subject to local, state, or international laws depending on your location.
          </p>
        </Section>

        <Section title="Disputes Resolution">
          <p>
            If you have a dispute or concern about the service, you agree to first attempt to resolve it informally by contacting the company.
          </p>
        </Section>

        <Section title="For European Union (EU) Users">
          <p>
            If you are a consumer in the EU, you will benefit from any mandatory provisions of the law of the country in which you reside.
          </p>
        </Section>

        <Section title="United States Legal Compliance">
          <p>
            You represent and warrant that (i) you are not located in a country subject to U.S. government sanctions, and (ii) you are not on any U.S. government list of prohibited or restricted parties.
          </p>
        </Section>

        <Section title="Severability and Waiver">
          <h3 className="font-semibold">Severability</h3>
          <p>
            If any provision is held to be unenforceable, it will be modified to reflect the original intent as closely as possible. All other provisions will remain in effect.
          </p>
          <h3 className="font-semibold">Waiver</h3>
          <p>
            The failure to enforce any right or require performance at any time does not waive that right. A waiver of any breach does not waive any subsequent breach.
          </p>
        </Section>

        <Section title="Translation Interpretation">
          <p>
            These terms may have been translated. In the event of a dispute, the original English version shall prevail.
          </p>
        </Section>

        <Section title="Changes to These Terms and Conditions">
          <p>
            We may update these terms at any time. If the changes are material, we will provide at least 30 days' notice. Continued use of the service means you accept the new terms.
          </p>
        </Section>

        <Section title="Contact Us">
          <p>
            If you have any questions, you can contact us by visiting this page on our website:
          </p>
          <ul className="list-disc pl-6">
            <li>
              {" "}
              <a
                href="http://localhost:3000/contact"
                className="text-blue-500 underline hover:text-blue-400"
              >
                http://localhost:3000/contact
              </a>
            </li>
          </ul>
        </Section>
      </div>
    </section>
  );
}
