<template>
  <div class="container mx-auto px-4 py-8 max-w-4xl">
    <h1 class="text-3xl font-bold mb-8">Privacy Policy</h1>
    
    <div class="prose prose-base dark:prose-invert max-w-none text-sm">
      <p class="text-gray-600 dark:text-gray-400 mb-6">Last updated: {{ new Date().toLocaleDateString() }}</p>
      
      <section class="mb-8">
        <h2 class="text-2xl font-semibold mb-4">1. Information We Collect</h2>
        <p>SendSol collects minimal information to provide our service:</p>
        <h3 class="text-xl font-medium mt-4 mb-2">Information You Provide:</h3>
        <ul>
          <li>Project details when creating fundraising campaigns</li>
          <li>Wallet addresses you connect to the platform</li>
          <li>Contact information if you reach out for support</li>
        </ul>
        
        <h3 class="text-xl font-medium mt-4 mb-2">Automatically Collected:</h3>
        <ul>
          <li>Browser type and device information</li>
          <li>Usage analytics and app performance data</li>
          <li>IP address and approximate location</li>
        </ul>
      </section>

      <section class="mb-8">
        <h2 class="text-2xl font-semibold mb-4">2. How We Use Your Information</h2>
        <p>We use collected information to:</p>
        <ul>
          <li>Provide and maintain the SendSol platform</li>
          <li>Display your projects to potential donors</li>
          <li>Improve user experience and app functionality</li>
          <li>Respond to support requests</li>
          <li>Comply with legal requirements</li>
        </ul>
      </section>

      <section class="mb-8">
        <h2 class="text-2xl font-semibold mb-4">3. Blockchain Data</h2>
        <p>Important notes about blockchain transactions:</p>
        <ul>
          <li>All transactions are public on the Solana blockchain</li>
          <li>Wallet addresses and transaction amounts are publicly visible</li>
          <li>SendSol does not control or modify blockchain data</li>
          <li>Transaction history is permanently recorded</li>
        </ul>
      </section>

      <section class="mb-8">
        <h2 class="text-2xl font-semibold mb-4">4. Information Sharing</h2>
        <p>We do not sell your personal information. We may share data:</p>
        <ul>
          <li>With service providers who help operate our platform</li>
          <li>When required by law or legal process</li>
          <li>In connection with a business transaction</li>
          <li>With your explicit consent</li>
        </ul>
      </section>

      <section class="mb-8">
        <h2 class="text-2xl font-semibold mb-4">5. Data Security</h2>
        <p>We implement security measures to protect your information:</p>
        <ul>
          <li>Encrypted data transmission</li>
          <li>Secure cloud infrastructure</li>
          <li>Regular security assessments</li>
          <li>Limited access to personal data</li>
        </ul>
      </section>

      <section class="mb-8">
        <h2 class="text-2xl font-semibold mb-4">6. Your Rights</h2>
        <p>You have the right to:</p>
        <ul>
          <li>Access your personal information</li>
          <li>Request correction of inaccurate data</li>
          <li>Request deletion of your account</li>
          <li>Opt out of non-essential communications</li>
        </ul>
      </section>

      <section class="mb-8">
        <h2 class="text-2xl font-semibold mb-4">7. Third-Party Services</h2>
        <p>SendSol integrates with third-party services:</p>
        <ul>
          <li>Solana wallet providers (Phantom, Solflare, etc.)</li>
          <li>Analytics services for app improvement</li>
          <li>Cloud infrastructure providers</li>
        </ul>
        <p>Each service has its own privacy policy that governs their data practices.</p>
      </section>

      <section class="mb-8">
        <h2 class="text-2xl font-semibold mb-4">8. Changes to Privacy Policy</h2>
        <p>We may update this Privacy Policy periodically. We will notify users of significant changes through the app or email.</p>
      </section>

      <section class="mb-8">
        <h2 class="text-2xl font-semibold mb-4">9. Contact Us</h2>
        <p>If you have questions about this Privacy Policy or our data practices, contact us at:</p>
        <p>Email: support@sendsol.app</p>
      </section>
    </div>
  </div>
</template>

<script setup>
// SEO
useHead({
  title: 'Privacy Policy - SendSol',
  meta: [
    { name: 'description', content: 'Privacy Policy for SendSol - How we protect your data on our Solana crowdfunding platform' }
  ]
})
</script>