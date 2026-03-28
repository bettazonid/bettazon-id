'use client'

import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { io } from 'socket.io-client'
import { adminFetch, getAdminToken, getAdminUser } from '@/lib/adminApi'

const CHAT_TYPE_LABEL = {
  'buyer-admin': 'Buyer ↔ Admin',
  'seller-admin': 'Seller ↔ Admin',
  'buyer-seller': 'Buyer ↔ Seller',
}

const ROLE_LABEL = {
  buyer: 'Buyer',
  seller: 'Seller',
  admin: 'Admin',
}

function formatDateTime(value) {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '—'
  return date.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function getUserRole(user) {
  const roles = Array.isArray(user?.roles) ? user.roles.map((item) => item.role) : []
  if (user?.currentRole === 'seller' || roles.includes('seller')) return 'seller'
  if (user?.currentRole === 'buyer' || roles.includes('buyer')) return 'buyer'
  if (user?.currentRole === 'admin' || roles.includes('admin')) return 'admin'
  return user?.currentRole || ''
}

function getSupportChatType(user) {
  const role = getUserRole(user)
  if (role === 'seller') return 'seller-admin'
  if (role === 'buyer') return 'buyer-admin'
  return ''
}

function getOtherParticipant(chat, adminUserId) {
  const participants = Array.isArray(chat?.participants) ? chat.participants : []
  return (
    participants.find((participant) => participant?._id !== adminUserId && getUserRole(participant) !== 'admin') ||
    participants.find((participant) => participant?._id !== adminUserId) ||
    participants[0] ||
    null
  )
}

function StatusPill({ children, tone = 'gray' }) {
  const toneClass = {
    gray: 'bg-gray-100 text-gray-700 border-gray-200',
    teal: 'bg-teal-50 text-teal-700 border-teal-200',
    orange: 'bg-orange-50 text-orange-700 border-orange-200',
    green: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  }[tone]

  return (
    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${toneClass}`}>
      {children}
    </span>
  )
}

export default function AdminChatsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const messagesEndRef = useRef(null)
  const handledQueryRef = useRef('')
  const socketRef = useRef(null)
  const joinedChatIdsRef = useRef(new Set())
  const selectedChatIdRef = useRef('')

  const [adminUser, setAdminUser] = useState(null)
  const [loadingChats, setLoadingChats] = useState(true)
  const [loadingMessages, setLoadingMessages] = useState(false)
  const [searchingUsers, setSearchingUsers] = useState(false)
  const [startingChat, setStartingChat] = useState(false)
  const [sendingMessage, setSendingMessage] = useState(false)
  const [chats, setChats] = useState([])
  const [messages, setMessages] = useState([])
  const [selectedChatId, setSelectedChatId] = useState('')
  const [chatType, setChatType] = useState('')
  const [conversationSearch, setConversationSearch] = useState('')
  const [userQuery, setUserQuery] = useState('')
  const [userRoleFilter, setUserRoleFilter] = useState('')
  const [userResults, setUserResults] = useState([])
  const [draftMessage, setDraftMessage] = useState('')
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')

  useEffect(() => {
    selectedChatIdRef.current = selectedChatId
  }, [selectedChatId])

  const upsertChat = useCallback((incomingChat, incomingMessage = null) => {
    if (!incomingChat) return

    const chatId = incomingChat._id || incomingChat.id
    if (!chatId) return

    setChats((prev) => {
      const existingIndex = prev.findIndex((chat) => (chat._id || chat.id) === chatId)
      const previousChat = existingIndex >= 0 ? prev[existingIndex] : null
      const previousUnread = Number(previousChat?.unreadCount || 0)

      const nextChat = {
        ...(previousChat || {}),
        ...incomingChat,
        _id: chatId,
        id: chatId,
        participants: incomingChat.participants || previousChat?.participants || [],
        lastMessage: incomingChat.lastMessage || incomingMessage || previousChat?.lastMessage || null,
        lastMessageAt:
          incomingChat.lastMessageAt || incomingMessage?.createdAt || previousChat?.lastMessageAt || new Date().toISOString(),
        unreadCount:
          selectedChatIdRef.current === chatId
            ? 0
            : incomingMessage
              ? previousUnread + 1
              : previousUnread,
      }

      const next = existingIndex >= 0
        ? [...prev.slice(0, existingIndex), nextChat, ...prev.slice(existingIndex + 1)]
        : [nextChat, ...prev]

      return next.sort((left, right) => {
        const leftTime = new Date(left.lastMessageAt || left.updatedAt || 0).getTime()
        const rightTime = new Date(right.lastMessageAt || right.updatedAt || 0).getTime()
        return rightTime - leftTime
      })
    })
  }, [])

  const upsertMessage = useCallback((incomingMessage) => {
    if (!incomingMessage) return

    const messageId = incomingMessage._id || incomingMessage.id
    if (!messageId) return

    setMessages((prev) => {
      if (prev.some((message) => (message._id || message.id) === messageId)) {
        return prev
      }

      return [...prev, incomingMessage].sort(
        (left, right) => new Date(left.createdAt || 0).getTime() - new Date(right.createdAt || 0).getTime()
      )
    })
  }, [])

  useEffect(() => {
    setAdminUser(getAdminUser())
  }, [])

  useEffect(() => {
    const token = getAdminToken()
    if (!token) return undefined

    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, '') || 'http://localhost:5000'
    const socket = io(apiBaseUrl, {
      transports: ['websocket', 'polling'],
      auth: { token },
    })

    socketRef.current = socket

    socket.on('connect', () => {
      setInfo('Realtime chat aktif.')
    })

    socket.on('connect_error', (err) => {
      setError(err.message || 'Koneksi realtime chat gagal')
    })

    socket.on('chat_message', (messagePayload) => {
      const incomingChatId = messagePayload?.chatId
      if (!incomingChatId) return

      if (selectedChatIdRef.current === incomingChatId) {
        upsertMessage(messagePayload)
      }

      upsertChat(
        {
          _id: incomingChatId,
          id: incomingChatId,
          lastMessage: messagePayload,
          lastMessageAt: messagePayload.createdAt,
        },
        messagePayload
      )
    })

    socket.on('chat:conversation-updated', ({ chat, message }) => {
      upsertChat(chat, message)
    })

    return () => {
      socket.disconnect()
      socketRef.current = null
      joinedChatIdsRef.current = new Set()
    }
  }, [upsertChat, upsertMessage])

  const fetchChats = useCallback(async () => {
    try {
      setLoadingChats(true)
      setError('')

      const params = new URLSearchParams({ page: '1', limit: '50' })
      if (chatType) params.set('type', chatType)

      const res = await adminFetch(`/api/chat?${params.toString()}`)
      const nextChats = res?.data?.chats || []
      setChats(nextChats)

      setSelectedChatId((prev) => {
        if (prev && nextChats.some((chat) => chat._id === prev || chat.id === prev)) {
          return prev
        }
        return nextChats[0]?._id || nextChats[0]?.id || ''
      })
    } catch (err) {
      setError(err.message || 'Gagal memuat daftar chat')
      setChats([])
      setSelectedChatId('')
    } finally {
      setLoadingChats(false)
    }
  }, [chatType])

  useEffect(() => {
    fetchChats()
  }, [])

  useEffect(() => {
    const socket = socketRef.current
    if (!socket) return

    const knownIds = new Set(chats.map((chat) => chat._id || chat.id).filter(Boolean))

    for (const chatId of joinedChatIdsRef.current) {
      if (!knownIds.has(chatId)) {
        socket.emit('leaveChat', { chatId })
        joinedChatIdsRef.current.delete(chatId)
      }
    }

    for (const chatId of knownIds) {
      if (!joinedChatIdsRef.current.has(chatId)) {
        socket.emit('joinChat', { chatId })
        joinedChatIdsRef.current.add(chatId)
      }
    }
  }, [chats])

  const selectedChat = useMemo(
    () => chats.find((chat) => (chat._id || chat.id) === selectedChatId) || null,
    [chats, selectedChatId]
  )

  const filteredChats = useMemo(() => {
    const keyword = conversationSearch.trim().toLowerCase()
    if (!keyword) return chats

    return chats.filter((chat) => {
      const other = getOtherParticipant(chat, adminUser?._id)
      return [
        other?.name,
        other?.email,
        other?.phone,
        chat?.orderId?.orderNumber,
        chat?.lastMessage?.content,
        CHAT_TYPE_LABEL[chat?.type] || chat?.type,
      ]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(keyword))
    })
  }, [adminUser?._id, chats, conversationSearch])

  const fetchMessages = useCallback(async (chatId) => {
    if (!chatId) {
      setMessages([])
      return
    }

    try {
      setLoadingMessages(true)
      setError('')

      const res = await adminFetch(`/api/chat/${chatId}/messages?page=1&limit=100`)
      setMessages(res?.data?.messages || [])
      await adminFetch(`/api/chat/${chatId}/read`, { method: 'PUT' })
      setChats((prev) => prev.map((chat) => ((chat._id || chat.id) === chatId ? { ...chat, unreadCount: 0 } : chat)))
    } catch (err) {
      setError(err.message || 'Gagal memuat pesan chat')
      setMessages([])
    } finally {
      setLoadingMessages(false)
    }
  }, [fetchChats])

  useEffect(() => {
    fetchMessages(selectedChatId)
  }, [selectedChatId, fetchMessages])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const searchUsers = async (e) => {
    e?.preventDefault?.()
    try {
      setSearchingUsers(true)
      setError('')

      const params = new URLSearchParams({
        page: '1',
        limit: '10',
        sort: 'updatedAt',
        order: 'desc',
        isActive: 'true',
      })
      if (userQuery.trim()) params.set('q', userQuery.trim())
      if (userRoleFilter) params.set('role', userRoleFilter)

      const res = await adminFetch(`/api/users/search?${params.toString()}`)
      const users = (res?.data?.users || []).filter((user) => Boolean(getSupportChatType(user)))
      setUserResults(users)
    } catch (err) {
      setError(err.message || 'Gagal mencari user')
      setUserResults([])
    } finally {
      setSearchingUsers(false)
    }
  }

  const startChatWithUser = useCallback(async (user) => {
    const type = getSupportChatType(user)
    if (!type) {
      setError('User ini tidak memiliki role buyer/seller untuk chat support.')
      return
    }

    try {
      setStartingChat(true)
      setError('')
      setInfo('')

      const res = await adminFetch('/api/chat', {
        method: 'POST',
        body: JSON.stringify({
          participants: [user._id, 'admin'],
          type,
        }),
      })

      const createdChat = res?.data
      const createdChatId = createdChat?._id || createdChat?.id || ''
      setInfo(`Chat support dengan ${user.name || user.email || 'user'} siap digunakan.`)
      await fetchChats()
      if (createdChatId) {
        setSelectedChatId(createdChatId)
      }
    } catch (err) {
      setError(err.message || 'Gagal membuat chat support')
    } finally {
      setStartingChat(false)
    }
  }, [fetchChats])

  useEffect(() => {
    const userId = searchParams.get('userId')
    const role = searchParams.get('role')
    const key = `${userId || ''}:${role || ''}`

    if (!userId || !adminUser?._id || handledQueryRef.current === key) return

    handledQueryRef.current = key

    const bootstrapChat = async () => {
      try {
        const res = await adminFetch(`/api/users/${userId}`)
        const user = res?.data
        if (!user) return
        await startChatWithUser({ ...user, currentRole: role || user.currentRole })
        router.replace('/admin/chats')
      } catch (err) {
        setError(err.message || 'Gagal membuka chat dari halaman user')
      }
    }

    bootstrapChat()
  }, [adminUser?._id, router, searchParams, startChatWithUser])

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!selectedChatId || !draftMessage.trim()) return

    try {
      setSendingMessage(true)
      setError('')

      const res = await adminFetch('/api/chat/message', {
        method: 'POST',
        body: JSON.stringify({
          chatId: selectedChatId,
          content: draftMessage.trim(),
          messageType: 'text',
        }),
      })

      const nextMessage = res?.data
      upsertMessage(nextMessage)
      upsertChat(
        {
          _id: selectedChatId,
          id: selectedChatId,
          lastMessage: nextMessage,
          lastMessageAt: nextMessage?.createdAt,
        },
        nextMessage
      )
      setDraftMessage('')
    } catch (err) {
      setError(err.message || 'Gagal mengirim pesan')
    } finally {
      setSendingMessage(false)
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Chat Support</h1>
          <p className="mt-0.5 text-sm text-gray-500">
            Kelola percakapan support antara buyer/seller dengan admin.
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span>{filteredChats.length.toLocaleString('id-ID')} percakapan</span>
          <button
            type="button"
            onClick={fetchChats}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Refresh
          </button>
        </div>
      </div>

      {error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      ) : null}
      {info ? (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{info}</div>
      ) : null}

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[340px,minmax(0,1fr)]">
        <div className="space-y-5">
          <div className="rounded-xl border border-gray-200 bg-white p-4 space-y-3">
            <div>
              <h2 className="font-semibold text-gray-900">Mulai Chat Baru</h2>
              <p className="mt-1 text-xs text-gray-500">Cari buyer/seller lalu buka percakapan support baru.</p>
            </div>

            <form onSubmit={searchUsers} className="space-y-2">
              <input
                type="text"
                value={userQuery}
                onChange={(e) => setUserQuery(e.target.value)}
                placeholder="Cari nama, email, atau no HP"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              />
              <div className="flex gap-2">
                <select
                  value={userRoleFilter}
                  onChange={(e) => setUserRoleFilter(e.target.value)}
                  className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm"
                >
                  <option value="">Buyer & Seller</option>
                  <option value="buyer">Buyer</option>
                  <option value="seller">Seller</option>
                </select>
                <button
                  type="submit"
                  disabled={searchingUsers || startingChat}
                  className="rounded-lg bg-[#008080] px-4 py-2 text-sm font-medium text-white hover:bg-[#006666] disabled:opacity-50"
                >
                  {searchingUsers ? 'Mencari...' : 'Cari'}
                </button>
              </div>
            </form>

            <div className="max-h-80 space-y-2 overflow-y-auto pr-1">
              {userResults.length === 0 ? (
                <p className="text-sm text-gray-400">Belum ada hasil pencarian user support.</p>
              ) : (
                userResults.map((user) => {
                  const supportRole = getSupportChatType(user)
                  return (
                    <div key={user._id} className="rounded-lg border border-gray-100 p-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-gray-900">{user.name || 'Tanpa Nama'}</p>
                          <p className="truncate text-xs text-gray-500">{user.email || user.phone || '—'}</p>
                        </div>
                        <StatusPill tone={supportRole === 'seller-admin' ? 'orange' : 'teal'}>
                          {ROLE_LABEL[getUserRole(user)] || 'User'}
                        </StatusPill>
                      </div>
                      <div className="mt-3 flex items-center justify-between gap-2">
                        <Link href={`/admin/users/${user._id}`} className="text-xs font-medium text-[#008080] hover:text-[#006666]">
                          Detail User →
                        </Link>
                        <button
                          type="button"
                          onClick={() => startChatWithUser(user)}
                          disabled={startingChat}
                          className="rounded-lg border border-[#008080]/20 px-3 py-1.5 text-xs font-medium text-[#008080] hover:bg-[#008080]/5 disabled:opacity-50"
                        >
                          {startingChat ? 'Memproses...' : 'Buka Chat'}
                        </button>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-4 space-y-3">
            <div className="flex gap-2">
              <input
                type="text"
                value={conversationSearch}
                onChange={(e) => setConversationSearch(e.target.value)}
                placeholder="Cari percakapan..."
                className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm"
              />
              <select
                value={chatType}
                onChange={(e) => setChatType(e.target.value)}
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
              >
                <option value="">Semua Chat</option>
                <option value="buyer-admin">Buyer ↔ Admin</option>
                <option value="seller-admin">Seller ↔ Admin</option>
              </select>
            </div>

            <div className="max-h-[520px] space-y-2 overflow-y-auto pr-1">
              {loadingChats ? (
                <div className="py-12 text-center text-sm text-gray-400">Memuat percakapan...</div>
              ) : filteredChats.length === 0 ? (
                <div className="py-12 text-center text-sm text-gray-400">Belum ada percakapan support.</div>
              ) : (
                filteredChats.map((chat) => {
                  const chatId = chat._id || chat.id
                  const other = getOtherParticipant(chat, adminUser?._id)
                  const active = chatId === selectedChatId
                  return (
                    <button
                      key={chatId}
                      type="button"
                      onClick={() => setSelectedChatId(chatId)}
                      className={`w-full rounded-xl border p-3 text-left transition-colors ${
                        active
                          ? 'border-[#008080] bg-[#008080]/5'
                          : 'border-gray-100 bg-white hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-gray-900">{other?.name || 'Peserta Chat'}</p>
                          <p className="truncate text-xs text-gray-500">{other?.email || other?.phone || '—'}</p>
                        </div>
                        {chat.unreadCount > 0 ? <StatusPill tone="green">{chat.unreadCount} unread</StatusPill> : null}
                      </div>
                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        <StatusPill tone={chat.type === 'seller-admin' ? 'orange' : 'teal'}>
                          {CHAT_TYPE_LABEL[chat.type] || chat.type}
                        </StatusPill>
                        {chat.orderId?.orderNumber ? <StatusPill>Order {chat.orderId.orderNumber}</StatusPill> : null}
                      </div>
                      <p className="mt-2 truncate text-xs text-gray-600">{chat.lastMessage?.content || 'Belum ada pesan.'}</p>
                      <p className="mt-1 text-[11px] text-gray-400">Update {formatDateTime(chat.lastMessageAt)}</p>
                    </button>
                  )
                })
              )}
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white">
          {!selectedChat ? (
            <div className="flex min-h-[720px] items-center justify-center px-6 text-center text-sm text-gray-400">
              Pilih percakapan di kiri atau mulai chat support baru.
            </div>
          ) : (
            <div className="flex min-h-[720px] flex-col">
              <div className="border-b border-gray-100 px-5 py-4">
                {(() => {
                  const other = getOtherParticipant(selectedChat, adminUser?._id)
                  const supportRole = getUserRole(other)
                  return (
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <h2 className="text-lg font-semibold text-gray-900">{other?.name || 'Peserta Chat'}</h2>
                        <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-gray-500">
                          <span>{other?.email || other?.phone || '—'}</span>
                          <StatusPill tone={supportRole === 'seller' ? 'orange' : 'teal'}>
                            {ROLE_LABEL[supportRole] || 'User'}
                          </StatusPill>
                          <StatusPill>{CHAT_TYPE_LABEL[selectedChat.type] || selectedChat.type}</StatusPill>
                          {selectedChat.orderId?._id ? (
                            <Link href={`/admin/orders/${selectedChat.orderId._id}`} className="font-medium text-[#008080] hover:text-[#006666]">
                              Order {selectedChat.orderId.orderNumber || 'Detail'} →
                            </Link>
                          ) : null}
                        </div>
                      </div>
                      {other?._id ? (
                        <Link
                          href={`/admin/users/${other._id}`}
                          className="rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                          Detail User
                        </Link>
                      ) : null}
                    </div>
                  )
                })()}
              </div>

              <div className="flex-1 space-y-3 overflow-y-auto bg-gray-50 px-5 py-4">
                {loadingMessages ? (
                  <div className="py-16 text-center text-sm text-gray-400">Memuat pesan...</div>
                ) : messages.length === 0 ? (
                  <div className="py-16 text-center text-sm text-gray-400">Belum ada pesan. Mulai percakapan dari bawah.</div>
                ) : (
                  messages.map((message) => {
                    const senderId = message?.senderId?._id || message?.senderId
                    const mine = senderId === adminUser?._id
                    return (
                      <div key={message._id || message.id} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[78%] rounded-2xl px-4 py-3 shadow-sm ${mine ? 'bg-[#008080] text-white' : 'bg-white text-gray-900 border border-gray-200'}`}>
                          <p className={`mb-1 text-xs font-medium ${mine ? 'text-white/80' : 'text-gray-500'}`}>
                            {message?.senderId?.name || (mine ? 'Admin' : 'User')}
                          </p>
                          <p className="whitespace-pre-wrap break-words text-sm">{message.content}</p>
                          <p className={`mt-2 text-[11px] ${mine ? 'text-white/70' : 'text-gray-400'}`}>
                            {formatDateTime(message.createdAt)}
                          </p>
                        </div>
                      </div>
                    )
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              <form onSubmit={handleSendMessage} className="border-t border-gray-100 p-4">
                <div className="flex gap-3">
                  <textarea
                    value={draftMessage}
                    onChange={(e) => setDraftMessage(e.target.value)}
                    placeholder="Tulis balasan admin..."
                    rows={3}
                    className="flex-1 resize-none rounded-xl border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#008080]/30"
                  />
                  <button
                    type="submit"
                    disabled={sendingMessage || !draftMessage.trim()}
                    className="self-end rounded-xl bg-[#FE735C] px-4 py-2 text-sm font-semibold text-white hover:bg-[#e5634d] disabled:opacity-50"
                  >
                    {sendingMessage ? 'Mengirim...' : 'Kirim'}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
