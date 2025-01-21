import axios from 'axios'
import { supabase } from '@/utils/supabase'

// Setup your feeds to show in Today page here
const rssFeeds = [
  { name: 'NDTV', url: 'https://feeds.feedburner.com/ndtvnews-top-stories' },
  
  { name: 'Times of India', url: 'https://timesofindia.indiatimes.com/rssfeeds/-2128936835.cms' },
  { name: 'Mumbai', url: 'https://timesofindia.indiatimes.com/rssfeeds/-2128838597.cms' },
  { name: 'Delhi', url: 'https://timesofindia.indiatimes.com/rssfeeds/-2128839596.cms' },
  { name: 'Bangalore', url: 'https://timesofindia.indiatimes.com/rssfeeds/-2128833038.cms' },
  
  { name: 'Business News', url: 'https://timesofindia.indiatimes.com/rssfeeds/1898055.cms' },
  { name: 'Education', url: 'https://timesofindia.indiatimes.com/rssfeeds/913168846.cms' },
  { name: 'Gadget News', url: 'https://timesofindia.indiatimes.com/rssfeeds/66949542.cms' },
  { name: 'Sports', url: 'https://timesofindia.indiatimes.com/rssfeeds/4719148.cms' },
]

async function fetchRssFeed(source) {
  try {
    const response = await axios.get(`https://api.rss2json.com/v1/api.json?rss_url=${source.url}`)
    return response.data
  } catch (error) {
    return null
  }
}

async function fetchRssFeeds() {
  const articles = []

  for (const feed of rssFeeds) {
    const feedData = await fetchRssFeed(feed)
    if (!feedData) continue

    for (const item of feedData.items) {
      const article = {
        title: item.title,
        link: item.link,
        author: feed.name,
        pubDate: new Date(item.pubDate),
        enclosure_link: item.enclosure.link ? item.enclosure.link : null,
      }

      articles.push(article)
    }
  }

  return articles
}

async function storeArticles(articles) {
  const { data, error } = await supabase.from('rss').upsert(articles, { onConflict: ['link'] })
  console.log('STORE ERROR : ', error)
}

export default async function main() {
  const articles = await fetchRssFeeds()
  await storeArticles(articles)
}

// Setup a bash script to run every 24 hours
// main()
// 0 0 * * * /usr/bin/node /src/CRONS/cron.js
