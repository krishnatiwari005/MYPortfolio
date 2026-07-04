'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Certificate } from '@/types';
import Card from '../ui/card';
import Badge from '../ui/badge';
import Button from '../ui/button';
import { ExternalLink, X, Download, Award } from 'lucide-react';

export interface CertificatesSectionProps {
  certificates: Certificate[];
}

export const CertificatesSection = ({ certificates }: CertificatesSectionProps) => {
  const [activeLightbox, setActiveLightbox] = useState<Certificate | null>(null);

  return (
    <section id="certificates" className="py-24 relative z-10 scroll-mt-12">
      <div className="w-full max-w-[1100px] mx-auto px-6 md:px-12 space-y-12">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center space-y-3">
          <div className="px-3 py-1 bg-accent-light border border-accent-primary/10 text-accent-primary text-xs font-bold tracking-widest uppercase rounded-full">
            Badges
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold font-display text-text-primary tracking-tight">
            Certifications & Credentials
          </h2>
          <p className="text-sm text-text-tertiary max-w-md">
            Click on any credential badge to view verification credentials or download documents.
          </p>
        </div>

        {/* Masonry Column Layout */}
        {certificates.length === 0 ? (
          <div className="text-center py-12 text-xs text-text-tertiary">
            No certificates uploaded yet.
          </div>
        ) : (
          <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
            {certificates.map((cert) => (
              <motion.div
                key={cert.id}
                whileHover={{ y: -2 }}
                onClick={() => setActiveLightbox(cert)}
                className="break-inside-avoid bg-white border border-border-subtle rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer mb-4"
              >
                {/* Thumbnail Preview */}
                <div className="relative w-full bg-bg-primary overflow-hidden border-b border-border-subtle min-h-[140px] flex items-center justify-center p-2">
                  {cert.preview_image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={cert.preview_image_url}
                      alt={cert.title}
                      className="w-full h-auto max-h-[180px] object-contain transition-transform duration-300 hover:scale-103"
                    />
                  ) : (
                    <Award className="w-12 h-12 text-accent-primary/40" />
                  )}
                </div>

                {/* Details */}
                <div className="p-4 space-y-1.5">
                  <h3 className="text-sm font-bold text-text-primary leading-tight font-display">{cert.title}</h3>
                  <div className="flex flex-wrap items-center justify-between gap-2 text-[10px] text-text-tertiary">
                    <span className="font-semibold">{cert.issuer}</span>
                    <span>{cert.issue_date}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox full visual image popups */}
      <AnimatePresence>
        {activeLightbox && (
          <div className="fixed inset-0 z-[201] flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-black/80 backdrop-blur-md" onClick={() => setActiveLightbox(null)} />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative max-w-2xl w-full bg-white rounded-2xl overflow-hidden shadow-2xl z-10 flex flex-col"
            >
              {/* Top controls header */}
              <div className="p-4 border-b border-border-subtle flex items-center justify-between bg-bg-secondary">
                <div className="overflow-hidden pr-8">
                  <h3 className="text-sm font-bold text-text-primary truncate font-display">{activeLightbox.title}</h3>
                  <p className="text-[10px] text-text-tertiary mt-0.5">{activeLightbox.issuer} • {activeLightbox.issue_date}</p>
                </div>
                <button
                  onClick={() => setActiveLightbox(null)}
                  className="p-1 text-text-tertiary hover:text-text-primary rounded-full hover:bg-border-subtle cursor-pointer shrink-0"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Graphic visual panel */}
              <div className="flex-1 bg-bg-primary p-6 flex items-center justify-center min-h-[250px] max-h-[70vh] overflow-y-auto">
                {activeLightbox.preview_image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={activeLightbox.preview_image_url}
                    alt={activeLightbox.title}
                    className="max-w-full max-h-[50vh] object-contain rounded-lg shadow-sm"
                  />
                ) : (
                  <Award className="w-24 h-24 text-accent-primary/20" />
                )}
              </div>

              {/* Bottom buttons actions footer */}
              <div className="p-4 border-t border-border-subtle flex flex-wrap gap-2 justify-end bg-bg-secondary">
                {activeLightbox.pdf_url && (
                  <Button
                    variant="secondary"
                    size="sm"
                    className="flex items-center gap-1.5"
                    onClick={() => window.open(activeLightbox.pdf_url!, '_blank')}
                  >
                    <Download className="w-4 h-4" /> Download PDF Document
                  </Button>
                )}
                {activeLightbox.credential_url && (
                  <Button
                    variant="primary"
                    size="sm"
                    className="flex items-center gap-1.5"
                    onClick={() => window.open(activeLightbox.credential_url!, '_blank')}
                  >
                    <span>Verify Credential</span>
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default CertificatesSection;
