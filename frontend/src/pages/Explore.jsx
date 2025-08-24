
// explore page
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiFilter, FiClock, FiTrendingUp, FiHeart, FiShare2, FiMoreVertical, FiX, FiLoader } from 'react-icons/fi';
import { BsPlayFill, BsDot } from 'react-icons/bs';
import { useWallet } from '../contexts/walletContext';
import { CgArrowsExchange } from "react-icons/cg";
import { Loader } from 'lucide-react';
import { Coins } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Explore = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [topics, setTopics] = useState(['']);
  const [showResults, setShowResults] = useState(false);
  const [matchResults, setMatchResults] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const { contract, account} = useWallet();
  const [videos, setVideos] = useState([]);
  const [accessMap, setAccessMap] = useState({});
  
  // New state for exchange functionality
  const [showExchangeModal, setShowExchangeModal] = useState(false);
  const [exchangeSkills, setExchangeSkills] = useState([]);
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [selectId,setSelectId] = useState(null)
  const [excId,setExcId] = useState(null)
  // const [mySkills,setMySkills] = useState(null);

  // sample skills for exchang
  // const sampleSkills = [
  //   { id: 1, name: "Web Development", level: "Advanced" },
  //   { id: 2, name: "Graphics Design", level: "Intermediate" },
  //   { id: 3, name: "Video Editing", level: "Beginner" },
  //   { id: 4, name: "Content Writing", level: "Advanced" },
  //   { id: 5, name: "Digital Marketing", level: "Intermediate" },
  //   { id: 6, name: "UI/UX Design", level: "Advanced" },
  //   { id: 7, name: "Data Analysis", level: "Intermediate" },
  // ];

  useEffect(() => {
    const getVideos = async () => {
      if (contract) {
        try {
          const newVideos = await contract.getAllContents();
          setVideos(newVideos);

          const accessData = {};
          for (let i = 0; i < newVideos.length; i++) {
            try {
              const hasAccess = await contract.hasAccess(i);
              accessData[i] = hasAccess;
            } catch (error) {
              console.error(`Error checking access for content ${i}:`, error);
              accessData[i] = false;
            }
          }

          setAccessMap(accessData);
          console.log("calculated accessData:", accessData);
        } catch (error) {
          console.error("Error fetching videos:", error);
        }
      }
    };

    getVideos();
  }, [contract]);

  useEffect(() => {
    console.log("accessMap updated:", accessMap);
  }, [accessMap]);

  // Initialize exchange skills (replace with your actual skills data)
useEffect(() => {
  const getMyContent = async () => {
    if (contract && account && videos.length > 0) {
      try {
        // Filter videos where creator is the current account
        const mySkills = videos.filter(video => 
          video.creator && video.creator.toLowerCase() === account.toLowerCase()
        );
        setExchangeSkills(mySkills);
      } catch (error) {
        console.error("Error filtering user content:", error);
      }
    }
  };
  getMyContent();
}, [contract, account, videos]); // Add videos as dependency

  useEffect(() => {
    console.log("own skills updated:", exchangeSkills);
  }, [exchangeSkills]);

  // Updated categories with proper filtering logic
  const categories = [
    { id: 'all', name: 'All Categories', icon: <FiTrendingUp /> },
    { id: 'general', name: 'General', icon: <FiTrendingUp /> },
    { id: 'education', name: 'Education', icon: <FiTrendingUp /> },
    { id: 'music', name: 'Music', icon: <FiTrendingUp /> },
    { id: 'technology', name: 'Technology', icon: <FiTrendingUp /> },
    { id: 'others', name: 'Others', icon: <FiTrendingUp /> }
  ];

  // Fixed filtering logic
  const filteredVideos = videos.filter(video => {
    // Category filtering - 'all' shows all videos, otherwise match category (case-insensitive)
    const matchesCategory = activeFilter === 'all' || 
                           video.category?.toLowerCase() === activeFilter.toLowerCase();
    
    // Search filtering - check title, channel, and category
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = searchQuery === '' || 
                         video.title?.toLowerCase().includes(searchLower) || 
                         video.channel?.toLowerCase().includes(searchLower) ||
                         video.category?.toLowerCase().includes(searchLower);
    
    return matchesCategory && matchesSearch;
  });

  const handleVideoClick = (video) => {
    setSelectedVideo(video);
    setShowModal(true);
  };

  const handleOpenVideo = () => {
    if (selectedVideo) {
      navigate('/course-video', { state: { videoData: selectedVideo } });
      setShowModal(false);
    }
  };

  // const handleBuyNow = async(id) => {
  //   try {
  //     const tx = await contract.purchaseContent(id);
  //     await tx.wait();
  //     alert("Purchased successfully, you may have to refresh your page");
  //     // Refresh access map after purchase
  //     const hasAccess = await contract.hasAccess(id);
  //     setAccessMap(prev => ({...prev, [id]: hasAccess}));
  //   } catch (error) {
  //     console.error("Purchase failed:", error);
  //     alert("Purchase failed. Please try again.");
  //   }
  //   setShowModal(false);
  // };

  const handleBuyNow = async (id) => {
  try {
    const tx = await contract.purchaseContent(id);
    await tx.wait();

    // succ..
    toast.success("Purchased successfully..");

    // Refresh access map after purchase
    const hasAccess = await contract.hasAccess(id);
    setAccessMap((prev) => ({ ...prev, [id]: hasAccess }));
  } catch (error) {
    console.error("Purchase failed:", error);

    //error
    toast.error("Purchase failed ❌ Please try again.");
  }

  setShowModal(false);
};



  const handleExchange = async(id) => {
    try {
      // Show the exchange modal instead of immediate action
      setExcId(id);
      setShowExchangeModal(true);
    } catch (error) {
      console.error("Exchange failed:", error);
      // alert("Exchange failed. Please try again.");
    }
  };

  const handleSkillSelection = async (skill,id) => {
    setSelectedSkill(skill);
    setSelectId(id)
    console.log(excId,":",selectId)
  };

  const confirmExchange = async () => {
    if (!selectedSkill) {
      alert("Please select a skill to exchange");
      return;
    }
    
    try {
      // Add your exchange logic here using the selectedSkill
      // console.log("Exchange initiated for content:", selectedVideo.id, "with skill:", selectedSkill);
      // alert(`Exchange requested with your ${selectedSkill.name} skill!`);
      
      const tx =  await contract.contentExchng(excId,selectId)
      tx.wait();
      // Close both modals
      setShowExchangeModal(false);
      setShowModal(false);
    } catch (error) {
      console.error("Exchange failed:", error);
      alert("Exchange failed. Please try again.");
    }
  };

  const navigate = useNavigate();

  const handlePlayVideo = (video) => {
    console.log("handlePlayVideo called with:", video);
    
    // First check if video exists
    if (!video) {
      console.error("No video provided");
      alert("Unable to play video. Please try again.");
      return;
    }

    // Check if we have a numeric ID
    const videoId = parseInt(video.id);
    if (isNaN(videoId)) {
      console.error("Invalid video ID:", video.id);
      alert("Invalid video ID. Please try again.");
      return;
    }

    console.log("Navigating to video ID:", videoId);
    navigate(`/course-video/${videoId}`);
  };

  const resetAnalysis = () => {
    setShowResults(false);
    setMatchResults([]);
    setIsProcessing(false);
  };

  // Function to format duration - handles both "MM:SS" format and plain text
  const formatVideoDuration = (duration) => {
    if (!duration) return "0:00";
    
    // If duration is already in MM:SS format, return as is
    if (typeof duration === 'string' && duration.includes(':')) {
      return duration;
    }
    
    // If it's a number or string number, treat as minutes
    const minutes = parseInt(duration);
    if (!isNaN(minutes)) {
      return `${minutes}:00`;
    }
    
    // Fallback for any other format
    return duration.toString();
  };

  // AI CONNECTION
  const handleAddTopic = () => {
    if (topics.length < 5) {
      setTopics([...topics, '']);
    }
  };

  const handleTopicChange = (index, value) => {
    const newTopics = [...topics];
    newTopics[index] = value;
    setTopics(newTopics);
  };

  const handleRemoveTopic = (index) => {
    const newTopics = topics.filter((_, i) => i !== index);
    setTopics(newTopics);
  };

  const handleContentMatch = async (video) => {
    const validTopics = topics.filter(topic => topic.trim());
    
    if (validTopics.length === 0) {
      alert("Please enter at least one topic to match");
      return;
    }
    
    setIsProcessing(true);
    setShowResults(true);
    
    // Show initial loading state
    setMatchResults({
      totalTopics: validTopics.length,
      topicsFound: 0,
      topicsMissing: validTopics.length,
      coverage: 0,
      details: validTopics.map(topic => ({
        topic,
        status: "pending",
        confidence: 0,
        explanation: "Analyzing..."
      }))
    });

    try {
      const response = await fetch('http://localhost:5001/process_ipfs_video', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ipfsHash: video.ipfsHash,
          topics: validTopics
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        setMatchResults({
          totalTopics: data.statistics.totalTopics,
          topicsFound: data.statistics.topicsFound,
          topicsMissing: data.statistics.topicsMissing,
          coverage: data.statistics.coverage,
          details: data.details
        });
      } else {
        throw new Error(data.error || 'Analysis failed');
      }
    } catch (error) {
      console.error('Error processing video:', error);
      alert(`Failed to analyze video content: ${error.message}`);
      setShowResults(false);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-6">
      <div className="pr-96">
        <div className="w-full">
          {/* Header */}
          <header className="mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent">
              Explore Content
            </h1>
            <p className="text-gray-400 mt-2">Discover amazing videos from creators worldwide</p>
          </header>

          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search videos, channels, categories..."
                className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              {/* Clear search button */}
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors text-sm"
                >
                  <FiX />
                  <span>Clear</span>
                </button>
              )}
              <div className="flex items-center gap-2 px-4 py-2 bg-gray-800 rounded-lg">
                <FiFilter />
                <span className="text-sm">Filters Active: {categories.find(cat => cat.id === activeFilter)?.name || 'All'}</span>
              </div>
            </div>
          </div>

          {/* Category Chips */}
          <div className="flex overflow-x-auto pb-4 mb-6 scrollbar-hide gap-2">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setActiveFilter(category.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
                  activeFilter === category.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-800 hover:bg-gray-700 text-gray-300'
                }`}
              >
                {category.icon}
                {category.name}
              </button>
            ))}
          </div>

          {/* Results counter */}
          <div className="mb-4">
            <p className="text-gray-400 text-sm">
              {searchQuery || activeFilter !== 'all' 
                ? `Showing ${filteredVideos.length} result${filteredVideos.length !== 1 ? 's' : ''} ${searchQuery ? `for "${searchQuery}"` : ''} ${activeFilter !== 'all' ? `in ${categories.find(cat => cat.id === activeFilter)?.name}` : ''}`
                : `${filteredVideos.length} videos available`
              }
            </p>
          </div>

          {/* Video Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredVideos.map((video, index) => (
              <div 
                key={video.id || index} 
                className="group relative bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] cursor-pointer"
                onClick={() => handleVideoClick(video)}
              >
                {/* Thumbnail */}
                <div className="relative">
                  <img 
                    src={`https://aqua-raw-mollusk-988.mypinata.cloud/ipfs/${video.thumbHash}`} 
                    alt={video.title}
                    className="w-full h-48 object-cover"
                  />
                  {/* Category Badge */}
                  <div className="absolute top-2 left-2 bg-blue-600 bg-opacity-90 px-2 py-1 rounded text-xs font-medium">
                    {video.category || 'General'}
                  </div>
                  {/* Duration Badge */}
                  <div className="absolute bottom-2 right-2 bg-black bg-opacity-80 px-2 py-1 rounded text-sm font-medium">
                    {formatVideoDuration(video.duration)}
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="bg-black bg-opacity-60 rounded-full p-4 hover:bg-opacity-80 transition">
                      <BsPlayFill className="text-white text-2xl" />
                    </div>
                  </div>
                </div>
                 
                {/* Video Info */}
                <div className="p-4">
                  <div className="flex gap-3">
                    <img 
                      src={"https://th.bing.com/th/id/OIP.uuvmdU0rKNYK6ybEnVNjHgHaGW?o=7rm=3&rs=1&pid=ImgDetMain&o=7&rm=3"} 
                      alt={"CodeMaster"}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium line-clamp-2">{video.title}</h3>
                      <p className="text-gray-400 text-sm mt-1">{video.channel || "CodeMaster"}</p>
                      <div className="flex items-center text-gray-400 text-xs mt-1">
                        <FiClock className="mr-1" />
                        <span>{formatVideoDuration(video.duration)}</span>
                        <BsDot className="mx-1" />
                        <span>{video.currentPrice || 10} points</span>
                      </div>
                    </div>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleContentMatch(video);
                      }}
                      className="absolute top-2 right-2 z-10 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-full transition-colors"
                    >
                      Match Content
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Video Selection Modal */}
          {showModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-70 backdrop-blur-md">
              <div className="relative bg-gray-800 rounded-2xl p-6 w-full max-w-md shadow-2xl">
                {/* Close Button */}
                <button 
                  onClick={() => setShowModal(false)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
                >
                  <FiX className="text-xl" />
                </button>
                
                {/* Modal Content */}
                <div className="text-center">
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold mb-2">Video Options</h2>
                    <p className="text-gray-400">Choose how you want to access this content</p>
                  </div>
                  
                  <div className="mb-6">
                    <img 
                      src={`https://aqua-raw-mollusk-988.mypinata.cloud/ipfs/${selectedVideo?.thumbHash}`} 
                      alt={selectedVideo?.title}
                      className="w-full h-50 object-cover rounded-xl mb-4"
                    />
                    <h3 className="font-medium text-lg mb-1">{selectedVideo?.title}</h3>
                    <p className="text-gray-400 text-sm">By {selectedVideo?.channel || "Unknown Creator"}</p>
                    <div className="flex items-center justify-center text-gray-400 text-sm mt-2">
                      <FiClock className="mr-1" />
                      <span>{formatVideoDuration(selectedVideo?.duration)}</span>
                      <BsDot className="mx-1" />
                      <span>{selectedVideo?.currentPrice || 10} points</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-end gap-2">
                    <button 
                      onClick={() => {
                        // Always allow video playback for now, comment out access check temporarily
                        // if (accessMap[selectedVideo?.id]) {
                          handlePlayVideo(selectedVideo);
                        // } else {
                        //   alert(`This video costs ${selectedVideo?.currentPrice || 10} points`);
                        // }
                      }}
                      className="flex items-center justify-center gap-1 bg-yellow-600 hover:bg-yellow-700 text-white py-2 px-4 rounded-[20px] transition-colors font-medium text-sm"
                    >
                      <i className="ri-play-fill text-lg"></i>
                      <Coins className="h-4 w-4" />
                      {selectedVideo?.currentPrice || 10}
                    </button>
                    {accessMap[selectedVideo.id] ? ( // Changed from accessMap check to always allow for debugging
                      <button 
                        onClick={() => {
                          console.log("Opening video:", selectedVideo);
                          handlePlayVideo(selectedVideo);
                        }}
                        className="flex items-center justify-center gap-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-[20px] transition-colors font-medium text-sm"
                      >
                        <i className="ri-play-fill text-lg"></i>
                        Open Video
                      </button>
                    ) : (
                      <>
                        <button 
                          onClick={() => {handleBuyNow(selectedVideo.id)}}
                          className="flex items-center justify-center gap-1 bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-[20px] transition-colors font-medium text-sm"
                        >
                          <i className="ri-heart-line text-lg"></i>
                          Buy Now
                        </button>
                        
                        <div className="relative group">
                          <button 
                            onClick={() => {handleExchange(selectedVideo.id)}}
                            className="flex items-center justify-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-4 rounded-[20px] transition-colors font-medium text-sm"
                          >
                            <CgArrowsExchange className="text-lg" />
                            Exchange
                          </button>
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block w-48 bg-white text-black text-xs rounded-md py-2 px-3 shadow-lg z-10">
                            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1 w-3 h-3 rotate-45 bg-white"></div>
                            Exchange your skill with anyone
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Exchange skil  */}
          {showExchangeModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-70 backdrop-blur-md">
              <div className="relative bg-gray-800 rounded-2xl p-6 w-full max-w-md max-h-[80vh] overflow-hidden shadow-2xl">
                {/* Close Button */}
                <button 
                  onClick={() => setShowExchangeModal(false)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
                >
                  <FiX className="text-xl" />
                </button>
                
                {/* Modal content */}
                <div className="text-center">
                  <div className="mb-4">
                    <h2 className="text-2xl font-bold mb-2">Exchange Skills</h2>
                    <p className="text-gray-400">Select a skill to exchange for this content</p>
                  </div>
                  
                  <div className="mb-4">
                    <div className="flex items-center justify-center gap-3 bg-gray-700 p-3 rounded-lg mb-4">
                      <img 
                        src={`https://aqua-raw-mollusk-988.mypinata.cloud/ipfs/${selectedVideo?.thumbHash}`} 
                        alt={selectedVideo?.title}
                        className="w-12 h-12 object-cover rounded-lg"
                      />
                      <div className="text-left">
                        <h3 className="font-medium text-sm line-clamp-1">{selectedVideo?.title}</h3>
                        <p className="text-gray-400 text-xs">By {selectedVideo?.channel || "Unknown Creator"}</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Skills List */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-3 text-left">Your Skills</h3>
                    <div className="max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800 rounded-lg">
                      {exchangeSkills.map((skill) => (
                        <div 
                          key={skill.id}
                          onClick={() => handleSkillSelection(skill,skill.id)}
                          className={`p-3 mb-2 rounded-lg cursor-pointer transition-colors ${
                            selectedSkill?.id === skill.id 
                              ? 'bg-blue-600 border-2 border-blue-400' 
                              : 'bg-gray-700 hover:bg-gray-600'
                          }`}
                        >
                          <div className="flex justify-between items-center">
                            <span className="font-medium">{skill.title}</span>
                            <span className="text-xs bg-gray-600 px-2 py-1 rounded-full">
                              {skill.category}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex justify-end gap-2">
                    <button 
                      onClick={() => setShowExchangeModal(false)}
                      className="px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={confirmExchange()}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-colors flex items-center gap-1"
                      disabled={!selectedSkill}
                    >
                      <CgArrowsExchange className="text-lg" />
                      Confirm Exchange
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}


          {/* Empty State */}
          {filteredVideos.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="bg-gray-800 p-6 rounded-full mb-4">
                <FiSearch className="text-4xl text-gray-400" />
              </div>
              <h3 className="text-xl font-medium mb-2">No videos found</h3>
              <p className="text-gray-400 max-w-md">
                {searchQuery 
                  ? `No results found for "${searchQuery}". Try different keywords or categories.`
                  : `No videos found in ${categories.find(cat => cat.id === activeFilter)?.name}. Try selecting a different category.`
                }
              </p>
              {(searchQuery || activeFilter !== 'all') && (
                <button 
                  onClick={() => {
                    setSearchQuery('');
                    setActiveFilter('all');
                  }}
                  className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                >
                  Show All Videos
                </button>
              )}
            </div>
          )}
        </div>

        {/* TOPIC INPUT SECTION WITH RESULT SHOWCASING */}
        {/* Topic Input Section */}
        <div className="fixed top-21 right-6 bottom-6 w-80 bg-gray-800 p-6 rounded-xl transition-all duration-300 overflow-y-auto">
          <h3 className="text-xl font-semibold mb-4 sticky top-0 bg-gray-800 py-2">
            {!showResults ? 'Match Content' : 'Analysis Results'}
          </h3>
          {!showResults ? (
            <div className="space-y-4">
              {topics.map((topic, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={topic}
                    onChange={(e) => handleTopicChange(index, e.target.value)}
                    placeholder="Enter topic"
                    className="flex-1 px-3 py-2 bg-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {index > 0 && (
                    <button
                      onClick={() => handleRemoveTopic(index)}
                      className="p-2 text-gray-400 hover:text-red-500"
                    >
                      <FiX />
                    </button>
                  )}
                </div>
              ))}
              {topics.length < 5 && (
                <button
                  onClick={handleAddTopic}
                  className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                >
                  + Add Topic
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {/* Summary Stats */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-700 p-3 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-400">Total</div>
                    <div className="text-lg font-bold">{matchResults.totalTopics || 0}</div>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <div className="text-sm text-gray-400">Found</div>
                    <div className="text-lg font-bold text-green-500">{matchResults.topicsFound || 0}</div>
                  </div>
                </div>
                <div className="bg-gray-700 p-3 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-400">Missing</div>
                    <div className="text-lg font-bold text-red-500">{matchResults.topicsMissing || 0}</div>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <div className="text-sm text-gray-400">Coverage</div>
                    <div className="text-lg font-bold text-yellow-500">{matchResults.coverage || 0}%</div>
                  </div>
                </div>
              </div>

              {/* Warning Banner */}
              {/* {matchResults.topicsMissing > 0 && (
                <div className="bg-yellow-500 bg-opacity-20 border border-yellow-600 text-yellow-500 px-3 py-2 rounded-lg text-sm">
                  ⚠️ Missing Content
                </div>
              )} */}

              {/* Sub-topics Section */}
              {isProcessing ? (
                <div className="text-center py-8">
                  <FiLoader className="animate-spin text-4xl mx-auto mb-4 text-blue-500" />
                  <p className="text-sm text-gray-400">Analyzing video content...</p>
                  <p className="text-xs text-gray-500 mt-1">This may take a few moments</p>
                </div>
              ) : (
                <>
                  <div className="bg-gray-700 p-4 rounded-lg">
                    <h4 className="font-semibold mb-3 text-sm">📝 Detailed Analysis</h4>
                    <div className="space-y-3 text-sm max-h-60 overflow-y-auto">
                      {matchResults.details?.map((detail, index) => (
                        <div key={index} className="border-l-2 border-gray-600 pl-3">
                          <div className={`flex items-center gap-2 mb-1 ${
                            detail.status === 'found' ? 'text-green-400' : 
                            detail.status === 'pending' ? 'text-yellow-400' : 'text-red-400'
                          }`}>
                            <span>
                              {detail.status === 'found' ? '✓' : 
                               detail.status === 'pending' ? '○' : '✗'}
                            </span>
                            <div className="flex-1 min-w-0">
                              <div className="truncate font-medium">{detail.topic}</div>
                              {detail.status !== 'pending' && (
                                <div className="text-xs text-gray-400">
                                  {detail.confidence}% confidence
                                </div>
                              )}
                            </div>
                          </div>
                          {detail.explanation && detail.status !== 'pending' && (
                            <div className="text-xs text-gray-400 mt-1 pl-6">
                              {detail.explanation}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={resetAnalysis}
                      className="flex-1 px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors text-sm"
                    >
                      Back to Topics
                    </button>
                    {selectedVideo && (
                      <button
                        onClick={() => handlePlayVideo(selectedVideo)}
                        className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors text-sm flex items-center justify-center gap-1"
                      >
                        <BsPlayFill className="text-lg" />
                        Watch Video
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
      <ToastContainer position="top-center"  autoClose={3000} />
    </div>
  );
};

export default Explore;