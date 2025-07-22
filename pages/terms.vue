<template>
  <div class="container mx-auto px-4 py-8 max-w-4xl">
    <h1 class="text-3xl font-bold mb-8">Terms of Service</h1>
    
    <div class="prose prose-base dark:prose-invert max-w-none text-sm">
      <p class="text-gray-600 dark:text-gray-400 mb-6">Last updated: {{ new Date().toLocaleDateString() }}</p>
      
      <section class="mb-8">
        <h2 class="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
        <p>By accessing and using SendSol, you accept and agree to be bound by the terms and provision of this agreement.</p>
      </section>

      <section class="mb-8">
        <h2 class="text-2xl font-semibold mb-4">2. Description of Service</h2>
        <p>SendSol is a mobile-first Solana crowdfunding platform that enables users to:</p>
        <ul>
          <li>Create fundraising projects on the Solana blockchain</li>
          <li>Send and receive SOL donations</li>
          <li>Connect multiple Solana wallets</li>
          <li>Organize transactions by project</li>
        </ul>
      </section>

      <section class="mb-8">
        <h2 class="text-2xl font-semibold mb-4">3. User Responsibilities</h2>
        <p>As a user of SendSol, you agree to:</p>
        <ul>
          <li>Provide accurate information when creating projects</li>
          <li>Use the platform only for lawful purposes</li>
          <li>Not engage in fraudulent or misleading fundraising activities</li>
          <li>Secure your wallet and private keys</li>
        </ul>
      </section>

      <section class="mb-8">
        <h2 class="text-2xl font-semibold mb-4">4. Blockchain Transactions</h2>
        <p>You acknowledge that:</p>
        <ul>
          <li>All transactions are recorded on the Solana blockchain</li>
          <li>Blockchain transactions are generally irreversible</li>
          <li>SendSol does not control the Solana network</li>
          <li>Transaction fees and processing times depend on network conditions</li>
        </ul>
      </section>

      <section class="mb-8">
        <h2 class="text-2xl font-semibold mb-4">5. Limitation of Liability</h2>
        <p>SendSol is provided "as is" without warranties. We are not liable for:</p>
        <ul>
          <li>Loss of funds due to user error</li>
          <li>Network outages or blockchain issues</li>
          <li>Third-party wallet malfunctions</li>
          <li>Project outcomes or fund misuse by project creators</li>
        </ul>
      </section>

      <section class="mb-8">
        <h2 class="text-2xl font-semibold mb-4">6. Privacy</h2>
        <p>Your privacy is important to us. Please review our Privacy Policy to understand how we collect and use your information.</p>
      </section>

      <section class="mb-8">
        <h2 class="text-2xl font-semibold mb-4">7. Changes to Terms</h2>
        <p>We reserve the right to modify these terms at any time. Continued use of SendSol constitutes acceptance of modified terms.</p>
      </section>

      <section class="mb-8">
        <h2 class="text-2xl font-semibold mb-4">8. Contact Information</h2>
        <p>If you have questions about these Terms of Service, please contact us at support@sendsol.app</p>
      </section>
    </div>
  </div>
</template>

<script setup>
// SEO
useHead({
  title: 'Terms of Service - SendSol',
  meta: [
    { name: 'description', content: 'Terms of Service for SendSol - Solana crowdfunding platform' }
  ]
})
</script>