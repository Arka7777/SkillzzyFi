

// import React, { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import { useWallet } from "../contexts/walletContext";
// import { Coins, X, Menu } from "lucide-react";
// import { IoIosNotifications } from "react-icons/io";

// const Navbar = () => {
//   const [isAnimating, setIsAnimating] = useState(false);
//   const [previousBalance, setPreviousBalance] = useState(0);
//   const [showNotifications, setShowNotifications] = useState(false);
//   const [notifications, setNotifications] = useState([]);
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

//   const { 
//     account, 
//     contract, 
//     connectWallet, 
//     handleDisconnect, 
//     balance, 
//     isConnected,
//     setBalance
//   } = useWallet();

//   // mock data
//   const mockNotifications = [
//     { id: 1, topic: "Purchase", message: "John Doe purchased your course 'React Masterclass' for 50 points", time: "2 hours ago", course: "React Masterclass", buyer: "John Doe", price: "50" },
//     { id: 2, topic: "Purchase", message: "Alice Smith purchased your course 'Web3 Development' for 75 points", time: "1 day ago", course: "Web3 Development", buyer: "Alice Smith", price: "75" },
//     { id: 3, topic: "Exchange", message: "Bob Johnson purchased your course 'Advanced JavaScript' for 60 points", time: "2 days ago", course: "Advanced JavaScript", buyer: "Bob Johnson", price: "60" },
//   ];

//   useEffect(() => {
//     setNotifications(mockNotifications);
//   }, []);

//   const updateBalance = async () => {
//     if (!contract) return;
//     try {
//       const newBalance = await contract.getBalance();
//       setPreviousBalance(balance);
//       setBalance(Number(newBalance));
//       setIsAnimating(true);
//     } catch (error) {
//       console.error("Error updating balance:", error);
//     }
//   };

//   useEffect(() => {
//     if (balance !== previousBalance && previousBalance !== 0) {
//       const timer = setTimeout(() => setIsAnimating(false), 600);
//       return () => clearTimeout(timer);
//     }
//   }, [balance, previousBalance]);

//   const handleWalletClick = async () => {
//     if (isConnected) {
//       handleDisconnect();
//     } else {
//       await connectWallet();
//     }
//   };

//   const toggleNotifications = () => setShowNotifications(!showNotifications);

//   const clearNotification = (id) => {
//     setNotifications(notifications.filter(notification => notification.id !== id));
//   };

//   const clearAllNotifications = () => setNotifications([]);

//   const formatAccount = (addr) => {
//     if (!addr) return "";
//     return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
//   };

//   const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

//   return (
//     <>
//       <nav className="bg-gradient-to-r from-blue-800 via-indigo-900 to-purple-800 shadow-lg px-6 py-4 flex justify-between items-center relative z-50">
//         {/* Logo */}
//         <div className="text-3xl md:text-4xl font-extrabold tracking-wide cursor-pointer 
//           bg-gradient-to-r from-purple-400 via-pink-500 to-yellow-500 
//           bg-clip-text text-transparent 
//           transition-transform duration-300 hover:scale-110 hover:drop-shadow-[0_0_15px_rgba(234,179,8,0.8)]">
//           Skillzzy<span className="text-yellow-400 drop-shadow-[0_0_5px_rgba(234,179,8,0.8)]">Fi</span>
//         </div>

//         {/* Desktop Menu */}
//         <div className="hidden md:flex space-x-6 items-center">
//           <Link to="/" className="nav-link">Home</Link>
//           <Link to="/about" className="nav-link">About</Link>
//           <Link to="/create" className="nav-link">Upload</Link>
//           <Link to="/explore" className="nav-link">Explore</Link>
//           <Link to="/services" className="nav-link">My Uploads</Link>
//           <Link to="/forum" className="nav-link">Forum</Link>

//           <div onClick={updateBalance} className="flex items-center bg-gradient-to-r from-yellow-100 to-yellow-50 rounded-full px-3 py-2 border border-yellow-200 shadow-sm cursor-pointer">
//             <Coins className="h-4 w-4 text-yellow-600" />
//             <span className={`ml-1.5 text-sm font-medium text-yellow-900 transition-transform duration-300 ${isAnimating ? "scale-125" : ""}`}>
//               {balance.toLocaleString()} pts
//             </span>
//           </div>

//           <button onClick={handleWalletClick} className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold rounded-full shadow-md px-4 py-2 transition-transform transform hover:scale-105">
//             {isConnected ? formatAccount(account) : "Connect Wallet"}
//           </button>

//           <Link to="/profile">
//             <button className="rounded-full bg-white text-purple-700 hover:bg-purple-200 px-4 py-2 shadow-lg transition-transform transform hover:scale-105">
//               Profile
//             </button>
//           </Link>

//           <button onClick={toggleNotifications} className="text-white text-3xl relative hover:text-yellow-300 transition duration-300 cursor-pointer">
//             <IoIosNotifications />
//             {notifications.length > 0 && (
//               <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
//                 {notifications.length}
//               </span>
//             )}
//           </button>
//         </div>

//         {/* Mobile Hamburger */}
//         <button onClick={toggleMobileMenu} className="md:hidden text-white text-3xl">
//           {mobileMenuOpen ? <X /> : <Menu />}
//         </button>
//       </nav>

//       {/* Mobile Menu Drawer */}
//       <div className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-40 transform transition-transform duration-300 ease-in-out ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"}`}>
//         <div className="flex justify-between items-center p-4 border-b">
//           <span className="text-lg font-bold">Menu</span>
//           <button onClick={toggleMobileMenu}><X /></button>
//         </div>
//         <div className="flex flex-col p-4 space-y-4">
//           <Link to="/" onClick={toggleMobileMenu} className="mobile-link">Home</Link>
//           <Link to="/about" onClick={toggleMobileMenu} className="mobile-link">About</Link>
//           <Link to="/create" onClick={toggleMobileMenu} className="mobile-link">Upload</Link>
//           <Link to="/explore" onClick={toggleMobileMenu} className="mobile-link">Explore</Link>
//           <Link to="/services" onClick={toggleMobileMenu} className="mobile-link">My Uploads</Link>
//           <Link to="/forum" onClick={toggleMobileMenu} className="mobile-link">Forum</Link>

//           <div onClick={() => {updateBalance(); toggleMobileMenu();}} className="flex items-center bg-yellow-50 rounded-full px-3 py-2 border border-yellow-200 shadow-sm cursor-pointer">
//             <Coins className="h-4 w-4 text-yellow-600" />
//             <span className="ml-1.5 text-sm font-medium text-yellow-900">{balance.toLocaleString()} pts</span>
//           </div>

//           <button onClick={handleWalletClick} className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold rounded-full shadow-md px-4 py-2">
//             {isConnected ? formatAccount(account) : "Connect Wallet"}
//           </button>

//           <Link to="/profile" onClick={toggleMobileMenu}>
//             <button className="rounded-full bg-white text-purple-700 hover:bg-purple-200 px-4 py-2 shadow-lg">
//               Profile
//             </button>
//           </Link>

//           <button onClick={() => {toggleNotifications(); toggleMobileMenu();}} className="text-purple-700 text-lg flex items-center">
//             <IoIosNotifications className="mr-2" /> Notifications
//             {notifications.length > 0 && (
//               <span className="ml-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
//                 {notifications.length}
//               </span>
//             )}
//           </button>
//         </div>
//       </div>

//       {/* Overlay for mobile menu */}
//       {mobileMenuOpen && (
//         <div className="fixed inset-0 bg-black bg-opacity-40 z-30" onClick={toggleMobileMenu}></div>
//       )}

//       {/* Notifications Panel (unchanged) */}
//       <div className={`fixed top-16 right-0 z-40 h-[calc(100vh-4rem)] w-100 bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${showNotifications ? 'translate-x-0' : 'translate-x-full'}`} onClick={(e) => e.stopPropagation()}>
//         <div className="p-4 bg-gradient-to-r from-blue-800 to-purple-800 text-white flex justify-between items-center h-16">
//           <h2 className="text-xl font-bold ">Notifications</h2>
//           <button onClick={toggleNotifications} className="text-white hover:text-yellow-300"><X size={24} /></button>
//         </div>
//         <div className="h-[calc(100%-8rem)] overflow-y-auto p-4">
//           {notifications.length > 0 ? (
//             notifications.map(notification => (
//               <div key={notification.id} className="p-3 mb-3 bg-gray-200 rounded-lg border border-gray-200 hover:bg-gray-300 transition-colors relative">
//                 <button onClick={() => clearNotification(notification.id)} className="absolute top-2 right-2 text-gray-400 hover:text-red-500 transition-colors">
//                   <X size={16} />
//                 </button>
//                 <p className="text-gray-800 pr-6">{notification.message}</p>
//                 <div className="flex justify-between items-center mt-2">
//                   <span className="text-xs text-gray-500">{notification.time}</span>
//                   {notification.topic === "Exchange" ? (
//                     <div className="flex items-center space-x-2">
//                       <button className="bg-green-500 hover:bg-green-600 px-2 py-1 text-white cursor-pointer rounded-2xl">Accept</button>
//                       <button className="bg-red-600 hover:bg-red-700 px-2 py-1 text-white cursor-pointer rounded-2xl">Reject</button>
//                     </div>
//                   ) : (
//                     <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">+{notification.price} pts</span>
//                   )}
//                 </div>
//               </div>
//             ))
//           ) : (
//             <div className="text-center py-8 text-gray-500">
//               <IoIosNotifications className="text-4xl mx-auto mb-2 text-gray-300" />
//               <p>No notifications yet</p>
//               <p className="text-sm mt-1">You'll see notifications here when people purchase your courses</p>
//             </div>
//           )}
//         </div>
//         {notifications.length > 0 && (
//           <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-white h-16">
//             <button onClick={clearAllNotifications} className="w-full py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors text-sm">
//               Clear All Notifications
//             </button>
//           </div>
//         )}
//       </div>
//       {showNotifications && (
//         <div className="fixed inset-0 z-30 bg-opacity-50 backdrop-blur-sm" onClick={toggleNotifications}/>
//       )}
//     </>
//   );
// };

// export default Navbar;

// /* Tailwind helper classes for reuse */
// const navLink = "text-white text-lg font-medium hover:text-yellow-300 transition duration-300 relative after:content-[''] after:absolute after:w-0 after:h-[2px] after:bg-yellow-300 after:left-0 after:-bottom-1 hover:after:w-full after:transition-all after:duration-300";
// const mobileLink = "text-gray-700 font-medium hover:text-purple-600 transition";



import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useWallet } from "../contexts/walletContext";
import { Coins, X, Menu, Wallet, LogOut, User } from "lucide-react";
import { IoIosNotifications } from "react-icons/io";
import Noti from "./Noti"; 
import icon from '../assets/icon.png';
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";


const Navbar = () => {
  const notify = () => toast("Metamask connected seccessfully! ");
  const [isAnimating, setIsAnimating] = useState(false);
  const [previousBalance, setPreviousBalance] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { 
    account, 
    contract, 
    connectWallet, 
    handleDisconnect, 
    balance, 
    isConnected,
    setBalance
  } = useWallet();

  // mock data
  const mockNotifications = [
    { id: 1, topic: "Purchase", message: "John Doe purchased your course 'React Masterclass' for 50 points", time: "2 hours ago", course: "React Masterclass", buyer: "John Doe", price: "50" },
    { id: 2, topic: "Purchase", message: "Alice Smith purchased your course 'Web3 Development' for 75 points", time: "1 day ago", course: "Web3 Development", buyer: "Alice Smith", price: "75" },
    { id: 3, topic: "Exchange", message: "Bob Johnson purchased your course 'Advanced JavaScript' for 60 points", time: "2 days ago", course: "Advanced JavaScript", buyer: "Bob Johnson", price: "60" },
  ];

useEffect(() => {
  const fetchNoties = async () => {
    if (!contract) return;
    try {
      const noties = await contract.getNoties();

      // Convert BigNumber or other types if needed
      const parsedNoties = noties.map((n, idx) => ({
        id: idx,
        topic: n.topic,
        message: n.message,
        sender: n.sender,
        receiver: n.receiver,
      }));

      setNotifications(parsedNoties);
    } catch (err) {
      console.error("Error fetching notifications:", err);
    }
  };

  fetchNoties();
}, [contract]);

  useEffect(()=>{
     console.log("Notifications: ",notifications)
  },[notifications])


  const updateBalance = async () => {
    if (!contract) return;
    try {
      const newBalance = await contract.getBalance();
      setPreviousBalance(balance);
      setBalance(Number(newBalance));
      setIsAnimating(true);
    } catch (error) {
      console.error("Error updating balance:", error);
    }
  };

  useEffect(() => {
    if (balance !== previousBalance && previousBalance !== 0) {
      const timer = setTimeout(() => setIsAnimating(false), 600);
      return () => clearTimeout(timer);
    }
  }, [balance, previousBalance]);

  
 const handleWalletClick = async () => {
  if (isConnected) {
    handleDisconnect();
    toast.info("Wallet disconnected");
  } else {
    try {
      await connectWallet();
      toast.success("Metamask connected successfully!");
    } catch (error) {
      toast.error("Failed to connect wallet ❌");
    }
  }
};


  const toggleNotifications = () => setShowNotifications(!showNotifications);

  const formatAccount = (addr) => {
    if (!addr) return "";
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  return (
    <>
      <nav className="sticky top-0 z-50 bg-gradient-to-r from-blue-800 via-indigo-900 to-purple-800 shadow-lg px-6 py-4 flex justify-between items-center ">
        {/* Logo */}
        <div className="flex items-center space-x-2 cursor-pointer 
          transition-transform duration-300 hover:scale-110">
          <img src={icon} alt="SkillzzyFi" className="h-10 w-10" />
          <Link to="/" className="flex items-center">
            <span className="text-3xl md:text-4xl font-bold font-['JetBrains Mono'] tracking-tight text-white">
              Skillzzy<span className="text-yellow-300 drop-shadow-[0_0_5px_rgba(252,211,77,0.6)]">Fi</span>
            </span>
          </Link>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-6 items-center">
          <Link to="/"  className="text-white text-lg font-medium hover:text-yellow-300 transition duration-300 relative after:content-[''] after:absolute after:w-0 after:h-[2px] after:bg-yellow-300 after:left-0 after:-bottom-1 hover:after:w-full after:transition-all after:duration-300">Home</Link>
          <Link to="/about" className="text-white text-lg font-medium hover:text-yellow-300 transition duration-300 relative after:content-[''] after:absolute after:w-0 after:h-[2px] after:bg-yellow-300 after:left-0 after:-bottom-1 hover:after:w-full after:transition-all after:duration-300">About</Link>
          <Link to="/create" className="text-white text-lg font-medium hover:text-yellow-300 transition duration-300 relative after:content-[''] after:absolute after:w-0 after:h-[2px] after:bg-yellow-300 after:left-0 after:-bottom-1 hover:after:w-full after:transition-all after:duration-300">Upload</Link>
          <Link to="/explore" className="text-white text-lg font-medium hover:text-yellow-300 transition duration-300 relative after:content-[''] after:absolute after:w-0 after:h-[2px] after:bg-yellow-300 after:left-0 after:-bottom-1 hover:after:w-full after:transition-all after:duration-300">Explore</Link>
          {/* <Link to="/services" className="text-white text-lg font-medium hover:text-yellow-300 transition duration-300 relative after:content-[''] after:absolute after:w-0 after:h-[2px] after:bg-yellow-300 after:left-0 after:-bottom-1 hover:after:w-full after:transition-all after:duration-300">My Uploads</Link> */}
          <Link to="/forum" className="text-white text-lg font-medium hover:text-yellow-300 transition duration-300 relative after:content-[''] after:absolute after:w-0 after:h-[2px] after:bg-yellow-300 after:left-0 after:-bottom-1 hover:after:w-full after:transition-all after:duration-300">Forum</Link>

          <div onClick={updateBalance} className="flex items-center bg-gradient-to-r from-yellow-100 to-yellow-50 rounded-full px-3 py-2 border border-yellow-200 shadow-sm cursor-pointer">
            <img src={icon} alt="Points" className="h-5 w-5 mr-0.5" />
            <span className={`ml-1.5 text-sm font-medium text-yellow-900 transition-transform duration-300 ${isAnimating ? "scale-125" : ""}`}>
              {balance.toLocaleString()} pts
            </span>
          </div>

          <button onClick={handleWalletClick } className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold rounded-full shadow-md px-4 py-2 transition-transform transform hover:scale-105 flex items-center space-x-2">
            {isConnected ? (
              <>
                <LogOut size={18} />
                <span>{formatAccount(account)}</span>
              </>
            ) : (
              <>
                <Wallet size={18} />
                <span>Connect Wallet</span>
              </>
            )}
          </button>

          <Link to="/profile">
            <button className="rounded-full bg-white text-purple-700 hover:bg-purple-200 px-4 py-2 shadow-lg transition-transform transform hover:scale-105 flex items-center space-x-2">
              <User size={18} />
              <span>Profile</span>
            </button>
          </Link>

          <button onClick={toggleNotifications} className="text-white text-3xl relative hover:text-yellow-300 transition duration-300 cursor-pointer">
            <IoIosNotifications />
            {notifications.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {notifications.length}
              </span>
            )}
          </button>
        </div>

        {/* Mobile Hamburger */}
        <button onClick={toggleMobileMenu} className="md:hidden text-white text-3xl">
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </nav>

      {/* Mobile Menu Drawer */}
      <div className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-40 transform transition-transform duration-300 ease-in-out ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex justify-between items-center p-4 border-b">
          <span className="text-lg font-bold">Menu</span>
          <button onClick={toggleMobileMenu}><X /></button>
        </div>
        <div className="flex flex-col p-4 space-y-4">
          <Link to="/" onClick={toggleMobileMenu} className="mobile-link">Home</Link>
          <Link to="/about" onClick={toggleMobileMenu} className="mobile-link">About</Link>
          <Link to="/create" onClick={toggleMobileMenu} className="mobile-link">Upload</Link>
          <Link to="/explore" onClick={toggleMobileMenu} className="mobile-link">Explore</Link>
          {/* <Link to="/services" onClick={toggleMobileMenu} className="mobile-link">My Uploads</Link> */}
          <Link to="/forum" onClick={toggleMobileMenu} className="mobile-link">Forum</Link>

          <div onClick={() => {updateBalance(); toggleMobileMenu();}} className="flex items-center bg-yellow-50 rounded-full px-3 py-2 border border-yellow-200 shadow-sm cursor-pointer">
            <img src={icon} alt="Points" className="h-4 w-4 mr-1" />
            <span className="ml-1.5 text-sm font-medium text-yellow-900">{balance.toLocaleString()} pts</span>
          </div>

          <button onClick={handleWalletClick} className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold rounded-full shadow-md px-4 py-2 flex items-center space-x-2 justify-center w-full">
            {isConnected ? (
              <>
                <LogOut size={18} />
                <span>{formatAccount(account)}</span>
              </>
            ) : (
              <>
                <Wallet size={18} />
                <span>Connect Wallet</span>
              </>
            )}
          </button>

          <Link to="/profile" onClick={toggleMobileMenu}>
            <button className="rounded-full bg-white text-purple-700 hover:bg-purple-200 px-4 py-2 shadow-lg w-full flex items-center space-x-2 justify-center">
              <User size={18} />
              <span>Profile</span>
            </button>
          </Link>

          <button onClick={() => {toggleNotifications(); toggleMobileMenu();}} className="text-purple-700 text-lg flex items-center">
            <IoIosNotifications className="mr-2" /> Notifications
            {notifications.length > 0 && (
              <span className="ml-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {notifications.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Overlay for mobile menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-30" onClick={toggleMobileMenu}></div>
      )}

      {/* Notifications Component */}
      <Noti 
        showNotifications={showNotifications}
        toggleNotifications={toggleNotifications}
        notifications={notifications}
        setNotifications={setNotifications}
      />
      <ToastContainer position="top-center"  autoClose={3000} />
    </>
  );
};

export default Navbar;

/* Tailwind helper classes for reuse */
const navLink = "text-white text-lg font-medium hover:text-yellow-300 transition duration-300 relative after:content-[''] after:absolute after:w-0 after:h-[2px] after:bg-yellow-300 after:left-0 after:-bottom-1 hover:after:w-full after:transition-all after:duration-300";
const mobileLink = "text-gray-700 font-medium hover:text-purple-600 transition";