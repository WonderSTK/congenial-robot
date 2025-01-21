import { defineStore } from 'pinia'
import axios from 'axios'

export const useRSSStore = defineStore('rss', {
  state: () => ({
    sources: [
      {
        name: 'Default',
        children: [
          { name: 'Le Monde', url: 'https://www.lemonde.fr/rss/une.xml' },
          { name: 'BBC', url: 'http://feeds.bbci.co.uk/news/rss.xml' },
          { name: 'CNN', url: 'http://rss.cnn.com/rss/edition.rss' },
          { name: 'NDTV', url: 'https://feeds.feedburner.com/ndtvnews-top-stories' },
          { name: 'Times of India', url: 'https://timesofindia.indiatimes.com/rssfeeds/-2128936835.cms' },
          { name: 'The Hindu', url: 'https://www.thehindu.com/news/national/feeder/default.rss' },
          { name: 'India Today', url: 'https://www.indiatoday.in/rss/home' },
        ]
      },
    ],
    datas: [],
    selectedSource: null,
    error: null,
  }),
  actions: {
    async fetchRssFeed(source) {
      try {
        const response = await axios.get(`https://api.rss2json.com/v1/api.json?rss_url=${source.url}`)
        this.datas = response.data
        this.selectedSource = source
        this.error = null
      } catch (error) {
        this.error = error
      }
    },
    async setSource(newSourceUrl) {
      if (newSourceUrl.trim() !== '') {
        await this.fetchRssFeed({ name: newSourceUrl, url: newSourceUrl, notSaved: true })
      }
    },
  }
})
