import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const SEOTools = () => {
  const tools = [
    {
      icon: '/Images/SeoMetaTitle.png',
      title: 'SEO Meta Title',
      description: 'Generate optimized meta titles that improve search engine visibility and click-through rates',
      path: '/MetaTitle',
    },
    {
      icon: '/Images/SeoMetaDescription.png',
      title: 'SEO Meta Description',
      description: 'Create compelling meta descriptions that boost your website’s ranking and attract more visitors',
      path: '/MetaDescription',
    },
    {
      icon: '/Images/SubKeywordGenerator.png',
      title: 'Sub Keyword Generator',
      description: 'Discover relevant sub-keywords to enhance your SEO strategy and drive more targeted traffic',
      path: '/SubKeywordGenerator',
    },
    {
      icon: '/Images/TopicalMapGenerator.png',
      title: 'Topical Map Generator',
      description: 'Build a structured content roadmap to target the right topics and strengthen your SEO',
      path: '/TopicalMapGenerator',
    },
    {
      icon: '/Images/BlogPostIdeas.png',
      title: 'Blog Post Ideas',
      description: 'Get creative and engaging blog post ideas to keep your content fresh and search-engine friendly',
      path: '/BlogPostIdeas',
    },
    {
      icon: '/Images/Json-ldFaqGenerator.png',
      title: 'JSON-LD FAQ Generator',
      description: 'Easily create structured FAQ data in JSON-LD format to improve visibility in search results',
      path: '/JSONGenerator',
    },
    {
      icon: '/Images/YoutubeTagGenerator.png',
      title: 'Youtube Tag Generator',
      description: 'Generate optimized YouTube tags to increase discoverability for your videos.',
      path: '/YoutubeTag',
    },
    {
      icon: '/Images/YoutubeContentIdeas.png',
      title: 'Youtube Content Ideas',
      description: 'Get fresh and trending video content ideas to engage your audience and grow your channel',
      path: '/YoutubeContent',
    },
    {
      icon: '/Images/YoutubeHashtagGenerator.png',
      title: 'Youtube Hashtag Generator',
      description: 'Find the perfect hashtags to increase reach and engagement on your YouTube videos',
      path: '/YoutubeHashtag',
    },
    {
      icon: '/Images/InstagramCaptionGenerator.png',
      title: 'Instagram Caption Generator',
      description: 'Create captivating and creative captions to boost engagement on your Instagram posts',
      path: '/InstaCaption',
    },
    {
      icon: '/Images/InstagramContentIdeas.png',
      title: 'Instagram Content Ideas',
      description: 'Discover engaging Instagram content ideas to keep your feed fresh and attract more followers',
      path: '/InstaContent',
    },
    {
      icon: '/Images/InstagramHashtagGenerator.png',
      title: 'Instagram Hashtag Generator',
      description: 'Generate effective Instagram hashtags to expand your reach and connect with your audience',
      path: '/InstaHashtag',
    },
    {
      icon: '/Images/FacebookCaptionGenerator.png',
      title: 'Facebook Caption Generator',
      description: 'Create catchy Facebook captions that spark interest and increase post engagement',
      path: '/FBCaption',
    },
    {
      icon: '/Images/FacebookContentIdeas.png',
      title: 'Facebook Content Ideas',
      description: 'Get unique and attention-grabbing content ideas to keep your Facebook followers engaged',
      path: '/FBContent',
    },
    {
      icon: '/Images/FacebookHashtagGenerator.png',
      title: 'Facebook Hashtag Generator',
      description: 'Generate trending Facebook hashtags to amplify your post visibility and interactions',
      path: '/FBHashtag',
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />

      {/* Top Image Banner */}
      <div className="w-full">
        <img 
          src="/Images/SeoToolsPageBackground.jpg" 
          alt="SEO Tools Banner" 
          className="w-full object-cover"
          style={{ height: '300px' }}
        />
      </div>

      <main className="flex-grow pb-10">
        <div className="container mx-auto px-4">
          {/* Hero Section */}
          <div className="text-center py-12">
            <h1 className="text-4xl font-bold mb-2" style={{ color: '#7FAF37' }}>SEO Tools</h1>
            <p 
              className="text-lg max-w-2xl mx-auto whitespace-nowrap" 
              style={{ 
                color: '#000000', 
                fontWeight: 700 
              }}
            ><br />
              Take your pick from these 100% free, AI-powered tools to boost your online presence
            </p>
          </div>

          {/* Tools Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tools.map((tool, index) => (
              <div 
                key={index} 
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col border border-gray-200"
                style={{ height: '100%' }}
              >
                <div className="p-6 flex-grow">
                  <div className="flex items-center mb-4">
                    <img 
                      src={tool.icon} 
                      alt={`${tool.title} icon`} 
                      className="w-8 h-8 mr-3 object-contain"
                    />
                    <h3 className="text-xl font-semibold" style={{ color: '#013024' }}>{tool.title}</h3>
                  </div>
                  <p className="mb-4" style={{ color: '#000000', fontWeight: 400 }}>{tool.description}</p>
                </div>
                <div className="p-4 text-right border-t border-gray-100">
                  <Link 
                    to={tool.path}
                    className="font-medium transition-colors duration-200"
                    style={{ 
                      color: '#013024',
                      textDecoration: 'none'
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.color = '#7FAF37';
                      e.currentTarget.style.textDecoration = 'underline';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.color = '#013024';
                      e.currentTarget.style.textDecoration = 'none';
                    }}
                  >
                    Learn more
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SEOTools;
