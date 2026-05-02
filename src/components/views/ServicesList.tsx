import React, { useState } from 'react';
import { SERVICES, Service } from '../../data';
import { Wrench, CheckCircle2, FileText, ArrowRight, ArrowLeft } from 'lucide-react';
import Markdown from 'react-markdown';
import { cn } from '../layout/Sidebar';

export function ServicesList() {
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  if (selectedService) {
    return (
      <div className="p-8 max-w-4xl mx-auto space-y-6 animate-fade-in">
        <button 
          onClick={() => setSelectedService(null)}
          className="flex items-center gap-2 text-[10px] font-mono text-t-300 hover:text-cmd uppercase tracking-widest transition-colors mb-4 border border-border-100 bg-panel px-3 py-1.5 rounded hover:border-cmd/50"
        >
          <ArrowLeft className="w-3 h-3" /> Back to Catalog
        </button>
        
        <div className="bg-panel2 border border-border-100 rounded-md overflow-hidden relative">
          <div className="h-48 w-full relative">
            <div className="absolute inset-0 bg-gradient-to-t from-panel2 to-transparent z-10" />
            {selectedService.image ? (
              <img src={selectedService.image} alt={selectedService.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-void border-b border-border-100" />
            )}
            <div className="absolute bottom-4 left-6 z-20">
              <h1 className="text-xl font-bold text-t-100 mb-2">{selectedService.name}</h1>
              <div className="flex items-center gap-4 text-xs font-mono text-t-200 uppercase tracking-widest">
                <span className="flex items-center gap-1.5 text-cmd"><CheckCircle2 className="w-3 h-3" /> {selectedService.duration}</span>
                <span className="font-extrabold text-t-100">{selectedService.price}</span>
              </div>
            </div>
          </div>
          <div className="p-6 md:p-8 border-t border-border-100">
            <div className="prose prose-invert prose-p:text-t-100 prose-headings:text-t-100 prose-hr:border-border-100 prose-a:text-cmd prose-pre:bg-panel prose-pre:border prose-pre:border-border-100 max-w-none text-sm">
              {selectedService.fullSop ? (
                <Markdown>{selectedService.fullSop}</Markdown>
              ) : (
                <p>No Standard Operating Procedure defined for this service.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-5xl mx-auto animate-fade-in">
      <div className="mb-6 flex items-center gap-3 border-b border-border-100 pb-4">
        <h2 className="text-xl font-bold text-t-100 uppercase tracking-wider">Service Catalog</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {SERVICES.map(service => (
          <div key={service.id} className="relative bg-panel2 border border-border-100 rounded-md overflow-hidden group hover:border-cmd/50 transition-colors">
            
            {/* Hover Image Overlay */}
            {service.image && (
              <div className="absolute inset-0 z-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300">
                <img src={service.image} alt="" className="w-full h-full object-cover grayscale mix-blend-overlay" />
                <div className="absolute inset-0 bg-gradient-to-t from-panel2 via-panel2/80 to-transparent" />
              </div>
            )}

            <div className="relative z-10 p-6 flex flex-col h-full">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-lg leading-tight text-t-100">{service.name}</h3>
                  <div className="flex items-center gap-3 mt-2 text-[10px] font-mono text-t-300 uppercase tracking-widest">
                    <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-cmd" /> {service.duration}</span>
                    <span className="flex items-center gap-1.5"><FileText className="w-3.5 h-3.5" /> {service.revisions}</span>
                  </div>
                </div>
                <div className="text-xl font-extrabold text-t-100 font-mono bg-panel px-2 py-1 rounded border border-border-100">{service.price}</div>
              </div>

              <div className="flex-1 space-y-5">
                <div>
                  <h4 className="text-[9px] font-mono uppercase tracking-widest text-t-300 font-bold mb-2.5">Process</h4>
                  <ol className="text-xs text-t-100 space-y-1.5 font-medium">
                    {service.process.map((step, i) => (
                      <li key={i} className="opacity-90">{step}</li>
                    ))}
                  </ol>
                </div>

                <div className="grid grid-cols-2 gap-4 border-t border-border-100/50 pt-4">
                  <div>
                    <h4 className="text-[9px] font-mono uppercase tracking-widest text-t-300 font-bold mb-2.5 flex items-center gap-1.5"><Wrench className="w-3 h-3" /> Tools</h4>
                    <ul className="text-[10px] text-t-200 space-y-1.5 font-mono">
                      {service.tools.map((t, i) => <li key={i} className="truncate">- {t}</li>)}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-[9px] font-mono uppercase tracking-widest text-t-300 font-bold mb-2.5 flex items-center gap-1.5"><FileText className="w-3 h-3" /> Resources</h4>
                    <ul className="text-[10px] text-t-200 space-y-1.5 font-mono">
                      {service.resources.map((r, i) => <li key={i} className="truncate">- {r}</li>)}
                    </ul>
                  </div>
                </div>
              </div>
              
              <button 
                onClick={() => setSelectedService(service)}
                className="mt-6 w-full flex justify-center items-center gap-2 bg-void border-cmd/30 border text-cmd hover:bg-cmd/10 hover:text-t-100 transition-colors text-[10px] font-mono font-bold uppercase tracking-widest py-2.5 rounded"
              >
                Access Full SOP <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
