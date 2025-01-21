<template>
  <div class="card rounded-box shadow-lg bg-base-100">
    <div class="card-body">
      <h2 class="card-title mb-4">Terms and Conditions of {{ app_name }}</h2>
      <p class="mb-2">By using this service, you agree to abide by the Terms and Conditions</p>
      <label for="terms" @click="authStore.action = 'terms'" class="btn btn-outline">See terms</label>
    </div>
  </div>

  <Teleport v-if="authStore.action === 'terms'" to="#modal-container">
    <input type="checkbox" id="terms" class="modal-toggle" @change="authStore.closeModal(!$event.target.checked)" />
    <label for="terms" class="modal cursor-pointer">
      <label class="modal-box relative" for="">
        <label for="terms" class="btn btn-sm btn-circle absolute right-2 top-2">✕</label>
        <h3 class="text-lg font-bold">Terms and Conditions of {{ app_name }}</h3>
        <div class="flex flex-col gap-4 mt-6">
          <p>
            These Terms and Conditions ("Terms") govern the use of {{ app_name }} ("Service"), which is
            owned and operated by {{ app_name }} Private Limited ("we", "us", or "our"). By using our Service,
            you agree to be bound by these Terms. If you do not agree to these Terms, you must not use our Service.
          </p>
          <ol class="list-decimal ml-4 flex flex-col gap-4 mt-4">
            <li>
              <h2 class="font-bold underline">Eligibility</h2>
              <p>
                You must be at least 18 years old to use our Service. By using our Service, you represent and warrant that you are at least 18 years old.
              </p>
            </li>

            <li>
             <h2 class="font-bold underline">Use of Service</h2>
              <p>
                You may use our Service only for lawful purposes and in accordance with these Terms. You agree not to use our Service:
              </p>

              <ol type="a" class="list-disc flex flex-col gap-2 mt-2">
                <li>
                  in any way that violates any applicable federal, state, local, or international law or regulation
                </li>

                <li>
                  for the purpose of exploiting, harming, or attempting to exploit or harm minors in any way
                  by exposing them to inappropriate content, asking for personally identifiable information, or otherwise
                </li>

                <li>
                  to transmit, or procure the sending of, any advertising or promotional material,
                  including any "junk mail," "chain letter," "spam," or any other similar solicitation
                </li>

                <li>
                  to impersonate or attempt to impersonate us, our employees, another user, or any other person or entity
                </li>

                <li>
                  to engage in any other conduct that restricts or inhibits anyone's use or enjoyment of our
                  Service, or which, as determined by us, may harm us or users of our Service or expose them to liability
                </li>
              </ol>
            </li>

            <li>
              <h2 class="font-bold underline">User Content</h2>
              <p>
                Our Service allows you to store, manage, and share your bookmarks ("User Content").
                You retain all rights in, and are solely responsible for, the User Content you store
                on our Service.
              </p>

              <p>
                By using our Service, you grant us a non-exclusive, transferable, sub-licensable, royalty-free,
                worldwide licence to use, copy, modify, create derivative works based on, distribute, publicly
                display, publicly perform, and otherwise exploit in any manner such User Content in all
                formats and distribution channels now known or hereafter devised (including in connection
                with our Service and our business and on third-party sites and services), without further
                notice to or consent from you, and without the requirement of payment to you or any other person or entity.
              </p>
            </li>

            <li>
              <h2 class="font-bold underline">Intellectual Property</h2>
              <p>
                Our Service and its entire contents, features, and functionality (including but not
                limited to all information, software, text, displays, images, video, and audio, and
                the design, selection, and arrangement thereof) are owned by us, our licensors, or
                other providers of such material and are protected by India and international copyright,
                trademark, patent, trade secret, and other intellectual property or proprietary rights laws.
              </p>

              <p>
                You may not reproduce, distribute, modify, create derivative works of, publicly display,
                publicly perform, republish, download, store, or transmit any of the material on our Service,
                except as follows:
              </p>
              <ol type="a" class="list-disc flex flex-col gap-2 mt-2">
                <li>
                  your computer may temporarily store copies of such materials in RAM incidental to your accessing and viewing those materials
                </li>

                <li>
                  you may store files that are automatically cached by your Web browser for display enhancement purposes; and
                </li>

                <li>
                  you may print or download one copy of a reasonable number of pages of the Service for your own personal,
                  non-commercial use and not for further reproduction, publication, or distribution.
                </li>

                <li>
                  If we provide desktop, mobile, or other applications for download, you may download a
                  single copy to your computer or mobile device solely for your own personal, non-commercial
                  use, provided you agree to be bound by our end-user licence agreement for such applications.
                </li>
              </ol>
            </li>

            <li>
              <h2 class="font-bold underline">Disclaimer of Warranties</h2>
              <p>
                {{ app_name }} makes no representations or warranties of any kind, express or implied, as
                to the operation of the website or services or the information, content, materials, or 
                products included on the website. To the fullest extent permissible by applicable law,
                {{ app_name }} disclaims all warranties, express or implied, including but not limited to
                implied warranties of merchantability and fitness for a particular purpose.
              </p>

              <p>
                We do not warrant that our website will be uninterrupted or error-free, nor do we make any warranty
                as to the results that may be obtained from the use of our website, or as to the accuracy,
                reliability, or currency of any information, content, service, or merchandise provided through our website.
              </p>

              <p>
                We disclaim any and all liability for the acts, omissions, and conduct of any third parties
                in connection with or related to your use of our website and/or any services offered by {{ app_name }}.
                You assume the entire risk of loss and damage arising from your use of our website, including but
                not limited to, any damage to your computer system or loss of data.
              </p>

              <p>
                To the fullest extent permissible by applicable law, we disclaim all warranties, express or
                implied, including but not limited to, implied warranties of merchantability and fitness
                for a particular purpose. Some jurisdictions do not allow the exclusion of implied
                warranties, so the above exclusion may not apply to you.
              </p>
            </li>

            <li>
              <h2 class="font-bold underline">Limitation of Liability</h2>
              <p>
                {{ app_name }} shall not be liable for any direct, indirect, incidental, special, or consequential
                damages arising out of or in connection with these terms and conditions or your use of
                {{ app_name }}, including but not limited to damages for loss of profits, goodwill, use, data, or other intangible losses.
              </p>
            </li>

            <li>
              <h2 class="font-bold underline">Indemnification</h2>
              <p>
                You agree to indemnify, defend, and hold harmless {{ app_name }} and its affiliates, directors,
                officers, employees, agents, and licensors from and against any and all claims, liabilities,
                damages, losses, costs, expenses, or fees (including reasonable attorneys' fees) arising
                from or related to your use of our website or services, your violation of these Terms and
                Conditions, or your violation of any rights of another.
              </p>
            </li>

            <li>
              <h2 class="font-bold underline">Governing Law and Jurisdiction</h2>
              <p>
                These Terms and Conditions shall be governed by and construed in accordance with the laws
                of India without regard to its conflict of law provisions. Any dispute arising out of or
                related to these Terms and Conditions or your use of our website or services shall be
                brought exclusively in the courts located in New Delhi, India, and you hereby consent
                to the jurisdiction of such courts.
              </p>
            </li>

            <li>
              <h2 class="font-bold underline">Entire Agreement</h2>
              <p>
                These Terms and Conditions, along with our Privacy Policy, constitute the entire agreement
                between you and {{ app_name }} with respect to your use of our website and services, and supersede
                all prior or contemporaneous communications and proposals, whether oral or written, between you and {{ app_name }}.
              </p>
            </li>

            <li>
              <h2 class="font-bold underline">Waiver and Severability</h2>
              <p>
                Our failure to enforce any right or provision of these Terms and Conditions shall not
                be deemed a waiver of such right or provision. If any provision of these Terms and
                Conditions is found to be invalid or unenforceable, the remaining provisions shall be
                enforced to the fullest extent possible, and the remaining provisions of these Terms
                and Conditions shall remain in full force and effect.
              </p>
            </li>

            <li>
              <h2 class="font-bold underline">Assignment</h2>
              <p>
                You may not assign these Terms and Conditions or any rights or licences granted hereunder,
                whether voluntarily or by operation of law, without our prior written consent.
              </p>
            </li>
          </ol>
        </div>
      </label>
    </label>
  </Teleport>
</template>
