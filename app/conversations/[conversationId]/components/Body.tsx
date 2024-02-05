'use client';

import axios from "axios";
import { useEffect, useRef, useState } from "react";

import useConversation from "@/app/hooks/useConversation";
import { FullMessageType } from "@/app/types";
import MessageBox from "./MessageBox";
import { pusherClient } from "@/app/libs/pusher";
import { find } from "lodash";

interface BodyProps {
    initialMessages: FullMessageType[];
}

const Body: React.FC<BodyProps> = ({ initialMessages = [] }) => {
    const bottomRef = useRef<HTMLDivElement>(null);
    const [messages, setMessages] = useState(initialMessages);

    const { conversationId } = useConversation();

    useEffect(() => {
        axios.post(`${process.env.LIVE_URL}/api/conversations/${conversationId}/seen`);
    }, [conversationId]);

    useEffect(() => {
        pusherClient.subscribe(conversationId)
        bottomRef?.current?.scrollIntoView()

        const messagehandler = (message: FullMessageType) => {
            axios.post(`${process.env.LIVE_URL}/api/conversations/${conversationId}/seen`);

            console.log("~ message: ---------------", message)
            setMessages((current: FullMessageType) => {
                console.log("current: -------------", current)
                if (find(current, { id: message.id })) {
                    return current
                }

                return [...current, message]

            })

        }

        // function to update seen message status
        const updateMessageHandler = (newMessage: FullMessageType) => {
            setMessages((current) => current.map((currentMessage) => {
                if (currentMessage.id === newMessage.id) {
                    return newMessage;
                }

                return currentMessage;
            }))
        };

        // handle/call messagehandler callback function new messages
        pusherClient.bind("messages:new", messagehandler)

        // handle/call updateMessageHandler callback function whether message is seen or not
        pusherClient.bind('message:update', updateMessageHandler);

        return () => {
            pusherClient.unsubscribe(conversationId)
            pusherClient.unbind("messages:new", messagehandler)
        }

    }, [conversationId])

    return (
        <div className="flex-1 overflow-y-auto">
            {messages.map((message, i) => (
                <MessageBox
                    isLast={i === messages.length - 1}
                    key={message.id}
                    data={message}
                />
            ))}
            <div className="pt-24" ref={bottomRef} />
        </div>
    );
}

export default Body;