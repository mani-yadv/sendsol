# SEND_8: AI Radio News Feature

## Description
Create an AI-powered crypto news audio feed using CryptoPanic API and Supabase's OpenAI integration to provide users with the latest crypto news updates in audio format.

## Requirements
### News Collection
- [ ] Implement CryptoPanic API integration
  - [ ] Set up API authentication
  - [ ] Implement rate limit handling
  - [ ] Store API credentials securely

### News Processing with Supabase AI
- [ ] Create Edge Functions for news processing
  - [ ] Fetch and filter news hourly
  - [ ] Use OpenAI to summarize and format news
  - [ ] Generate engaging radio-style scripts
- [ ] Implement audio generation
  - [ ] Use OpenAI Text-to-Speech API
  - [ ] Store audio files in Supabase Storage
  - [ ] Track audio generation status

### Frontend Integration
- [ ] Create radio player component
  - [ ] Display "Last Updated" timestamp
  - [ ] Add play/pause controls
  - [ ] Show current playing news item
- [ ] Implement audio streaming
  - [ ] Stream from Supabase Storage
  - [ ] Handle buffering states
  - [ ] Support background playback

## Technical Architecture

### Database Schema
```sql
-- News items table
CREATE TABLE news_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    source_url TEXT,
    published_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    processed_at TIMESTAMP WITH TIME ZONE,
    status TEXT DEFAULT 'pending'
);

-- Audio episodes table
CREATE TABLE audio_episodes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    news_items UUID[] NOT NULL,
    script TEXT NOT NULL,
    audio_url TEXT,
    duration INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status TEXT DEFAULT 'pending',
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Edge Function Implementation
```javascript
// news-processor.ts
const processNews = async (news: NewsItem[]) => {
  const supabase = getSupabaseClient();
  
  // 1. Summarize and format news using OpenAI
  const summary = await supabase.functions.invoke('summarize-news', {
    body: { news }
  });
  
  // 2. Generate radio script
  const script = await supabase.functions.invoke('generate-script', {
    body: { summary }
  });
  
  // 3. Generate audio using OpenAI TTS
  const audio = await supabase.functions.invoke('generate-audio', {
    body: { script }
  });
  
  // 4. Store audio in Supabase Storage
  const { data, error } = await supabase.storage
    .from('radio-episodes')
    .upload(`episodes/${Date.now()}.mp3`, audio);
    
  // 5. Update episode record
  await supabase.from('audio_episodes')
    .insert({
      news_items: news.map(n => n.id),
      script,
      audio_url: data?.path,
      status: 'ready',
      last_updated: new Date()
    });
};
```

### Frontend Component
```vue
<template>
  <div class="radio-player">
    <h3>SendSol Radio 
      <span v-if="lastUpdated">
        (Last updated: {{ formatTime(lastUpdated) }})
      </span>
    </h3>
    
    <audio-player 
      :src="currentEpisode?.audio_url"
      @play="handlePlay"
      @pause="handlePause"
    />
    
    <div class="current-news" v-if="currentEpisode">
      <p>{{ getCurrentNewsTitle() }}</p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      currentEpisode: null,
      lastUpdated: null
    }
  },
  
  async created() {
    await this.fetchLatestEpisode();
  },
  
  methods: {
    async fetchLatestEpisode() {
      const { data } = await this.supabase
        .from('audio_episodes')
        .select('*')
        .eq('status', 'ready')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
        
      this.currentEpisode = data;
      this.lastUpdated = data?.last_updated;
    }
  }
}
</script>
```

## Environment Variables
```bash
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
CRYPTOPANIC_API_KEY=your_api_key
OPENAI_API_KEY=your_openai_key
```

## Implementation Flow
1. Hourly cron job fetches news from CryptoPanic
2. Edge function processes news using OpenAI:
   - Summarizes and formats news
   - Generates engaging radio script
   - Converts script to audio using OpenAI TTS
3. Audio file stored in Supabase Storage
4. Frontend fetches latest episode and streams audio
5. Users can play/pause and see last update time

## Status
- Status: Not Started
- Priority: Medium
- Assigned: TBD
