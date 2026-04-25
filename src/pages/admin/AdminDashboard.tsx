import { useEffect, useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, FileText, Briefcase, MessageSquare, Image, Users, Settings, LogOut, Plus, Edit3, Trash2, Eye, EyeOff, X, Check, ChevronDown, Menu, ShieldCheck, UserPlus, Mail, Upload, ImagePlus, Search, Palette, Globe, AlertCircle, ShoppingCart, Video } from '@/components/ui/MaterialIcon';
import { supabase } from '@/lib/supabase';
import type { Post, CaseStudy, Enquiry, JobPosting, TeamMember, Settings as SettingsType, AdminInvite } from '@/lib/supabase';

type MediaItem = {
  id: string;
  name: string;
  url: string;
  tags?: string;
  created_at: string;
};

type Tab =
  | 'dashboard'
  | 'blog'
  | 'case-studies'
  | 'enquiries'
  | 'media'
  | 'jobs'
  | 'team'
  | 'client-logos'
  | 'awards'
  | 'shop'
  | 'settings'
  | 'seo'
  | 'users';

type ShopProductRow = {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  description: string;
  video_url: string | null;
  order_index: number;
  active: boolean;
};

type AwardRow = {
  id: string;
  event_name: string;
  title: string;
  description: string;
  image_url: string | null;
  order_index: number;
  active: boolean;
};

type ClientLogoRow = {
  id: string;
  name: string;
  logo_url: string;
  order_index: number;
  active: boolean;
};

const slugify = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Data states
  const [posts, setPosts] = useState<Post[]>([]);
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([]);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [settings, setSettings] = useState<SettingsType[]>([]);
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [invites, setInvites] = useState<AdminInvite[]>([]);
  const [adminUsers, setAdminUsers] = useState<{ user_id: string; role: string; email?: string }[]>([]);
  const [clientLogos, setClientLogos] = useState<ClientLogoRow[]>([]);
  const [awards, setAwards] = useState<AwardRow[]>([]);
  const [shopProducts, setShopProducts] = useState<ShopProductRow[]>([]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) navigate('/admin', { replace: true });
    });
  }, [navigate]);

  // Fetch all data
  const fetchAll = useCallback(async () => {
    try {
      const [postsRes, csRes, enquiriesRes, jobsRes, teamRes, settingsRes, mediaRes, invitesRes, adminRolesRes, clientLogosRes, awardsRes, shopRes] =
        await Promise.allSettled([
          supabase.from('posts').select('*').order('published_at', { ascending: false }),
          supabase.from('case_studies').select('*').order('published_at', { ascending: false }),
          supabase.from('enquiries').select('*').order('created_at', { ascending: false }),
          supabase.from('job_postings').select('*').order('posted_at', { ascending: false }),
          supabase.from('team_members').select('*').order('order_index', { ascending: true }),
          supabase.from('settings').select('*').order('key', { ascending: true }),
          supabase.from('media_library').select('*').order('created_at', { ascending: false }),
          supabase.from('admin_invites').select('*').order('created_at', { ascending: false }),
          supabase.from('admin_roles').select('user_id, role'),
          supabase.from('client_logos').select('*').order('order_index', { ascending: true }),
          supabase.from('awards').select('*').order('order_index', { ascending: true }),
          supabase.from('shop_products').select('*').order('order_index', { ascending: true }),
        ]);

      if (postsRes.status === 'fulfilled' && postsRes.value.data) setPosts(postsRes.value.data);
      if (csRes.status === 'fulfilled' && csRes.value.data) setCaseStudies(csRes.value.data);
      if (enquiriesRes.status === 'fulfilled' && enquiriesRes.value.data) setEnquiries(enquiriesRes.value.data);
      if (jobsRes.status === 'fulfilled' && jobsRes.value.data) setJobs(jobsRes.value.data);
      if (teamRes.status === 'fulfilled' && teamRes.value.data) setTeam(teamRes.value.data);
      if (settingsRes.status === 'fulfilled' && settingsRes.value.data) setSettings(settingsRes.value.data);
      if (mediaRes.status === 'fulfilled' && mediaRes.value.data) setMedia(mediaRes.value.data as MediaItem[]);
      if (invitesRes.status === 'fulfilled' && invitesRes.value.data) setInvites(invitesRes.value.data as AdminInvite[]);
      if (adminRolesRes.status === 'fulfilled' && adminRolesRes.value.data) setAdminUsers(adminRolesRes.value.data);
      if (clientLogosRes.status === 'fulfilled' && clientLogosRes.value.data) setClientLogos(clientLogosRes.value.data as ClientLogoRow[]);
      if (awardsRes.status === 'fulfilled' && awardsRes.value.data) setAwards(awardsRes.value.data as AwardRow[]);
      if (shopRes.status === 'fulfilled' && shopRes.value.data) setShopProducts(shopRes.value.data as ShopProductRow[]);
    } catch {
      // no-op
    }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/admin', { replace: true });
  };

  const navItems: { tab: Tab; label: string; icon: React.ReactNode }[] = [
    { tab: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
    { tab: 'blog', label: 'Blog Editor', icon: <FileText size={18} /> },
    { tab: 'case-studies', label: 'Case Studies', icon: <Briefcase size={18} /> },
    { tab: 'enquiries', label: 'Enquiries', icon: <MessageSquare size={18} /> },
    { tab: 'media', label: 'Media Library', icon: <Image size={18} /> },
    { tab: 'jobs', label: 'Job Postings', icon: <Briefcase size={18} /> },
    { tab: 'team', label: 'Team Members', icon: <Users size={18} /> },
    { tab: 'client-logos', label: 'Client Logos', icon: <Palette size={18} /> },
    { tab: 'awards', label: 'Awards', icon: <Globe size={18} /> },
    { tab: 'shop', label: 'Engagement Shop', icon: <ShoppingCart size={18} /> },
    { tab: 'settings', label: 'Site Settings', icon: <Settings size={18} /> },
    { tab: 'seo', label: 'SEO & Branding', icon: <Search size={18} /> },
    { tab: 'users', label: 'User Management', icon: <ShieldCheck size={18} /> },
  ];

  return (
    <div className="min-h-screen bg-navy-950 flex text-cream">
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full z-40 bg-navy-900 border-r border-navy-800 transition-all duration-300 flex flex-col ${
          sidebarOpen ? 'w-60' : 'w-16'
        }`}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 py-5 border-b border-navy-800 flex-shrink-0">
          <div className="w-8 h-8 rounded-lg bg-gold-600 flex items-center justify-center text-navy-950 font-display text-base font-bold flex-shrink-0">
            Q
          </div>
          {sidebarOpen && (
            <span className="text-cream text-sm font-medium truncate">Queenswood CMS</span>
          )}
        </div>

        {/* Toggle */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="absolute -right-3 top-[72px] w-6 h-6 bg-navy-800 border border-navy-700 rounded-full flex items-center justify-center text-slate-400 hover:text-gold-500 transition-colors"
        >
          <ChevronDown
            size={12}
            className={`transition-transform duration-300 ${sidebarOpen ? 'rotate-90' : '-rotate-90'}`}
          />
        </button>

        {/* Nav */}
        <nav className="flex-1 py-4 overflow-y-auto">
          {navItems.map((item) => (
            <button
              key={item.tab}
              onClick={() => setActiveTab(item.tab)}
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-all duration-200 ${
                activeTab === item.tab
                  ? 'text-gold-500 bg-gold-600/10 border-r-2 border-gold-500'
                  : 'text-slate-400 hover:text-cream hover:bg-navy-800'
              }`}
              title={!sidebarOpen ? item.label : undefined}
            >
              <span className="flex-shrink-0">{item.icon}</span>
              {sidebarOpen && <span className="truncate">{item.label}</span>}
            </button>
          ))}
        </nav>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-4 text-slate-400 hover:text-red-400 transition-colors border-t border-navy-800 text-sm"
          title={!sidebarOpen ? 'Logout' : undefined}
        >
          <LogOut size={18} className="flex-shrink-0" />
          {sidebarOpen && <span>Logout</span>}
        </button>
      </aside>

      {/* Main content */}
      <main
        className={`flex-1 min-h-screen transition-all duration-300 ${
          sidebarOpen ? 'ml-60' : 'ml-16'
        }`}
      >
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-navy-950/95 backdrop-blur-sm border-b border-navy-800 px-6 py-4 flex items-center gap-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-slate-400 hover:text-cream transition-colors lg:hidden"
          >
            <Menu size={20} />
          </button>
          <h1 className="font-display text-lg text-cream capitalize">
            {navItems.find((n) => n.tab === activeTab)?.label ?? 'Dashboard'}
          </h1>
        </header>

        <div className="p-6 md:p-8">
          {activeTab === 'dashboard' && (
            <DashboardTab
              counts={{ posts: posts.length, caseStudies: caseStudies.length, enquiries: enquiries.length, jobs: jobs.filter((j) => j.active).length }}
            />
          )}
          {activeTab === 'blog' && (
            <BlogTab posts={posts} onRefresh={fetchAll} />
          )}
          {activeTab === 'case-studies' && (
            <CaseStudiesTab caseStudies={caseStudies} onRefresh={fetchAll} />
          )}
          {activeTab === 'enquiries' && (
            <EnquiriesTab enquiries={enquiries} onRefresh={fetchAll} />
          )}
          {activeTab === 'media' && (
            <MediaTab media={media} onRefresh={fetchAll} />
          )}
          {activeTab === 'jobs' && (
            <JobsTab jobs={jobs} onRefresh={fetchAll} />
          )}
          {activeTab === 'team' && (
            <TeamTab team={team} onRefresh={fetchAll} />
          )}
          {activeTab === 'client-logos' && (
            <ClientLogosTab logos={clientLogos} onRefresh={fetchAll} />
          )}
          {activeTab === 'awards' && (
            <AwardsTab awards={awards} onRefresh={fetchAll} />
          )}
          {activeTab === 'shop' && (
            <ShopTab products={shopProducts} onRefresh={fetchAll} />
          )}
          {activeTab === 'settings' && (
            <SettingsTab settings={settings} onRefresh={fetchAll} />
          )}
          {activeTab === 'seo' && (
            <SEOTab settings={settings} onRefresh={fetchAll} />
          )}
          {activeTab === 'users' && (
            <UsersTab invites={invites} adminUsers={adminUsers} onRefresh={fetchAll} />
          )}
        </div>
      </main>
    </div>
  );
}

// ===== DASHBOARD TAB =====
function DashboardTab({ counts }: { counts: Record<string, number> }) {
  const cards = [
    { label: 'Blog Posts', value: counts.posts, color: 'from-blue-600/20 to-navy-900' },
    { label: 'Case Studies', value: counts.caseStudies, color: 'from-purple-600/20 to-navy-900' },
    { label: 'Enquiries', value: counts.enquiries, color: 'from-gold-600/20 to-navy-900' },
    { label: 'Active Jobs', value: counts.jobs, color: 'from-green-600/20 to-navy-900' },
  ];

  return (
    <div>
      <h2 className="font-display text-2xl text-cream mb-8">Welcome back</h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => (
          <div
            key={card.label}
            className={`rounded-xl bg-gradient-to-br ${card.color} border border-navy-800 p-6`}
          >
            <p className="text-slate-400 text-xs uppercase tracking-widest mb-3">{card.label}</p>
            <p className="font-display text-4xl text-cream">{card.value}</p>
          </div>
        ))}
      </div>
      <div className="mt-10 bg-navy-900 rounded-xl border border-navy-800 p-6">
        <h3 className="font-display text-lg text-cream mb-4">Quick Actions</h3>
        <div className="flex flex-wrap gap-3">
          <span className="text-slate-400 text-sm">
            Use the sidebar to navigate between content types. All changes save directly to Supabase.
          </span>
        </div>
      </div>
    </div>
  );
}

// ===== BODY EDITOR =====
function BodyEditor({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cursorPosRef = useRef<number>(0);

  const uploadImageFile = async (file: File): Promise<string> => {
    const ext = file.name.split('.').pop();
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { data, error } = await supabase.storage.from('media').upload(filename, file, { upsert: false });
    if (error) throw error;
    const { data: urlData } = supabase.storage.from('media').getPublicUrl(data.path);
    return urlData.publicUrl;
  };

  const insertImageAtCursor = (url: string) => {
    const tag = `\n![image](${url})\n`;
    const pos = cursorPosRef.current;
    const newValue = value.slice(0, pos) + tag + value.slice(pos);
    onChange(newValue);
    const newPos = pos + tag.length;
    requestAnimationFrame(() => {
      if (textareaRef.current) {
        textareaRef.current.selectionStart = newPos;
        textareaRef.current.selectionEnd = newPos;
        textareaRef.current.focus();
      }
    });
  };

  const handleFile = async (file: File) => {
    if (!file.type.startsWith('image/')) return;
    setUploading(true);
    setUploadError('');
    try {
      const url = await uploadImageFile(file);
      insertImageAtCursor(url);
    } catch (err: unknown) {
      setUploadError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await handleFile(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDrop = async (e: React.DragEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (!file) return;
    const rect = textareaRef.current?.getBoundingClientRect();
    if (rect && textareaRef.current) {
      const dropY = e.clientY - rect.top + textareaRef.current.scrollTop;
      const lineHeight = 21;
      const lineIndex = Math.floor(dropY / lineHeight);
      const lines = value.split('\n');
      let charPos = 0;
      for (let i = 0; i < Math.min(lineIndex, lines.length); i++) {
        charPos += lines[i].length + 1;
      }
      cursorPosRef.current = Math.min(charPos, value.length);
    }
    await handleFile(file);
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-slate-500 text-xs">Drag an image onto the text area to insert at that position, or:</span>
        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileInput} />
        <button
          type="button"
          onClick={() => {
            cursorPosRef.current = textareaRef.current?.selectionStart ?? value.length;
            fileInputRef.current?.click();
          }}
          disabled={uploading}
          className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-navy-800 text-slate-300 hover:text-gold-500 hover:bg-navy-700 transition-colors disabled:opacity-50"
        >
          {uploading ? (
            <div className="w-3 h-3 border border-gold-600 border-t-transparent rounded-full animate-spin" />
          ) : (
            <ImagePlus size={13} />
          )}
          {uploading ? 'Uploading...' : 'Upload & Insert Image'}
        </button>
      </div>
      {uploadError && <p className="text-red-400 text-xs">{uploadError}</p>}
      <div className={`relative rounded-lg transition-all ${dragOver ? 'ring-2 ring-gold-500' : ''}`}>
        {dragOver && (
          <div className="absolute inset-0 z-10 rounded-lg bg-gold-600/10 border-2 border-dashed border-gold-500 flex items-center justify-center pointer-events-none">
            <p className="text-gold-400 text-sm font-medium">Drop image here to insert</p>
          </div>
        )}
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => {
            cursorPosRef.current = e.target.selectionStart;
            onChange(e.target.value);
          }}
          onMouseUp={() => { cursorPosRef.current = textareaRef.current?.selectionStart ?? 0; }}
          onKeyUp={() => { cursorPosRef.current = textareaRef.current?.selectionStart ?? 0; }}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          rows={14}
          className={`${inputClass} resize-y min-h-[200px]`}
          placeholder={`Write your content here...\n\nMarkdown-like formatting:\n# Heading 1\n## Heading 2\n- List item\n![image](https://...)\n\nDrag an image file directly onto this area to insert it at that position.`}
        />
      </div>
    </div>
  );
}

// ===== BLOG TAB =====
function BlogTab({ posts, onRefresh }: { posts: Post[]; onRefresh: () => void }) {
  const [editing, setEditing] = useState<Partial<Post> | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [heroUploading, setHeroUploading] = useState(false);
  const [heroUploadError, setHeroUploadError] = useState('');
  const [heroDragOver, setHeroDragOver] = useState(false);
  const heroFileRef = useRef<HTMLInputElement>(null);

  const emptyPost: Partial<Post> = {
    title: '', slug: '', excerpt: '', body: '', category: 'Insights',
    author: '', hero_image: '', meta_title: '', meta_description: '',
  };

  const uploadImageFile = async (file: File): Promise<string> => {
    const ext = file.name.split('.').pop();
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { data, error } = await supabase.storage.from('media').upload(filename, file, { upsert: false });
    if (error) throw error;
    const { data: urlData } = supabase.storage.from('media').getPublicUrl(data.path);
    return urlData.publicUrl;
  };

  const handleHeroDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setHeroDragOver(false);
    const file = e.dataTransfer.files[0];
    if (!file || !file.type.startsWith('image/')) return;
    setHeroUploading(true);
    setHeroUploadError('');
    try {
      const url = await uploadImageFile(file);
      setEditing((prev) => prev ? { ...prev, hero_image: url } : prev);
    } catch (err: unknown) {
      setHeroUploadError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setHeroUploading(false);
    }
  };

  const handleHeroFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setHeroUploading(true);
    setHeroUploadError('');
    try {
      const url = await uploadImageFile(file);
      setEditing((prev) => prev ? { ...prev, hero_image: url } : prev);
    } catch (err: unknown) {
      setHeroUploadError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setHeroUploading(false);
      if (heroFileRef.current) heroFileRef.current.value = '';
    }
  };

  const handleSave = async () => {
    if (!editing) return;
    setSaving(true);
    setError('');
    try {
      const payload = {
        ...editing,
        published_at: editing.published_at ?? new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      if (editing.id) {
        const { error: err } = await supabase.from('posts').update(payload).eq('id', editing.id);
        if (err) throw err;
      } else {
        const { error: err } = await supabase.from('posts').insert(payload);
        if (err) throw err;
      }
      setEditing(null);
      onRefresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this post?')) return;
    await supabase.from('posts').delete().eq('id', id);
    onRefresh();
  };

  if (editing !== null) {
    return (
      <FormPanel
        title={editing.id ? 'Edit Post' : 'New Post'}
        onCancel={() => setEditing(null)}
        onSave={handleSave}
        saving={saving}
        error={error}
      >
        <FormField label="Title" required>
          <input
            type="text"
            value={editing.title ?? ''}
            onChange={(e) => setEditing({ ...editing, title: e.target.value, slug: editing.id ? editing.slug : slugify(e.target.value) })}
            className={inputClass}
          />
        </FormField>
        <FormField label="Slug">
          <input type="text" value={editing.slug ?? ''} onChange={(e) => setEditing({ ...editing, slug: e.target.value })} className={inputClass} />
        </FormField>
        <FormField label="Excerpt">
          <textarea value={editing.excerpt ?? ''} onChange={(e) => setEditing({ ...editing, excerpt: e.target.value })} rows={2} className={inputClass} />
        </FormField>

        <FormField label="Body" required>
          <BodyEditor
            value={editing.body ?? ''}
            onChange={(v) => setEditing((prev) => prev ? { ...prev, body: v } : prev)}
          />
        </FormField>

        <FormField label="Category">
          <select value={editing.category ?? 'Insights'} onChange={(e) => setEditing({ ...editing, category: e.target.value })} className={inputClass}>
            <option>Insights</option><option>News</option><option>Case Studies</option>
          </select>
        </FormField>
        <FormField label="Author">
          <input type="text" value={editing.author ?? ''} onChange={(e) => setEditing({ ...editing, author: e.target.value })} className={inputClass} />
        </FormField>

        <FormField label="Hero Image">
          <div className="flex flex-col gap-3">
            <input type="url" value={editing.hero_image ?? ''} onChange={(e) => setEditing({ ...editing, hero_image: e.target.value })} className={inputClass} placeholder="https://... or drag & drop below" />
            <div
              onDrop={handleHeroDrop}
              onDragOver={(e) => { e.preventDefault(); setHeroDragOver(true); }}
              onDragLeave={() => setHeroDragOver(false)}
              onClick={() => heroFileRef.current?.click()}
              className={`rounded-lg border-2 border-dashed p-5 flex flex-col items-center gap-2 cursor-pointer transition-all ${
                heroDragOver ? 'border-gold-500 bg-gold-600/10' : 'border-navy-700 hover:border-gold-600/50'
              }`}
            >
              <input ref={heroFileRef} type="file" accept="image/*" className="hidden" onChange={handleHeroFileInput} />
              {heroUploading ? (
                <div className="w-6 h-6 border-2 border-gold-600 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Upload size={18} className="text-slate-500" />
                  <p className="text-slate-500 text-xs">Drop hero image here or click to browse</p>
                </>
              )}
            </div>
            {heroUploadError && <p className="text-red-400 text-xs">{heroUploadError}</p>}
            {editing.hero_image && (
              <img src={editing.hero_image} alt="" className="rounded-lg h-32 object-cover border border-navy-700" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
            )}
          </div>
        </FormField>

        <FormField label="Meta Title">
          <input type="text" value={editing.meta_title ?? ''} onChange={(e) => setEditing({ ...editing, meta_title: e.target.value })} className={inputClass} />
        </FormField>
        <FormField label="Meta Description">
          <textarea value={editing.meta_description ?? ''} onChange={(e) => setEditing({ ...editing, meta_description: e.target.value })} rows={2} className={inputClass} />
        </FormField>
      </FormPanel>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-xl text-cream">Blog Posts ({posts.length})</h2>
        <button onClick={() => setEditing(emptyPost)} className="btn-primary flex items-center gap-2 text-sm px-4 py-2">
          <Plus size={14} /> New Post
        </button>
      </div>
      <DataTable
        columns={['Title', 'Category', 'Author', 'Published', 'Actions']}
        rows={posts}
        renderRow={(post) => (
          <tr key={post.id} className="border-b border-navy-800 hover:bg-navy-900 transition-colors">
            <td className="px-4 py-3 text-sm text-cream max-w-xs truncate">{post.title}</td>
            <td className="px-4 py-3 text-xs text-gold-500">{post.category}</td>
            <td className="px-4 py-3 text-xs text-slate-400">{post.author}</td>
            <td className="px-4 py-3 text-xs text-slate-500">{new Date(post.published_at).toLocaleDateString('en-GB')}</td>
            <td className="px-4 py-3">
              <div className="flex items-center gap-2">
                <button onClick={() => setEditing(post)} className="p-1.5 text-slate-400 hover:text-gold-500 transition-colors">
                  <Edit3 size={14} />
                </button>
                <button onClick={() => handleDelete(post.id)} className="p-1.5 text-slate-400 hover:text-red-400 transition-colors">
                  <Trash2 size={14} />
                </button>
              </div>
            </td>
          </tr>
        )}
      />
    </div>
  );
}

// ===== CASE STUDIES TAB =====
function CaseStudiesTab({ caseStudies, onRefresh }: { caseStudies: CaseStudy[]; onRefresh: () => void }) {
  const [editing, setEditing] = useState<Partial<CaseStudy> | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const emptyCS: Partial<CaseStudy> = { title: '', slug: '', client: '', sector: 'Transport', hero_image: '', summary: '', body: '', meta_title: '', meta_description: '' };

  const handleSave = async () => {
    if (!editing) return;
    setSaving(true); setError('');
    try {
      const payload = { ...editing, published_at: editing.published_at ?? new Date().toISOString(), updated_at: new Date().toISOString() };
      if (editing.id) {
        const { error: err } = await supabase.from('case_studies').update(payload).eq('id', editing.id);
        if (err) throw err;
      } else {
        const { error: err } = await supabase.from('case_studies').insert(payload);
        if (err) throw err;
      }
      setEditing(null); onRefresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Save failed');
    } finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this case study?')) return;
    await supabase.from('case_studies').delete().eq('id', id);
    onRefresh();
  };

  if (editing !== null) {
    return (
      <FormPanel title={editing.id ? 'Edit Case Study' : 'New Case Study'} onCancel={() => setEditing(null)} onSave={handleSave} saving={saving} error={error}>
        <FormField label="Title" required><input type="text" value={editing.title ?? ''} onChange={(e) => setEditing({ ...editing, title: e.target.value, slug: editing.id ? editing.slug : slugify(e.target.value) })} className={inputClass} /></FormField>
        <FormField label="Slug"><input type="text" value={editing.slug ?? ''} onChange={(e) => setEditing({ ...editing, slug: e.target.value })} className={inputClass} /></FormField>
        <FormField label="Client"><input type="text" value={editing.client ?? ''} onChange={(e) => setEditing({ ...editing, client: e.target.value })} className={inputClass} /></FormField>
        <FormField label="Sector">
          <select value={editing.sector ?? 'Transport'} onChange={(e) => setEditing({ ...editing, sector: e.target.value })} className={inputClass}>
            <option>Transport</option><option>Water</option><option>Energy</option><option>Other</option>
          </select>
        </FormField>
        <FormField label="Hero Image URL"><input type="url" value={editing.hero_image ?? ''} onChange={(e) => setEditing({ ...editing, hero_image: e.target.value })} className={inputClass} /></FormField>
        <FormField label="Summary"><textarea value={editing.summary ?? ''} onChange={(e) => setEditing({ ...editing, summary: e.target.value })} rows={3} className={inputClass} /></FormField>
        <FormField label="Body" required>
          <BodyEditor
            value={editing.body ?? ''}
            onChange={(v) => setEditing((prev) => prev ? { ...prev, body: v } : prev)}
          />
        </FormField>
        <FormField label="Meta Title"><input type="text" value={editing.meta_title ?? ''} onChange={(e) => setEditing({ ...editing, meta_title: e.target.value })} className={inputClass} /></FormField>
        <FormField label="Meta Description"><textarea value={editing.meta_description ?? ''} onChange={(e) => setEditing({ ...editing, meta_description: e.target.value })} rows={2} className={inputClass} /></FormField>
      </FormPanel>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-xl text-cream">Case Studies ({caseStudies.length})</h2>
        <button onClick={() => setEditing(emptyCS)} className="btn-primary flex items-center gap-2 text-sm px-4 py-2"><Plus size={14} /> New Case Study</button>
      </div>
      <DataTable
        columns={['Title', 'Client', 'Sector', 'Published', 'Actions']}
        rows={caseStudies}
        renderRow={(cs) => (
          <tr key={cs.id} className="border-b border-navy-800 hover:bg-navy-900 transition-colors">
            <td className="px-4 py-3 text-sm text-cream max-w-xs truncate">{cs.title}</td>
            <td className="px-4 py-3 text-xs text-slate-400 max-w-xs truncate">{cs.client}</td>
            <td className="px-4 py-3 text-xs text-gold-500">{cs.sector}</td>
            <td className="px-4 py-3 text-xs text-slate-500">{new Date(cs.published_at).toLocaleDateString('en-GB')}</td>
            <td className="px-4 py-3"><div className="flex items-center gap-2">
              <button onClick={() => setEditing(cs)} className="p-1.5 text-slate-400 hover:text-gold-500 transition-colors"><Edit3 size={14} /></button>
              <button onClick={() => handleDelete(cs.id)} className="p-1.5 text-slate-400 hover:text-red-400 transition-colors"><Trash2 size={14} /></button>
            </div></td>
          </tr>
        )}
      />
    </div>
  );
}

// ===== ENQUIRIES TAB =====
function EnquiriesTab({ enquiries, onRefresh }: { enquiries: Enquiry[]; onRefresh: () => void }) {
  const [expanded, setExpanded] = useState<string | null>(null);

  const markRead = async (id: string, read: boolean) => {
    await supabase.from('enquiries').update({ read }).eq('id', id);
    onRefresh();
  };

  const unread = enquiries.filter((e) => !e.read).length;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-xl text-cream">
          Enquiries ({enquiries.length})
          {unread > 0 && (
            <span className="ml-3 bg-gold-600 text-navy-950 text-xs font-bold px-2 py-0.5 rounded-full">
              {unread} unread
            </span>
          )}
        </h2>
      </div>
      <div className="flex flex-col gap-3">
        {enquiries.length === 0 ? (
          <div className="text-center py-16 text-slate-500">No enquiries yet.</div>
        ) : (
          enquiries.map((enq) => (
            <div
              key={enq.id}
              className={`bg-navy-900 rounded-xl border transition-all duration-200 ${
                enq.read ? 'border-navy-800' : 'border-gold-600/40'
              }`}
            >
              <div
                className="flex items-start justify-between px-5 py-4 cursor-pointer"
                onClick={() => setExpanded(expanded === enq.id ? null : enq.id)}
              >
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  {!enq.read && (
                    <span className="w-2 h-2 rounded-full bg-gold-500 flex-shrink-0 mt-2" />
                  )}
                  <div className="min-w-0">
                    <p className={`text-sm font-medium ${enq.read ? 'text-slate-400' : 'text-cream'}`}>
                      {enq.name}
                      {enq.company && <span className="text-slate-500 font-normal"> — {enq.company}</span>}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5 truncate">{enq.email}</p>
                    {enq.subject && (
                      <p className="text-xs text-gold-500 mt-1 truncate">{enq.subject}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0 ml-4">
                  <span className="text-xs text-slate-600">
                    {new Date(enq.created_at).toLocaleDateString('en-GB')}
                  </span>
                  <ChevronDown
                    size={14}
                    className={`text-slate-500 transition-transform ${expanded === enq.id ? 'rotate-180' : ''}`}
                  />
                </div>
              </div>
              {expanded === enq.id && (
                <div className="px-5 pb-5 border-t border-navy-800 pt-4">
                  <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">{enq.message}</p>
                  <div className="flex items-center gap-3 mt-4">
                    <button
                      onClick={() => markRead(enq.id, !enq.read)}
                      className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg transition-colors ${
                        enq.read
                          ? 'bg-navy-800 text-slate-400 hover:text-cream'
                          : 'bg-gold-600/10 text-gold-500 hover:bg-gold-600/20'
                      }`}
                    >
                      {enq.read ? <EyeOff size={12} /> : <Eye size={12} />}
                      {enq.read ? 'Mark unread' : 'Mark as read'}
                    </button>
                    <a
                      href={`mailto:${enq.email}`}
                      className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-navy-800 text-slate-400 hover:text-cream transition-colors"
                    >
                      Reply by email
                    </a>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// ===== MEDIA TAB =====
function MediaTab({ media, onRefresh }: { media: MediaItem[]; onRefresh: () => void }) {
  const [form, setForm] = useState({ name: '', url: '', tags: '' });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadFile = async (file: File) => {
    setUploading(true);
    setUploadError('');
    try {
      const ext = file.name.split('.').pop();
      const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { data, error } = await supabase.storage.from('media').upload(filename, file, { upsert: false });
      if (error) throw error;
      const { data: urlData } = supabase.storage.from('media').getPublicUrl(data.path);
      const publicUrl = urlData.publicUrl;
      await supabase.from('media_library').insert({
        name: file.name,
        url: publicUrl,
        created_at: new Date().toISOString(),
      });
      onRefresh();
    } catch (err: unknown) {
      setUploadError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const files = Array.from(e.dataTransfer.files).filter((f) => f.type.startsWith('image/'));
    for (const file of files) {
      await uploadFile(file);
    }
  };

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    for (const file of files) {
      await uploadFile(file);
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleAdd = async () => {
    if (!form.url) return;
    setSaving(true);
    await supabase.from('media_library').insert({ name: form.name || 'Untitled', url: form.url, created_at: new Date().toISOString() });
    setForm({ name: '', url: '', tags: '' });
    setSaving(false);
    onRefresh();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Remove this media item?')) return;
    await supabase.from('media_library').delete().eq('id', id);
    onRefresh();
  };

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  return (
    <div>
      <h2 className="font-display text-xl text-cream mb-6">Media Library ({media.length})</h2>

      {/* Drag and drop upload zone */}
      <div
        onDrop={handleDrop}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onClick={() => fileInputRef.current?.click()}
        className={`rounded-xl border-2 border-dashed p-10 mb-6 flex flex-col items-center justify-center gap-3 transition-all duration-200 cursor-pointer ${
          dragOver
            ? 'border-gold-500 bg-gold-600/10'
            : 'border-navy-700 bg-navy-900 hover:border-gold-600/50 hover:bg-navy-800/50'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleFileInput}
        />
        {uploading ? (
          <div className="w-8 h-8 border-2 border-gold-600 border-t-transparent rounded-full animate-spin" />
        ) : (
          <>
            <div className="p-3 rounded-xl bg-navy-800 text-gold-500">
              <Upload size={24} />
            </div>
            <div className="text-center">
              <p className="text-cream text-sm font-medium">Drop images here or click to browse</p>
              <p className="text-slate-500 text-xs mt-1">PNG, JPG, GIF, WebP supported</p>
            </div>
          </>
        )}
      </div>

      {uploadError && (
        <p className="text-red-400 text-sm bg-red-400/10 rounded-lg px-4 py-3 mb-4">{uploadError}</p>
      )}

      <div className="bg-navy-900 rounded-xl border border-navy-800 p-5 mb-8">
        <h3 className="text-sm text-slate-400 uppercase tracking-wider mb-4">Add by URL</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <FormField label="File Name">
            <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Image name" className={inputClass} />
          </FormField>
          <FormField label="URL" required>
            <input type="url" value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} placeholder="https://..." className={inputClass} />
          </FormField>
          <FormField label="Tags">
            <input type="text" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} placeholder="tag1, tag2" className={inputClass} />
          </FormField>
        </div>
        <button onClick={handleAdd} disabled={saving || !form.url} className="btn-primary text-sm px-5 py-2 mt-4 flex items-center gap-2">
          <Plus size={14} /> Add Item
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {media.map((item) => (
          <div key={item.id} className="group relative bg-navy-900 rounded-xl overflow-hidden border border-navy-800">
            <div className="aspect-square bg-navy-800">
              <img src={item.url} alt={item.name} className="w-full h-full object-cover" loading="lazy" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
            </div>
            <div className="p-2">
              <p className="text-xs text-slate-400 truncate">{item.name}</p>
            </div>
            <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => handleCopyUrl(item.url)}
                className={`p-1 rounded text-white text-xs ${copiedUrl === item.url ? 'bg-green-600' : 'bg-navy-700/90 hover:bg-navy-600'}`}
                title="Copy URL"
              >
                {copiedUrl === item.url ? <Check size={12} /> : <ImagePlus size={12} />}
              </button>
              <button
                onClick={() => handleDelete(item.id)}
                className="p-1 bg-red-500/80 text-white rounded"
                title="Delete"
              >
                <X size={12} />
              </button>
            </div>
          </div>
        ))}
        {media.length === 0 && (
          <div className="col-span-full text-center py-16 text-slate-500">No media items yet. Upload or add one above.</div>
        )}
      </div>
    </div>
  );
}

// ===== JOBS TAB =====
function JobsTab({ jobs, onRefresh }: { jobs: JobPosting[]; onRefresh: () => void }) {
  const [editing, setEditing] = useState<Partial<JobPosting> | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const emptyJob: Partial<JobPosting> = { title: '', type: 'Full-time', location: '', department: '', description: '', salary: '', active: true };

  const handleSave = async () => {
    if (!editing) return;
    setSaving(true); setError('');
    try {
      const payload = { ...editing, posted_at: editing.posted_at ?? new Date().toISOString() };
      if (editing.id) {
        const { error: err } = await supabase.from('job_postings').update(payload).eq('id', editing.id);
        if (err) throw err;
      } else {
        const { error: err } = await supabase.from('job_postings').insert(payload);
        if (err) throw err;
      }
      setEditing(null); onRefresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Save failed');
    } finally { setSaving(false); }
  };

  const toggleActive = async (id: string, active: boolean) => {
    await supabase.from('job_postings').update({ active: !active }).eq('id', id);
    onRefresh();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this job posting?')) return;
    await supabase.from('job_postings').delete().eq('id', id);
    onRefresh();
  };

  if (editing !== null) {
    return (
      <FormPanel title={editing.id ? 'Edit Job' : 'New Job Posting'} onCancel={() => setEditing(null)} onSave={handleSave} saving={saving} error={error}>
        <FormField label="Title" required><input type="text" value={editing.title ?? ''} onChange={(e) => setEditing({ ...editing, title: e.target.value })} className={inputClass} /></FormField>
        <FormField label="Type">
          <select value={editing.type ?? 'Full-time'} onChange={(e) => setEditing({ ...editing, type: e.target.value })} className={inputClass}>
            <option>Full-time</option><option>Part-time</option><option>Contract</option><option>Freelance</option>
          </select>
        </FormField>
        <FormField label="Location"><input type="text" value={editing.location ?? ''} onChange={(e) => setEditing({ ...editing, location: e.target.value })} className={inputClass} /></FormField>
        <FormField label="Department"><input type="text" value={editing.department ?? ''} onChange={(e) => setEditing({ ...editing, department: e.target.value })} className={inputClass} /></FormField>
        <FormField label="Salary"><input type="text" value={editing.salary ?? ''} onChange={(e) => setEditing({ ...editing, salary: e.target.value })} placeholder="e.g. £35,000 - £45,000" className={inputClass} /></FormField>
        <FormField label="Description" required><textarea value={editing.description ?? ''} onChange={(e) => setEditing({ ...editing, description: e.target.value })} rows={8} className={inputClass} /></FormField>
        <FormField label="Active">
          <label className="flex items-center gap-3 cursor-pointer">
            <div
              onClick={() => setEditing({ ...editing, active: !editing.active })}
              className={`w-11 h-6 rounded-full transition-colors ${editing.active ? 'bg-gold-600' : 'bg-navy-700'} relative`}
            >
              <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${editing.active ? 'left-6' : 'left-1'}`} />
            </div>
            <span className="text-slate-400 text-sm">{editing.active ? 'Active (visible)' : 'Inactive (hidden)'}</span>
          </label>
        </FormField>
      </FormPanel>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-xl text-cream">Job Postings ({jobs.length})</h2>
        <button onClick={() => setEditing(emptyJob)} className="btn-primary flex items-center gap-2 text-sm px-4 py-2"><Plus size={14} /> New Job</button>
      </div>
      <DataTable
        columns={['Title', 'Type', 'Location', 'Status', 'Actions']}
        rows={jobs}
        renderRow={(job) => (
          <tr key={job.id} className="border-b border-navy-800 hover:bg-navy-900 transition-colors">
            <td className="px-4 py-3 text-sm text-cream">{job.title}</td>
            <td className="px-4 py-3 text-xs text-slate-400">{job.type}</td>
            <td className="px-4 py-3 text-xs text-slate-400">{job.location || '—'}</td>
            <td className="px-4 py-3">
              <span className={`text-xs px-2 py-1 rounded-full ${job.active ? 'bg-green-500/10 text-green-400' : 'bg-slate-600/20 text-slate-500'}`}>
                {job.active ? 'Active' : 'Inactive'}
              </span>
            </td>
            <td className="px-4 py-3"><div className="flex items-center gap-2">
              <button onClick={() => toggleActive(job.id, job.active)} className="p-1.5 text-slate-400 hover:text-gold-500 transition-colors" title={job.active ? 'Deactivate' : 'Activate'}>
                {job.active ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
              <button onClick={() => setEditing(job)} className="p-1.5 text-slate-400 hover:text-gold-500 transition-colors"><Edit3 size={14} /></button>
              <button onClick={() => handleDelete(job.id)} className="p-1.5 text-slate-400 hover:text-red-400 transition-colors"><Trash2 size={14} /></button>
            </div></td>
          </tr>
        )}
      />
    </div>
  );
}

// ===== TEAM TAB =====
function TeamTab({ team, onRefresh }: { team: TeamMember[]; onRefresh: () => void }) {
  const [editing, setEditing] = useState<Partial<TeamMember> | null>(null);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!editing) return;
    setSaving(true);
    if (editing.id) {
      await supabase.from('team_members').update(editing).eq('id', editing.id);
    } else {
      await supabase.from('team_members').insert(editing);
    }
    setEditing(null); setSaving(false); onRefresh();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Remove this team member?')) return;
    await supabase.from('team_members').delete().eq('id', id);
    onRefresh();
  };

  if (editing !== null) {
    return (
      <FormPanel title={editing.id ? 'Edit Team Member' : 'New Team Member'} onCancel={() => setEditing(null)} onSave={handleSave} saving={saving} error="">
        <FormField label="Name" required>
          <input
            type="text"
            value={editing.name ?? ''}
            onChange={(e) => setEditing({ ...editing, name: e.target.value, slug: editing.id ? editing.slug : e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') })}
            className={inputClass}
          />
        </FormField>
        <FormField label="Slug (URL path — e.g. jack-day)">
          <input type="text" value={editing.slug ?? ''} onChange={(e) => setEditing({ ...editing, slug: e.target.value })} className={inputClass} placeholder="jack-day" />
        </FormField>
        <FormField label="Role">
          <input type="text" value={editing.role ?? ''} onChange={(e) => setEditing({ ...editing, role: e.target.value })} className={inputClass} />
        </FormField>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <FormField label="Primary Photo URL">
            <input type="url" value={editing.image_url ?? ''} onChange={(e) => setEditing({ ...editing, image_url: e.target.value })} className={inputClass} placeholder="https://..." />
          </FormField>
          <FormField label="Hover Photo URL">
            <input type="url" value={editing.hover_image_url ?? ''} onChange={(e) => setEditing({ ...editing, hover_image_url: e.target.value })} className={inputClass} placeholder="https://..." />
          </FormField>
        </div>
        {editing.image_url && (
          <div className="flex gap-4">
            <div className="flex flex-col gap-1">
              <span className="text-xs text-slate-500">Primary</span>
              <img src={editing.image_url} alt="" className="w-24 h-32 object-cover rounded-lg border border-navy-700" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
            </div>
            {editing.hover_image_url && (
              <div className="flex flex-col gap-1">
                <span className="text-xs text-slate-500">Hover</span>
                <img src={editing.hover_image_url} alt="" className="w-24 h-32 object-cover rounded-lg border border-navy-700" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
              </div>
            )}
          </div>
        )}
        <FormField label="Bio">
          <textarea value={editing.bio ?? ''} onChange={(e) => setEditing({ ...editing, bio: e.target.value })} rows={6} className={inputClass} placeholder="Write a paragraph or two about this team member..." />
        </FormField>
        <FormField label="LinkedIn URL">
          <input type="url" value={editing.linkedin_url ?? ''} onChange={(e) => setEditing({ ...editing, linkedin_url: e.target.value })} className={inputClass} placeholder="https://linkedin.com/in/..." />
        </FormField>
        <FormField label="Display Order">
          <input type="number" value={editing.order_index ?? 0} onChange={(e) => setEditing({ ...editing, order_index: parseInt(e.target.value) })} className={inputClass} />
        </FormField>
      </FormPanel>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-xl text-cream">Team Members ({team.length})</h2>
        <button onClick={() => setEditing({ name: '', role: '', image_url: '', hover_image_url: '', bio: '', linkedin_url: '', slug: '', order_index: team.length })} className="btn-primary flex items-center gap-2 text-sm px-4 py-2"><Plus size={14} /> Add Member</button>
      </div>
      <DataTable
        columns={['Photo', 'Name', 'Role', 'Slug', 'Order', 'Actions']}
        rows={team}
        renderRow={(member) => (
          <tr key={member.id} className="border-b border-navy-800 hover:bg-navy-900 transition-colors">
            <td className="px-4 py-3">
              {member.image_url ? (
                <img src={member.image_url} alt={member.name} className="w-10 h-12 object-cover object-top rounded-lg border border-navy-700" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
              ) : (
                <div className="w-10 h-12 rounded-lg bg-navy-800 flex items-center justify-center text-gold-500/60 font-display text-sm">
                  {(member.name || '?')[0]}
                </div>
              )}
            </td>
            <td className="px-4 py-3 text-sm text-cream">{member.name}</td>
            <td className="px-4 py-3 text-xs text-gold-500">{member.role}</td>
            <td className="px-4 py-3 text-xs text-slate-500 font-mono">{member.slug || '—'}</td>
            <td className="px-4 py-3 text-xs text-slate-400">{member.order_index ?? '—'}</td>
            <td className="px-4 py-3"><div className="flex items-center gap-2">
              <button onClick={() => setEditing(member)} className="p-1.5 text-slate-400 hover:text-gold-500 transition-colors"><Edit3 size={14} /></button>
              <button onClick={() => handleDelete(member.id)} className="p-1.5 text-slate-400 hover:text-red-400 transition-colors"><Trash2 size={14} /></button>
            </div></td>
          </tr>
        )}
      />
    </div>
  );
}

// ===== IMAGE SETTING CARD =====
function ImageSettingCard({
  label, description, settingKey, placeholder, values, saved, setValues, onSave, onClear, onOpenPicker, inputClass, aspectClass,
}: {
  label: string;
  description: string;
  settingKey: string;
  placeholder: string;
  values: Record<string, string>;
  saved: Record<string, boolean>;
  setValues: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  onSave: (key: string) => void;
  onClear: (key: string) => void;
  onOpenPicker: (key: string) => void;
  inputClass: string;
  aspectClass?: string;
}) {
  const val = values[settingKey] ?? '';
  return (
    <div className="bg-navy-900 rounded-xl border border-navy-800 p-5 mb-4">
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-xs text-gold-500 uppercase tracking-wider font-medium">{label}</p>
          <p className="text-xs text-slate-500 mt-0.5">{description}</p>
        </div>
        {val && (
          <button onClick={() => onClear(settingKey)} className="text-xs text-red-400 hover:text-red-300 transition-colors flex items-center gap-1">
            <X size={12} /> Remove
          </button>
        )}
      </div>

      {val ? (
        <div className={`relative rounded-lg overflow-hidden mb-3 bg-navy-800 ${aspectClass ?? 'aspect-video max-h-48'}`}>
          <img src={val} alt={label} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
        </div>
      ) : (
        <div className={`rounded-lg border border-dashed border-navy-700 bg-navy-800/50 flex flex-col items-center justify-center gap-2 mb-3 ${aspectClass ?? 'aspect-video max-h-48'}`}>
          <ImagePlus size={24} className="text-slate-600" />
          <p className="text-slate-500 text-xs">{placeholder}</p>
        </div>
      )}

      <div className="flex gap-2">
        <input
          type="url"
          value={val}
          onChange={(e) => setValues((prev) => ({ ...prev, [settingKey]: e.target.value }))}
          placeholder="https://... or pick from Media Library"
          className={`${inputClass} flex-1 text-xs`}
        />
        <button
          onClick={() => onOpenPicker(settingKey)}
          className="px-3 py-2 rounded-lg text-xs font-medium bg-navy-800 border border-navy-700 text-slate-300 hover:text-cream hover:border-navy-600 transition-all flex items-center gap-1.5 whitespace-nowrap"
        >
          <Image size={13} /> Library
        </button>
        <button
          onClick={() => onSave(settingKey)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${saved[settingKey] ? 'bg-green-600 text-white' : 'btn-primary'}`}
        >
          {saved[settingKey] ? <Check size={14} /> : 'Save'}
        </button>
      </div>
    </div>
  );
}

// ===== SETTINGS TAB =====
function SettingsTab({ settings, onRefresh }: { settings: SettingsType[]; onRefresh: () => void }) {
  const [values, setValues] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState<Record<string, boolean>>({});
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);

  useEffect(() => {
    const init: Record<string, string> = {};
    settings.forEach((s) => { init[s.key] = s.value; });
    setValues(init);
  }, [settings]);

  const handleSave = async (key: string) => {
    const { error } = await supabase
      .from('settings')
      .update({ value: values[key] ?? '', updated_at: new Date().toISOString() })
      .eq('key', key);
    if (!error) {
      setSaved((prev) => ({ ...prev, [key]: true }));
      setTimeout(() => setSaved((prev) => ({ ...prev, [key]: false })), 2000);
      onRefresh();
    }
  };

  const [mediaPickerTarget, setMediaPickerTarget] = useState<string>('hero_bg_image');

  const openMediaPicker = async (target: string) => {
    const { data } = await supabase.from('media_library').select('*').order('created_at', { ascending: false });
    setMediaItems(data ?? []);
    setMediaPickerTarget(target);
    setMediaPickerOpen(true);
  };

  const pickMedia = (url: string) => {
    setValues((prev) => ({ ...prev, [mediaPickerTarget]: url }));
    setMediaPickerOpen(false);
  };

  const clearImageSetting = async (key: string) => {
    setValues((prev) => ({ ...prev, [key]: '' }));
    await supabase.from('settings').update({ value: '', updated_at: new Date().toISOString() }).eq('key', key);
    onRefresh();
  };

  const [newKey, setNewKey] = useState('');
  const [newValue, setNewValue] = useState('');

  const handleAdd = async () => {
    if (!newKey) return;
    await supabase.from('settings').insert({ key: newKey, value: newValue, updated_at: new Date().toISOString() });
    setNewKey(''); setNewValue('');
    onRefresh();
  };

  const IMAGE_KEYS = ['hero_bg_image', 'social_construct_presenter_image'];

  return (
    <div>
      <h2 className="font-display text-xl text-cream mb-6">Site Settings</h2>

      {/* Hero Background Image — dedicated card */}
      <ImageSettingCard
        label="Hero Background Image"
        description="Replaces the animated particle canvas on the homepage hero."
        settingKey="hero_bg_image"
        placeholder="No image set — particle canvas will be shown"
        values={values}
        saved={saved}
        setValues={setValues}
        onSave={handleSave}
        onClear={clearImageSetting}
        onOpenPicker={openMediaPicker}
        inputClass={inputClass}
      />

      {/* Social Construct Presenter Image */}
      <ImageSettingCard
        label="Social Construct — Presenter Photo"
        description="Photo of Alex Teniola shown on the Social Construct page. Falls back to 'AT' initials if not set."
        settingKey="social_construct_presenter_image"
        placeholder="No photo set — initials will be shown"
        values={values}
        saved={saved}
        setValues={setValues}
        onSave={handleSave}
        onClear={clearImageSetting}
        onOpenPicker={openMediaPicker}
        inputClass={inputClass}
        aspectClass="aspect-square max-h-32 max-w-32 rounded-full"
      />

      {/* All other settings */}
      <div className="flex flex-col gap-4 mb-8">
        {settings.filter((s) => !IMAGE_KEYS.includes(s.key)).map((setting) => (
          <div key={setting.key} className="bg-navy-900 rounded-xl border border-navy-800 p-5">
            <p className="text-xs text-gold-500 uppercase tracking-wider mb-3 font-medium">{setting.key}</p>
            <div className="flex gap-3">
              <input
                type="text"
                value={values[setting.key] ?? ''}
                onChange={(e) => setValues({ ...values, [setting.key]: e.target.value })}
                className={`${inputClass} flex-1`}
              />
              <button
                onClick={() => handleSave(setting.key)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${saved[setting.key] ? 'bg-green-600 text-white' : 'btn-primary'}`}
              >
                {saved[setting.key] ? <Check size={14} /> : 'Save'}
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-navy-900 rounded-xl border border-navy-800 p-5">
        <h3 className="text-sm text-slate-400 uppercase tracking-wider mb-4">Add New Setting</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="Key"><input type="text" value={newKey} onChange={(e) => setNewKey(e.target.value)} placeholder="setting_key" className={inputClass} /></FormField>
          <FormField label="Value"><input type="text" value={newValue} onChange={(e) => setNewValue(e.target.value)} placeholder="Value" className={inputClass} /></FormField>
        </div>
        <button onClick={handleAdd} disabled={!newKey} className="btn-primary text-sm px-5 py-2 mt-4 flex items-center gap-2">
          <Plus size={14} /> Add Setting
        </button>
      </div>

      {/* Media Picker Modal */}
      {mediaPickerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setMediaPickerOpen(false)} />
          <div className="relative bg-navy-900 rounded-2xl border border-navy-800 w-full max-w-2xl max-h-[80vh] flex flex-col shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-navy-800">
              <h3 className="font-display text-lg text-cream">Pick from Media Library</h3>
              <button onClick={() => setMediaPickerOpen(false)} className="p-2 text-slate-400 hover:text-cream transition-colors"><X size={18} /></button>
            </div>
            <div className="overflow-y-auto p-5 flex-1">
              {mediaItems.length === 0 ? (
                <p className="text-slate-500 text-sm text-center py-8">No images in media library yet.</p>
              ) : (
                <div className="grid grid-cols-3 gap-3">
                  {mediaItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => pickMedia(item.url)}
                      className="group relative aspect-video rounded-lg overflow-hidden bg-navy-800 border border-navy-700 hover:border-gold-500 transition-all"
                    >
                      <img src={item.url} alt={item.name} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="text-white text-xs font-medium">Select</span>
                      </div>
                      <p className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs px-2 py-1 truncate opacity-0 group-hover:opacity-100 transition-opacity">{item.name}</p>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ===== USERS TAB =====
function UsersTab({ invites, adminUsers, onRefresh }: { invites: AdminInvite[]; adminUsers: { user_id: string; role: string }[]; onRefresh: () => void }) {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('editor');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleInviteOnly = async () => {
    if (!email) return;
    setSaving(true); setError(''); setSuccess('');
    try {
      const { error: err } = await supabase.from('admin_invites').insert({ email, role });
      if (err) throw err;
      setSuccess(`${email} added to invite list with role: ${role}`);
      setEmail('');
      onRefresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to record invite');
    } finally { setSaving(false); }
  };

  const handleRemoveInvite = async (id: string) => {
    if (!confirm('Remove this invite?')) return;
    await supabase.from('admin_invites').delete().eq('id', id);
    onRefresh();
  };

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h2 className="font-display text-xl text-cream mb-2">User Management</h2>
        <p className="text-slate-400 text-sm">
          Manage who has access to this admin panel. Admin users are linked via Supabase Auth.
        </p>
      </div>

      {/* Current admin roles */}
      <div className="bg-navy-900 rounded-xl border border-navy-800 p-5">
        <h3 className="text-sm text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
          <ShieldCheck size={14} /> Active Admin Accounts ({adminUsers.length})
        </h3>
        {adminUsers.length === 0 ? (
          <p className="text-slate-500 text-sm">No admin accounts found.</p>
        ) : (
          <div className="flex flex-col gap-2">
            {adminUsers.map((u) => (
              <div key={u.user_id} className="flex items-center justify-between px-4 py-3 rounded-lg bg-navy-950 border border-navy-800">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gold-600/20 border border-gold-600/30 flex items-center justify-center text-gold-500">
                    <ShieldCheck size={14} />
                  </div>
                  <div>
                    <p className="text-cream text-sm font-mono">{u.user_id}</p>
                    <p className="text-xs text-slate-500">Role: {u.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add new user form */}
      <div className="bg-navy-900 rounded-xl border border-navy-800 p-5">
        <h3 className="text-sm text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
          <UserPlus size={14} /> Add New Admin User
        </h3>
        <p className="text-slate-500 text-xs mb-5 leading-relaxed">
          To create a new login, go to your Supabase project dashboard &rarr; Authentication &rarr; Users &rarr; Invite User. Then return here to record the invite for reference, or ask the new user to sign up with their email.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <FormField label="Email">
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="user@example.com" className={inputClass} />
          </FormField>
          <FormField label="Role">
            <select value={role} onChange={(e) => setRole(e.target.value)} className={inputClass}>
              <option value="editor">Editor</option>
              <option value="admin">Admin</option>
              <option value="super_admin">Super Admin</option>
            </select>
          </FormField>
        </div>
        {error && <p className="text-red-400 text-sm bg-red-400/10 rounded-lg px-4 py-3 mb-4">{error}</p>}
        {success && <p className="text-green-400 text-sm bg-green-400/10 rounded-lg px-4 py-3 mb-4">{success}</p>}
        <button onClick={handleInviteOnly} disabled={saving || !email} className="btn-primary text-sm px-5 py-2 flex items-center gap-2">
          <Mail size={14} /> Record Invite
        </button>
      </div>

      {/* Invite list */}
      {invites.length > 0 && (
        <div className="bg-navy-900 rounded-xl border border-navy-800 overflow-hidden">
          <div className="px-5 py-4 border-b border-navy-800">
            <h3 className="text-sm text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <Mail size={14} /> Recorded Invites ({invites.length})
            </h3>
          </div>
          <table className="w-full">
            <thead>
              <tr className="border-b border-navy-800">
                <th className="px-4 py-3 text-left text-xs text-slate-500 uppercase tracking-wider">Email</th>
                <th className="px-4 py-3 text-left text-xs text-slate-500 uppercase tracking-wider">Role</th>
                <th className="px-4 py-3 text-left text-xs text-slate-500 uppercase tracking-wider">Invited</th>
                <th className="px-4 py-3 text-left text-xs text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {invites.map((inv) => (
                <tr key={inv.id} className="border-b border-navy-800 hover:bg-navy-900 transition-colors">
                  <td className="px-4 py-3 text-sm text-cream">{inv.email}</td>
                  <td className="px-4 py-3 text-xs text-gold-500">{inv.role}</td>
                  <td className="px-4 py-3 text-xs text-slate-500">{new Date(inv.created_at).toLocaleDateString('en-GB')}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full ${inv.accepted_at ? 'bg-green-500/10 text-green-400' : 'bg-slate-600/20 text-slate-400'}`}>
                      {inv.accepted_at ? 'Accepted' : 'Pending'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => handleRemoveInvite(inv.id)} className="p-1.5 text-slate-400 hover:text-red-400 transition-colors">
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ===== SEO TAB =====
function SEOTab({ settings, onRefresh }: { settings: SettingsType[]; onRefresh: () => void }) {
  const [values, setValues] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const init: Record<string, string> = {};
    settings.forEach((s) => { init[s.key] = s.value; });
    setValues(init);
  }, [settings]);

  const handleSave = async (key: string) => {
    const existing = settings.find((s) => s.key === key);
    if (existing) {
      await supabase.from('settings').update({ value: values[key] ?? '', updated_at: new Date().toISOString() }).eq('key', key);
    } else {
      await supabase.from('settings').insert({ key, value: values[key] ?? '', updated_at: new Date().toISOString() });
    }
    setSaved((prev) => ({ ...prev, [key]: true }));
    setTimeout(() => setSaved((prev) => ({ ...prev, [key]: false })), 2000);
    onRefresh();
  };

  const handleSaveAll = async (keys: string[]) => {
    for (const key of keys) {
      await handleSave(key);
    }
  };

  const seoFields: { key: string; label: string; description: string; type?: string; rows?: number }[] = [
    { key: 'seo_site_name', label: 'Site Name', description: 'Used in page title templates and structured data (e.g. "Queenswood Engagement")' },
    { key: 'seo_default_description', label: 'Default Meta Description', description: 'Fallback description used on pages without a specific description. Keep to 150-160 characters.', rows: 3 },
    { key: 'seo_og_image', label: 'Default OG Share Image URL', description: 'Default image shown when pages are shared on social media. Ideal size: 1200x630px', type: 'url' },
    { key: 'seo_canonical_base_url', label: 'Canonical Base URL', description: 'Your live domain e.g. https://wearequeenswood.com — used for canonical links and structured data', type: 'url' },
    { key: 'seo_twitter_handle', label: 'Twitter / X Handle', description: 'e.g. @queenswood — used in Twitter Card meta tags' },
    { key: 'seo_google_site_verification', label: 'Google Search Console Verification Code', description: 'The content value from Google\'s verification meta tag. Leave blank if using DNS verification.' },
  ];

  const navFields: { key: string; label: string; description: string }[] = [
    { key: 'nav_bg_color', label: 'Navbar Background Colour', description: 'Background colour of the navbar when scrolled. Use a hex code e.g. #0d0f14' },
    { key: 'nav_text_color', label: 'Navbar Link Text Colour', description: 'Colour of navigation link text. Use a hex code e.g. #a8b2c1' },
    { key: 'nav_accent_color', label: 'Navbar Accent / Active Colour', description: 'Colour of active links and hover underlines. Use a hex code e.g. #fff100' },
  ];

  const seoKeys = seoFields.map((f) => f.key);
  const navKeys = navFields.map((f) => f.key);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h2 className="font-display text-2xl text-cream mb-1">SEO &amp; Branding</h2>
        <p className="text-slate-400 text-sm">Control how your site appears in Google, social media, and structured data. These settings directly affect your search rankings.</p>
      </div>

      {/* SEO health tips */}
      <div className="bg-navy-900 rounded-xl border border-gold-600/20 p-5">
        <div className="flex items-start gap-3 mb-4">
          <div className="p-2 rounded-lg bg-gold-600/10 text-gold-500 flex-shrink-0">
            <Globe size={16} />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-cream mb-1">Google News Eligibility</h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              Your blog posts automatically use <strong className="text-cream">NewsArticle</strong> structured data, making them eligible to appear in Google News and the Top Stories carousel. For best results: publish regularly, write descriptive titles, add hero images to every post, and set unique meta descriptions per article.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { icon: <Check size={12} />, text: 'NewsArticle schema on all blog posts', ok: true },
            { icon: <Check size={12} />, text: 'Organization + LocalBusiness structured data', ok: true },
            { icon: <Check size={12} />, text: 'BreadcrumbList on all inner pages', ok: true },
            { icon: <AlertCircle size={12} />, text: 'Add OG share image below for social previews', ok: false },
            { icon: <AlertCircle size={12} />, text: 'Submit sitemap to Google Search Console', ok: false },
            { icon: <Check size={12} />, text: 'Canonical URLs set on every page', ok: true },
          ].map((tip, i) => (
            <div key={i} className={`flex items-center gap-2 text-xs px-3 py-2 rounded-lg ${tip.ok ? 'bg-green-500/10 text-green-400' : 'bg-amber-500/10 text-amber-400'}`}>
              {tip.icon}
              <span>{tip.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* SEO Settings */}
      <div className="bg-navy-900 rounded-xl border border-navy-800 p-6">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <Search size={16} className="text-gold-500" />
            <h3 className="text-sm font-semibold text-cream uppercase tracking-wider">Search Engine Settings</h3>
          </div>
          <button
            onClick={() => handleSaveAll(seoKeys)}
            className="btn-primary text-xs px-4 py-2 flex items-center gap-1.5"
          >
            <Check size={12} /> Save All SEO
          </button>
        </div>
        <div className="flex flex-col gap-5">
          {seoFields.map((field) => (
            <div key={field.key}>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs text-gold-500 uppercase tracking-wider font-medium">{field.label}</label>
                <button
                  onClick={() => handleSave(field.key)}
                  className={`text-xs px-3 py-1 rounded-lg transition-all ${saved[field.key] ? 'bg-green-600 text-white' : 'bg-navy-800 text-slate-400 hover:text-cream'}`}
                >
                  {saved[field.key] ? <Check size={12} /> : 'Save'}
                </button>
              </div>
              <p className="text-slate-500 text-xs mb-2">{field.description}</p>
              {field.rows ? (
                <textarea
                  value={values[field.key] ?? ''}
                  onChange={(e) => setValues({ ...values, [field.key]: e.target.value })}
                  rows={field.rows}
                  className={inputClass}
                />
              ) : (
                <input
                  type={field.type || 'text'}
                  value={values[field.key] ?? ''}
                  onChange={(e) => setValues({ ...values, [field.key]: e.target.value })}
                  className={inputClass}
                />
              )}
              {field.key === 'seo_default_description' && (
                <p className={`text-xs mt-1 ${(values[field.key]?.length ?? 0) > 160 ? 'text-red-400' : 'text-slate-600'}`}>
                  {values[field.key]?.length ?? 0} / 160 characters
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Navbar Colours */}
      <div className="bg-navy-900 rounded-xl border border-navy-800 p-6">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <Palette size={16} className="text-gold-500" />
            <h3 className="text-sm font-semibold text-cream uppercase tracking-wider">Navbar Colours</h3>
          </div>
          <button
            onClick={() => handleSaveAll(navKeys)}
            className="btn-primary text-xs px-4 py-2 flex items-center gap-1.5"
          >
            <Check size={12} /> Save All Colours
          </button>
        </div>

        {/* Live preview */}
        <div
          className="rounded-xl p-4 mb-6 flex items-center justify-between border"
          style={{
            backgroundColor: values['nav_bg_color'] || '#0d0f14',
            borderColor: 'rgba(255,255,255,0.08)',
          }}
        >
          <span className="text-xs font-semibold" style={{ color: values['nav_text_color'] || '#a8b2c1' }}>
            What We Do &nbsp;&nbsp; Our Work &nbsp;&nbsp; About Us &nbsp;&nbsp;
            <span style={{ color: values['nav_accent_color'] || '#fff100', borderBottom: `2px solid ${values['nav_accent_color'] || '#fff100'}` }}>
              Contact
            </span>
          </span>
          <span className="text-xs text-slate-500">Live preview</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {navFields.map((field) => (
            <div key={field.key}>
              <label className="block text-xs text-gold-500 uppercase tracking-wider font-medium mb-1">{field.label}</label>
              <p className="text-slate-500 text-xs mb-2">{field.description}</p>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={values[field.key] || '#000000'}
                  onChange={(e) => setValues({ ...values, [field.key]: e.target.value })}
                  className="w-10 h-10 rounded-lg cursor-pointer border border-navy-700 bg-navy-800 p-0.5"
                />
                <input
                  type="text"
                  value={values[field.key] ?? ''}
                  onChange={(e) => setValues({ ...values, [field.key]: e.target.value })}
                  className={`${inputClass} flex-1 font-mono text-xs`}
                  placeholder="#000000"
                />
                <button
                  onClick={() => handleSave(field.key)}
                  className={`px-3 py-2 rounded-lg text-xs transition-all flex-shrink-0 ${saved[field.key] ? 'bg-green-600 text-white' : 'btn-primary'}`}
                >
                  {saved[field.key] ? <Check size={12} /> : 'Save'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Google instructions */}
      <div className="bg-navy-900 rounded-xl border border-navy-800 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Globe size={16} className="text-gold-500" />
          <h3 className="text-sm font-semibold text-cream uppercase tracking-wider">Submit to Google</h3>
        </div>
        <ol className="flex flex-col gap-3 text-sm text-slate-400 list-decimal list-inside">
          <li>Go to <strong className="text-cream">Google Search Console</strong> (search.google.com/search-console)</li>
          <li>Add your property using the URL prefix method with <code className="bg-navy-800 px-1.5 py-0.5 rounded text-xs text-gold-400">{values['seo_canonical_base_url'] || 'https://wearequeenswood.com'}</code></li>
          <li>Copy the verification code and paste it into the Google Search Console Verification field above, then save</li>
          <li>Submit your sitemap: add <code className="bg-navy-800 px-1.5 py-0.5 rounded text-xs text-gold-400">/sitemap.xml</code> in Search Console &rarr; Sitemaps</li>
          <li>Use the URL Inspection tool to request indexing of your homepage and any new articles</li>
        </ol>
      </div>
    </div>
  );
}

// ===== CLIENT LOGOS TAB =====
function ClientLogosTab({ logos, onRefresh }: { logos: ClientLogoRow[]; onRefresh: () => void }) {
  const [editing, setEditing] = useState<ClientLogoRow | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState('');
  const [newLogoUrl, setNewLogoUrl] = useState('');

  const handleToggleActive = async (logo: ClientLogoRow) => {
    await supabase.from('client_logos').update({ active: !logo.active }).eq('id', logo.id);
    onRefresh();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this client logo?')) return;
    await supabase.from('client_logos').delete().eq('id', id);
    onRefresh();
  };

  const handleSaveEdit = async () => {
    if (!editing) return;
    setSaving(true); setError('');
    const { error: err } = await supabase
      .from('client_logos')
      .update({ name: editing.name, logo_url: editing.logo_url, order_index: editing.order_index })
      .eq('id', editing.id);
    setSaving(false);
    if (err) { setError(err.message); return; }
    setEditing(null);
    onRefresh();
  };

  const handleAdd = async () => {
    if (!newName.trim()) return;
    const maxOrder = logos.length > 0 ? Math.max(...logos.map((l) => l.order_index)) + 1 : 1;
    await supabase.from('client_logos').insert({ name: newName.trim(), logo_url: newLogoUrl.trim(), order_index: maxOrder, active: true });
    setNewName(''); setNewLogoUrl(''); setShowAdd(false);
    onRefresh();
  };

  const inputCls = 'w-full bg-navy-950 border border-navy-700 rounded-lg px-3 py-2 text-cream text-sm placeholder-slate-600 focus:outline-none focus:border-gold-600 focus:ring-1 focus:ring-gold-600/30 transition-all';

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-display text-xl text-cream">Client Logos</h2>
          <p className="text-slate-400 text-sm mt-1">Manage the names and logos shown in the homepage marquee carousel.</p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="btn-primary text-sm px-4 py-2 flex items-center gap-2"
        >
          <Plus size={14} /> Add Client
        </button>
      </div>

      {showAdd && (
        <div className="bg-navy-900 rounded-xl border border-gold-600/30 p-5 mb-6 flex flex-col gap-4">
          <h3 className="text-sm text-gold-500 font-medium uppercase tracking-wider">New Client</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-400 text-xs uppercase tracking-wider mb-1.5">Display Name *</label>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="e.g. Balfour Beatty"
                className={inputCls}
              />
            </div>
            <div>
              <label className="block text-slate-400 text-xs uppercase tracking-wider mb-1.5">Logo URL (optional)</label>
              <input
                type="url"
                value={newLogoUrl}
                onChange={(e) => setNewLogoUrl(e.target.value)}
                placeholder="https://... (leave blank to show text)"
                className={inputCls}
              />
            </div>
          </div>
          {newLogoUrl && (
            <div className="flex items-center gap-3">
              <img src={newLogoUrl} alt="Preview" className="h-8 object-contain bg-white/5 rounded px-2 py-1" />
              <span className="text-slate-500 text-xs">Logo preview</span>
            </div>
          )}
          <div className="flex gap-2">
            <button onClick={handleAdd} disabled={!newName.trim()} className="btn-primary text-sm px-5 py-2 flex items-center gap-2">
              <Check size={14} /> Add
            </button>
            <button onClick={() => { setShowAdd(false); setNewName(''); setNewLogoUrl(''); }} className="btn-ghost text-sm px-5 py-2">
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="bg-navy-900 rounded-xl border border-navy-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-navy-800">
                {['Order', 'Client', 'Logo', 'Active', 'Actions'].map((col) => (
                  <th key={col} className="text-left text-xs text-slate-500 uppercase tracking-wider px-4 py-3 font-medium">{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {logos.map((logo) => (
                editing?.id === logo.id ? (
                  <tr key={logo.id} className="border-b border-navy-800 bg-navy-800/50">
                    <td className="px-4 py-3">
                      <input
                        type="number"
                        value={editing.order_index}
                        onChange={(e) => setEditing({ ...editing, order_index: Number(e.target.value) })}
                        className={`${inputCls} w-16`}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="text"
                        value={editing.name}
                        onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                        className={inputCls}
                      />
                    </td>
                    <td className="px-4 py-3 w-64">
                      <input
                        type="url"
                        value={editing.logo_url}
                        onChange={(e) => setEditing({ ...editing, logo_url: e.target.value })}
                        placeholder="https://... (leave blank for text)"
                        className={inputCls}
                      />
                    </td>
                    <td className="px-4 py-3 text-slate-400 text-sm">—</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={handleSaveEdit}
                          disabled={saving}
                          className="p-1.5 rounded-lg bg-green-600/20 text-green-400 hover:bg-green-600/30 transition-colors"
                        >
                          <Check size={14} />
                        </button>
                        <button
                          onClick={() => { setEditing(null); setError(''); }}
                          className="p-1.5 rounded-lg bg-navy-700 text-slate-400 hover:text-cream transition-colors"
                        >
                          <X size={14} />
                        </button>
                      </div>
                      {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
                    </td>
                  </tr>
                ) : (
                  <tr key={logo.id} className="border-b border-navy-800 hover:bg-navy-800/30 transition-colors">
                    <td className="px-4 py-3 text-slate-400 text-sm">{logo.order_index}</td>
                    <td className="px-4 py-3 text-cream text-sm font-medium">{logo.name}</td>
                    <td className="px-4 py-3">
                      {logo.logo_url ? (
                        <img src={logo.logo_url} alt={logo.name} className="h-7 object-contain" />
                      ) : (
                        <span className="text-slate-600 text-xs italic">Text only</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleToggleActive(logo)}
                        className={`flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded-full transition-all ${
                          logo.active
                            ? 'bg-green-600/20 text-green-400'
                            : 'bg-slate-700/30 text-slate-500'
                        }`}
                      >
                        {logo.active ? <Eye size={11} /> : <EyeOff size={11} />}
                        {logo.active ? 'Visible' : 'Hidden'}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setEditing(logo)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-gold-500 hover:bg-gold-600/10 transition-all"
                          title="Edit"
                        >
                          <Edit3 size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(logo.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-400/10 transition-all"
                          title="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              ))}
              {logos.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-slate-500 text-sm">No client logos yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <p className="text-slate-600 text-xs mt-4">
        Tip: Leave the Logo URL blank to display the client name as text in the marquee. Upload logos to the Media Library and paste the URL here.
      </p>
    </div>
  );
}

// ===== AWARDS TAB =====
function AwardsTab({ awards, onRefresh }: { awards: AwardRow[]; onRefresh: () => void }) {
  const [editing, setEditing] = useState<AwardRow | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [newAward, setNewAward] = useState<Omit<AwardRow, 'id' | 'active'>>({
    event_name: '',
    title: '',
    description: '',
    image_url: null,
    order_index: 0,
  });

  const inputCls = 'w-full bg-navy-950 border border-navy-700 rounded-lg px-3 py-2 text-cream text-sm placeholder-slate-600 focus:outline-none focus:border-gold-600 focus:ring-1 focus:ring-gold-600/30 transition-all';

  const uploadImage = async (file: File): Promise<string> => {
    const ext = file.name.split('.').pop();
    const filename = `awards/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { data, error: upErr } = await supabase.storage.from('media').upload(filename, file, { upsert: false });
    if (upErr) throw upErr;
    const { data: urlData } = supabase.storage.from('media').getPublicUrl(data.path);
    return urlData.publicUrl;
  };

  const handleUploadNew = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadImage(file);
      setNewAward((prev) => ({ ...prev, image_url: url }));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleUploadEdit = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editing) return;
    setUploading(true);
    try {
      const url = await uploadImage(file);
      setEditing((prev) => prev ? { ...prev, image_url: url } : prev);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleAdd = async () => {
    if (!newAward.event_name.trim() || !newAward.title.trim()) return;
    setSaving(true); setError('');
    const maxOrder = awards.length > 0 ? Math.max(...awards.map((a) => a.order_index)) + 1 : 1;
    const { error: err } = await supabase.from('awards').insert({
      ...newAward,
      order_index: maxOrder,
      active: true,
    });
    setSaving(false);
    if (err) { setError(err.message); return; }
    setNewAward({ event_name: '', title: '', description: '', image_url: null, order_index: 0 });
    setShowAdd(false);
    onRefresh();
  };

  const handleSaveEdit = async () => {
    if (!editing) return;
    setSaving(true); setError('');
    const { error: err } = await supabase
      .from('awards')
      .update({
        event_name: editing.event_name,
        title: editing.title,
        description: editing.description,
        image_url: editing.image_url,
        order_index: editing.order_index,
      })
      .eq('id', editing.id);
    setSaving(false);
    if (err) { setError(err.message); return; }
    setEditing(null);
    onRefresh();
  };

  const handleToggleActive = async (award: AwardRow) => {
    await supabase.from('awards').update({ active: !award.active }).eq('id', award.id);
    onRefresh();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this award?')) return;
    await supabase.from('awards').delete().eq('id', id);
    onRefresh();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-display text-xl text-cream">Awards</h2>
          <p className="text-slate-400 text-sm mt-1">Manage awards displayed on the About Us and Home pages.</p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="btn-primary text-sm px-4 py-2 flex items-center gap-2"
        >
          <Plus size={14} /> Add Award
        </button>
      </div>

      {showAdd && (
        <div className="bg-navy-900 rounded-xl border border-gold-600/30 p-5 mb-6 flex flex-col gap-4">
          <h3 className="text-sm text-gold-500 font-medium uppercase tracking-wider">New Award</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-400 text-xs uppercase tracking-wider mb-1.5">Event / Ceremony Name *</label>
              <input type="text" value={newAward.event_name} onChange={(e) => setNewAward({ ...newAward, event_name: e.target.value })} placeholder="e.g. HS2 Inspiration Awards 2022" className={inputCls} />
            </div>
            <div>
              <label className="block text-slate-400 text-xs uppercase tracking-wider mb-1.5">Award Title *</label>
              <input type="text" value={newAward.title} onChange={(e) => setNewAward({ ...newAward, title: e.target.value })} placeholder="e.g. Outstanding Community Engagement" className={inputCls} />
            </div>
          </div>
          <div>
            <label className="block text-slate-400 text-xs uppercase tracking-wider mb-1.5">Description</label>
            <textarea rows={3} value={newAward.description} onChange={(e) => setNewAward({ ...newAward, description: e.target.value })} placeholder="Brief description of the award..." className={`${inputCls} resize-none`} />
          </div>
          <div>
            <label className="block text-slate-400 text-xs uppercase tracking-wider mb-1.5">Award Image (optional)</label>
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 cursor-pointer bg-navy-800 border border-navy-700 rounded-lg px-4 py-2 text-sm text-slate-400 hover:text-cream hover:border-gold-600 transition-all">
                <Upload size={14} />
                {uploading ? 'Uploading...' : 'Upload Image'}
                <input type="file" accept="image/*" className="hidden" onChange={handleUploadNew} disabled={uploading} />
              </label>
              {newAward.image_url && (
                <div className="flex items-center gap-2">
                  <img src={newAward.image_url} alt="Preview" className="h-10 w-10 object-cover rounded-lg border border-navy-700" />
                  <button onClick={() => setNewAward({ ...newAward, image_url: null })} className="p-1 text-slate-500 hover:text-red-400 transition-colors"><X size={12} /></button>
                </div>
              )}
            </div>
          </div>
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <div className="flex gap-2">
            <button onClick={handleAdd} disabled={saving || !newAward.event_name.trim() || !newAward.title.trim()} className="btn-primary text-sm px-5 py-2 flex items-center gap-2">
              <Check size={14} /> {saving ? 'Saving...' : 'Add'}
            </button>
            <button onClick={() => { setShowAdd(false); setNewAward({ event_name: '', title: '', description: '', image_url: null, order_index: 0 }); setError(''); }} className="btn-ghost text-sm px-5 py-2">Cancel</button>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-4">
        {awards.length === 0 && (
          <div className="bg-navy-900 rounded-xl border border-navy-800 px-6 py-16 text-center text-slate-500 text-sm">No awards yet.</div>
        )}
        {awards.map((award) => (
          editing?.id === award.id ? (
            <div key={award.id} className="bg-navy-900 rounded-xl border border-gold-600/40 p-5 flex flex-col gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 text-xs uppercase tracking-wider mb-1.5">Event / Ceremony Name</label>
                  <input type="text" value={editing.event_name} onChange={(e) => setEditing({ ...editing, event_name: e.target.value })} className={inputCls} />
                </div>
                <div>
                  <label className="block text-slate-400 text-xs uppercase tracking-wider mb-1.5">Award Title</label>
                  <input type="text" value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} className={inputCls} />
                </div>
              </div>
              <div>
                <label className="block text-slate-400 text-xs uppercase tracking-wider mb-1.5">Description</label>
                <textarea rows={3} value={editing.description} onChange={(e) => setEditing({ ...editing, description: e.target.value })} className={`${inputCls} resize-none`} />
              </div>
              <div>
                <label className="block text-slate-400 text-xs uppercase tracking-wider mb-1.5">Award Image</label>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 cursor-pointer bg-navy-800 border border-navy-700 rounded-lg px-4 py-2 text-sm text-slate-400 hover:text-cream hover:border-gold-600 transition-all">
                    <Upload size={14} />
                    {uploading ? 'Uploading...' : 'Upload New'}
                    <input type="file" accept="image/*" className="hidden" onChange={handleUploadEdit} disabled={uploading} />
                  </label>
                  {editing.image_url && (
                    <div className="flex items-center gap-2">
                      <img src={editing.image_url} alt="Preview" className="h-10 w-10 object-cover rounded-lg border border-navy-700" />
                      <button onClick={() => setEditing({ ...editing, image_url: null })} className="p-1 text-slate-500 hover:text-red-400 transition-colors"><X size={12} /></button>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div>
                  <label className="block text-slate-400 text-xs uppercase tracking-wider mb-1.5">Order</label>
                  <input type="number" value={editing.order_index} onChange={(e) => setEditing({ ...editing, order_index: Number(e.target.value) })} className={`${inputCls} w-20`} />
                </div>
              </div>
              {error && <p className="text-red-400 text-sm">{error}</p>}
              <div className="flex gap-2">
                <button onClick={handleSaveEdit} disabled={saving} className="btn-primary text-sm px-5 py-2 flex items-center gap-2"><Check size={14} /> {saving ? 'Saving...' : 'Save'}</button>
                <button onClick={() => { setEditing(null); setError(''); }} className="btn-ghost text-sm px-5 py-2">Cancel</button>
              </div>
            </div>
          ) : (
            <div key={award.id} className="bg-navy-900 rounded-xl border border-navy-800 p-5 flex items-start gap-5">
              {award.image_url ? (
                <img src={award.image_url} alt={award.title} className="w-16 h-16 object-cover rounded-lg border border-navy-700 flex-shrink-0" />
              ) : (
                <div className="w-16 h-16 rounded-lg border border-navy-700 bg-navy-800 flex items-center justify-center flex-shrink-0">
                  <ImagePlus size={20} className="text-slate-600" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-gold-500 text-xs uppercase tracking-widest font-medium mb-0.5">{award.event_name}</p>
                <h3 className="text-cream font-medium text-sm mb-1">{award.title}</h3>
                <p className="text-slate-500 text-xs leading-relaxed line-clamp-2">{award.description}</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => handleToggleActive(award)}
                  className={`flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded-full transition-all ${award.active ? 'bg-green-600/20 text-green-400' : 'bg-slate-700/30 text-slate-500'}`}
                >
                  {award.active ? <Eye size={11} /> : <EyeOff size={11} />}
                  {award.active ? 'Visible' : 'Hidden'}
                </button>
                <button onClick={() => { setEditing(award); setError(''); }} className="p-1.5 rounded-lg text-slate-400 hover:text-gold-500 hover:bg-gold-600/10 transition-all" title="Edit">
                  <Edit3 size={14} />
                </button>
                <button onClick={() => handleDelete(award.id)} className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-400/10 transition-all" title="Delete">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          )
        ))}
      </div>
    </div>
  );
}

// ===== SHARED COMPONENTS =====

const inputClass = 'w-full bg-navy-950 border border-navy-700 rounded-lg px-3 py-2.5 text-cream text-sm placeholder-slate-600 focus:outline-none focus:border-gold-600 focus:ring-1 focus:ring-gold-600/30 transition-all';

function FormField({ label, children, required }: { label: string; children: React.ReactNode; required?: boolean }) {
  return (
    <div>
      <label className="block text-slate-400 text-xs uppercase tracking-wider mb-2 font-medium">
        {label} {required && <span className="text-gold-500">*</span>}
      </label>
      {children}
    </div>
  );
}

function FormPanel({
  title, children, onCancel, onSave, saving, error,
}: {
  title: string;
  children: React.ReactNode;
  onCancel: () => void;
  onSave: () => void;
  saving: boolean;
  error: string;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-xl text-cream">{title}</h2>
        <button onClick={onCancel} className="p-2 text-slate-400 hover:text-cream transition-colors"><X size={18} /></button>
      </div>
      <div className="bg-navy-900 rounded-xl border border-navy-800 p-6 flex flex-col gap-5">
        {children}
        {error && <p className="text-red-400 text-sm bg-red-400/10 rounded-lg px-4 py-3">{error}</p>}
        <div className="flex items-center gap-3 pt-2">
          <button onClick={onSave} disabled={saving} className="btn-primary flex items-center gap-2 text-sm px-6 py-2.5">
            {saving ? 'Saving...' : <><Check size={14} /> Save</>}
          </button>
          <button onClick={onCancel} className="btn-ghost text-sm px-6 py-2.5">Cancel</button>
        </div>
      </div>
    </div>
  );
}

function DataTable<T>({
  columns, rows, renderRow,
}: {
  columns: string[];
  rows: T[];
  renderRow: (row: T) => React.ReactNode;
}) {
  return (
    <div className="bg-navy-900 rounded-xl border border-navy-800 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-navy-800">
              {columns.map((col) => (
                <th key={col} className="px-4 py-3 text-left text-xs text-slate-500 uppercase tracking-wider font-medium">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-16 text-center text-slate-500 text-sm">
                  No items yet.
                </td>
              </tr>
            ) : (
              rows.map(renderRow)
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ===== SHOP TAB =====
function ShopTab({ products, onRefresh }: { products: ShopProductRow[]; onRefresh: () => void }) {
  const [editing, setEditing] = useState<ShopProductRow | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const activeUploadId = useRef<string | null>(null);

  const [form, setForm] = useState<Partial<ShopProductRow>>({});

  const startEdit = (p: ShopProductRow) => {
    setEditing(p);
    setForm({ title: p.title, tagline: p.tagline, description: p.description, video_url: p.video_url, active: p.active });
    setError('');
  };

  const cancelEdit = () => { setEditing(null); setForm({}); setError(''); };

  const handleSave = async () => {
    if (!editing) return;
    setSaving(true);
    setError('');
    const { error: err } = await supabase
      .from('shop_products')
      .update({
        title: form.title,
        tagline: form.tagline,
        description: form.description,
        video_url: form.video_url ?? null,
        active: form.active,
        updated_at: new Date().toISOString(),
      })
      .eq('id', editing.id);
    setSaving(false);
    if (err) { setError(err.message); return; }
    cancelEdit();
    onRefresh();
  };

  const handleRemoveVideo = async (p: ShopProductRow) => {
    await supabase.from('shop_products').update({ video_url: null, updated_at: new Date().toISOString() }).eq('id', p.id);
    onRefresh();
  };

  const handleUploadVideo = async (productId: string, file: File) => {
    setUploadingId(productId);
    setError('');
    try {
      const ext = file.name.split('.').pop();
      const filename = `shop/${productId}-${Date.now()}.${ext}`;
      const { data, error: uploadErr } = await supabase.storage.from('media').upload(filename, file, { upsert: true, contentType: file.type || 'video/mp4' });
      if (uploadErr) throw uploadErr;
      const { data: urlData } = supabase.storage.from('media').getPublicUrl(data.path);
      await supabase.from('shop_products').update({ video_url: urlData.publicUrl, updated_at: new Date().toISOString() }).eq('id', productId);
      onRefresh();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Upload failed');
    } finally {
      setUploadingId(null);
      activeUploadId.current = null;
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-xl text-cream">Engagement Shop Products</h2>
      </div>

      {error && (
        <div className="mb-4 bg-red-900/30 border border-red-700 rounded-lg px-4 py-3 text-red-300 text-sm flex items-center gap-2">
          <AlertCircle size={16} /> {error}
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="video/mp4,video/quicktime,video/webm,video/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file && activeUploadId.current) {
            handleUploadVideo(activeUploadId.current, file);
          }
          e.target.value = '';
        }}
      />

      <div className="flex flex-col gap-4">
        {products.map((p) => (
          <div key={p.id} className="bg-navy-900 border border-navy-800 rounded-xl overflow-hidden">
            {editing?.id === p.id ? (
              <div className="p-6">
                <div className="grid grid-cols-1 gap-4 mb-4">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Title</label>
                    <input
                      className="w-full bg-navy-800 border border-navy-700 rounded-lg px-3 py-2 text-cream text-sm focus:outline-none focus:border-gold-500"
                      value={form.title ?? ''}
                      onChange={(e) => setForm({ ...form, title: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Tagline</label>
                    <input
                      className="w-full bg-navy-800 border border-navy-700 rounded-lg px-3 py-2 text-cream text-sm focus:outline-none focus:border-gold-500"
                      value={form.tagline ?? ''}
                      onChange={(e) => setForm({ ...form, tagline: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Description</label>
                    <textarea
                      rows={3}
                      className="w-full bg-navy-800 border border-navy-700 rounded-lg px-3 py-2 text-cream text-sm focus:outline-none focus:border-gold-500 resize-none"
                      value={form.description ?? ''}
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Video URL (optional — or use upload button)</label>
                    <input
                      className="w-full bg-navy-800 border border-navy-700 rounded-lg px-3 py-2 text-cream text-sm focus:outline-none focus:border-gold-500"
                      placeholder="https://..."
                      value={form.video_url ?? ''}
                      onChange={(e) => setForm({ ...form, video_url: e.target.value || null })}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      id={`active-${p.id}`}
                      type="checkbox"
                      checked={form.active ?? true}
                      onChange={(e) => setForm({ ...form, active: e.target.checked })}
                      className="accent-gold-500"
                    />
                    <label htmlFor={`active-${p.id}`} className="text-sm text-slate-300">Visible on shop page</label>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 bg-gold-600 hover:bg-gold-500 text-navy-950 text-sm font-semibold px-5 py-2 rounded-lg transition-colors disabled:opacity-50"
                  >
                    <Check size={14} /> {saving ? 'Saving…' : 'Save'}
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="text-sm text-slate-400 hover:text-cream transition-colors px-3 py-2"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-4 p-5">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-cream text-sm truncate">{p.title}</span>
                    {!p.active && (
                      <span className="text-xs bg-slate-700 text-slate-300 px-2 py-0.5 rounded-full">Hidden</span>
                    )}
                  </div>
                  <p className="text-slate-400 text-xs mb-2 leading-relaxed line-clamp-1">{p.tagline}</p>
                  <div className="flex items-center gap-2">
                    {p.video_url ? (
                      <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-900/30 border border-emerald-700/40 px-2.5 py-1 rounded-full">
                        <Video size={11} /> Video attached
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-xs text-slate-500 bg-navy-800 border border-navy-700 px-2.5 py-1 rounded-full">
                        <Video size={11} /> No video
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => {
                      activeUploadId.current = p.id;
                      fileInputRef.current?.click();
                    }}
                    disabled={uploadingId === p.id}
                    title="Upload video file"
                    className="flex items-center gap-1.5 p-2 rounded-lg bg-navy-800 hover:bg-navy-700 text-slate-400 hover:text-gold-400 transition-colors disabled:opacity-50 text-xs"
                  >
                    {uploadingId === p.id ? (
                      <span className="text-gold-400 px-1">Uploading…</span>
                    ) : (
                      <><Upload size={14} /><span className="hidden sm:inline">Upload Video</span></>
                    )}
                  </button>
                  {p.video_url && (
                    <button
                      onClick={() => handleRemoveVideo(p)}
                      title="Remove video"
                      className="p-2 rounded-lg bg-navy-800 hover:bg-navy-700 text-slate-400 hover:text-red-400 transition-colors"
                    >
                      <Trash2 size={15} />
                    </button>
                  )}
                  <button
                    onClick={() => startEdit(p)}
                    title="Edit product text"
                    className="p-2 rounded-lg bg-navy-800 hover:bg-navy-700 text-slate-400 hover:text-gold-400 transition-colors"
                  >
                    <Edit3 size={15} />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
