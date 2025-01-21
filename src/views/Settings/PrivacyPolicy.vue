<template>
  <div class="card rounded-box shadow-lg bg-base-100">
    <div class="card-body">
      <h2 class="card-title mb-4">Privacy Policy</h2>
      <p class="mb-2">Rights, obligations, and practices described in this Policy</p>
      <label for="privacy-policy" @click="authStore.action = 'privacy-policy'" class="btn btn-outline">Show privacy</label>
    </div>
  </div>

  <Teleport v-if="authStore.action === 'privacy-policy'" to="#modal-container">
    <input type="checkbox" id="privacy-policy" class="modal-toggle" @change="authStore.closeModal(!$event.target.checked)" />
    <label for="privacy-policy" class="modal cursor-pointer">
      <label class="modal-box relative" for="">
        <label for="privacy-policy" class="btn btn-sm btn-circle absolute right-2 top-2">✕</label>
        <h3 class="text-lg font-bold">Privacy Policy for {{ app_name }}</h3>
        <div class="flex flex-col gap-4 mt-6">
           <p>
            Welcome to {{ app_name }}! We understand how important your privacy is to you, and we want you
            to feel safe and secure when using our website. This Privacy Policy outlines how we collect,
            use, and protect your personal information.
          </p>
          <p>
            By using {{ app_name }} you accept and consent to the rights, obligations, and practices described in this Policy.
          </p>
          <ol class="list-decimal ml-4 flex flex-col gap-4 mt-4">
            <li>
              When you are just browsing our website without logging in we do not collect anyone's data
              but when you sign up we collect some information which helps us to serve advertisements to
              you that are tailored to your interests and location. We do not collect any other personal
              information about you unless you voluntarily provide it to us.
            </li>

            <li>
              How We Use Your Personal Information: We use your computer's Internet Protocol address
              and geo-location information to deliver personalised advertisements to you. We do not share
              this information with any third-party advertisers or partners. We may also use this information
              to improve our website and services.
            </li>

            <li>
              Cookies: {{ app_name }} uses cookies to collect non-personal information about your browsing
              behaviour on our website. We use this information to personalise your experience, improve
              our website, and deliver relevant advertisements to you. You can choose to disable cookies
              in your browser settings, but this may affect your ability to use our website.
            </li>

            <li>
              Third-Party Links: {{ app_name }} may contain links to third-party websites. We are not
              responsible for the privacy policies or practices of these websites. We encourage you to
              review the privacy policies of these websites before providing any personal information.
            </li>

            <li>
              Security: We take the security of your personal information seriously and have implemented
              industry-standard security measures to protect your information from unauthorised access,
              disclosure, or misuse. However, no system is completely secure, and we cannot guarantee
              the security of your personal information.
            </li>

            <li>
              Children's Privacy: {{ app_name }} is not intended for use by children under the age of 13.
              We do not knowingly collect personal information from children under 13. If we become
              aware that we have collected personal information from a child under 13, we will take
              steps to delete the information as soon as possible.
            </li>

            <li>
              Data Retention: We will retain your personal information for as long as necessary to
              provide our services to you. We may also retain your personal information for a longer
              period if required by law or to comply with our legal obligations.
            </li>

            <li>
              Changes to this Privacy Policy: We reserve the right to modify or update this Privacy
              Policy at any time without prior notice. We encourage you to review this Privacy Policy
              periodically for any changes.
            </li>
          </ol>
        </div>
      </label>
    </label>
  </Teleport>
</template>
