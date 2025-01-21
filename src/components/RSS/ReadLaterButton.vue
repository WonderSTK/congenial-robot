<template>
  <div class="tooltip tooltip-left" data-tip="Read later">
    <DatePicker
      v-model="selectedDate"
      :min-date="inXDays(1)"
      @open="getSelected"
      @update:model-value="saveNews(news, selectedDate)"
      auto-apply
      :month-change-on-scroll="false"
      position="right"
      :dark="themeStore.currentTheme === 'dark'"
    >
      <template #trigger>
        <button @click.prevent class="btn btn-ghost">
          <i class="fa-solid fa-folder-plus"></i>
        </button>
      </template>
    </DatePicker>
  </div>
</template>

<script setup>
import { ref, inject, toRefs } from 'vue'
import { inXDays } from '@/utils/dates'
import router from '@/router'
import { supabase } from '@/utils/supabase'

import VueDatePicker from '@vuepic/vue-datepicker'
const DatePicker = VueDatePicker

import { useThemeStore } from "@/stores/themeStore"
const themeStore = useThemeStore()

const authStore = inject('authStore')
const selectedDate = ref(null)
const { rssIds } = toRefs(authStore)
const maxSaveNews = ref(authStore.myPlan.readLater || null)

const props = defineProps({
  news: {
    type: Object,
    required: true
  },
  needToStore: {
    type: Boolean,
    default: false
  }
})

const storeArticle = async (article) => {
  const news = {
    title: article.title,
    link: article.link,
    author: article.author,
    pubDate: new Date(article.pubDate),
    enclosure_link: article.enclosure.link ? article.enclosure.link : null,
    user_id: authStore.user.userId
  }

  await supabase
    .from('rss')
    .upsert([news], { onConflict: 'link' })
    .select()
    .single()
}

const saveNews = async (news, date) => {
  if (news.saved) {
    if (new Date(news.selected_date).getDate() === date.getDate()) {
      await supabase
        .from('readLater')
        .delete()
        .eq('user_id', authStore.user.userId)
        .eq('rss_link', news.link)
      authStore.rssIds = authStore.rssIds.filter(id => id !== news.link)
    } else {
      await supabase
        .from('readLater')
        .update({ selected_date: date })
        .eq('user_id', authStore.user.userId)
        .eq('rss_link', news.link)
      if (news.readLater) news.readLater[0].selected_date = new Date(date)
    }
    return
  }

  if (maxSaveNews.value && rssIds.value.length >= maxSaveNews.value) {
    router.push('/upgrades')
    return
  }

  if (props.needToStore) await storeArticle(news)

  const newSavedNews = {
    rss_link: news.link,
    user_id: authStore.user.userId,
    added_date: new Date(),
    selected_date: date,
    my_author: news.name,
  }
  const { error } = await supabase
    .from('readLater')
    .insert(newSavedNews)
  if (!error) authStore.rssIds.push(news.link)
}

const getSelected = async () => {
  if (props.news.saved) {
    const { data, error } = await supabase
      .from('readLater')
      .select('selected_date')
      .eq('user_id', authStore.user.userId)
      .eq('rss_link', props.news.link)
      .single()

    if (!error) {
      selectedDate.value = data.selected_date
      props.news.selected_date = selectedDate.value
      return
    }
  }
  selectedDate.value = null
}
</script>

<style>
@import '@vuepic/vue-datepicker/dist/main.css';
.dp__arrow_top, .dp__arrow_bottom {
  left: 91%;
}
</style>
