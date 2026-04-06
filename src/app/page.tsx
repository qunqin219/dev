"use client";

import { useState, useEffect } from "react";

// 对话记录类型
interface Conversation {
  id: string;
  title: string;
  summary: string;
  tags: string;
  model: string | null;
  createdAt: string;
}

// 添加对话表单
function AddConversationForm({
  onAdd,
  onCancel,
}: {
  onAdd: (conv: Conversation) => void;
  onCancel: () => void;
}) {
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [tags, setTags] = useState("");
  const [model, setModel] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !summary.trim()) return;

    const res = await fetch("/api/conversations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, summary, tags, model }),
    });
    const data = await res.json();
    onAdd(data);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white dark:bg-zinc-900 rounded-xl p-6 border border-zinc-200 dark:border-zinc-800"
    >
      <h2 className="text-lg font-semibold mb-4">添加新对话</h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">标题 *</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="这次对话的主题是什么？"
            className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">摘要 *</label>
          <textarea
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            placeholder="简要描述这次对话的内容..."
            rows={3}
            className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">标签</label>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="用逗号分隔，如：工作,代码,思考"
            className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">使用的 AI 模型</label>
          <input
            type="text"
            value={model}
            onChange={(e) => setModel(e.target.value)}
            placeholder="如：GPT-4, Claude 3, Gemini..."
            className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex gap-2 pt-2">
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors"
          >
            保存
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-zinc-200 dark:bg-zinc-700 rounded-lg hover:bg-zinc-300 dark:hover:bg-zinc-600 transition-colors"
          >
            取消
          </button>
        </div>
      </div>
    </form>
  );
}

// 对话卡片
function ConversationCard({
  conversation,
  onDelete,
}: {
  conversation: Conversation;
  onDelete: (id: string) => void;
}) {
  const tagList = conversation.tags
    ? conversation.tags.split(",").filter(Boolean)
    : [];
  const date = new Date(conversation.createdAt).toLocaleDateString("zh-CN");

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-xl p-5 border border-zinc-200 dark:border-zinc-800 hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors group">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold text-lg">{conversation.title}</h3>
        <button
          onClick={() => onDelete(conversation.id)}
          className="opacity-0 group-hover:opacity-100 text-zinc-400 hover:text-red-500 transition-all text-sm"
        >
          删除
        </button>
      </div>
      <p className="text-zinc-600 dark:text-zinc-400 text-sm mb-3 line-clamp-2">
        {conversation.summary}
      </p>
      <div className="flex flex-wrap gap-2 mb-2">
        {tagList.map((tag) => (
          <span
            key={tag}
            className="px-2 py-0.5 bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 rounded text-xs"
          >
            {tag.trim()}
          </span>
        ))}
      </div>
      <div className="flex justify-between text-xs text-zinc-500">
        {conversation.model && <span>{conversation.model}</span>}
        <span>{date}</span>
      </div>
    </div>
  );
}

// 统计面板
function StatsPanel({ conversations }: { conversations: Conversation[] }) {
  const total = conversations.length;
  const allTags = conversations.flatMap((c) =>
    c.tags ? c.tags.split(",").filter(Boolean) : []
  );
  const tagCounts = allTags.reduce(
    (acc, tag) => {
      acc[tag] = (acc[tag] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );
  const topTags = Object.entries(tagCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-xl p-5 border border-zinc-200 dark:border-zinc-800">
      <h2 className="font-semibold mb-4">📊 统计</h2>
      <div className="space-y-3">
        <div>
          <div className="text-3xl font-bold text-indigo-500">{total}</div>
          <div className="text-sm text-zinc-500">总对话数</div>
        </div>
        {topTags.length > 0 && (
          <div>
            <div className="text-sm font-medium mb-2">热门标签</div>
            <div className="flex flex-wrap gap-1">
              {topTags.map(([tag, count]) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 bg-zinc-100 dark:bg-zinc-800 rounded text-xs"
                >
                  {tag.trim()} ({count})
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// 搜索栏
function SearchBar({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="relative">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="搜索对话..."
        className="w-full pl-10 pr-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
      <svg
        className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
    </div>
  );
}

// 标签筛选
function TagFilter({
  tags,
  selected,
  onSelect,
}: {
  tags: string[];
  selected: string | null;
  onSelect: (tag: string | null) => void;
}) {
  if (tags.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onSelect(null)}
        className={`px-3 py-1 rounded-full text-sm transition-colors ${
          selected === null
            ? "bg-indigo-500 text-white"
            : "bg-zinc-200 dark:bg-zinc-700 hover:bg-zinc-300 dark:hover:bg-zinc-600"
        }`}
      >
        全部
      </button>
      {tags.map((tag) => (
        <button
          key={tag}
          onClick={() => onSelect(tag === selected ? null : tag)}
          className={`px-3 py-1 rounded-full text-sm transition-colors ${
            selected === tag
              ? "bg-indigo-500 text-white"
              : "bg-zinc-200 dark:bg-zinc-700 hover:bg-zinc-300 dark:hover:bg-zinc-600"
          }`}
        >
          {tag}
        </button>
      ))}
    </div>
  );
}

// 主页面
export default function Home() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // 加载数据
  const loadConversations = async () => {
    const res = await fetch("/api/conversations");
    const data = await res.json();
    setConversations(data);
  };

  useEffect(() => {
    loadConversations();
  }, []);

  // 添加对话
  const handleAdd = (conv: Conversation) => {
    setConversations([conv, ...conversations]);
    setShowForm(false);
  };

  // 删除对话
  const handleDelete = async (id: string) => {
    if (!confirm("确定要删除这条记录吗？")) return;
    await fetch(`/api/conversations?id=${id}`, { method: "DELETE" });
    setConversations(conversations.filter((c) => c.id !== id));
  };

  // 所有标签
  const allTags = Array.from(
    new Set(
      conversations.flatMap((c) =>
        c.tags ? c.tags.split(",").filter(Boolean) : []
      )
    )
  );

  // 筛选
  const filtered = conversations.filter((c) => {
    const matchSearch =
      !search ||
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.summary.toLowerCase().includes(search.toLowerCase());
    const matchTag =
      !selectedTag ||
      (c.tags && c.tags.split(",").includes(selectedTag));
    return matchSearch && matchTag;
  });

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      {/* 头部 */}
      <header className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                chi
              </h1>
              <p className="text-sm text-zinc-500">AI 对话管理器</p>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              添加对话
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* 侧边栏 */}
          <aside className="lg:col-span-1 space-y-4">
            <StatsPanel conversations={conversations} />
          </aside>

          {/* 主内容 */}
          <div className="lg:col-span-3 space-y-4">
            {/* 搜索和筛选 */}
            <div className="space-y-3">
              <SearchBar value={search} onChange={setSearch} />
              <TagFilter
                tags={allTags}
                selected={selectedTag}
                onSelect={setSelectedTag}
              />
            </div>

            {/* 添加表单 */}
            {showForm && (
              <AddConversationForm
                onAdd={handleAdd}
                onCancel={() => setShowForm(false)}
              />
            )}

            {/* 对话列表 */}
            {filtered.length === 0 ? (
              <div className="text-center py-12 text-zinc-500">
                {conversations.length === 0
                  ? "还没有对话记录，添加第一条吧 🌱"
                  : "没有找到匹配的对话"}
              </div>
            ) : (
              <div className="space-y-3">
                {filtered.map((conv) => (
                  <ConversationCard
                    key={conv.id}
                    conversation={conv}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
