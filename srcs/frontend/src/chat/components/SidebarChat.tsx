import { useEffect, useState } from "react";
import ChatList from "../ChatList";
import ChatView from "../ChatView";
import GroupChatCreation from "./GroupChatCreation";
import GroupChatInvitations from "./GroupChatInvitations";

export function SidebarChat() {
  const [mode, setMode] = useState<
  "list" | "chat" | "create-group" | "invitations"
  >("list");

  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [collapsed, setCollapsed] = useState(false);

  // RESIZING
  const [width, setWidth] = useState(350);
  const [resizing, setResizing] = useState(false);

  function startResize() {
    setResizing(true);
  }

  function onResize(e: MouseEvent) {
    if (!resizing) return;

    // Sidebar is on the RIGHT → width = windowWidth - mouseX
    const newWidth = window.innerWidth - e.clientX;

    // Clamp between 200 and 600
    setWidth(Math.min(600, Math.max(200, newWidth)));
  }

  function stopResize() {
    setResizing(false);
  }

  useEffect(() => {
    window.addEventListener("mousemove", onResize);
    window.addEventListener("mouseup", stopResize);
    return () => {
      window.removeEventListener("mousemove", onResize);
      window.removeEventListener("mouseup", stopResize);
    };
  }, [resizing]);

  return (
    <div
      style={{
        width: collapsed ? "45px" : `${width}px`,
        transition: collapsed ? "width 0.25s ease" : "none",
        height: "100vh",
        borderLeft: "2px solid #ccc",
        background: "white",
        display: "flex",
        flexDirection: "column",
        overflowY: "auto",
        overflowX: "hidden"

      }}
    >
      {/* COLLAPSE BUTTON */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        style={{
          position: "absolute",
          left: "-40px",
          top: "20px",
          width: "40px",
          height: "40px",
          borderRadius: "8px 0 0 8px",
          border: "1px solid #ccc",
          background: "#68d3b1",
          cursor: "pointer",
          zIndex: 20
        }}
      >
        {collapsed ? "⮜" : "⮞"}
      </button>

      {/* RESIZE HANDLE (only when expanded) */}
      {!collapsed && (
        <div
          onMouseDown={startResize}
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: "6px",
            height: "100%",
            cursor: "ew-resize",
            zIndex: 15
          }}
        />
      )}

      {/* CONTENT */}
      {/* {!collapsed && !activeChatId && (
        <ChatList onSelectChat={(id) => setActiveChatId(id)} />
      )}

      {!collapsed && activeChatId && (
        <ChatView
          chatId={activeChatId}
          onClose={() => setActiveChatId(null)}
        />
      )} */}

      {!collapsed && mode === "list" && (
        <ChatList
        onSelectChat={(id) => {
          setActiveChatId(id);
          setMode("chat");
        }}
        onCreateGroup={() => setMode("create-group")}
        onShowInvitations={() => setMode("invitations")}
        />
      )}

      {!collapsed && mode === "chat" && activeChatId && (
        <ChatView
        chatId={activeChatId}
        onClose={() => {
          setActiveChatId(null);
          setMode("list");
        }}
        />
      )}

      {!collapsed && mode === "create-group" && (
        <GroupChatCreation
        onClose={() => setMode("list")}
        onCreated={(chatId) => {
          setActiveChatId(chatId);
          setMode("chat");
        }}
        />
      )}

      {!collapsed && mode === "invitations" && (
        <GroupChatInvitations
        onClose={() => setMode("list")}
        />
      )}
    </div>
  );
}
