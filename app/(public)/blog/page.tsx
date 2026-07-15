import { PageContainer } from "@/components/shared/PageContainer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, ArrowRight, TrendingUp } from "lucide-react";
import Link from "next/link";

const BLOG_CATEGORIES = ["All", "Career Advice", "Hiring Trends", "Company News", "Engineering", "Design"];

const FEATURED_POST = {
  id: "the-future-of-ai-in-recruitment",
  title: "The Future of AI in Recruitment: Beyond Resume Parsing",
  excerpt: "How generative AI and machine learning are fundamentally changing how companies assess talent and cultural fit.",
  category: "Hiring Trends",
  date: "Oct 12, 2026",
  readTime: "8 min read",
  author: "David Chen",
};

const LATEST_POSTS = [
  {
    id: "navigating-remote-work-2026",
    title: "Navigating the New Era of Remote Work in 2026",
    excerpt: "Strategies for building cohesive, high-performing teams across time zones without losing company culture.",
    category: "Career Advice",
    date: "Oct 10, 2026",
    readTime: "5 min read",
  },
  {
    id: "stitch-raises-series-b",
    title: "Stitch Raises $50M Series B to Expand Global Marketplace",
    excerpt: "We are thrilled to announce our latest funding round led by top-tier investors to accelerate our product roadmap.",
    category: "Company News",
    date: "Oct 05, 2026",
    readTime: "3 min read",
  },
  {
    id: "designing-for-accessibility",
    title: "Designing for Accessibility: A Practical Guide",
    excerpt: "How our design team overhauled the Stitch interface to meet advanced accessibility standards.",
    category: "Design",
    date: "Oct 01, 2026",
    readTime: "6 min read",
  },
  {
    id: "microservices-architecture-lessons",
    title: "Lessons Learned Scaling Our Microservices Architecture",
    excerpt: "A deep dive into the engineering challenges we faced while scaling our matching engine to handle millions of requests.",
    category: "Engineering",
    date: "Sep 28, 2026",
    readTime: "10 min read",
  },
];

const TRENDING_POSTS = [
  { id: "salary-negotiation-tips", title: "5 Proven Strategies for Salary Negotiation in Tech" },
  { id: "top-programming-languages-2026", title: "The Most In-Demand Programming Languages of 2026" },
  { id: "building-employer-brand", title: "How to Build an Employer Brand That Attracts Top Talent" },
];

export default function BlogPage() {
  return (
    <PageContainer>
      <div className="flex flex-col gap-4 py-8 md:py-12 text-center items-center">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
          Stitch Blog
        </h1>
        <p className="max-w-2xl text-lg text-muted-foreground">
          Insights, updates, and advice on the future of work, hiring, and technology from the Stitch team.
        </p>
      </div>

      {/* Featured Post */}
      <section className="mb-12">
        <Card className="overflow-hidden border-none bg-muted/30">
          <div className="grid md:grid-cols-2 gap-6 items-center">
            <div className="h-64 md:h-full w-full bg-primary/10 flex items-center justify-center relative overflow-hidden min-h-[300px]">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 via-primary/5 to-transparent" />
              <span className="font-bold text-3xl text-primary/40">Featured Image</span>
            </div>
            <div className="flex flex-col p-6 md:p-10 justify-center h-full">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                  {FEATURED_POST.category}
                </span>
              </div>
              <h2 className="text-3xl font-bold mb-4 line-clamp-2">
                <Link href={`/blog/${FEATURED_POST.id}`} className="hover:underline">
                  {FEATURED_POST.title}
                </Link>
              </h2>
              <p className="text-muted-foreground text-lg mb-6 line-clamp-3">
                {FEATURED_POST.excerpt}
              </p>
              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {FEATURED_POST.date}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {FEATURED_POST.readTime}
                </div>
              </div>
              <Button className="w-fit">
                <Link href={`/blog/${FEATURED_POST.id}`}>
                  Read Article <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </Card>
      </section>

      {/* Categories */}
      <section className="flex flex-wrap gap-2 mb-10 border-b pb-6">
        {BLOG_CATEGORIES.map((cat, i) => (
          <Button key={i} variant={i === 0 ? "default" : "outline"} className="rounded-full">
            {cat}
          </Button>
        ))}
      </section>

      <div className="grid gap-12 lg:grid-cols-3 items-start">
        {/* Latest Posts */}
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-bold mb-6">Latest Articles</h2>
          <div className="grid gap-8 sm:grid-cols-2">
            {LATEST_POSTS.map((post) => (
              <Card key={post.id} className="flex flex-col h-full border-none shadow-none bg-transparent group">
                <div className="h-48 w-full bg-muted rounded-xl mb-4 overflow-hidden relative">
                  <div className="absolute inset-0 bg-primary/5 group-hover:bg-primary/10 transition-colors" />
                </div>
                <CardHeader className="p-0 mb-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-primary mb-2">
                    {post.category}
                  </span>
                  <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors">
                    <Link href={`/blog/${post.id}`}>
                      {post.title}
                    </Link>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0 flex-1">
                  <p className="text-muted-foreground line-clamp-2">{post.excerpt}</p>
                </CardContent>
                <CardFooter className="p-0 mt-4 flex items-center gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {post.date}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {post.readTime}
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>

        {/* Sidebar (Trending & Newsletter) */}
        <div className="lg:col-span-1 space-y-8">
          {/* Trending */}
          <Card className="border-none bg-muted/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Trending Now
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              {TRENDING_POSTS.map((post, i) => (
                <Link key={post.id} href={`/blog/${post.id}`} className="group flex gap-4 items-start">
                  <span className="text-3xl font-bold text-muted-foreground/30 group-hover:text-primary/50 transition-colors">
                    0{i + 1}
                  </span>
                  <h3 className="font-semibold text-sm group-hover:text-primary transition-colors line-clamp-2 mt-1.5">
                    {post.title}
                  </h3>
                </Link>
              ))}
            </CardContent>
          </Card>

          {/* Newsletter */}
          <Card className="bg-primary text-primary-foreground border-none">
            <CardHeader>
              <CardTitle>Subscribe to our newsletter</CardTitle>
              <CardDescription className="text-primary-foreground/80">
                Get the latest insights delivered straight to your inbox every week.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="flex flex-col gap-3">
                <Input 
                  placeholder="Enter your email" 
                  className="bg-primary-foreground text-foreground border-none focus-visible:ring-2 focus-visible:ring-primary-foreground/50 placeholder:text-muted-foreground"
                />
                <Button variant="secondary" className="w-full">
                  Subscribe
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
}

