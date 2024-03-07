import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Model from '../components/Model';
// import { BsEmojiSmile, BsFillEmojiSmileFill } from "react-icons/bs"
import { fetchMessages, sendMessage } from '../apis/messages';
import { useEffect } from 'react';
import MessageHistory from '../components/MessageHistory';
import io from "socket.io-client"
import "./home.css"
import { fetchChats, setNotifications } from '../redux/chatsSlice';
import Loading from '../components/ui/Loading';
// import data from '@emoji-mart/data'
// import Picker from '@emoji-mart/react'
import { getChatName } from '../utils/logics';
import Typing from '../components/ui/Typing';
import { validUser } from '../apis/auth';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { useSpeechSynthesis } from 'react-speech-kit';
import Navbar from '../components/Navbar';
import { REACT_APP_SERVER_URL } from '../helper.js';
const ENDPOINT = REACT_APP_SERVER_URL;
let socket, selectedChatCompare;

function Chat(props) {
  const { activeChat, notifications } = useSelector((state) => state.chats)
  const dispatch = useDispatch()
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState([])
  const [socketConnected, setSocketConnected] = useState(false)
  const [typing, setTyping] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [loading, setLoading] = useState(false)
  // const [showPicker, setShowPicker] = useState(false);
  const [micOn,setMicOn]=useState(false);
  const activeUser = useSelector((state) => state.activeUser)
  
  const {
    transcript,
    resetTranscript,
  }=useSpeechRecognition();
  const {speak}=useSpeechSynthesis();
  // console.log(transcript);
  const keyDownFunction = async (e) => {
    if ((e.key === "Enter" || e.type === "click") && (message)) {
      setMessage("")
      resetTranscript();
      socket.emit("stop typing", activeChat._id)
      const data = await sendMessage({ chatId: activeChat._id, message })
      socket.emit("new message", data)
      setMessages([...messages, data])
      dispatch(fetchChats())
    }
  }
  const handleMicon=()=>{
    if(!micOn){
      setMicOn(true);
      SpeechRecognition.startListening();
    }
    else{
      SpeechRecognition.stopListening();
      setMicOn(false);
      // setMessage("");
    }
  }
  const handleMicPut=()=>{
    setMessage(transcript)
    resetTranscript();
    setMicOn(false);
  }
  const handleOnSpeak=()=>{
    speak({text:message});
  }
  
  useEffect(() => {
    socket = io(ENDPOINT)
    socket.on("typing", () => setIsTyping(true))
    socket.on("stop typing", () => setIsTyping(false))
  }, [])
  
  useEffect(() => {
    socket.emit("setup", activeUser)
    socket.on("connected", () => {
      setSocketConnected(true)
    })
  }, [messages, activeUser])
  useEffect(() => {
    const fetchMessagesFunc = async () => {
      if (activeChat) {
        setLoading(true)
        const data = await fetchMessages(activeChat._id)
        setMessages(data)
        socket.emit("join room", activeChat._id)
        setLoading(false)
        
      }
      return
    }
    fetchMessagesFunc()
    selectedChatCompare = activeChat
    
  }, [activeChat])
  useEffect(() => {
    socket.on("message recieved", (newMessageRecieved) => {
      if ((!selectedChatCompare || selectedChatCompare._id) !== newMessageRecieved.chatId._id) {
        if (!notifications.includes(newMessageRecieved)) {
          dispatch(setNotifications([newMessageRecieved, ...notifications]))
        }
      }
      else {
        setMessages([...messages, newMessageRecieved])
      }
      dispatch(fetchChats())
    })
  })
  useEffect(() => {
    const isValid = async () => {
      const data = await validUser()
      if (!data?.user) {
        window.location.href = "/login"
      }
      
    }
    isValid()
  }, [])
  if (loading) {
    return <div className={props.className}>
      <Loading />
    </div>
  }
  return (
    <>

      {
        activeChat ?
          <div className={props.className}>
            <div className=' border-y-2 rounded-xl flex justify-between items-center bg-transparent backdrop-blur-3xl w-[100%] text-white p-3'>
              <div className='flex items-center gap-x-[10px]'>
                <div className='flex flex-col items-start justify-center'>
                  <h5 className='text-[17px] font-bold tracking-wide'>{getChatName(activeChat, activeUser)}</h5>
                  {/* <p className='text-[11px] text-[#aabac8]'>Last seen 5 min ago</p> */}
                </div>
              </div>
              <div>
                <Model />
              </div>
            </div>
            <div className='scrollbar-hide w-[100%] h-[70vh] md:h-[66vh] lg:h-[69vh] flex flex-col overflow-y-scroll p-4'>
              <MessageHistory typing={isTyping} messages={messages} />
              <div className='ml-7 -mb-10'>
                {
                  isTyping ?
                    <Typing width="100" height="100" /> : ""
                }

              </div>
            </div>
            <div className='absolute left-[5%] bottom-[8%]'>
              {/* {
                showPicker && <Picker data={data} onEmojiSelect={(e) => setMessage(message + e.native)} />
              } */}
              <div className='text-white border-[1px] border-[#aabac8] py-3 w-[360px] sm:w-[400px] md:w-[500px] h-[50px] lg:w-[780px] rounded-t-[10px] bg-transparent'>

                <form className='bg-transparent'>
                  <input className='focus:outline-0 w-[100%] bg-transparent pl-6' type="text" name="message" placeholder="Speech" value={transcript} />
                </form>

              </div>

              <div className='text-white border-x-[1px] border-b-[1px] bg-transparent border-[#aabac8] px-6 py-3 w-[360px] sm:w-[400px] md:w-[350px] lg:w-[780px] rounded-b-[10px] h-[50px]'>
                <form onKeyDown={(e) => keyDownFunction(e)} onSubmit={(e) => e.preventDefault()}>
                  <input onChange={(e) => {
                    setMessage(e.target.value)
                    if (!socketConnected) return
                    if (!typing) {
                      setTyping(true)
                      socket.emit('typing', activeChat._id)
                    }
                    let lastTime = new Date().getTime()
                    var time = 3000
                    setTimeout(() => {
                      var timeNow = new Date().getTime()
                      var timeDiff = timeNow - lastTime
                      if (timeDiff >= time && typing) {
                        socket.emit("stop typing", activeChat._id)
                        setTyping(false)
                      }
                    }, time)
                  }} className='focus:outline-0 w-[100%] bg-transparent' type="text" name="message" placeholder="Type Your Message" value={message} />
                </form>

              </div>

              <div className='border-x-[1px] border-b-[1px] bg-transparent border-[#aabac8] px-6 py-3 w-[360px] sm:w-[400px] md:w-[350px] lg:w-[780px] rounded-[10px] h-[50px]'>
                <div className='flex justify-between items-start'>
                  <button onClick={(e) => keyDownFunction(e)} className='bg-blue-500 border-[2px] border-[#d4d4d4] text-[14px] px-2 py-[3px] text-white font-medium rounded-[7px] -mt-1 w-[150px]'>Send</button>
                  <button onClick={handleMicon} className='bg-blue-500 border-[2px] border-[#d4d4d4] text-[14px] px-2 py-[3px] text-white font-medium rounded-[7px] -mt-1 w-[150px]'>{micOn?'stop':'start'}</button>
                  {/* <button onClick={SpeechRecognition.stopListening} className='bg-[rgb(248,249,250)] border-[2px] border-[#d4d4d4] text-[14px] px-2 py-[3px] text-[#9e9e9e] font-medium rounded-[7px] -mt-1'>Mice</button> */}
                  <button onClick={handleMicPut} className='bg-blue-500 border-[2px] border-[#d4d4d4] text-[14px] px-2 py-[3px] text-white font-medium rounded-[7px] -mt-1 w-[150px]'>put</button>
                  <button onClick={handleOnSpeak} className='bg-blue-500 border-[2px] border-[#d4d4d4] text-[14px] px-2 py-[3px] text-white font-medium rounded-[7px] -mt-1 w-[150px]'>speak</button>

                </div>
              </div>
            </div>
          </div> :
          <div className={props.className}>
            <div className='relative'>
              <div className='absolute top-[40vh] left-[44%] flex flex-col items-center justify-center gap-y-3'>
                <img className='w-[50px] h-[50px] rounded-[25px]' alt="User profile" src={activeUser.profilePic} />
                <h3 className='text-[#111b21] text-[20px] font-medium tracking-wider'>Welcome <span className='text-[#166e48] text-[19px] font-bold'> {activeUser.name}</span></h3>
              </div>
            </div>
          </div>

      }
    </>
  )
}

export default Chat