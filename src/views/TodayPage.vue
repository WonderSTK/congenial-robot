<template>
  <ul class="space-y-4 pb-2">
    <div
      v-for="news in rss"
      :key="news.id"
      class="ease flex gap-4 items-center justify-between bg-base-100 rounded-box p-3 hover:bg-base-200"
      :class="rssIds && rssIds.includes(news.link) ? 'border border-accent' : ''"
    >
      <a :href="news.link" target="_blank" class="flex flex-wrap gap-4 w-full group">
        <div class="avatar max-w-full max-h-32 md:max-w-[12rem]">
          <img v-if="news.enclosure_link" class="rounded-lg" :src="news.enclosure_link" :alt="`News image ${news.id}`" />
          <div v-else class="bg-base-300 rounded-lg w-[12rem]"></div>
        </div>
        <div class="flex-col flex-[2]">
          <div class="flex gap-2 items-center">
            <svg class="w-6 h-6 min-w-min" width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M31.2015 12.6249C31.7488 11.1466 31.9068 9.737 31.5136 8.47194C31.3325 8.48825 31.1446 8.49669 30.9523 8.49669C25.1911 8.49669 15.0088 1.25338 14.2381 0.125C11.0628 4.75044 4.40733 8.30656 1.39908 12.2947C0.181832 13.9085 -0.426793 15.1094 0.784269 16.9556L13.4681 33.2529C14.0401 34.0274 15.1612 34.0904 15.9594 33.3761C15.9594 33.3761 26.3611 20.0285 33.8756 15.8986C33.3108 14.7956 32.3709 13.6948 31.2015 12.6249M13.247 29.7991L13.1941 29.8357L13.1463 29.8773C12.9525 30.0512 12.7802 30.2478 12.6333 30.4629L1.64321 16.3424C0.851769 15.1179 1.07621 14.4732 2.24114 12.9297C3.56246 11.1787 5.67408 9.47881 7.91002 7.67938C10.2343 5.8085 12.6283 3.8825 14.3866 1.691C17.2891 4.07937 25.4077 9.35281 30.6609 9.54575C31.2909 15.7316 18.4648 26.1598 13.247 29.7991" fill="currentColor" fill-opacity="0.5"/>
              <path d="M10.246 6.96384L24.4238 18.0732L24.9289 17.621L10.615 6.63309L10.246 6.96384ZM14.8664 12.8774L9.06363 8.0219C9.06363 8.0219 7.04426 9.31115 4.59851 12.1388L9.74651 17.4612L14.8664 12.8774M2.15332 14.7837L13.1041 28.2055L15.1263 26.396L3.45101 13.0473C3.45101 13.0473 2.43345 13.598 2.15332 14.7837ZM14.4237 15.5532L20.785 21.3301L22.8061 19.5205L16.1826 13.9788L14.4237 15.5532ZM10.9058 18.7027L16.7429 24.9487L18.7634 23.1397L12.6648 17.1282L10.9058 18.7027ZM14.6695 5.05022L13.8117 7.45884L14.3494 7.85034L17.0804 5.40515L16.546 5.06878L14.6644 6.75347L15.4964 4.40559L14.9384 4.05347L12.3357 6.38334L12.802 6.72253L14.6695 5.05022ZM17.0067 9.78815L17.5276 9.32072L15.9385 8.19122L16.6591 7.54659L18.0704 8.51297L18.5716 8.06353L17.1445 7.11065L17.7396 6.57853L19.3197 7.60059L19.8327 7.14215L17.6479 5.7629L14.8816 8.23959L17.0067 9.78815ZM18.6993 11.0212L20.8587 9.71334L21.5658 9.26559L21.0966 9.87197L19.7073 11.7569L20.3783 12.2457L24.5341 10.1088L23.7454 9.61097L21.4668 10.9148L20.8851 11.267L21.2755 10.7534L22.6261 8.90447L21.8678 8.42634L19.7613 9.7319L19.2016 10.0857L19.5869 9.59578L20.8626 7.79184L20.1516 7.34297L18.0923 10.579L18.6993 11.0212ZM26.5101 11.209C25.9988 10.8878 25.5213 10.7343 25.0746 10.7433C24.6314 10.7528 24.268 10.8862 23.9817 11.1427C23.6673 11.4239 23.5615 11.7158 23.665 12.0185C23.7258 12.2002 23.9193 12.4628 24.2494 12.8105L24.5909 13.1693C24.7945 13.3808 24.9256 13.5541 24.9829 13.6868C25.0392 13.8213 25.0116 13.9388 24.9008 14.0378C24.7113 14.2072 24.4643 14.2392 24.1611 14.1357C23.9726 14.0642 23.795 13.9667 23.6335 13.846C23.3129 13.6177 23.1571 13.3977 23.161 13.1857C23.1633 13.0698 23.2268 12.937 23.3511 12.7874L22.6137 12.2733C22.2813 12.5708 22.1553 12.9027 22.2385 13.2712C22.3223 13.643 22.6075 14.0097 23.1025 14.3708C23.5958 14.7325 24.0869 14.926 24.5695 14.9474C25.0572 14.9682 25.4588 14.84 25.7682 14.5615C26.0719 14.2904 26.1799 13.999 26.0933 13.6891C26.0382 13.4905 25.8835 13.2593 25.6338 12.9961L25.0741 12.4055C24.8609 12.1827 24.7338 12.028 24.6904 11.9397C24.6229 11.8053 24.6471 11.6866 24.7636 11.5831C24.8901 11.4695 25.0521 11.4233 25.2501 11.443C25.4509 11.4627 25.6602 11.5432 25.879 11.6838C26.0776 11.812 26.2176 11.9448 26.2958 12.082C26.4168 12.289 26.383 12.4887 26.1974 12.6783L27.0282 13.2256C27.3736 12.8926 27.4816 12.5399 27.3528 12.1692C27.2268 11.8019 26.9449 11.4813 26.5101 11.209" fill="currentColor" fill-opacity="0.5"/>
            </svg>
            <span class="text-sm text-accent lg:max-w-[15rem] truncate">{{ news.author }}</span>
            <ReadLaterButton :news="{ ...news, saved: rssIds && rssIds.includes(news.link)}" class="ml-auto" />
          </div>
          <div class="-mt-2 pr-12">
            <i v-if="news.pubDate" class="text-xs opacity-50">{{ new Date(news.pubDate).toLocaleString() }}</i>
            <i v-else class="text-xs opacity-50">Date not specified</i>
            <p class="text-sm font-bold group-hover:link flex-1">{{ news.title }}</p>
          </div>
        </div>
      </a>
    </div>
  </ul>
</template>

<script setup>
import { defineAsyncComponent, onMounted, ref, inject, toRefs } from 'vue'
import { supabase } from '@/utils/supabase'

const ReadLaterButton = defineAsyncComponent(() => import ("@/components/RSS/ReadLaterButton.vue"))
const authStore = inject('authStore')

const { rssIds } = toRefs(authStore)
const rss = ref([])

const loadTodayRSS = async () => {
  const twentyFourHoursAgo = new Date()
  twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24)

  const { data, error } = await supabase
    .from('rss')
    .select('*')
    .is('user_id', null)
    .gt('pubDate', twentyFourHoursAgo.toISOString())
    .order('pubDate', { ascending: false })

  if (!error) rss.value = data
}

onMounted(async () => {
  loadTodayRSS()
  await authStore.getRssIds()
})
</script>
