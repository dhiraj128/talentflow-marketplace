import { PageContainer } from "@/components/shared/PageContainer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Calendar, Clock, Share2, Mail, Link2, Link as LinkIcon } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

// Mock data fetcher
async function getPostData(id: string) {
  // In a real app, this would fetch from an API or CMS based on the ID.
  if (id === "404") return null;

  return {
    id,
    title: "The Future of AI in Recruitment: Beyond Resume Parsing",
    excerpt: "How generative AI and machine learning are fundamentally changing how companies assess talent and cultural fit.",
    content: `
      <p>The recruitment landscape is undergoing a massive transformation. For decades, the process of finding the right candidate involved manually sifting through hundreds of resumes, relying heavily on keyword matching. However, as artificial intelligence evolves, we are moving far beyond simple resume parsing.</p>
      
      <h2>Moving Beyond Keywords</h2>
      <p>Traditional Applicant Tracking Systems (ATS) were revolutionary in their time, allowing recruiters to digitize and search vast databases of candidates. But they had a fatal flaw: they were inherently biased toward candidates who knew how to optimize their resumes with the right keywords, rather than those with the best actual skills or cultural fit.</p>
      <p>Today's AI algorithms can understand context. They can look at a candidate's entire digital footprint, portfolio, and past projects to assess true capability. Instead of just seeing "React developer," the system understands the complexity of the React applications the candidate has built.</p>

      <h2>Evaluating Cultural Fit</h2>
      <p>Perhaps the most exciting application of AI in recruitment is its ability to help predict cultural alignment. By analyzing communication styles, preferred working methods, and core values, AI can suggest matches that are more likely to result in long-term employee retention and satisfaction.</p>
      <blockquote>"The goal of AI in hiring isn't to replace human judgment, but to augment it. By automating the screening of raw technical requirements, we give recruiters the time back to focus on human connection." - David Chen, CTO</blockquote>

      <h2>The Ethical Considerations</h2>
      <p>As we embrace these technologies, we must also be vigilant about the ethical implications. AI models are trained on historical data, which means they can inherit historical biases if not carefully monitored and calibrated.</p>
      <ul>
        <li>Regular auditing of AI hiring algorithms is non-negotiable.</li>
        <li>Transparency with candidates about how their data is being used.</li>
        <li>Maintaining a "human-in-the-loop" approach for final decision making.</li>
      </ul>

      <h2>Conclusion</h2>
      <p>The future of recruitment is undoubtedly AI-driven, but it remains fundamentally human-centric. By leveraging technology to handle the quantitative aspects of matching, we can elevate the qualitative aspects of relationship building.</p>
    `,
    category: "Hiring Trends",
    date: "Oct 12, 2026",
    readTime: "8 min read",
    author: {
      name: "David Chen",
      role: "Chief Technology Officer at Stitch",
      avatar: "DC"
    },
    tags: ["Artificial Intelligence", "Future of Work", "HR Tech"]
  };
}

export default async function BlogPostPage({ params }: { params: { id: string } }) {
  const post = await getPostData(params.id);

  if (!post) {
    notFound();
  }

  return (
    <PageContainer>
      <div className="max-w-3xl mx-auto py-8">
        {/* Back Link */}
        <Button variant="ghost" className="mb-8 -ml-4 text-muted-foreground hover:text-foreground">
          <Link href="/blog">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Blog
          </Link>
        </Button>

        {/* Header */}
        <header className="mb-10">
          <div className="flex items-center gap-2 mb-6 text-sm">
            <span className="font-semibold uppercase tracking-wider text-primary">
              {post.category}
            </span>
            <span className="text-muted-foreground">•</span>
            <span className="text-muted-foreground flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {post.date}
            </span>
            <span className="text-muted-foreground">•</span>
            <span className="text-muted-foreground flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {post.readTime}
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6 leading-tight">
            {post.title}
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8">
            {post.excerpt}
          </p>

          {/* Author info */}
          <div className="flex items-center gap-4 py-6 border-y">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
              {post.author.avatar}
            </div>
            <div>
              <p className="font-semibold">{post.author.name}</p>
              <p className="text-sm text-muted-foreground">{post.author.role}</p>
            </div>
          </div>
        </header>

        {/* Hero Image Placeholder */}
        <div className="w-full h-80 md:h-[450px] bg-muted rounded-2xl mb-12 flex items-center justify-center border">
          <span className="font-bold text-3xl text-muted-foreground/30">Article Hero Image</span>
        </div>

        {/* Content */}
        <div className="flex flex-col md:flex-row gap-10">
          {/* Main Content Body */}
          <article className="md:w-3/4 max-w-none 
            [&>p]:text-lg [&>p]:leading-relaxed [&>p]:mb-6 [&>p]:text-muted-foreground
            [&>h2]:text-2xl [&>h2]:font-bold [&>h2]:mt-10 [&>h2]:mb-4
            [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:mb-6 [&>ul>li]:mb-2 [&>ul>li]:text-muted-foreground
            [&>blockquote]:border-l-4 [&>blockquote]:border-primary [&>blockquote]:bg-muted/30 [&>blockquote]:py-4 [&>blockquote]:px-6 [&>blockquote]:rounded-r-lg [&>blockquote]:mb-6 [&>blockquote]:text-lg [&>blockquote]:italic
            [&_a]:text-primary [&_a]:underline hover:[&_a]:text-primary/80"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
          
          {/* Sidebar / Social Share */}
          <div className="md:w-1/4">
            <div className="sticky top-24 space-y-6">
              <div>
                <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider text-muted-foreground">Share this article</h3>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon" className="rounded-full">
                    <Share2 className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" className="rounded-full">
                    <Link2 className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" className="rounded-full">
                    <Mail className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" className="rounded-full">
                    <LinkIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider text-muted-foreground">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span key={tag} className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
