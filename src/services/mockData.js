const MOCK_DELAY = 1000; // Simulate network delay

const mockResponses = {
  meta_title: [
    "Best {keyword} Tips and Tricks for 2024 | Expert Guide",
    "Ultimate {keyword} Guide: Everything You Need to Know",
    "{keyword} Made Easy: Step-by-Step Tutorial",
    "Top 10 {keyword} Strategies That Actually Work",
    "The Complete {keyword} Handbook for Beginners"
  ],
  meta_description: [
    "Discover the best {keyword} techniques and strategies. Learn expert tips and tricks to improve your skills. Start your journey today!",
    "Looking for {keyword} advice? Our comprehensive guide covers everything from basics to advanced techniques. Click to learn more!",
    "Master {keyword} with our easy-to-follow guide. Perfect for beginners and experts alike. Get started now!",
    "Transform your {keyword} approach with these proven strategies. Expert insights and practical tips included.",
    "The ultimate resource for {keyword} enthusiasts. Learn from the best and take your skills to the next level."
  ],
  sub_keywords: [
    "{keyword} basics",
    "advanced {keyword} techniques",
    "{keyword} for beginners",
    "professional {keyword} tips",
    "{keyword} best practices",
    "{keyword} tutorial",
    "{keyword} guide",
    "{keyword} examples",
    "{keyword} strategies",
    "{keyword} tools"
  ],
  topical_map: [
    "Introduction to {keyword}",
    "Basic Concepts",
    "Advanced Techniques",
    "Common Challenges",
    "Best Practices",
    "Tools and Resources",
    "Case Studies",
    "Future Trends"
  ],
  blog_post_ideas: [
    "10 Surprising Facts About {keyword} You Didn't Know",
    "The Ultimate Guide to {keyword} for Beginners",
    "How to Master {keyword} in 30 Days",
    "Common {keyword} Mistakes and How to Avoid Them",
    "The Future of {keyword}: Trends to Watch"
  ],
  facebook_content_ideas: [
    "5 Creative Ways to Use {keyword} in Your Facebook Posts",
    "How to Create Engaging {keyword} Content for Facebook",
    "The Ultimate Guide to {keyword} Content on Facebook",
    "10 {keyword} Post Ideas That Will Boost Your Engagement",
    "How to Make Your {keyword} Posts Go Viral on Facebook",
    "The Best {keyword} Content Strategies for Facebook",
    "How to Create Shareable {keyword} Content for Facebook",
    "The Complete Guide to {keyword} Marketing on Facebook",
    "How to Use {keyword} to Grow Your Facebook Audience",
    "The Most Effective {keyword} Post Types for Facebook"
  ],
  facebook_hashtags: [
    "#{keyword} #socialmedia #marketing #digitalmarketing #business",
    "#{keyword} #facebook #content #engagement #viral",
    "#{keyword} #marketingtips #socialmediamarketing #businessgrowth",
    "#{keyword} #contentmarketing #socialmedia #digitalmarketing",
    "#{keyword} #facebookmarketing #socialmediamanagement #business"
  ],
  facebook_caption: [
    "Discover the power of {keyword} and transform your social media presence! 🚀 #SocialMediaMarketing",
    "Looking to boost your {keyword} game? Here's everything you need to know! 💡 #DigitalMarketing",
    "The ultimate guide to mastering {keyword} - your complete resource! 📚 #MarketingTips",
    "Transform your {keyword} strategy with these expert tips! 💪 #BusinessGrowth",
    "Ready to take your {keyword} to the next level? Let's get started! 🔥 #MarketingSuccess"
  ],
  instagram_content_ideas: [
    "5 Creative {keyword} Ideas for Your Instagram Feed 📸",
    "How to Create Stunning {keyword} Content for Instagram ✨",
    "The Ultimate Guide to {keyword} on Instagram 📱",
    "10 {keyword} Post Ideas That Will Boost Your Engagement 📈",
    "How to Make Your {keyword} Posts Go Viral on Instagram 🚀",
    "The Best {keyword} Content Strategies for Instagram 💡",
    "How to Create Shareable {keyword} Content for Instagram 📤",
    "The Complete Guide to {keyword} Marketing on Instagram 📊",
    "How to Use {keyword} to Grow Your Instagram Audience 👥",
    "The Most Effective {keyword} Post Types for Instagram 📷"
  ],
  instagram_caption: [
    "Discover the magic of {keyword} ✨ #InstaGood",
    "Transforming {keyword} into art 🎨 #Creative",
    "The perfect {keyword} moment captured 📸 #Photography",
    "Exploring the world of {keyword} 🌍 #Adventure",
    "Creating something special with {keyword} 💫 #Inspiration",
    "The beauty of {keyword} in every detail 🌟 #Aesthetic",
    "Making memories with {keyword} 📱 #Lifestyle",
    "The art of {keyword} in motion 🎬 #Video",
    "Capturing the essence of {keyword} 📷 #Photography",
    "The perfect {keyword} story in one frame 📸 #InstaMoment"
  ],
  instagram_hashtags: [
    "#{keyword} #instagood #photography #instamood #instadaily",
    "#{keyword} #photooftheday #instalike #instafollow #instatag",
    "#{keyword} #instacool #instapic #instafashion #instastyle",
    "#{keyword} #instaphoto #instalife #instamoment #instatravel",
    "#{keyword} #instaart #instacreative #instainspiration #instalove"
  ],
  youtube_content_ideas: [
    "How to {keyword} - Step by Step Tutorial",
    "10 {keyword} Tips and Tricks You Need to Know",
    "The Ultimate Guide to {keyword} for Beginners",
    "5 Common {keyword} Mistakes and How to Fix Them",
    "How to Master {keyword} in 30 Days",
    "The Best {keyword} Tools and Resources",
    "How to Use {keyword} Like a Pro",
    "The Complete {keyword} Tutorial for Beginners",
    "How to Get Started with {keyword}",
    "The Most Effective {keyword} Strategies"
  ],
  youtube_tags: [
    "{keyword} tutorial, how to {keyword}, {keyword} tips, {keyword} guide, {keyword} for beginners",
    "{keyword} basics, {keyword} techniques, {keyword} examples, {keyword} training, {keyword} help",
    "{keyword} step by step, {keyword} walkthrough, {keyword} demonstration, {keyword} lesson",
    "{keyword} how to, {keyword} explained, {keyword} guide, {keyword} tutorial, {keyword} tips",
    "{keyword} beginner, {keyword} advanced, {keyword} professional, {keyword} expert, {keyword} master"
  ],
  youtube_hashtags: [
    "#{keyword} #tutorial #howto #tips #guide",
    "#{keyword} #beginner #basics #learning #education",
    "#{keyword} #advanced #professional #expert #master",
    "#{keyword} #tutorial #walkthrough #demonstration #lesson",
    "#{keyword} #tips #tricks #hacks #techniques"
  ],
  twitter_post: [
    "Discover the power of {keyword}! 🚀 #TwitterMarketing",
    "Looking to boost your {keyword} game? Here's what you need to know! 💡 #DigitalMarketing",
    "The ultimate guide to mastering {keyword} - your complete resource! 📚 #MarketingTips",
    "Transform your {keyword} strategy with these expert tips! 💪 #BusinessGrowth",
    "Ready to take your {keyword} to the next level? Let's get started! 🔥 #MarketingSuccess",
    "The future of {keyword} is here! Are you ready? 🌟 #Innovation",
    "Breaking down {keyword} into simple, actionable steps! 📝 #HowTo",
    "The secret to successful {keyword} revealed! 🤫 #MarketingSecrets",
    "How to use {keyword} to grow your business! 📈 #BusinessTips",
    "The most effective {keyword} strategies for 2024! 🎯 #MarketingStrategy"
  ]
};

const mockContent = {
  generate: async (type, prompt) => {
    await new Promise(resolve => setTimeout(resolve, MOCK_DELAY));
    
    const keyword = prompt || 'your topic';
    const responses = mockResponses[type] || [];
    const randomIndex = Math.floor(Math.random() * responses.length);
    const content = responses[randomIndex].replace(/{keyword}/g, keyword);
    
    return { content };
  },

  save: async (name, type, data) => {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No token, Authorization denied');
    }

    try {
      // Save to MongoDB
      const response = await fetch('http://localhost:5000/api/content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        },
        body: JSON.stringify({ 
          name, 
          type, 
          category: type,
          data
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to save content to database');
      }

      const savedContent = await response.json();
      console.log('Saved to MongoDB:', savedContent);
      return savedContent;
    } catch (error) {
      console.error('Error saving to MongoDB:', error);
      throw error;
    }
  },

  getMyContent: async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No token, Authorization denied');
    }

    try {
      const response = await fetch('http://localhost:5000/api/content/my-content', {
        headers: {
          'x-auth-token': token
        }
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch content from database');
      }

      const content = await response.json();
      console.log('Retrieved from MongoDB:', content);
      return content;
    } catch (error) {
      console.error('Error fetching from MongoDB:', error);
      throw error;
    }
  }
};

export default mockContent; 