import React from 'react'
import { useSelector } from 'react-redux'
import ScrollableFeed from "react-scrollable-feed"
import { isSameSender, isSameSenderMargin, isSameUser, isLastMessage } from '../utils/logics'
import { Tooltip } from "@chakra-ui/tooltip";
import { Avatar } from "@chakra-ui/avatar";
import "../pages/home.css"
function MessageHistory({ messages }) {
  const activeUser = useSelector((state) => state.activeUser)

  return (
    <>
      <ScrollableFeed className='h-[80%] scrollbar-hide'>
        {messages &&
          messages.map((m, i) => (

            <div className='flex items-center gap-x-[6px]' key={m._id} >
              {(isSameSender(messages, m, i, activeUser.id) ||
                isLastMessage(messages, i, activeUser.id)) && (
                  <Tooltip label={m.sender?.name} placement="bottom-start" hasArrow>
                    <Avatar
                      style={{ width: "32px", height: "32px" }}
                      mt="43px"
                      mr={1}

                      cursor="pointer"
                      name={m.sender?.name}
                      src={m.sender?.profilePic}
                      borderRadius="25px"
                    />
                  </Tooltip>

                )}
              <span className='tracking-wider text-[15px]  font-medium'
                style={{
                  backgroundColor: `${m.sender._id === activeUser.id ? "#2E9DFB" : "#E9E9EB"
                    }`,
                  marginLeft: isSameSenderMargin(messages, m, i, activeUser.id),
                  marginTop: isSameUser(messages, m, i, activeUser.id) ? 3 : 10,
                  borderRadius: `${m.sender._id === activeUser.id ? "10px 10px 0px 10px" : "10px 10px 10px 0"}`,
                  padding: "10px 18px",
                  maxWidth: "460px",
                  color: `${m.sender._id === activeUser.id ? "#ffff" : "#848587"}`
                }}
              >
                {m.message}
              </span>
            </div>
          ))
        }

      </ScrollableFeed >
      {/* <div>feed</div> */}
    </>
  )
}

export default MessageHistory