import React, { useState, useEffect } from 'react';
import { Send, Bot, User, Sparkles, CheckCircle2 } from 'lucide-react';
import { cn } from '../layout/Sidebar';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { auth, db } from '../../firebase';
import { collection, query, where, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import { handleFirestoreError, OperationType } from '../../utils/firestoreErrorHandler';
import { GoogleGenAI, Type, FunctionDeclaration } from '@google/genai';
import { SERVICES } from '../../data';
import Markdown from 'react-markdown';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

interface Message {
  id: string;
  sender: 'user' | 'commander';
  text: string;
  action?: string;
  timestamp: any;
}

interface Memory {
  id: string;
  content: string;
  type: string;
}

const triggerAgentTool: FunctionDeclaration = {
  name: "triggerAgent",
  description: "Trigger another specialized AI agent to perform an action or task within the dashboard. Available agents: Coordinator, Communicator, AutoCoder, The Optimizer, SEO Writer.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      agentName: { type: Type.STRING, description: "Name of the agent to trigger (Coordinator, Communicator, AutoCoder, The Optimizer, SEO Writer)" },
      task: { type: Type.STRING, description: "The specific task instruction for the agent" }
    },
    required: ["agentName", "task"]
  }
};

const generateDocumentTool: FunctionDeclaration = {
  name: "generateDocument",
  description: "Generate a document. Can be a PDF (content), Documentation, Meeting Brief, Summary, Project Milestone, Prompt Engineering templates, or Project Overview.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      title: { type: Type.STRING, description: "Title of the document" },
      docType: { type: Type.STRING, description: "Type: PDF, Documentation, Brief, Summary, Milestone, Overview, Prompt, etc." },
      content: { type: Type.STRING, description: "The content of the document in Markdown format." }
    },
    required: ["title", "docType", "content"]
  }
};

const sendCommunicationTool: FunctionDeclaration = {
  name: "sendCommunication",
  description: "Draft and send an email or WhatsApp message, or configure auto-reply.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      channel: { type: Type.STRING, description: "Email or WhatsApp" },
      recipient: { type: Type.STRING, description: "Name, email, or phone number" },
      subject: { type: Type.STRING, description: "Subject if email" },
      content: { type: Type.STRING, description: "Message body" },
      isAutoReply: { type: Type.BOOLEAN, description: "Is this setting up an auto-reply protocol?" }
    },
    required: ["channel", "recipient", "content"]
  }
};

const manageProjectContextTool: FunctionDeclaration = {
  name: "manageProjectContext",
  description: "Auto add projects, propose tech stacks, or propose solutions for project issues.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      action: { type: Type.STRING, description: "add_project, propose_stack, propose_solution" },
      projectName: { type: Type.STRING },
      proposalOrDetails: { type: Type.STRING, description: "Markdown content containing the stack, solution, or project overview." }
    },
    required: ["action", "projectName", "proposalOrDetails"]
  }
};

const assignTaskTool: FunctionDeclaration = {
  name: "assignTaskToTeamMember",
  description: "Suggest assigning a task to a specific team member based on their role and capabilities.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      assigneeName: { type: Type.STRING, description: "Name of the team member to assign the task to" },
      taskDescription: { type: Type.STRING, description: "Description of the task" },
      projectName: { type: Type.STRING, description: "Associated project (optional)" },
      reasoning: { type: Type.STRING, description: "Why this person was chosen for the task based on their capabilities." }
    },
    required: ["assigneeName", "taskDescription", "reasoning"]
  }
};

const generatePromptTemplateTool: FunctionDeclaration = {
  name: "generatePromptTemplate",
  description: "Generate and save a prompt engineering template for tasks like project summarization, email drafting, or code generation.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      title: { type: Type.STRING, description: "Title of the prompt template" },
      description: { type: Type.STRING, description: "Brief description of what the template is for" },
      template: { type: Type.STRING, description: "The actual prompt template (use placeholders like [Project Name])" }
    },
    required: ["title", "description", "template"]
  }
};

const navigateViewTool: FunctionDeclaration = {
  name: "navigateView",
  description: "Navigate the user to a specific view in the dashboard. Available views: overview, projects, team, ai-agents, services, client-ops, templates, seo-intel, memory, logs, project-detail, team-detail, service-detail.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      viewId: { type: Type.STRING, description: "The ID of the view to navigate to (e.g., seo-intel, projects)" },
      entityId: { type: Type.STRING, description: "Optional entity ID if navigating to a detail view (e.g., project ID)" }
    },
    required: ["viewId"]
  }
};

const invokeActionTool: FunctionDeclaration = {
  name: "invokeAction",
  description: "Programmatically press a widget button or trigger a specific UI action in the dashboard. Use this when the user asks to 'run', 'execute', or 'trigger' a specific button (e.g., 'Run Full Link Audit' -> 'run-full-link-audit', 'Run Crawler' -> 'run-crawler', 'Execute Fix' -> 'execute-fix').",
  parameters: {
    type: Type.OBJECT,
    properties: {
      actionId: { type: Type.STRING, description: "The ID of the action to invoke (e.g., 'run-crawler', 'execute-fix', 'run-full-link-audit')" },
      payload: { type: Type.STRING, description: "Optional stringified JSON payload for the action" }
    },
    required: ["actionId"]
  }
};

const queryDashboardStateTool: FunctionDeclaration = {
  name: "queryDashboardState",
  description: "Query the real-time internal state or metrics of a specific dashboard module/view.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      module: { type: Type.STRING, description: "The module or view to query (e.g., 'seo-intel', 'client-ops', 'overview')" }
    },
    required: ["module"]
  }
};

interface AgentChatProps {
  onNavigate?: (viewId: string, entityId?: string) => void;
}

export function AgentChat({ onNavigate }: AgentChatProps) {
  const { user } = useAuth();
  const { projects: PROJECTS, team: TEAM } = useData();
  const [messages, setMessages] = useState<Message[]>([]);
  const [memories, setMemories] = useState<Memory[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    // Listen to messages
    const qMsgs = query(collection(db, 'messages'), where('userId', '==', user.uid));
    const unsubMsgs = onSnapshot(qMsgs, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Message[];
      data.sort((a, b) => {
        const tA = a.timestamp?.toMillis ? a.timestamp.toMillis() : Date.now();
        const tB = b.timestamp?.toMillis ? b.timestamp.toMillis() : Date.now();
        return tA - tB;
      });
      setMessages(data);
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'messages', auth));

    // Listen to memories
    const qMems = query(collection(db, 'memories'), where('userId', '==', user.uid));
    const unsubMems = onSnapshot(qMems, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Memory[];
      setMemories(data);
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'memories', auth));

    return () => {
      unsubMsgs();
      unsubMems();
    };
  }, [user]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !user || loading) return;

    const userText = input.trim();
    setInput('');
    setLoading(true);
    setErrorMsg(null);

    try {
      await addDoc(collection(db, 'messages'), {
        userId: user.uid,
        sender: 'user',
        text: userText,
        timestamp: serverTimestamp()
      });

      const systemInstruction = `You are Commander, the main AI Orchestrator for Agency OS.
You are aware of all context in the dashboard:
Projects: ${JSON.stringify(PROJECTS)}
Team: ${JSON.stringify(TEAM)}
Services: ${JSON.stringify(SERVICES)}
Stored AI Context/Memories: ${JSON.stringify(memories)}

You have advanced capabilities. You can:
1. Write PDFs, create documentation, meeting briefs, summaries, milestones, overviews, and prompt engineering using \`generateDocument\`.
2. Write and send emails, and auto-reply to WhatsApp messages using \`sendCommunication\`.
3. Auto add projects, propose tech stacks, and propose issue solutions using \`manageProjectContext\`.
4. Trigger other specialized agents (Coordinator for project management, Communicator for client communication, AutoCoder for code generation workflows, The Optimizer for SEO/GEO auditing and strategy, SEO Writer for semantic copywriting) using \`triggerAgent\`.
5. Suggest task assignments to team members based on project needs and their capabilities using \`assignTaskToTeamMember\`.
6. Generate reusable prompt templates for common tasks using \`generatePromptTemplate\`.
7. Navigate the user's dashboard view physically changing the current active screen using \`navigateView(viewId, entityId?)\`. Use this when the user asks to "see", "show", or "open" a specific page or entity.
8. Directly execute actions and press buttons in the UI for the user using \`invokeAction(actionId, payload?)\`. Use this when the user asks to run an audit, execute a fix, run crawler, or do anything tied to a button.
9. Query real-time data or metrics from dashboard components using \`queryDashboardState(module)\`. Use this to answer queries about the current status of an open view (e.g., pending tasks, scores, values).

Help the agency owner by fully utilizing your tools. Whenever asked to draft, create, send, assign, or propose, USE the appropriate tool to perform the action. If orchestration is requested, use triggerAgent.`;

      // Build chat history for Gemini
      const contents: any[] = messages.map(m => ({
        role: m.sender === 'user' ? 'user' : 'model',
        parts: [{ text: m.text }]
      }));
      contents.push({ role: 'user', parts: [{ text: userText }] });

      const response = await ai.models.generateContent({
        model: "gemini-3.1-pro-preview",
        contents,
        config: {
          systemInstruction,
          tools: [{ functionDeclarations: [triggerAgentTool, generateDocumentTool, sendCommunicationTool, manageProjectContextTool, assignTaskTool, generatePromptTemplateTool, navigateViewTool, invokeActionTool, queryDashboardStateTool] }]
        }
      });

      let responseText = response.text || '';
      let actionText = '';
      
      const functionCalls = response.functionCalls;
      if (functionCalls && functionCalls.length > 0) {
        const fc = functionCalls[0];
        const args = fc.args as Record<string, any>;
        
        if (fc.name === 'triggerAgent') {
           actionText = `Triggered [${args.agentName}]: ${args.task}`;
        } else if (fc.name === 'generateDocument') {
           actionText = `Generated ${args.docType}: ${args.title}`;
           if (!responseText) responseText = args.content;
           else responseText += `\n\n${args.content}`;
        } else if (fc.name === 'sendCommunication') {
           actionText = `Sent ${args.channel} to ${args.recipient}`;
           if (!responseText) responseText = `**Subject:** ${args.subject || 'N/A'}\n\n${args.content}`;
           else responseText += `\n\n**Sent Message:**\n${args.content}`;
        } else if (fc.name === 'manageProjectContext') {
           actionText = `Executed ${args.action} for ${args.projectName}`;
           if (!responseText) responseText = args.proposalOrDetails;
           else responseText += `\n\n${args.proposalOrDetails}`;
        } else if (fc.name === 'assignTaskToTeamMember') {
           actionText = `Assigned task to ${args.assigneeName}${args.projectName ? ` for project ${args.projectName}` : ''}`;
           if (!responseText) responseText = `**Task:** ${args.taskDescription}\n**Reasoning:** ${args.reasoning}`;
           else responseText += `\n\n**Assigned Task:** ${args.taskDescription}\n**Reasoning:** ${args.reasoning}`;
        } else if (fc.name === 'generatePromptTemplate') {
           actionText = `Generated Prompt Template: ${args.title}`;
           if (!responseText) responseText = `**Template:**\n\n${args.template}`;
           else responseText += `\n\n**Template:**\n\n${args.template}`;
           
           try {
             await addDoc(collection(db, 'prompt_templates'), {
               userId: user.uid,
               title: args.title,
               description: args.description || '',
               template: args.template,
               createdAt: serverTimestamp()
             });
           } catch (tplErr) {
             console.error("Failed to write prompt template", tplErr);
             try {
               handleFirestoreError(tplErr, OperationType.CREATE, 'prompt_templates', auth);
             } catch(e) {}
           }
        } else if (fc.name === 'navigateView') {
           actionText = `Navigating to ${args.viewId}${args.entityId ? ` (${args.entityId})` : ''}`;
           if (onNavigate) {
             onNavigate(args.viewId, args.entityId);
           }
        } else if (fc.name === 'invokeAction') {
           actionText = `Invoked action ${args.actionId}`;
           const event = new CustomEvent('agent-invoke-action', { detail: { actionId: args.actionId, payload: args.payload } });
           window.dispatchEvent(event);
        } else if (fc.name === 'queryDashboardState') {
           actionText = `Queried state for module: ${args.module}`;
           
           // Mocked state payload for testing
           const mockState = {
             module: args.module,
             metrics: {
               authorityScore: 42,
               organicTraffic: "12.4K",
               toxicDomains: 14,
               pendingTasks: 2,
               failedTasks: 1
             },
             activeProject: "CT Industry"
           };

           contents.push({
             role: 'model',
             parts: [{ functionCall: fc }]
           });
           
           contents.push({
             role: 'user',
             parts: [{
               functionResponse: {
                 name: 'queryDashboardState',
                 response: mockState
               }
             }]
           });
           
           const followUpResponse = await ai.models.generateContent({
             model: "gemini-3.1-pro-preview",
             contents,
             config: { systemInstruction }
           });
           
           responseText = followUpResponse.text || '';
        }

        try {
          await addDoc(collection(db, 'agent_logs'), {
            userId: user.uid,
            tool: fc.name || 'unknown_tool',
            parameters: JSON.stringify(args) || '{}',
            outcome: actionText || 'Tool executed successfully',
            timestamp: serverTimestamp()
          });
        } catch (logErr) {
          console.error("Failed to write agent log", logErr);
          try {
            handleFirestoreError(logErr, OperationType.CREATE, 'agent_logs', auth);
          } catch (e) {}
        }
      }

      await addDoc(collection(db, 'messages'), {
        userId: user.uid,
        sender: 'commander',
        text: responseText || 'Action executed.',
        ...(actionText ? { action: actionText } : {}),
        timestamp: serverTimestamp()
      });

    } catch (error: any) {
      console.error(error);
      setErrorMsg(error?.message || String(error));
      try {
        handleFirestoreError(error, OperationType.CREATE, 'messages', auth);
      } catch (err) { }
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <aside className="w-80 flex-shrink-0 bg-panel-dark border-l border-border-200 h-screen flex flex-col">
      <div className="p-4 border-b border-border-100 flex justify-between items-center bg-panel-dark">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-status-ok rounded-full animate-pulse"></div>
          <div>
            <h3 className="font-bold text-xs uppercase tracking-widest text-t-100">AI Commander</h3>
            <span className="text-[10px] italic font-mono text-t-300">Orchestrating agency flow...</span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 font-mono text-[11px] leading-relaxed">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={cn(
              "flex flex-col gap-1 w-full",
              msg.sender === 'user' ? "items-end" : "items-start"
            )}
          >
            <div className={cn(
              "px-3 py-2 rounded-md text-[11px] prose prose-invert prose-p:leading-relaxed prose-pre:bg-panel prose-pre:border-border-200 prose-pre:border prose-a:text-cmd max-w-none",
              msg.sender === 'user' 
                ? "bg-panel3 border border-border-100 text-t-100" 
                : "text-t-200"
            )}>
              {msg.sender === 'commander' && <span className="text-status-info mr-2 font-sans font-bold">[SYSTEM]</span>}
              <Markdown>{msg.text}</Markdown>
            </div>
            
            {msg.action && (
              <div className="mt-1 p-3 rounded-md bg-panel3 text-xs w-full text-t-100">
                <span className="font-bold uppercase text-cmd">Agent Action:</span><br/>
                {msg.action}
              </div>
            )}
          </div>
        ))}
        {loading && (
          <div className="text-t-300 italic text-[10px] mt-2 flex items-center gap-2">
            <Sparkles className="w-3 h-3 animate-pulse" /> Processing intelligence...
          </div>
        )}
        {errorMsg && (
          <div className="mt-2 p-3 bg-status-err/10 border border-status-err/20 rounded-md text-status-err text-[11px] font-mono">
            <strong>Error:</strong> {errorMsg}
          </div>
        )}
      </div>

      <div className="p-4 border-t border-border-100 bg-panel-dark">
        <form onSubmit={handleSend} className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
            placeholder={loading ? "System busy..." : "Command Mahdi-OS..."}
            className="w-full bg-panel2 border border-border-100 rounded px-3 py-2 text-xs text-t-100 placeholder:text-t-300 focus:outline-none focus:border-cmd transition-colors italic disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={loading}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-t-300 uppercase font-bold tracking-widest hover:text-t-100 disabled:opacity-50"
          >
            Enter
          </button>
        </form>
      </div>
    </aside>
  );
}
