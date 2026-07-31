"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { PageContainer } from "@/components/shared/PageContainer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Briefcase, Users, Zap, GraduationCap, ArrowRight, Star, MapPin, RefreshCw, Loader2 } from "lucide-react";
import { UnifiedSearchService, UnifiedSearchResults } from "@/lib/services/search.service";
import { StarRating } from "@/features/reviews/StarRating";
import Link from "next/link";

function UnifiedSearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const query = searchParams.get("q") || searchParams.get("query") || "";
  const initialTab = searchParams.get("tab") || "all";

  const [inputQuery, setInputQuery] = useState(query);
  const [activeTab, setActiveTab] = useState(initialTab);
  const [data, setData] = useState<UnifiedSearchResults | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchResults = async (q: string) => {
    if (!q.trim()) {
      setData(null);
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const res = await UnifiedSearchService.searchUnified(q.trim());
      setData(res);
    } catch (err: any) {
      setError(err.message || "Failed to perform search.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setInputQuery(query);
    fetchResults(query);
  }, [query]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(inputQuery.trim())}`);
    }
  };

  return (
    <PageContainer className="py-8 space-y-8">
      {/* Header Search Input */}
      <div className="bg-card border rounded-2xl p-6 shadow-sm space-y-4">
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
          Unified Marketplace Search
        </h1>
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-3.5 h-5 w-5 text-muted-foreground" />
            <Input
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="Search across Jobs, Talent, Freelancers, and Courses..."
              className="pl-11 h-12 text-base rounded-xl"
            />
          </div>
          <Button type="submit" size="lg" className="h-12 px-6 rounded-xl font-semibold gap-2">
            <Search className="h-4 w-4" /> Search Marketplace
          </Button>
        </form>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-16 space-y-3">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-muted-foreground font-medium">Searching marketplace across all domains...</p>
        </div>
      ) : error ? (
        <div className="p-12 text-center border rounded-2xl bg-card space-y-4">
          <p className="text-destructive font-semibold">{error}</p>
          <Button variant="outline" onClick={() => fetchResults(query)}>
            <RefreshCw className="h-4 w-4 mr-2" /> Retry Search
          </Button>
        </div>
      ) : !data || data.totalResults === 0 ? (
        <div className="p-12 text-center border rounded-2xl bg-card space-y-3">
          <Search className="h-12 w-12 text-muted-foreground mx-auto" />
          <h3 className="text-xl font-bold">No results found</h3>
          <p className="text-muted-foreground text-sm max-w-md mx-auto">
            {query ? `No marketplace items matched "${query}". Try searching for another keyword or skill.` : "Type a keyword above to search the entire TalentFlow ecosystem."}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-muted-foreground">
              Found <strong className="text-foreground">{data.totalResults}</strong> result{data.totalResults > 1 ? "s" : ""} for "{data.query}"
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-5">
              <TabsTrigger value="all">All ({data.totalResults})</TabsTrigger>
              <TabsTrigger value="jobs">Jobs ({data.jobs.length})</TabsTrigger>
              <TabsTrigger value="talent">Talent ({data.talent.length})</TabsTrigger>
              <TabsTrigger value="freelancers">Freelancers ({data.freelancers.length})</TabsTrigger>
              <TabsTrigger value="courses">Courses ({data.courses.length})</TabsTrigger>
            </TabsList>

            {/* TAB: ALL RESULTS */}
            <TabsContent value="all" className="mt-6 space-y-10">
              {/* Jobs Preview */}
              {data.jobs.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b pb-2">
                    <h3 className="text-lg font-bold flex items-center gap-2">
                      <Briefcase className="h-5 w-5 text-blue-600" /> Jobs ({data.jobs.length})
                    </h3>
                    <Button variant="ghost" size="sm" onClick={() => setActiveTab("jobs")} className="text-xs">
                      View all jobs <ArrowRight className="h-3.5 w-3.5 ml-1" />
                    </Button>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    {data.jobs.slice(0, 4).map((j) => (
                      <Link key={j.id} href={`/jobs/${j.id}`}>
                        <div className="bg-card border rounded-xl p-4 hover:border-primary transition-all shadow-sm space-y-2">
                          <h4 className="font-bold text-base text-foreground">{j.title}</h4>
                          <p className="text-xs text-muted-foreground">{j.company} • {j.location}</p>
                          <div className="flex flex-wrap gap-1 pt-1">
                            {j.skills.map((s: string) => (
                              <Badge key={s} variant="secondary" className="text-[10px]">{s}</Badge>
                            ))}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Freelancers Preview */}
              {data.freelancers.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b pb-2">
                    <h3 className="text-lg font-bold flex items-center gap-2">
                      <Zap className="h-5 w-5 text-amber-500" /> Freelancers ({data.freelancers.length})
                    </h3>
                    <Button variant="ghost" size="sm" onClick={() => setActiveTab("freelancers")} className="text-xs">
                      View all freelancers <ArrowRight className="h-3.5 w-3.5 ml-1" />
                    </Button>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    {data.freelancers.slice(0, 4).map((f) => (
                      <Link key={f.id} href={`/freelancers/${f.id}`}>
                        <div className="bg-card border rounded-xl p-4 hover:border-primary transition-all shadow-sm space-y-2">
                          <div className="flex items-center justify-between">
                            <h4 className="font-bold text-base text-foreground">{f.name}</h4>
                            <span className="font-bold text-xs text-emerald-600">${f.hourlyRate}/hr</span>
                          </div>
                          <p className="text-xs text-muted-foreground">{f.title}</p>
                          <StarRating rating={f.rating} size="sm" showText />
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Courses Preview */}
              {data.courses.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b pb-2">
                    <h3 className="text-lg font-bold flex items-center gap-2">
                      <GraduationCap className="h-5 w-5 text-emerald-600" /> Courses ({data.courses.length})
                    </h3>
                    <Button variant="ghost" size="sm" onClick={() => setActiveTab("courses")} className="text-xs">
                      View all courses <ArrowRight className="h-3.5 w-3.5 ml-1" />
                    </Button>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    {data.courses.slice(0, 4).map((c) => (
                      <Link key={c.id} href={`/find-courses/${c.id}`}>
                        <div className="bg-card border rounded-xl p-4 hover:border-primary transition-all shadow-sm space-y-2">
                          <h4 className="font-bold text-base text-foreground">{c.title}</h4>
                          <p className="text-xs text-muted-foreground">Instructor: {c.instructor}</p>
                          <StarRating rating={c.rating} size="sm" showText />
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>

            {/* TAB: JOBS */}
            <TabsContent value="jobs" className="mt-6">
              <div className="grid md:grid-cols-2 gap-4">
                {data.jobs.map((j) => (
                  <Link key={j.id} href={`/jobs/${j.id}`}>
                    <div className="bg-card border rounded-xl p-5 hover:border-primary transition-all shadow-sm space-y-2">
                      <h4 className="font-bold text-base">{j.title}</h4>
                      <p className="text-xs text-muted-foreground">{j.company} • {j.location}</p>
                      <Badge variant="outline" className="text-xs">{j.salary}</Badge>
                    </div>
                  </Link>
                ))}
              </div>
            </TabsContent>

            {/* TAB: TALENT */}
            <TabsContent value="talent" className="mt-6">
              <div className="grid md:grid-cols-2 gap-4">
                {data.talent.map((t) => (
                  <div key={t.id} className="bg-card border rounded-xl p-5 shadow-sm space-y-2">
                    <h4 className="font-bold text-base">{t.name}</h4>
                    <p className="text-xs text-muted-foreground">{t.role} • {t.location}</p>
                    <StarRating rating={t.rating} size="sm" showText />
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* TAB: FREELANCERS */}
            <TabsContent value="freelancers" className="mt-6">
              <div className="grid md:grid-cols-2 gap-4">
                {data.freelancers.map((f) => (
                  <Link key={f.id} href={`/freelancers/${f.id}`}>
                    <div className="bg-card border rounded-xl p-5 hover:border-primary transition-all shadow-sm space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-base">{f.name}</h4>
                        <span className="font-bold text-xs text-emerald-600">${f.hourlyRate}/hr</span>
                      </div>
                      <p className="text-xs text-muted-foreground">{f.title}</p>
                      <StarRating rating={f.rating} size="sm" showText />
                    </div>
                  </Link>
                ))}
              </div>
            </TabsContent>

            {/* TAB: COURSES */}
            <TabsContent value="courses" className="mt-6">
              <div className="grid md:grid-cols-2 gap-4">
                {data.courses.map((c) => (
                  <Link key={c.id} href={`/find-courses/${c.id}`}>
                    <div className="bg-card border rounded-xl p-5 hover:border-primary transition-all shadow-sm space-y-2">
                      <h4 className="font-bold text-base">{c.title}</h4>
                      <p className="text-xs text-muted-foreground">Instructor: {c.instructor}</p>
                      <StarRating rating={c.rating} size="sm" showText />
                    </div>
                  </Link>
                ))}
              </div>
            </TabsContent>

          </Tabs>
        </div>
      )}
    </PageContainer>
  );
}

export default function UnifiedSearchPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center">Loading search page...</div>}>
      <UnifiedSearchContent />
    </Suspense>
  );
}
