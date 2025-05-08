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

export function PrivacyPolicy() {
  return (
    <section className="px-4 py-10 md:px-8 md:py-16 lg:py-20 text-foreground">
      <div className="mx-auto max-w-4xl space-y-12 text-sm text-left leading-relaxed">
        <header className="space-y-2 border-b border-muted-foreground/20 pb-4">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-muted-foreground">
            <strong>Last updated:</strong> May 01, 2025
          </p>
          <p>
            This Privacy Policy describes our policies on the collection, use, and disclosure of your information when you use the service, and explains your privacy rights and legal protections.
          </p>
        </header>

        <Section title="Interpretation and Definitions">
          <h3 className="font-semibold">Interpretation</h3>
          <p>
            Words with capitalized initials have specific meanings defined below, and apply equally in singular or plural.
          </p>
          <h3 className="font-semibold">Definitions</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Account</strong>: a unique profile created to access our service.</li>
            <li><strong>Affiliate</strong>: any entity under common control with us.</li>
            <li><strong>Company</strong>: refers to MeetCode, also "we", "us", or "our".</li>
            <li><strong>Cookies</strong>: small data files placed on your device.</li>
            <li><strong>Country</strong>: California, United States.</li>
            <li><strong>Device</strong>: any technology used to access the service.</li>
            <li><strong>Personal Data</strong>: information identifying an individual.</li>
            <li><strong>Service</strong>: the website at MeetCode.com.</li>
            <li><strong>Service Provider</strong>: third parties that help provide or analyze the service.</li>
            <li><strong>Usage Data</strong>: data automatically collected from the service.
            </li>
            <li><strong>You</strong>: the user of the service, either as an individual or on behalf of a company.
            </li>
          </ul>
        </Section>

        <Section title="Collecting and Using Your Personal Data">
          <h3 className="font-semibold">Types of Data Collected</h3>
          <ul className="list-disc pl-6">
            <li>Email address</li>
            <li>Usage data (IP address, browser type, device ID, etc.)</li>
          </ul>
          <h3 className="font-semibold">Third-Party Social Media Services</h3>
          <p>
            You may log in using services like Google or GitHub. We may access data you grant through these platforms.
          </p>
        </Section>

        <Section title="Tracking Technologies and Cookies">
          <p>
            We use cookies and similar technologies (like beacons and scripts) to improve service experience and analyze usage.
          </p>
          <ul className="list-disc pl-6">
            <li><strong>Necessary Cookies:</strong> essential for service operation.</li>
            <li><strong>Notice Acceptance Cookies:</strong> track cookie consent.</li>
            <li><strong>Functionality Cookies:</strong> remember your preferences.</li>
          </ul>
        </Section>

        <Section title="Use of Your Personal Data">
          <ul className="list-disc pl-6">
            <li>To provide, maintain, and improve the service.</li>
            <li>To manage user accounts and registrations.</li>
            <li>To fulfill contracts and transactions.</li>
            <li>To send updates, support notices, or service communications.</li>
            <li>For analytics and service improvement.</li>
          </ul>
        </Section>

        <Section title="Sharing Your Information">
          <p>We may share data:</p>
          <ul className="list-disc pl-6">
            <li>With service providers for operations and analytics.</li>
            <li>During business transfers or mergers.</li>
            <li>With affiliates or business partners.</li>
            <li>With your consent.</li>
          </ul>
        </Section>

        <Section title="Retention and Transfer of Data">
          <p>
            We retain data only as long as necessary. Data may be transferred to locations outside your region, but we take measures to ensure it remains protected.
          </p>
        </Section>

        <Section title="Your Data Rights">
          <p>
            You can delete or request deletion of your data by accessing account settings or contacting us directly.
          </p>
        </Section>

        <Section title="Disclosure and Legal Compliance">
          <ul className="list-disc pl-6">
            <li>To comply with legal obligations.</li>
            <li>To protect our rights or prevent harm.</li>
            <li>To cooperate with public authorities.</li>
          </ul>
        </Section>

        <Section title="Security of Your Personal Data">
          <p>
            While we use reasonable measures to protect data, no system is 100% secure. Use the service with awareness of this limitation.
          </p>
        </Section>

        <Section title="Children’s Privacy">
          <p>
            We do not knowingly collect information from children under 13. If we become aware of such collection, we will delete it promptly.
          </p>
        </Section>

        <Section title="Links to Other Websites">
          <p>
            We are not responsible for third-party sites linked from our service. Please review their privacy policies.
          </p>
        </Section>

        <Section title="Changes to this Privacy Policy">
          <p>
            We may revise this policy at any time. We will notify users of material updates and post the latest revision date at the top.
          </p>
        </Section>

        <Section title="Contact Us">
          <p>If you have questions, visit:</p>
          <ul className="list-disc pl-6">
            <li>
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
