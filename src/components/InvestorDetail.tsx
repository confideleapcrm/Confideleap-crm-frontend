
// src/components/InvestorDetail.tsx
import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  Edit,
  Mail,
  Phone,
  MapPin,
  Building,
  Globe,
  Linkedin,
  ExternalLink,
  Star,
  TrendingUp,
  Calendar,
  MessageCircle,
  Users,
  Activity,
  Clock,
  CheckCircle,
  MoreVertical,
  Send,
  Plus,
  FileText,
  Download,
  Eye,
  ThumbsUp,
  ThumbsDown,
  Briefcase,
  GraduationCap,
  Link as LinkIcon,
  Tag,
  StickyNote,
  BarChart3,
  PieChart,
  X,
} from "lucide-react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getInvestorById, getMeetingsForInvestor } from "../services/investorService";
import MeetingsList from "../components/MeetingsList";

const InvestorDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [isEditing, setIsEditing] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);

  // Investor state and loading state
  const [investor, setInvestor] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  // Real meetings loaded from API
  const [meetings, setMeetings] = useState<any[]>([]);
  const [meetingsLoading, setMeetingsLoading] = useState(false);

  // COMMUNICATIONS (kept as mock for example)
  const communications = [
    {
      id: "1",
      type: "email",
      direction: "outbound",
      subject: "TechFlow Series B - AI-Powered Financial Analytics",
      content:
        "Hi Emily, Given GV's focus on AI and enterprise software, I wanted to share an exciting opportunity...",
      status: "replied",
      occurredAt: "2024-01-15T09:05:00Z",
      sentiment: "positive",
    },
    {
      id: "2",
      type: "email",
      direction: "inbound",
      subject: "Re: TechFlow Series B - AI-Powered Financial Analytics",
      content:
        "Hi Sarah, This looks very interesting. I'd love to learn more about your AI models and technical architecture. Are you available for a call this week?",
      status: "read",
      occurredAt: "2024-01-15T14:20:00Z",
      sentiment: "positive",
    },
    {
      id: "3",
      type: "meeting",
      direction: "outbound",
      subject: "TechFlow Technical Deep Dive",
      content: "Technical discussion about AI architecture and scalability",
      status: "completed",
      occurredAt: "2024-01-18T15:00:00Z",
      sentiment: "positive",
      outcome:
        "Very positive meeting. Emily is excited about our technical approach and wants to introduce us to her team.",
    },
    {
      id: "4",
      type: "linkedin",
      direction: "inbound",
      subject: "LinkedIn connection request",
      content: "Connected on LinkedIn and shared additional resources",
      status: "accepted",
      occurredAt: "2024-01-20T11:30:00Z",
      sentiment: "neutral",
    },
  ];

  // Mock documents shared (kept as before)
  const sharedDocuments = [
    {
      id: "1",
      name: "TechFlow Pitch Deck Q1 2024",
      type: "pitch_deck",
      sharedAt: "2024-01-18T16:30:00Z",
      accessLevel: "download",
      downloadCount: 3,
      lastAccessed: "2024-01-23T10:30:00Z",
    },
    {
      id: "2",
      name: "Technical Architecture Overview",
      type: "technical_doc",
      sharedAt: "2024-01-19T09:00:00Z",
      accessLevel: "view",
      downloadCount: 1,
      lastAccessed: "2024-01-22T14:15:00Z",
    },
    {
      id: "3",
      name: "Financial Model 2024-2027",
      type: "financial_model",
      sharedAt: "2024-01-20T11:00:00Z",
      accessLevel: "download",
      downloadCount: 2,
      lastAccessed: "2024-01-23T08:45:00Z",
    },
  ];

  const tabs = [
    { id: "overview", label: "Overview", icon: Eye },
    { id: "communications", label: "Communications", icon: MessageCircle },
    { id: "meetings", label: "Meetings", icon: Calendar },
    { id: "documents", label: "Documents", icon: FileText },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "hot":
        return "bg-red-100 text-red-800 border-red-200";
      case "warm":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "contacted":
        return "bg-green-100 text-green-800 border-green-200";
      case "cold":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getFitColor = (score: number) => {
    if (score >= 90) return "text-green-600";
    if (score >= 70) return "text-yellow-600";
    return "text-red-600";
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatDateTime = (dateString: string) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // helper to build mailto with investor id
  const buildMailTo = (email: string, investorId: string) => {
    const decodedId = (() => {
      try {
        return decodeURIComponent(investorId);
      } catch {
        return investorId;
      }
    })();

    const subject = encodeURIComponent(`Intro / Follow-up — InvestorID: ${decodedId}`);
    const body = encodeURIComponent(`Hi,\n\nReferencing investor record: ${decodedId}\n\n(Your message here)\n\nRegards,`);

    return `mailto:${email}?subject=${subject}&body=${body}`;
  };

  // LOAD INVESTOR
  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getInvestorById(id)
      .then((data) => {
        setInvestor(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching investor data:", error);
        setLoading(false);
      });
  }, [id]);

  // LOAD MEETINGS for this investor
  const loadMeetings = async () => {
    if (!id) return;
    setMeetingsLoading(true);
    try {
      const res = await getMeetingsForInvestor(id);
      const items = res?.items ?? res ?? [];
      setMeetings(items);
    } catch (err) {
      console.error("Failed to fetch meetings:", err);
      setMeetings([]);
    } finally {
      setMeetingsLoading(false);
    }
  };

  // load meetings when investor id is available and when investor is refreshed
  useEffect(() => {
    if (!id) return;
    loadMeetings();
    // also reload when meeting events fire
    const onCreated = () => loadMeetings();
    window.addEventListener("investorMeetingCreated", onCreated);
    window.addEventListener("investorMeetingUpdated", onCreated);
    window.addEventListener("investorPostMeetOutcomeSaved", onCreated);
    return () => {
      window.removeEventListener("investorMeetingCreated", onCreated);
      window.removeEventListener("investorMeetingUpdated", onCreated);
      window.removeEventListener("investorPostMeetOutcomeSaved", onCreated);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, investor?.id]);

  // utility to tolerant-read meeting status
  const meetingStatusOf = (m: any) => {
    if (!m) return "";
    return (m.status || m.meeting_status || m.meetingStatus || "").toString().toLowerCase();
  };

  const renderOverviewTab = () => {
    if (!investor) return null;
    return (
      <div className="space-y-6">
        {/* Key Information */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Contact Information */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>

            <div className="space-y-4">
              <div className="flex items-center">
                <Mail className="w-4 h-4 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <a
                    href={investor.email ? buildMailTo(investor.email, investor.id) : "#"}
                    className="text-blue-600 hover:text-blue-800"
                    onClick={(e) => {
                      if (!investor.email) e.preventDefault();
                    }}
                  >
                    {investor.email || "N/A"}
                  </a>
                </div>
              </div>

              <div className="flex items-center">
                <Phone className="w-4 h-4 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  {investor.phone ? (
                    <a href={`tel:${investor.phone}`} className="text-blue-600 hover:text-blue-800">
                      {investor.phone}
                    </a>
                  ) : (
                    <p className="text-gray-900">N/A</p>
                  )}
                </div>
              </div>

              <div className="flex items-center">
                <MapPin className="w-4 h-4 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Location</p>
                  <p className="text-gray-900">{investor.location}</p>
                </div>
              </div>

              <div className="flex items-center">
                <Linkedin className="w-4 h-4 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">LinkedIn</p>
                  <a
                    href={investor.linkedinUrl || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 flex items-center"
                    onClick={(e) => {
                      if (!investor.linkedinUrl) e.preventDefault();
                    }}
                  >
                    View Profile
                    <ExternalLink className="w-3 h-3 ml-1" />
                  </a>
                </div>
              </div>

              {investor.personalWebsite && (
                <div className="flex items-center">
                  <Globe className="w-4 h-4 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Website</p>
                    <a href={investor.personalWebsite} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 flex items-center">
                      Visit Website
                      <ExternalLink className="w-3 h-3 ml-1" />
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Investment Profile */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Investment Profile</h3>

            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500 mb-2">Investment Stages</p>
                <div className="flex flex-wrap gap-1">
                  {(investor.investmentStages || []).map((stage: any) => (
                    <span key={stage} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                      {stage}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-2">Sector Focus</p>
                <div className="flex flex-wrap gap-1">
                  {(investor.sectorPreferences || []).map((sector: any) => (
                    <span key={sector} className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-medium">
                      {sector}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-2">Geographic Focus</p>
                <div className="flex flex-wrap gap-1">
                  {(investor.geographicPreferences || []).map((region: any) => (
                    <span key={region} className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs font-medium">
                      {region}
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Min Check Size</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {investor.minCheckSize ? `$${(investor.minCheckSize / 1000000).toFixed(1)}M` : "—"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Max Check Size</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {investor.maxCheckSize ? `$${(investor.maxCheckSize / 1000000).toFixed(1)}M` : "—"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Metrics</h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Star className="w-4 h-4 text-yellow-400 mr-2" />
                  <span className="text-sm text-gray-600">Portfolio Fit</span>
                </div>
                <span className={`text-lg font-bold ${getFitColor(investor.portfolioFitScore || 0)}`}>
                  {investor.portfolioFitScore ?? 0}%
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Activity className="w-4 h-4 text-blue-500 mr-2" />
                  <span className="text-sm text-gray-600">Engagement Score</span>
                </div>
                <span className="text-lg font-bold text-blue-600">{investor.engagementScore ?? 0}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <MessageCircle className="w-4 h-4 text-green-500 mr-2" />
                  <span className="text-sm text-gray-600">Response Rate</span>
                </div>
                <span className="text-lg font-bold text-green-600">{investor.responseRate ?? 0}%</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Clock className="w-4 h-4 text-orange-500 mr-2" />
                  <span className="text-sm text-gray-600">Avg Response Time</span>
                </div>
                <span className="text-sm font-medium text-gray-900">{investor.avgResponseTimeHours ?? 0}h</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Users className="w-4 h-4 text-purple-500 mr-2" />
                  <span className="text-sm text-gray-600">Total Interactions</span>
                </div>
                <span className="text-sm font-medium text-gray-900">{investor.totalInteractions ?? 0}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Firm Information */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Building className="w-5 h-5 mr-2 text-blue-600" />
            Firm Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <p className="text-sm text-gray-500">Firm Name</p>
              <p className="text-lg font-semibold text-gray-900">{investor.firm?.name ?? "—"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Type</p>
              <p className="text-lg font-semibold text-gray-900">{investor.firm?.type ?? "—"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Headquarters</p>
              <p className="text-lg font-semibold text-gray-900">{investor.firm?.headquarters ?? "—"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">AUM</p>
              <p className="text-lg font-semibold text-gray-900">{investor.firm?.aum ? `$${(investor.firm.aum / 1000000000).toFixed(1)}B` : "—"}</p>
            </div>
          </div>

          <div className="mt-4">
            {investor.firm?.website && (
              <a href={investor.firm.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 flex items-center">
                <Globe className="w-4 h-4 mr-2" />
                Visit Firm Website
                <ExternalLink className="w-3 h-3 ml-1" />
              </a>
            )}
          </div>
        </div>

        {/* Portfolio Companies */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Portfolio Companies</h3>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {(investor.portfolioCompanies || []).map((company: any) => (
              <div key={company} className="p-3 bg-gray-50 rounded-lg text-center">
                <p className="text-sm font-medium text-gray-900">{company}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Notable Investments */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Notable Investments</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(investor.notableInvestments || []).map((investment: any, index: any) => (
              <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                <CheckCircle className="w-4 h-4 text-green-500 mr-3" />
                <span className="text-sm text-gray-900">{investment}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Education & Experience */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <GraduationCap className="w-5 h-5 mr-2 text-blue-600" />
              Education
            </h3>

            <div className="space-y-4">
              {(investor.education || []).map((edu: any, index: any) => (
                <div key={index} className="border-l-4 border-blue-500 pl-4">
                  <p className="font-medium text-gray-900">{edu.degree}</p>
                  <p className="text-sm text-gray-600">{edu.institution}</p>
                  <p className="text-xs text-gray-500">{edu.year}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Briefcase className="w-5 h-5 mr-2 text-blue-600" />
              Experience
            </h3>

            <div className="space-y-4">
              {(investor.experience || []).map((exp: any, index: any) => (
                <div key={index} className="border-l-4 border-green-500 pl-4">
                  <p className="font-medium text-gray-900">{exp.role}</p>
                  <p className="text-sm text-gray-600">{exp.company}</p>
                  <p className="text-xs text-gray-500 mb-1">{exp.duration}</p>
                  <p className="text-sm text-gray-700">{exp.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tags and Notes */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Tag className="w-5 h-5 mr-2 text-blue-600" />
              Tags
            </h3>

            <div className="flex flex-wrap gap-2">
              {(investor.tags || []).map((tag: any) => (
                <span key={tag} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <StickyNote className="w-5 h-5 mr-2 text-blue-600" />
              Notes
            </h3>

            <p className="text-gray-700 text-sm leading-relaxed">{investor.notes}</p>
          </div>
        </div>
      </div>
    );
  };

  const renderCommunicationsTab = () => {
    if (!investor) return null;
    return (
      <div className="space-y-6">
        {/* Communication Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-center">
            <MessageCircle className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{communications.length}</p>
            <p className="text-sm text-gray-500">Total Communications</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-center">
            <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{investor.responseRate ?? 0}%</p>
            <p className="text-sm text-gray-500">Response Rate</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-center">
            <Clock className="w-8 h-8 text-orange-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{investor.avgResponseTimeHours ?? 0}h</p>
            <p className="text-sm text-gray-500">Avg Response Time</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-center">
            <Calendar className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{meetings.length}</p>
            <p className="text-sm text-gray-500">Meetings Held</p>
          </div>
        </div>

        {/* Communication History */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Communication History</h3>
            <button onClick={() => setShowContactModal(true)} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>New Communication</span>
            </button>
          </div>

          <div className="space-y-4">
            {communications.map((comm) => (
              <div key={comm.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${comm.type === "email" ? "bg-blue-100" : comm.type === "meeting" ? "bg-green-100" : comm.type === "linkedin" ? "bg-purple-100" : "bg-gray-100"}`}>
                      {comm.type === "email" && <Mail className="w-4 h-4 text-blue-600" />}
                      {comm.type === "meeting" && <Calendar className="w-4 h-4 text-green-600" />}
                      {comm.type === "linkedin" && <Linkedin className="w-4 h-4 text-purple-600" />}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{comm.subject}</p>
                      <p className="text-sm text-gray-500">{comm.direction === "inbound" ? "Received" : "Sent"} • {formatDateTime(comm.occurredAt)}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    {comm.sentiment === "positive" && <ThumbsUp className="w-4 h-4 text-green-500" />}
                    {comm.sentiment === "negative" && <ThumbsDown className="w-4 h-4 text-red-500" />}
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${comm.status === "replied" ? "bg-green-100 text-green-800" : comm.status === "read" ? "bg-blue-100 text-blue-800" : comm.status === "sent" ? "bg-yellow-100 text-yellow-800" : "bg-gray-100 text-gray-800"}`}>
                      {comm.status}
                    </span>
                  </div>
                </div>

                <p className="text-sm text-gray-700 mb-3">{comm.content}</p>

                {comm.outcome && (
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm text-green-800"><strong>Outcome:</strong> {comm.outcome}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderMeetingsTab = () => {
    if (!investor) return null;

    // derive counts tolerant to field name differences
    const completedCount = meetings.filter((m) => meetingStatusOf(m) === "completed").length;
    const upcomingCount = meetings.filter((m) => meetingStatusOf(m) === "scheduled").length;

    return (
      <div className="space-y-6">
        {/* Meeting Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-center">
            <Calendar className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{meetings.length}</p>
            <p className="text-sm text-gray-500">Total Meetings</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-center">
            <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{completedCount}</p>
            <p className="text-sm text-gray-500">Completed</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-center">
            <Clock className="w-8 h-8 text-orange-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{upcomingCount}</p>
            <p className="text-sm text-gray-500">Upcoming</p>
          </div>
        </div>

        {/* Meetings List (component) */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Meeting History</h3>
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              onClick={() => {
                // if you have a scheduling modal, open it; otherwise fallback to event
                window.dispatchEvent(new CustomEvent("openScheduleMeetingForInvestor", { detail: { investorId: investor.id } }));
              }}
            >
              <Plus className="w-4 h-4" />
              <span>Schedule Meeting</span>
            </button>
          </div>

          <MeetingsList
            investorId={investor.id}
            onMeetingUpdated={() => {
              // reload the meetings and optionally re-fetch investor if needed
              loadMeetings();
              // if you want investor refreshed (to pick up snapshot changes), uncomment:
              // getInvestorById(id).then(d => setInvestor(d)).catch(()=>{});
            }}
          />
        </div>
      </div>
    );
  };

  const renderDocumentsTab = () => {
    if (!investor) return null;
    return (
      <div className="space-y-6">
        {/* Document Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-center">
            <FileText className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{sharedDocuments.length}</p>
            <p className="text-sm text-gray-500">Documents Shared</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-center">
            <Download className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{sharedDocuments.reduce((sum, doc) => sum + doc.downloadCount, 0)}</p>
            <p className="text-sm text-gray-500">Total Downloads</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-center">
            <Eye className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{sharedDocuments.filter((doc) => doc.lastAccessed).length}</p>
            <p className="text-sm text-gray-500">Recently Accessed</p>
          </div>
        </div>

        {/* Shared Documents */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Shared Documents</h3>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>Share Document</span>
            </button>
          </div>

          <div className="space-y-4">
            {sharedDocuments.map((doc) => (
              <div key={doc.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${doc.type === "pitch_deck" ? "bg-blue-100" : doc.type === "financial_model" ? "bg-green-100" : doc.type === "technical_doc" ? "bg-purple-100" : "bg-gray-100"}`}>
                      <FileText className={`w-5 h-5 ${doc.type === "pitch_deck" ? "text-blue-600" : doc.type === "financial_model" ? "text-green-600" : doc.type === "technical_doc" ? "text-purple-600" : "text-gray-600"}`} />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{doc.name}</p>
                      <p className="text-sm text-gray-500 capitalize">{doc.type.replace("_", " ")}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${doc.accessLevel === "download" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"}`}>
                      {doc.accessLevel}
                    </span>
                    <button className="text-gray-400 hover:text-gray-600">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Shared</p>
                    <p className="font-medium text-gray-900">{formatDate(doc.sharedAt)}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Downloads</p>
                    <p className="font-medium text-gray-900">{doc.downloadCount}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Last Accessed</p>
                    <p className="font-medium text-gray-900">{doc.lastAccessed ? formatDate(doc.lastAccessed) : "Never"}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderAnalyticsTab = () => {
    if (!investor) return null;
    return (
      <div className="space-y-6">
        {/* Engagement Analytics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Engagement Timeline</h3>

            {/* Mock engagement chart */}
            <div className="h-48 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <BarChart3 className="w-12 h-12 text-blue-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Engagement timeline chart</p>
                <p className="text-xs text-gray-500">Showing interaction frequency over time</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Response Patterns</h3>

            {/* Mock response pattern chart */}
            <div className="h-48 bg-gradient-to-br from-green-50 to-emerald-100 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <PieChart className="w-12 h-12 text-green-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Response pattern analysis</p>
                <p className="text-xs text-gray-500">Communication preferences and timing</p>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Analytics */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Detailed Analytics</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <Activity className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-blue-600">{investor.engagementScore}</p>
              <p className="text-sm text-gray-600">Engagement Score</p>
              <p className="text-xs text-gray-500 mt-1">Above average</p>
            </div>

            <div className="text-center p-4 bg-green-50 rounded-lg">
              <MessageCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-green-600">{investor.responseRate}%</p>
              <p className="text-sm text-gray-600">Response Rate</p>
              <p className="text-xs text-gray-500 mt-1">Excellent</p>
            </div>

            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <Star className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-purple-600">{investor.portfolioFitScore}%</p>
              <p className="text-sm text-gray-600">Portfolio Fit</p>
              <p className="text-xs text-gray-500 mt-1">Excellent match</p>
            </div>

            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <Clock className="w-8 h-8 text-orange-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-orange-600">{investor.avgResponseTimeHours}h</p>
              <p className="text-sm text-gray-600">Avg Response Time</p>
              <p className="text-xs text-gray-500 mt-1">Very fast</p>
            </div>
          </div>
        </div>

        {/* Interaction Insights */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Interaction Insights</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Communication Preferences</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Email</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: "85%" }} />
                    </div>
                    <span className="text-sm font-medium text-gray-900">85%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">LinkedIn</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: "65%" }} />
                    </div>
                    <span className="text-sm font-medium text-gray-900">65%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Phone</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div className="bg-purple-500 h-2 rounded-full" style={{ width: "45%" }} />
                    </div>
                    <span className="text-sm font-medium text-gray-900">45%</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Best Contact Times</h4>
              <div className="space-y-3">
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm font-medium text-green-800">Tuesday - Thursday</p>
                  <p className="text-xs text-green-600">Highest response rate (92%)</p>
                </div>
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm font-medium text-blue-800">10:00 AM - 2:00 PM PST</p>
                  <p className="text-xs text-blue-600">Fastest response time (1.2h avg)</p>
                </div>
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm font-medium text-yellow-800">Avoid Mondays & Fridays</p>
                  <p className="text-xs text-yellow-600">Lower response rate (67%)</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-gray-500 text-lg">Loading investor details...</div>
      </div>
    );
  }
  if (!investor) {
    return null;
  }
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button onClick={() => navigate(-1)} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                <ArrowLeft className="w-5 h-5" />
              </button>

              <div className="flex items-center space-x-4">
                <img src={investor.avatarUrl || "https://ui-avatars.com/api/?name=Investor&background=0D8ABC&color=fff"} alt={`${investor.firstName} ${investor.lastName}`} className="w-16 h-16 rounded-full object-cover border-4 border-white shadow-lg" />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{investor.firstName} {investor.lastName}</h1>
                  <p className="text-gray-600">{investor.jobTitle}</p>
                  <p className="text-blue-600 font-medium">{investor.firm?.name}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <span className={`px-3 py-1 text-sm font-medium rounded-full border ${getStatusColor(investor.status)}`}>
                  {investor.status ? investor.status.charAt(0).toUpperCase() + investor.status.slice(1) : "—"}
                </span>
                <div className="flex items-center">
                  <Star className="w-4 h-4 text-yellow-400 mr-1" />
                  <span className={`text-sm font-semibold ${getFitColor(investor.portfolioFitScore || 0)}`}>{investor.portfolioFitScore ?? 0}% fit</span>
                </div>
              </div>

              <a href={investor.email ? buildMailTo(investor.email, investor.id) : "#"} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2" onClick={(e) => { if (!investor.email) e.preventDefault(); }}>
                <Send className="w-4 h-4" />
                <span>Contact</span>
              </a>

              <Link to={`/edit-investor/${investor.id}`} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors flex items-center space-x-2">
                <Edit className="w-4 h-4" />
                <span>Edit</span>
              </Link>

              <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-center">
            <Activity className="w-6 h-6 text-blue-600 mx-auto mb-2" />
            <p className="text-lg font-bold text-gray-900">{investor.engagementScore}</p>
            <p className="text-xs text-gray-500">Engagement Score</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-center">
            <MessageCircle className="w-6 h-6 text-green-600 mx-auto mb-2" />
            <p className="text-lg font-bold text-gray-900">{investor.responseRate}%</p>
            <p className="text-xs text-gray-500">Response Rate</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-center">
            <Clock className="w-6 h-6 text-orange-600 mx-auto mb-2" />
            <p className="text-lg font-bold text-gray-900">{investor.avgResponseTimeHours}h</p>
            <p className="text-xs text-gray-500">Avg Response Time</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-center">
            <Users className="w-6 h-6 text-purple-600 mx-auto mb-2" />
            <p className="text-lg font-bold text-gray-900">{investor.totalInteractions}</p>
            <p className="text-xs text-gray-500">Total Interactions</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-center">
            <Calendar className="w-6 h-6 text-indigo-600 mx-auto mb-2" />
            <p className="text-lg font-bold text-gray-900">{meetings.length}</p>
            <p className="text-xs text-gray-500">Meetings</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-1 mb-6">
          <div className="flex space-x-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === tab.id ? "bg-blue-100 text-blue-700" : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"}`}>
                  <Icon className="w-4 h-4 mr-2" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === "overview" && renderOverviewTab()}
        {activeTab === "communications" && renderCommunicationsTab()}
        {activeTab === "meetings" && renderMeetingsTab()}
        {activeTab === "documents" && renderDocumentsTab()}
        {activeTab === "analytics" && renderAnalyticsTab()}
      </div>

      {/* Contact Modal */}
      {showContactModal && investor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Contact {investor.firstName}</h3>
                <button onClick={() => setShowContactModal(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3">
                <a href={investor.email ? buildMailTo(investor.email, investor.id) : "#"} className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors" onClick={(e) => { if (!investor.email) e.preventDefault(); }}>
                  <Mail className="w-4 h-4 mr-2" />
                  Send Email
                </a>

                <a href={investor.phone ? `tel:${investor.phone}` : "#"} className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors" onClick={(e) => { if (!investor.phone) e.preventDefault(); }}>
                  <Phone className="w-4 h-4 mr-2" />
                  Schedule Call
                </a>

                <button className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors" onClick={() => window.dispatchEvent(new CustomEvent("openScheduleMeetingForInvestor", { detail: { investorId: investor.id } }))}>
                  <Calendar className="w-4 h-4 mr-2" />
                  Schedule Meeting
                </button>

                <button className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                  <Linkedin className="w-4 h-4 mr-2" />
                  LinkedIn Message
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvestorDetail;
