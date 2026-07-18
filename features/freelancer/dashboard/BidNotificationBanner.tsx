import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell, ChevronRight } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

interface BidNotificationBannerProps {
  count: number;
}

export function BidNotificationBanner({ count }: BidNotificationBannerProps) {
  if (count <= 0) return null;

  return (
    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
      <Card className="bg-gradient-to-r from-amber-500/10 via-orange-500/5 to-transparent border-amber-500/20 overflow-hidden">
        <CardContent className="p-4 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
              <Bell className="w-6 h-6 text-amber-600 animate-pulse" />
            </div>
            <div>
              <h3 className="font-bold text-lg">You have {count} new project {count === 1 ? 'bid' : 'bids'} waiting!</h3>
              <p className="text-sm text-muted-foreground">Employers have requested your services. Respond quickly to improve your ranking.</p>
            </div>
          </div>
          <Link href="#project-invitations">
            <Button className="w-full sm:w-auto bg-amber-600 hover:bg-amber-700 text-white shrink-0">
              View Bids <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        </CardContent>
      </Card>
    </motion.div>
  );
}
