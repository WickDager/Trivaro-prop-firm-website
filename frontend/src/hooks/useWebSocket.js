/**
 * WebSocket Hook
 * Manages real-time connection for live updates
 */

import { useEffect, useState, useRef } from 'react'
import { io } from 'socket.io-client'

const WS_URL = import.meta.env.VITE_WS_URL || 'http://localhost:5000'

export const useWebSocket = () => {
  const [socket, setSocket] = useState(null)
  const [connected, setConnected] = useState(false)
  const socketRef = useRef(null)

  useEffect(() => {
    const token = localStorage.getItem('accessToken')
    if (!token) return

    // Connect to WebSocket server
    const newSocket = io(WS_URL, {
      auth: {
        token,
      },
      transports: ['websocket', 'polling'],
    })

    newSocket.on('connect', () => {
      console.log('WebSocket connected')
      setConnected(true)
    })

    newSocket.on('disconnect', () => {
      console.log('WebSocket disconnected')
      setConnected(false)
    })

    newSocket.on('error', (error) => {
      console.error('WebSocket error:', error)
    })

    socketRef.current = newSocket
    setSocket(newSocket)

    return () => {
      if (newSocket) {
        newSocket.disconnect()
      }
    }
  }, [])

  const joinUserRoom = (userId) => {
    if (socketRef.current && connected) {
      socketRef.current.emit('join-user-room', userId)
    }
  }

  const joinChallengeRoom = (challengeId) => {
    if (socketRef.current && connected) {
      socketRef.current.emit('join-challenge-room', challengeId)
    }
  }

  const subscribe = (event, handler) => {
    if (socketRef.current) {
      socketRef.current.on(event, handler)
    }
  }

  const unsubscribe = (event, handler) => {
    if (socketRef.current) {
      socketRef.current.off(event, handler)
    }
  }

  return {
    socket: socketRef.current,
    connected,
    joinUserRoom,
    joinChallengeRoom,
    subscribe,
    unsubscribe,
  }
}
