"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  Folder, 
  Activity, 
  FolderGit2, 
  Calendar, 
  Share2, 
  Building2, 
  Award, 
  Users2, 
  CheckSquare, 
  StickyNote
} from "lucide-react";
import KabinetHeader from "@/components/kabinet/KabinetHeader";
import ReportsView from "@/components/kabinet/ReportsView";
import ActivityView from "@/components/kabinet/ActivityView";
import ProjectsView from "@/components/kabinet/ProjectsView";
import CalendarView from "@/components/kabinet/CalendarView";
import PostsView from "@/components/kabinet/PostsView";
import PartnersView from "@/components/kabinet/PartnersView";
import ResultsView from "@/components/kabinet/ResultsView";
import MeetingsView from "@/components/kabinet/MeetingsView";
import TasksView from "@/components/kabinet/TasksView";
import NotesView from "@/components/kabinet/NotesView";
import { 
  loadInitialState, 
  saveLocalState, 
  fetchRemoteState,
  syncToBackend,
  AppState 
} from "@/lib/store";
import { 
  Project, 
  CalendarEvent, 
  PostItem, 
  PartnerItem, 
  ResultItem, 
  MeetingItem, 
  TaskItem, 
  NoteItem,
  UserRole
} from "@/types";

const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6);

type TabKey = 
  | "reports" 
  | "activity" 
  | "projects" 
  | "calendar" 
  | "posts" 
  | "partners" 
  | "results" 
  | "meetings" 
  | "tasks" 
  | "notes";

const TABS: { key: TabKey; label: string; icon: React.ElementType }[] = [
  { key: "reports", label: "Hesabatlar", icon: Folder },
  { key: "activity", label: "Aktivlik", icon: Activity },
  { key: "projects", label: "Layihələr", icon: FolderGit2 },
  { key: "calendar", label: "Təqvim", icon: Calendar },
  { key: "posts", label: "Post planı", icon: Share2 },
  { key: "partners", label: "Əməkdaşlıq", icon: Building2 },
  { key: "results", label: "Nəticələr", icon: Award },
  { key: "meetings", label: "İclaslar və qərarlar", icon: Users2 },
  { key: "tasks", label: "Görüləcək işlər", icon: CheckSquare },
  { key: "notes", label: "Qeydlər", icon: StickyNote },
];

export default function KabinetPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabKey>("reports");
  const [state, setState] = useState<AppState | null>(null);
  const [isMongoConnected, setIsMongoConnected] = useState(false);
  const [currentUser, setCurrentUser] = useState<{
    displayName: string;
    email: string;
    role: UserRole;
    department: string;
  } | null>(null);

  useEffect(() => {
    // Check authentication
    const userStr = localStorage.getItem("aeik_user");
    if (!userStr) {
      router.push("/login");
      return;
    }
    try {
      setCurrentUser(JSON.parse(userStr));
    } catch {
      router.push("/login");
      return;
    }

    // Load initial local data immediately
    const initialData = loadInitialState();
    setState(initialData);

    // Fetch from MongoDB
    fetchRemoteState().then((res) => {
      if (res.connected && res.data) {
        setIsMongoConnected(true);
        setState(res.data);
      }
    });
  }, [router]);

  if (!currentUser || !state) {
    return (
      <div className="min-h-screen bg-[#F8F7FD] flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 border-4 border-brand-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-semibold text-slate-500">Şəxsi kabinet yüklənir...</p>
        </div>
      </div>
    );
  }

  const isAdmin = currentUser.role === "admin" || currentUser.role === "owner";

  // State mutation helper
  const updateState = (updater: (prev: AppState) => AppState) => {
    setState((prev) => {
      if (!prev) return prev;
      const next = updater(prev);
      saveLocalState(next);
      return next;
    });
  };

  // 1. Reports Handler
  const handleUpdateLink = (id: string, url: string) => {
    updateState((prev) => {
      const nextLinks = { ...prev.links, [id]: { url } };
      syncToBackend("links", "save", id, { url });
      return { ...prev, links: nextLinks };
    });
  };

  // 2. Activity Handlers
  const handleAddMember = (name: string) => {
    const id = uid();
    const newMember = { id, name, ts: Date.now() };
    updateState((prev) => {
      syncToBackend("members", "save", id, newMember);
      return {
        ...prev,
        members: { ...prev.members, [id]: newMember }
      };
    });
  };

  const handleDeleteMember = (id: string) => {
    updateState((prev) => {
      const newMembers = { ...prev.members };
      delete newMembers[id];
      syncToBackend("members", "delete", id);
      return { ...prev, members: newMembers };
    });
  };

  const handleToggleAttendance = (key: string, nextVal: "+" | "-" | "") => {
    updateState((prev) => {
      const nextAtt = { ...prev.att };
      if (!nextVal) {
        delete nextAtt[key];
        syncToBackend("att", "delete", key);
      } else {
        const [m, moStr] = key.split("_");
        const rec = { v: nextVal, m, mo: Number(moStr) };
        nextAtt[key] = rec;
        syncToBackend("att", "save", key, rec);
      }
      return { ...prev, att: nextAtt };
    });
  };

  // 3. Projects Handlers
  const handleAddProject = (proj: Omit<Project, "id" | "ts">) => {
    const id = uid();
    const newProj: Project = { ...proj, id, ts: Date.now() };
    updateState((prev) => {
      syncToBackend("projects", "save", id, newProj);
      return {
        ...prev,
        projects: { ...prev.projects, [id]: newProj }
      };
    });
  };

  const handleUpdateProject = (id: string, updates: Partial<Project>) => {
    updateState((prev) => {
      const target = prev.projects[id];
      if (!target) return prev;
      const updated = { ...target, ...updates };
      syncToBackend("projects", "save", id, updated);
      return {
        ...prev,
        projects: { ...prev.projects, [id]: updated }
      };
    });
  };

  const handleDeleteProject = (id: string) => {
    updateState((prev) => {
      const newProjects = { ...prev.projects };
      delete newProjects[id];
      syncToBackend("projects", "delete", id);

      // Clean events
      const newEvents = { ...prev.events };
      Object.entries(newEvents).forEach(([eId, e]) => {
        if (e.pid === id) {
          delete newEvents[eId];
        }
      });

      return { ...prev, projects: newProjects, events: newEvents };
    });
  };

  // 4. Events Handlers
  const handleAddEvent = (ev: Omit<CalendarEvent, "id" | "ts">) => {
    const id = uid();
    const newEv: CalendarEvent = { ...ev, id, ts: Date.now() };
    updateState((prev) => {
      syncToBackend("events", "save", id, newEv);
      return {
        ...prev,
        events: { ...prev.events, [id]: newEv }
      };
    });
  };

  const handleDeleteEvent = (id: string) => {
    updateState((prev) => {
      const newEvents = { ...prev.events };
      delete newEvents[id];
      syncToBackend("events", "delete", id);
      return { ...prev, events: newEvents };
    });
  };

  // 5-10. Generic Items Handlers
  const handleAddItem = (sec: string, data: any) => {
    const id = uid();
    const item = { ...data, id, sec, ts: Date.now() };
    updateState((prev) => {
      syncToBackend("items", "save", id, item);
      return {
        ...prev,
        items: { ...prev.items, [id]: item }
      };
    });
  };

  const handleUpdateItemStatus = (id: string, status: string) => {
    updateState((prev) => {
      const target = prev.items[id];
      if (!target) return prev;
      const updated = { ...target, status };
      syncToBackend("items", "save", id, updated);
      return {
        ...prev,
        items: { ...prev.items, [id]: updated }
      };
    });
  };

  const handleDeleteItem = (id: string) => {
    updateState((prev) => {
      const newItems = { ...prev.items };
      delete newItems[id];
      syncToBackend("items", "delete", id);
      return { ...prev, items: newItems };
    });
  };

  // Collect items by section
  const allItems = Object.values(state.items);
  const posts = allItems.filter((i) => i.sec === "posts") as PostItem[];
  const partners = allItems.filter((i) => i.sec === "partners") as PartnerItem[];
  const results = allItems.filter((i) => i.sec === "results") as ResultItem[];
  const meetings = allItems.filter((i) => i.sec === "meetings") as MeetingItem[];
  const tasks = allItems.filter((i) => i.sec === "tasks") as TaskItem[];
  const notes = allItems.filter((i) => i.sec === "notes") as NoteItem[];

  return (
    <div className="min-h-screen bg-[#F8F7FD] flex flex-col font-sans">
      <KabinetHeader
        currentUser={currentUser}
        isMongoConnected={isMongoConnected}
      />

      {/* Main Tab Navigation Bar */}
      <div className="bg-white border-b border-purple-100 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-1.5 overflow-x-auto py-2.5 scrollbar-none">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.key;

              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                    isActive
                      ? "bg-brand-600 text-white shadow-xs"
                      : "text-slate-600 hover:text-brand-600 hover:bg-purple-50"
                  }`}
                >
                  <Icon size={14} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main Content Body */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        {activeTab === "reports" && (
          <ReportsView
            links={state.links}
            isAdmin={isAdmin}
            onUpdateLink={handleUpdateLink}
          />
        )}

        {activeTab === "activity" && (
          <ActivityView
            members={state.members}
            att={state.att}
            isAdmin={isAdmin}
            onAddMember={handleAddMember}
            onDeleteMember={handleDeleteMember}
            onToggleAttendance={handleToggleAttendance}
          />
        )}

        {activeTab === "projects" && (
          <ProjectsView
            projects={state.projects}
            events={state.events}
            isAdmin={isAdmin}
            onAddProject={handleAddProject}
            onUpdateProject={handleUpdateProject}
            onDeleteProject={handleDeleteProject}
            onAddEvent={handleAddEvent}
            onDeleteEvent={handleDeleteEvent}
          />
        )}

        {activeTab === "calendar" && (
          <CalendarView
            projects={state.projects}
            events={state.events}
            isAdmin={isAdmin}
            onAddEvent={handleAddEvent}
            onDeleteEvent={handleDeleteEvent}
          />
        )}

        {activeTab === "posts" && (
          <PostsView
            posts={posts}
            projects={state.projects}
            isAdmin={isAdmin}
            onAddItem={(item) => handleAddItem("posts", item)}
            onUpdateStatus={handleUpdateItemStatus}
            onDeleteItem={handleDeleteItem}
          />
        )}

        {activeTab === "partners" && (
          <PartnersView
            partners={partners}
            isAdmin={isAdmin}
            onAddItem={(item) => handleAddItem("partners", item)}
            onUpdateStatus={handleUpdateItemStatus}
            onDeleteItem={handleDeleteItem}
          />
        )}

        {activeTab === "results" && (
          <ResultsView
            results={results}
            isAdmin={isAdmin}
            onAddItem={(item) => handleAddItem("results", item)}
            onUpdateStatus={handleUpdateItemStatus}
            onDeleteItem={handleDeleteItem}
          />
        )}

        {activeTab === "meetings" && (
          <MeetingsView
            meetings={meetings}
            isAdmin={isAdmin}
            onAddItem={(item) => handleAddItem("meetings", item)}
            onDeleteItem={handleDeleteItem}
          />
        )}

        {activeTab === "tasks" && (
          <TasksView
            tasks={tasks}
            isAdmin={isAdmin}
            onAddItem={(item) => handleAddItem("tasks", item)}
            onUpdateStatus={handleUpdateItemStatus}
            onDeleteItem={handleDeleteItem}
          />
        )}

        {activeTab === "notes" && (
          <NotesView
            notes={notes}
            isAdmin={isAdmin}
            onAddItem={(item) => handleAddItem("notes", item)}
            onDeleteItem={handleDeleteItem}
          />
        )}
      </main>
    </div>
  );
}
