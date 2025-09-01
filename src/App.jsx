import { useState, useRef, useEffect } from 'react'
import React from 'react';
import './index.css'
import { BiHome } from "react-icons/bi";
import { HiOutlineClipboardDocumentList } from "react-icons/hi2";
import { BiMessageRounded } from "react-icons/bi";
import { IoAddOutline, IoMailOutline, IoCloseOutline } from "react-icons/io5";
import { TbInvoice } from "react-icons/tb";
import { LuCalendarDays } from "react-icons/lu";
import { IoSettingsOutline } from "react-icons/io5";
import { FaRegUser } from "react-icons/fa";
import { FaHistory } from "react-icons/fa";
import { IoSearchOutline } from "react-icons/io5";
import { MdOutlinePhoneInTalk } from "react-icons/md";
import { CiVideoOn } from "react-icons/ci";
import { IoMdMore } from "react-icons/io";
import { FiArrowLeft, FiAtSign } from "react-icons/fi";
import { MdFormatColorText } from "react-icons/md";
import { CgAttachment } from "react-icons/cg";
import { GoSmiley } from "react-icons/go";
import { AiOutlinePicture } from "react-icons/ai";
import { IoMdLink } from "react-icons/io";
import { GrSend } from "react-icons/gr";
import { CiLocationOn } from "react-icons/ci";
import { MdOutlinePersonAddAlt } from "react-icons/md";
import { FiMessageCircle } from "react-icons/fi";
import { BsInfo } from "react-icons/bs";
import { MdOutlinePeopleAlt } from "react-icons/md";
import { BsCheckAll } from "react-icons/bs";
import { HiMenuAlt2 } from "react-icons/hi";
import { RiContactsBook3Line } from "react-icons/ri";

function App() {
  const [activeIcon, setActiveIcon] = useState(1);
  const [activePosition, setActivePosition] = useState(0);
  const [users, setUsers] = useState([]);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [groupLoading, setGroupLoading] = useState(true);
  const [error, setError] = useState(null);
  const [groupError, setGroupError] = useState(null);
  const [chatList, setChatList] = useState([]);
  const [userChats, setUserChats] = useState([]);
  const [userDetails, setUserDetails] = useState(null);
  const [chatLoading, setChatLoading] = useState(true);
  const [userChatLoading, setUserChatLoading] = useState(true);
  const [userDetailsLoading, setUserDetailsLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [userSearchTerm, setUserSearchTerm] = useState("");
  const [messageSearchTerm, setMessageSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [filteredMessages, setFilteredMessages] = useState([]);
  const [isSearchingMessages, setIsSearchingMessages] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isUserListOpen, setIsUserListOpen] = useState(true);
  const [isUserDetailsOpen, setIsUserDetailsOpen] = useState(false);
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 1024);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  
  const iconRefs = useRef([]);
  const chatContainerRef = useRef(null);
  
  const sideBarIcon = [
    { id: 1, icon: <BiHome size={35} />, name: "Home" },
    { id: 2, icon: <HiOutlineClipboardDocumentList size={35} />, name: "Documents" },
    { id: 3, icon: <FaHistory size={30} />, name: "History" },
    { id: 4, icon: <IoMailOutline size={35} />, name: "Mail" },
    { id: 5, icon: <TbInvoice size={35} />, name: "Invoices" },
    { id: 6, icon: <LuCalendarDays size={35} />, name: "Calendar" },
    { id: 7, icon: <BiMessageRounded size={35} />, name: "Messages" },
    { id: 8, icon: <IoSettingsOutline size={35} />, name: "Settings" },
    { id: 9, icon: <FaRegUser size={35} />, name: "Profile" },
  ]

  // Check screen size and update isMobileView state
  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 1024);
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(false);
        setIsUserListOpen(true);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // SideBar 
  useEffect(() => {
    const timer = setTimeout(() => {
      if (iconRefs.current[0]) {
        setActivePosition(iconRefs.current[0].offsetTop);
      }
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  const handleIconClick = (id, index) => {
    setActiveIcon(id);
    if (iconRefs.current[index]) {
      setActivePosition(iconRefs.current[index].offsetTop);
    }
    if (isMobileView) {
      setIsSidebarOpen(false);
    }
  };

  // Fetch all data from APIs
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const usersResponse = await fetch('https://mock-test.worthycodes.com/api/chatSystem/users/list');
        if (!usersResponse.ok) throw new Error('Failed to fetch users');
        const usersData = await usersResponse.json();
        setUsers(usersData);
        setFilteredUsers(usersData);

        const groupsResponse = await fetch('https://mock-test.worthycodes.com/api/chatSystem/groups/list');
        if (!groupsResponse.ok) throw new Error('Failed to fetch groups');
        const groupsData = await groupsResponse.json();
        setGroups(groupsData);

        const chatListResponse = await fetch('https://mock-test.worthycodes.com/api/chatSystem/chat/list');
        if (!chatListResponse.ok) throw new Error('Failed to fetch chat list');
        const chatListData = await chatListResponse.json();
        setChatList(chatListData);

        if ( !isMobileView && usersData.length > 0){
          setSelectedUser(usersData[0])
        }

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
        setGroupLoading(false);
        setChatLoading(false);
      }
    };

    fetchAllData();
  }, []);


   // Filter users based on search term
  useEffect(() => {
    if (!userSearchTerm) {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter(user => 
        user.username.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
        user.phone.includes(userSearchTerm)
      );
      setFilteredUsers(filtered);
    }
  }, [userSearchTerm, users]);

  // Filter messages based on search term
  useEffect(() => {
    if (!messageSearchTerm) {
      setFilteredMessages(userChats);
      setIsSearchingMessages(false);
    } else {
      const filtered = userChats.filter(chat => {
      
        const messageText = String(chat.message || '');
        return messageText.toLowerCase().includes(messageSearchTerm.toLowerCase());
      });
      setFilteredMessages(filtered);
      setIsSearchingMessages(true);
    }
  }, [messageSearchTerm, userChats]);
  
  // Fetch user chats when selected user changes
  useEffect(() => {
    const fetchUserChats = async () => {
      if (!selectedUser) return;
      
      try {
        setUserChatLoading(true);
        const userChatsResponse = await fetch(`https://mock-test.worthycodes.com/api/chatSystem/chatByUserId/${selectedUser.id}`);
        if (!userChatsResponse.ok) throw new Error('Failed to fetch user chats');
        const userChatsData = await userChatsResponse.json();
        setUserChats(userChatsData);
        setFilteredMessages(userChatsData);
        setMessageSearchTerm(""); 
        
      
        if (isMobileView) {
          setIsUserListOpen(false);
          setIsUserDetailsOpen(false);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setUserChatLoading(false);
      }
    };

    fetchUserChats();
  }, [selectedUser, isMobileView]);

  // Fetch user details when selected user changes
  useEffect(() => {
    const fetchUserDetails = async () => {
      if (!selectedUser) return;
      
      try {
        setUserDetailsLoading(true);
        const userDetailsResponse = await fetch(`https://mock-test.worthycodes.com/api/chatSystem/user/${selectedUser.id}`);
        if (!userDetailsResponse.ok) throw new Error('Failed to fetch user details');
        const userDetailsData = await userDetailsResponse.json();
        setUserDetails(userDetailsData);
      } catch (err) {
        setError(err.message);
      } finally {
        setUserDetailsLoading(false);
      }
    };

    fetchUserDetails();
  }, [selectedUser]);

  // Scroll to bottom of chat when new messages arrive
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [userChats]);

  // Function to handle sending a new message
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedUser) return;
    
    try {
   
      const fromUser = 5;
      const toUser = selectedUser.id;
      
      const response = await fetch('https://mock-test.worthycodes.com/api/chatSystem/chats/add', {
        method: 'POST',
        
        body: JSON.stringify({
          fromUser,
          toUser,
          message: newMessage
        })
      });
      
      if (!response.ok) throw new Error('Failed to send message');
      
    
      const newChat = {
        id: Date.now(), 
        fromUser,
        toUser,
        message: newMessage,
        timestamp: Date.now()
      };
      
      setUserChats([...userChats, newChat]);
      setFilteredMessages([...userChats, newChat]);
      setNewMessage("");
      
    } catch (err) {
      setError(err.message);
    }
  };

  const UserList = ({ users, loading, error, onUserSelect }) => {
    if (loading) {
      return <div className="p-4 text-center">Loading users...</div>;
    }

    if (error) {
      return <div className="p-4 text-center text-red-500">Error: {error}</div>;
    }

    return (
      <div className="mt-4 max-h-[350px] overflow-y-auto space-y-5 w-full">
        {users.map(user => (
          <div 
            key={user.id} 
            className={`flex items-start justify-between rounded-xl cursor-pointer p-2 ${(selectedUser?.id === user.id && selectedUser !==null) ? 'bg-primary/5' : ''}`}
            onClick={() => onUserSelect(user)}
          >
            <div className='flex items-center'>
              <div className="relative">
                <img 
                  src={user.profileImage} 
                  alt={user.username}
                  className="w-12 h-12 rounded-full object-cover object-center"
                />
                <div className="absolute -bottom-1 right-[19px] w-2 h-2 bg-green-400 rounded-full border-2 border-white"></div>
              </div>
              <div className="ml-3">
                <div className="font-semibold flex flex-col sm:flex-row sm:items-center gap-1">
                  <div className='text-sm'>{user.username}</div> 
                  <div className="hidden sm:block">-</div>
                  <div className="text-[12px] text-gray-500"> {user.address}</div>
                </div>
                <div className="text-gray-500 flex items-center gap-x-2">
                  <div className='text-[12px]'>{user.position}</div> 
                </div>
                
              </div>
            </div>
            <div>
              <div className='text-[10px] bg-accent text-center rounded-full py-0.5 text-white'>1</div>
              <div className='text-primary mt-3'>
                <BsCheckAll size={20}/>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Function to get user by ID
  const getUserById = (id) => {
    return users.find(user => user.id === id);
  };

  // Function to get group names for a specific user ID
  const getGroupsForUser = (userId) => {
    return groups
      .filter(group => group.users.includes(userId))
      .map(group => group.name);
  };

  // Function to get group details for a specific user ID
  const getGroupsForUserWithDetails = (userId) => {
    return groups
      .filter(group => group.users.includes(userId))
      .map(group => ({
        id: group.id,
        name: group.name,
        users: group.users
      }));
  };

  
  const getGroupParticipants = (groupId, currentUserId) => {
    const group = groups.find(g => g.id === groupId);
    if (!group) return [];
    
    return group.users.filter(userId => userId !== currentUserId);
  };

  const GroupLists = ({ groups, loading, error }) => {
    if (loading) {
      return <div className="p-4 text-center">Loading groups...</div>;
    }

    if (error) {
      return <div className="p-4 text-center text-red-500">Error: {error}</div>;
    }

    return (
      <div className='mt-3 grid grid-cols-1 gap-y-3 w-full'>
        {groups.map(group => {
         
          const displayUser = group.users.length > 0 ? group.users[0] : null;
          const remainingUsers = group.users.length - 1;
          
          return (
            <div key={group.id} className='flex items-center justify-between w-full text-black rounded-lg p-2'>
              <div className='flex w-full items-center gap-x-2'>
                <div className={`w-auto ${group.id===1?'bg-purple-600/20 text-purple-600 px-3':''} ${group.id===2?'bg-amber-500/10 text-amber-500 px-3':''} ${group.id===3?'bg-red-500/10 text-red-500 px-4':''} ${group.id===4?'bg-green-500/10 text-green-500 px-[10px]':''} ${group.id===5?'bg-blue-500/10 text-blue-500 px-3':''} ${group.id===6?'bg-indigo-500/20 text-indigo-500 px-3':''} py-1 rounded-lg font-bold`}> 
                  {group.name.charAt(0)?.toLocaleUpperCase()}
                </div>
                <div className="truncate">{group.name}</div>
              </div>
              <div className='relative flex -space-x-4'>
                {displayUser ? (
                  <>
                    <img 
                      src={getUserById(displayUser)?.profileImage} 
                      alt={getUserById(displayUser)?.username}
                      className="w-8 h-8 rounded-full border-2 border-white"
                    />
                    {remainingUsers > 0 && (
                      <div className="w-10 rounded-full bg-bg-300 border-white flex items-center justify-center text-xs font-bold">
                        +{remainingUsers}
                      </div>
                    )}
                  </>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // Chat Display Component
  const ChatDisplay = ({ userChats, loading, error, searchTerm }) => {
    if (loading) {
      return <div className="p-4 text-center h-full flex items-center justify-center">Loading chats...</div>;
    }

    if (error) {
      return <div className="p-4 text-center text-red-500 h-full flex items-center justify-center">Error: {error}</div>;
    }

    // Format timestamp to readable time
    const formatTime = (timestamp) => {
      const date = new Date(timestamp);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    
    const highlightSearchTerm = (text, term) => {
      if (!term) return text;
      
      
      const textString = String(text || '');
      const regex = new RegExp(`(${term})`, 'gi');
      const parts = textString.split(regex);
      
      return parts.map((part, index) => 
        part.toLowerCase() === term.toLowerCase() ? 
          <mark key={index} className="bg-yellow-200">{part}</mark> : 
          part
      );
    };

    return (
      <div className="h-full flex flex-col">
        <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4">
          {userChats.length === 0 ? (
            <div className="text-center text-gray-500 py-4">
              {searchTerm ? "No messages found" : "No messages yet"}
            </div>
          ) : (
            userChats.map(chat => {
              const user = getUserById(chat.fromUser);
              const isCurrentUser = chat.fromUser === 5; 
              
              return (
                <div key={chat.id} className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-xs rounded-lg p-3 ${isCurrentUser ? 'bg-primary text-white' : 'bg-gray-200'}`}>
                    <div className="flex items-center mb-1">
                      {!isCurrentUser && (
                        <img 
                          src={user?.profileImage} 
                          alt={user?.username}
                          className="w-6 h-6 rounded-full mr-2"
                        />
                      )}
                      <span className="text-sm font-semibold">
                        {isCurrentUser ? 'You' : user?.username}
                      </span>
                    </div>
                   
                    <p className="text-sm">
                      {highlightSearchTerm(
                        typeof chat.message === 'object' ? JSON.stringify(chat.message) : chat.message,
                        searchTerm
                      )}
                    </p>
                    {chat.image && (
                      <img 
                        src={chat.image} 
                        alt="Chat attachment"
                        className="mt-2 rounded-lg max-w-full"
                      />
                    )}
                    <div className="text-xs mt-1 opacity-70 text-right">
                      {formatTime(chat.timestamp)}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    );
  };

   // Component to display group participants with profile images
  const GroupParticipants = ({ group, currentUserId }) => {
    if (!group) return null;
    
    const participants = getGroupParticipants(group.id, currentUserId);
    const displayParticipants = participants.slice(0, 3);
    const remainingParticipants = participants.length - 3;
    
    return (
      <div className="flex items-center mt-2 w-full justify-between p-2">
        <div className="text-sm items-center flex gap-x-2">
          <div className='text-green-500 bg-green-500/10 px-2 p-1 rounded-lg'>{group.name?.charAt(0)?.toLocaleUpperCase()}</div>
          <div className="truncate">{group.name}</div>
        </div>
        <div className="relative flex -space-x-3">
          {displayParticipants.map(userId => {
            const user = getUserById(userId);
            return user ? (
              <img 
                key={userId}
                src={user.profileImage} 
                alt={user.username}
                className="w-6 h-6 rounded-full border-2 border-white"
              />
            ) : null;
          })}
          {remainingParticipants > 0 && (
            <div className="w-6 h-6 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs font-bold">
              +{remainingParticipants}
            </div>
          )}
        </div>
      </div>
    );
  };

  // Mobile navigation header
  const MobileHeader = () => {
    if (!isMobileView) return null;
    
    return (
      <div className="lg:hidden flex items-center justify-between p-4 bg-white border-b">
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
          <HiMenuAlt2 size={24} />
        </button>
        
        <div className="font-bold text-xl">Chat</div>
        
        {selectedUser && !isUserListOpen ? (
          <button onClick={() => {
            if (isUserDetailsOpen) {
              setIsUserDetailsOpen(false);
              setIsUserListOpen(true)
            } else {
              setIsUserListOpen(true);
            }
            setSelectedUser(null)
          }} className="text-primary">
            <RiContactsBook3Line size={24}/>
          </button>
        ) : (
          <div className="w-8"></div> 
        )}
      </div>
    );
  };

  // Mobile view controls
  const MobileViewControls = () => {
    if (!isMobileView || !selectedUser) return null;
    
    return (
      <div className="lg:hidden flex justify-center items-center p-3 bg-white border-t border-zinc-300">
        <button 
             onClick={() => {
          if (isUserDetailsOpen) {
            setIsUserDetailsOpen(false);
            setIsUserListOpen(true)
          } else {
            setIsUserListOpen(true);
          }
          setSelectedUser(null);
        }}
          className={`px-3 py-3 rounded-full ${isUserListOpen ? 'bg-primary text-white' : 'bg-gray-100'}`}
        >
          <GrSend size={20}/>
        </button>
         
       
      </div>
    );
  };

  return (
    <div className='h-screen w-full relative flex gap-x-5'>
      {/* Mobile Overlay for Sidebar */}
      {isMobileView && isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-white/10 backdrop-blur-[12px] bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}
      
      {/* SideBar */}
      <div className={`fixed lg:relative z-50 h-full bg-white lg:bg-transparent transform transition-transform ${isMobileView?'overflow-y-auto':""} duration-300 ease-in-out 
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        <div className='text-white space-y-5 flex flex-col justify-between items-center h-full py-4'>
          <div className='relative w-auto h-auto flex flex-col justify-center bg-primary rounded-r-[40px] items-center gap-y-2'>
            <div 
              className='w-[4px] rounded-r-xl bg-red-500 absolute left-0 bottom-0 transition-all duration-300'
              style={{ 
                height: '50px',
                top: `${activePosition + 13}px`
              }}
            ></div>
            {sideBarIcon.map((icon, index) => (
              <div 
                key={icon.id} 
                ref={el => iconRefs.current[index] = el}
                className={`relative py-5 cursor-pointer px-7`} 
                onClick={() => handleIconClick(icon.id, index)}
              >
                {icon.icon}
                {index===6 &&(<div className='absolute top-2 right-3 rounded-full px-2 bg-amber-400'>2</div>)}
              </div>
            ))}
          </div>
          <div className='mb-5'>
            <div className='relative bg-cover bg-center w-15 h-15 rounded-full' style={{backgroundImage: `url(${getUserById(5)?.profileImage})`}}>
              <div className='w-5 h-5 absolute -bottom-1 bg-green-400 border-4 rounded-full -right-1'></div>
            </div>
            <div className='w-5 mt-2 text-black font-bold'>{getUserById(5)?.username}</div>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className={`w-full flex flex-col lg:flex-row ${isMobileView?'':'p-5'}`}>
        
        <MobileHeader />
        
        <div className='flex-1 flex flex-col lg:flex-row overflow-hidden'>
          {/* Left Panel - User List and Groups */}
          <div className={`lg:w-1/4 flex flex-col gap-y-6 p-4 lg:p-0 bg-white lg:bg-transparent 
            ${isMobileView && !isUserListOpen ? 'hidden  ' : 'flex'} overflow-y-auto h-full`}>
            <div className='bg-white w-full rounded-xl p-4 drop-shadow-md'>
              <div className='flex gap-x-3 items-center bg-bg-300 rounded-xl p-4'>
                <div>
                  <IoSearchOutline size={25} className='text-gray-400'/>
                </div>
                <input 
                  type="text" 
                  placeholder='Search Contact' 
                  className='outline-none border-none font-bold flex-1' 
                  value={userSearchTerm}
                  onChange={(e) => setUserSearchTerm(e.target.value)}
                />
              </div>
              <div className=''>
                <UserList 
                  users={filteredUsers} 
                  loading={loading} 
                  error={error} 
                  onUserSelect={setSelectedUser}
                />
              </div>
              <div className='mt-4 grid grid-cols-2 gap-x-3 font-semibold'>
                <button className='bg-primary text-white py-3 rounded hover:bg-primary/80'>Meeting</button>
                <button className='bg-bg-300 text-black py-3 rounded hover:bg-bg-300/60'>Schedule</button>
              </div>
            </div> 

            <div className={`bg-white rounded-lg p-4  w-full drop-shadow-lg  ${!isMobileView?'max-h-[calc(100%-120px)] overflow-y-auto':""} `}>
              <div className='flex w-full justify-between items-center'>
                <div className='sticky font-bold text-xl'>Groups ({groups.length})</div>
                <div><IoAddOutline size={20}/></div>
              </div>
              <div className='w-full'>
                <GroupLists groups={groups} loading={groupLoading} error={groupError}/>
              </div>
            </div>
          </div>

          {/* Middle Panel - Chat Interface */}
          <div className={`flex-1 flex flex-col bg-white rounded-lg overflow-hidden ${isMobileView?'':'ml-5 w-full'} 
            ${isMobileView && (isUserListOpen || isUserDetailsOpen) ? 'hidden' : 'flex'}`}>
            {selectedUser !==null ? (
              <>
                <div className='p-4 border-b border-zinc-300 flex items-center'>
                  {isMobileView ? (
                    // Mobile view with expandable search
                    isSearchExpanded ? (
                      // Expanded search view (covers header)
                      <>
                        <button 
                          onClick={() => {
                            setIsSearchExpanded(false);
                            setMessageSearchTerm(""); // Clear search when closing
                            
                          }}
                          className="mr-3"
                        >
                          <IoCloseOutline size={20} />
                        </button>
                        <div className='flex-1 flex items-center bg-bg-300 rounded-lg px-3 py-2'>
                          <IoSearchOutline size={18} className='text-gray-400 mr-2'/>
                          <input 
                            placeholder='Search messages...' 
                            className='text-md font-semibold outline-none border-none bg-transparent w-full'
                            value={messageSearchTerm}
                            onChange={(e) => setMessageSearchTerm(e.target.value)}
                            autoFocus // Focus input when expanded
                          />
                        </div>
                      </>
                    ) : (
                      // Regular mobile header view
                      <>
                        <button 
                          onClick={() => {
                            setSelectedUser(null)
                            console.log(selectedUser)
                            setIsUserListOpen(true)}}
                          className="mr-3"
                        >
                          <IoCloseOutline size={20} />
                        </button>
                        <div 
                          style={{backgroundImage: `url(${selectedUser.profileImage})`}} 
                          className='w-10 h-10 rounded-full bg-center bg-cover cursor-pointer'
                          onClick={() => setIsUserDetailsOpen(true)}
                        ></div>
                        <div className='ml-3 flex-1'>
                          <div className='font-semibold text-md'>{selectedUser.username}</div>
                          <div className='text-xs text-zinc-500'>
                            {getGroupsForUser(selectedUser.id).length > 0 ? (
                              <div className="truncate">
                                {getGroupsForUser(selectedUser.id).join(', ')}
                              </div>
                            ) : (
                              <p>User is not in any groups</p>
                            )}
                          </div>
                        </div>
                        <div className='flex items-center gap-x-2'>
                          <button 
                            onClick={() => setIsSearchExpanded(true)}
                            className='p-1 text-zinc-400'
                          >
                            <IoSearchOutline size={20}/>
                          </button>
                          <div className='p-1 rounded-full border-2 border-zinc-400 text-zinc-400'>
                            <MdOutlinePhoneInTalk size={15}/>
                          </div>
                          <div className='p-1 rounded-full border-2 border-zinc-400 text-zinc-400'>
                            <CiVideoOn size={15}/>
                          </div>
                          <div className='p-1 rounded-full border-2 border-zinc-400 text-zinc-400'>
                            <IoMdMore size={15}/>
                          </div>
                        </div>
                      </>
                    )
                  ) : (
                    // Desktop view (unchanged)
                    <>
                      <div 
                        style={{backgroundImage: `url(${selectedUser.profileImage})`}} 
                        className='w-10 h-10 rounded-full bg-center bg-cover'
                      ></div>
                      <div className='ml-3 flex-1'>
                        <div className='font-semibold text-md'>{selectedUser.username}</div>
                        <div className='text-xs text-zinc-500'>
                          {getGroupsForUser(selectedUser.id).length > 0 ? (
                            <div>
                              {getGroupsForUser(selectedUser.id).join(', ')}
                            </div>
                          ) : (
                            <p>User is not in any groups</p>
                          )}
                        </div>
                      </div>
                      <div className='flex items-center gap-x-2'>
                        <div className='text-zinc-400'><IoSearchOutline size={20}/></div>
                        <input 
                          placeholder='Search' 
                          className='text-md font-semibold outline-none border-none w-25'
                          value={messageSearchTerm}
                          onChange={(e) => setMessageSearchTerm(e.target.value)}
                        />
                        <div className='p-1 rounded-full border-2 border-zinc-400 text-zinc-400 '>
                          <MdOutlinePhoneInTalk size={20}/>
                        </div>
                        <div className='p-1 rounded-full border-2 border-zinc-400 text-zinc-400 '>
                          <CiVideoOn size={20}/>
                        </div>
                        <div className='p-1 rounded-full border-2 border-zinc-400 text-zinc-400 '>
                          <IoMdMore size={20}/>
                        </div>
                      </div>
                    </>
                  )}
                </div>
                
                <div className='flex-1 overflow-hidden'>
                  <ChatDisplay 
                    userChats={filteredMessages} 
                    loading={userChatLoading} 
                    error={error} 
                    searchTerm={messageSearchTerm}
                  />
                </div>
                
                <div className='p-4 border-t border-zinc-300 flex'>
                  <input 
                    type='text' 
                    placeholder='Type a message here.' 
                    className='outline-none border-none font-semibold text-md flex-1'
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  />
                  <div className='flex items-center gap-x-2'>
                    <div className='text-zinc-600 hidden lg:block'><FiAtSign size={20}/></div>
                    <div className='text-zinc-600 hidden lg:block'><MdFormatColorText size={20}/></div>
                    <div className='text-zinc-600'><CgAttachment size={20}/></div>
                    <div className='text-zinc-600'><GoSmiley size={20}/></div>
                    <div className='text-zinc-600 hidden lg:block'><AiOutlinePicture size={20}/></div>
                    <div className='text-zinc-600 hidden lg:block'><IoMdLink size={20}/></div>
                    <div 
                      className='bg-accent p-2 rounded-full ml-2 cursor-pointer'
                      onClick={handleSendMessage}
                    > 
                      <GrSend size={25} className='text-white'/>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className='flex items-center justify-center h-full'>
                <div className='text-gray-500 text-lg'>Select a user to start chatting</div>
              </div>
            )}
          </div>

          {/* Right Panel - User Details */}
          {userDetails && (
            <div className={`lg:w-[450px]  bg-white rounded-xl shadow-xl overflow-y-auto h-full
              ${isMobileView && !isUserDetailsOpen ? 'hidden' : 'lg:block'}`}>
              <div className='h-full'>
                <div className='w-full h-1/2 border-b border-zinc-300 relative' >
                  <div className='w-full h-2/3 bg-cover bg-center rounded-xl' style={{backgroundImage: `url(${userDetails.profileImage})`}} ></div>
                  <div className='absolute left-5 right-5 bottom-8 w-auto h-40 bg-white rounded-xl drop-shadow-lg p-4'>
                    <div className='text-center pt-2 font-semibold text-xl'>{userDetails.username}</div>
                    <div className='text-center mt-1 text-zinc-500 text-sm font-semibold '>{userDetails.position}</div>
                    <div className='justify-center items-center mt-2 text-sm gap-x-2 font-semibold flex'>
                      <div><CiLocationOn size={16}/></div>
                      {userDetails.address}
                    </div>
                    <div className='mt-4 flex justify-center items-center gap-x-3'>
                      <div className='p-1 border-2 border-zinc-600 rounded-full'><MdOutlinePersonAddAlt size={24}/></div>
                      <div className='p-1 bg-primary text-white rounded-full'><FiMessageCircle size={24}/></div>
                      <div className='p-1 bg-accent text-white border-zinc-600 rounded-full'><CiVideoOn size={24}/></div>
                    </div>
                  </div>
                  {isMobileView && (<div className='absolute top-4 left-4 hover:bg-white/10' onClick={() =>{ setIsUserDetailsOpen(null)}}><FiArrowLeft size={15}/></div>)}
                </div>
                
                <div className='p-5 w-full border-b border-zinc-300'>
                  <div className='flex justify-between w-full'>
                    <div className='text-xl font-semibold'>User Information</div>
                    <div className='border border-zinc-400 p-1 rounded-full'><BsInfo size={20}/></div>
                  </div>
                  <div className='mt-3 text-zinc-500 text-md'>Phone</div>
                  <div className='font-semibold text-black mt-1'>{userDetails.phone}</div>
                  <div className='mt-3 text-zinc-500 text-md'>Email</div>
                  <div className='font-semibold text-black mt-1'>{userDetails.email}</div>
                </div>
                
                <div className='p-5 w-full '>
                  <div className='flex justify-between w-full'>
                    <div className='text-lg font-semibold '>Group Participants</div>
                    <div className='text-zinc-400 p-1 rounded-full'><MdOutlinePeopleAlt size={20}/></div>
                  </div>
                  {selectedUser !== null && getGroupsForUserWithDetails(selectedUser.id).map((group) => (
                    <GroupParticipants 
                      key={group.id} 
                      group={group} 
                      currentUserId={selectedUser.id}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
        
        {(!isMobileView || isUserListOpen || isUserDetailsOpen) && <MobileViewControls />}
      </div>
    </div>
  );
}

export default App