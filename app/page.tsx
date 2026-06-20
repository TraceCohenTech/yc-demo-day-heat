"use client";

import { CountUp } from "@/components/CountUp";
import { Reveal } from "@/components/Reveal";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  Cell, CartesianGrid, PieChart, Pie,
} from "recharts";
import { useState } from "react";

/* ── DATA ── */

type Company = {
  name: string;
  batch: string;
  valuation: number;
  raised: string;
  category: "sleeper" | "hot-won" | "hot-failed" | "moderate";
  story: string;
  industry: string;
  founded: number;
  seedYear?: number;
  seriesAYear?: number;
  unicornYear?: number;
  status: "active" | "public" | "acquired" | "dead";
};

const COMPANIES: Company[] = [
  { name: "Airbnb", batch: "W09", valuation: 84, raised: "$6.4B", category: "sleeper", story: "7+ VC rejections. Sold cereal boxes to survive. Fred Wilson publicly passed.", industry: "Travel", founded: 2008, seedYear: 2009, seriesAYear: 2011, unicornYear: 2014, status: "public" },
  { name: "Stripe", batch: "S09", valuation: 159, raised: "$9.4B", category: "hot-won", story: "First customer in 2 weeks via YC network. Sequoia early.", industry: "Fintech", founded: 2010, seedYear: 2010, seriesAYear: 2012, unicornYear: 2014, status: "active" },
  { name: "Coinbase", batch: "S12", valuation: 43, raised: "$1.9B", category: "sleeper", story: "Only $320K committed when pitching a $1M seed round.", industry: "Crypto", founded: 2012, seedYear: 2012, seriesAYear: 2013, unicornYear: 2017, status: "public" },
  { name: "DoorDash", batch: "S13", valuation: 72, raised: "$2.5B", category: "sleeper", story: "Bottom half of batch at Demo Day. Nearly died in 2017–18.", industry: "Delivery", founded: 2013, seedYear: 2013, seriesAYear: 2014, unicornYear: 2018, status: "public" },
  { name: "Cruise", batch: "W14", valuation: 0, raised: "$16B", category: "hot-failed", story: "Not in TechCrunch's top 8 picks. Peaked at $30B. Pedestrian dragging incident 2023. GM shut down robotaxi unit Dec 2024 after $10B+ losses.", industry: "Autonomous", founded: 2013, seedYear: 2014, seriesAYear: 2015, status: "dead" },
  { name: "Scale AI", batch: "S16", valuation: 29, raised: "$1.6B", category: "hot-won", story: "19-year-old founder. Pivoted during batch. Raised Series A in 2017.", industry: "AI", founded: 2016, seedYear: 2016, seriesAYear: 2017, unicornYear: 2021, status: "active" },
  { name: "Deel", batch: "W19", valuation: 17.3, raised: "$679M", category: "hot-won", story: "TechCrunch top 10 pick. Raised quickly post-Demo Day.", industry: "HR", founded: 2019, seedYear: 2019, seriesAYear: 2020, unicornYear: 2021, status: "active" },
  { name: "Rippling", batch: "W17", valuation: 20.8, raised: "$2B", category: "moderate", story: "Zenefits baggage but closed seed in 2 weeks. 90% repeat backers.", industry: "HR", founded: 2016, seedYear: 2017, seriesAYear: 2019, unicornYear: 2021, status: "active" },
  { name: "OpenSea", batch: "W18", valuation: 0, raised: "$427M", category: "hot-failed", story: "Peaked at $13B during NFT mania. Sold to Coinbase for undisclosed amount at massive loss.", industry: "Crypto", founded: 2017, seedYear: 2018, seriesAYear: 2021, unicornYear: 2021, status: "acquired" },
  { name: "Faire", batch: "W17", valuation: 5.2, raised: "$1.7B", category: "hot-won", story: "Raised $3.4M seed from Khosla shortly after YC. Peaked at $12.6B, down-round to $5.2B.", industry: "Wholesale", founded: 2017, seedYear: 2017, seriesAYear: 2018, unicornYear: 2019, status: "active" },
  { name: "Brex", batch: "W17", valuation: 5.15, raised: "$1.5B", category: "hot-won", story: "Ribbit Capital led $7M Series A pre-Demo Day. Acquired for $5.15B.", industry: "Fintech", founded: 2017, seedYear: 2017, seriesAYear: 2018, unicornYear: 2018, status: "acquired" },
  { name: "Reddit", batch: "S05", valuation: 33, raised: "$1.3B", category: "sleeper", story: "19 years from YC to IPO. Longest timeline of any YC company.", industry: "Social", founded: 2005, seedYear: 2005, seriesAYear: 2007, unicornYear: 2017, status: "public" },
  { name: "Instacart", batch: "S12", valuation: 10, raised: "$2.9B", category: "sleeper", story: "Applied late. Rejected multiple times. Delivered beer to Garry Tan's door.", industry: "Delivery", founded: 2012, seedYear: 2012, seriesAYear: 2013, unicornYear: 2015, status: "public" },
  { name: "Gusto", batch: "W12", valuation: 9.5, raised: "$746M", category: "moderate", story: "Steady builder. No Demo Day hype. Grew into $9.5B company.", industry: "HR", founded: 2011, seedYear: 2012, seriesAYear: 2014, unicornYear: 2019, status: "active" },
  { name: "GitLab", batch: "W15", valuation: 4.7, raised: "$414M", category: "sleeper", story: "All-remote model made fundraising difficult. Series B was a grind. IPO'd, now ~$4.7B.", industry: "Dev Tools", founded: 2011, seedYear: 2015, seriesAYear: 2016, unicornYear: 2019, status: "public" },
  { name: "Flexport", batch: "W14", valuation: 1, raised: "$2.7B", category: "moderate", story: "Logistics. Peaked at $8B. CEO ousted, cratered to ~$1B on secondaries.", industry: "Logistics", founded: 2013, seedYear: 2014, seriesAYear: 2015, unicornYear: 2019, status: "active" },
  { name: "Flock Safety", batch: "S17", valuation: 8.4, raised: "$381M", category: "hot-won", story: "Garry Tan funded seed at Demo Day on the spot. 'Home run.'", industry: "Security", founded: 2017, seedYear: 2017, seriesAYear: 2019, unicornYear: 2021, status: "active" },
  { name: "Dropbox", batch: "S07", valuation: 6.4, raised: "$1.7B", category: "hot-won", story: "Viral demo video. 5K→75K waitlist signups overnight.", industry: "Cloud", founded: 2007, seedYear: 2007, seriesAYear: 2008, unicornYear: 2011, status: "public" },
  { name: "Razorpay", batch: "W15", valuation: 9.2, raised: "$816M", category: "moderate", story: "Payments for India. Valued at $9.2B, preparing IPO.", industry: "Fintech", founded: 2014, seedYear: 2015, seriesAYear: 2016, unicornYear: 2021, status: "active" },
  { name: "Benchling", batch: "S12", valuation: 6.1, raised: "$412M", category: "moderate", story: "Biotech tools. Quiet grower to $6.1B valuation.", industry: "Biotech", founded: 2012, seedYear: 2013, seriesAYear: 2016, unicornYear: 2021, status: "active" },
  { name: "Checkr", batch: "S14", valuation: 1.2, raised: "$679M", category: "hot-won", story: "Overwhelming investor interest. Landed Uber immediately. Peaked at $5.7B, marked down to ~$1.2B.", industry: "HR", founded: 2014, seedYear: 2014, seriesAYear: 2016, unicornYear: 2019, status: "active" },
  { name: "Fivetran", batch: "W13", valuation: 5.6, raised: "$853M", category: "moderate", story: "Data integration. Scaled steadily from YC check.", industry: "Data", founded: 2012, seedYear: 2013, seriesAYear: 2018, unicornYear: 2021, status: "active" },
  { name: "Rappi", batch: "W16", valuation: 5.2, raised: "$2.3B", category: "moderate", story: "Latin American delivery super-app.", industry: "Delivery", founded: 2015, seedYear: 2016, seriesAYear: 2017, unicornYear: 2019, status: "active" },
  { name: "Zapier", batch: "S12", valuation: 5, raised: "$1.4M", category: "sleeper", story: "Bootstrapped from Missouri. Only ever raised $1.3M total.", industry: "Automation", founded: 2011, seedYear: 2012, status: "active" },
  { name: "Webflow", batch: "S13", valuation: 4, raised: "$335M", category: "sleeper", story: "Credit card debt. Failed Kickstarter. 6 years to raise first VC.", industry: "Dev Tools", founded: 2013, seedYear: 2019, seriesAYear: 2019, unicornYear: 2022, status: "active" },
  { name: "Meesho", batch: "S16", valuation: 9, raised: "$1.4B", category: "moderate", story: "Social commerce India. IPO'd Dec 2025. Market cap ~$9B.", industry: "E-commerce", founded: 2015, seedYear: 2016, seriesAYear: 2018, unicornYear: 2021, status: "public" },
  { name: "EquipmentShare", batch: "W15", valuation: 5.7, raised: "$3.5B", category: "moderate", story: "Construction equipment rental. IPO'd Jan 2026 on NASDAQ.", industry: "Construction", founded: 2014, seedYear: 2015, seriesAYear: 2017, unicornYear: 2022, status: "public" },
  { name: "Whatnot", batch: "W20", valuation: 11.5, raised: "$710M", category: "sleeper", story: "100+ investor meetings. Raised from friends. Pivoted post-Demo Day. Series F at $11.5B.", industry: "E-commerce", founded: 2019, seedYear: 2020, seriesAYear: 2021, unicornYear: 2022, status: "active" },
  { name: "GOAT Group", batch: "W11", valuation: 3.7, raised: "$493M", category: "sleeper", story: "Original YC company (GrubWithUs) failed. Years of middling ideas before pivot.", industry: "E-commerce", founded: 2015, seedYear: 2016, seriesAYear: 2017, unicornYear: 2020, status: "active" },
  { name: "GrubMarket", batch: "W15", valuation: 4.5, raised: "$549M", category: "moderate", story: "Food marketplace. Series H Feb 2026.", industry: "Food", founded: 2014, seedYear: 2015, seriesAYear: 2016, unicornYear: 2021, status: "active" },
  { name: "Segment", batch: "S11", valuation: 3.2, raised: "$284M", category: "sleeper", story: "Demo Day product was a classroom tool that flopped. Pivoted entirely.", industry: "Analytics", founded: 2011, seedYear: 2012, seriesAYear: 2014, unicornYear: 2019, status: "acquired" },
  { name: "Groww", batch: "W18", valuation: 9, raised: "$393M", category: "moderate", story: "Indian investing platform. IPO'd Nov 2025. Market cap ~$9B.", industry: "Fintech", founded: 2016, seedYear: 2018, seriesAYear: 2019, unicornYear: 2021, status: "public" },
  { name: "Podium", batch: "W16", valuation: 3, raised: "$419M", category: "moderate", story: "Customer engagement platform.", industry: "SaaS", founded: 2014, seedYear: 2016, seriesAYear: 2017, unicornYear: 2021, status: "active" },
  { name: "Twitch", batch: "S07", valuation: 0.97, raised: "$35M", category: "moderate", story: "Started as Justin.tv. Pivoted to gaming streams. $970M Amazon exit.", industry: "Streaming", founded: 2007, seedYear: 2007, seriesAYear: 2008, status: "acquired" },
  { name: "Algolia", batch: "W14", valuation: 2.25, raised: "$334M", category: "moderate", story: "Search API. $2.25B valuation.", industry: "Dev Tools", founded: 2012, seedYear: 2014, seriesAYear: 2015, unicornYear: 2021, status: "active" },
  { name: "PagerDuty", batch: "S10", valuation: 0.66, raised: "$524M", category: "moderate", story: "Already had paying customers at YC. IPO'd. Stock declined to ~$660M market cap.", industry: "DevOps", founded: 2009, seedYear: 2010, seriesAYear: 2013, status: "public" },
  { name: "Mixpanel", batch: "S09", valuation: 1, raised: "$277M", category: "moderate", story: "Analytics. Same batch as Stripe.", industry: "Analytics", founded: 2009, seedYear: 2009, seriesAYear: 2012, status: "active" },
  { name: "Amplitude", batch: "W12", valuation: 0.87, raised: "$336M", category: "moderate", story: "Product analytics. IPO'd. Market cap ~$870M.", industry: "Analytics", founded: 2012, seedYear: 2013, seriesAYear: 2015, status: "public" },
  { name: "PlanGrid", batch: "W12", valuation: 0.875, raised: "$69M", category: "moderate", story: "Construction tech. Acquired by Autodesk for $875M.", industry: "Construction", founded: 2011, seedYear: 2012, seriesAYear: 2014, status: "acquired" },
  { name: "Heroku", batch: "W08", valuation: 0.212, raised: "$13M", category: "moderate", story: "Cloud platform. Acquired by Salesforce for $212M.", industry: "Cloud", founded: 2007, seedYear: 2008, seriesAYear: 2009, status: "acquired" },
  { name: "Zenefits", batch: "W13", valuation: 0, raised: "$584M", category: "hot-failed", story: "a16z Series A. $4.5B peak valuation. CEO ousted for fraud.", industry: "HR", founded: 2013, seedYear: 2013, seriesAYear: 2014, unicornYear: 2015, status: "dead" },
  { name: "Parker", batch: "W19", valuation: 0, raised: "$200M+", category: "hot-failed", story: "Peter Thiel's Valar Ventures led. $65M revenue. Chapter 7 bankruptcy.", industry: "Fintech", founded: 2019, seedYear: 2019, seriesAYear: 2020, status: "dead" },
  { name: "Embark Trucks", batch: "W16", valuation: 0, raised: "$317M", category: "hot-failed", story: "SPAC at $5.2B. Stock crashed to $60M. Shut down 2023.", industry: "Autonomous", founded: 2016, seedYear: 2016, seriesAYear: 2018, status: "dead" },
  { name: "Momentus", batch: "S18", valuation: 0, raised: "$160M", category: "hot-failed", story: "SPAC at $1B+. SEC fraud charges. Collapsed.", industry: "Space", founded: 2017, seedYear: 2018, seriesAYear: 2019, status: "dead" },
  { name: "Atrium", batch: "S07", valuation: 0, raised: "$75.5M", category: "hot-failed", story: "Justin Kan (sold Twitch for $970M). a16z backed. Shut down 2020.", industry: "Legal", founded: 2017, seedYear: 2017, seriesAYear: 2018, status: "dead" },
  { name: "Notable Labs", batch: "W15", valuation: 0, raised: "$55M", category: "hot-failed", story: "Public biotech company. Filed for bankruptcy Oct 2024.", industry: "Biotech", founded: 2014, seedYear: 2015, seriesAYear: 2017, status: "dead" },
  { name: "Homejoy", batch: "W10", valuation: 0, raised: "$40M", category: "hot-failed", story: "Massive Demo Day buzz. On-demand cleaning. Shut down 2015.", industry: "Services", founded: 2012, seedYear: 2012, seriesAYear: 2013, status: "dead" },
  { name: "SpoonRocket", batch: "S13", valuation: 0, raised: "$13.5M", category: "hot-failed", story: "TechCrunch top 8. $2M run rate. 112% weekly growth. Dead by 2016.", industry: "Delivery", founded: 2013, seedYear: 2013, seriesAYear: 2014, status: "dead" },
  { name: "Mattermark", batch: "S12", valuation: 0, raised: "$17M", category: "hot-failed", story: "a16z + Foundry. Fire-sold for <$1M. Stock worthless.", industry: "Data", founded: 2012, seedYear: 2012, seriesAYear: 2014, status: "dead" },
  { name: "Buttercoin", batch: "S13", valuation: 0, raised: "Funded", category: "hot-failed", story: "TechCrunch top 8. Bitcoin exchange. Dead by April 2015.", industry: "Crypto", founded: 2013, seedYear: 2013, status: "dead" },
  { name: "Standard Treasury", batch: "S13", valuation: 0, raised: "Funded", category: "hot-failed", story: "TechCrunch top 8. Banking API. Acqui-hired by SVB.", industry: "Fintech", founded: 2013, seedYear: 2013, status: "acquired" },
  { name: "Dating Ring", batch: "W14", valuation: 0, raised: "Funded", category: "hot-failed", story: "TechCrunch's #2 pick. 60% MoM growth. Shut down 2018.", industry: "Consumer", founded: 2014, seedYear: 2014, status: "dead" },
  { name: "Kimono Labs", batch: "W14", valuation: 0, raised: "Funded", category: "hot-failed", story: "TechCrunch top 8. 20K devs. Acqui-hired by Palantir.", industry: "Dev Tools", founded: 2014, seedYear: 2014, status: "acquired" },
  { name: "ZeroDown", batch: "W19", valuation: 0, raised: "$10M+", category: "hot-failed", story: "Raised $10M+ pre-Demo Day at $75M valuation. Shut down.", industry: "Real Estate", founded: 2018, seedYear: 2019, status: "dead" },
  { name: "Flockjay", batch: "W19", valuation: 0, raised: "Funded", category: "hot-failed", story: "TechCrunch top 10. 40% job placement rate. Shut down ~2022.", industry: "Education", founded: 2018, seedYear: 2019, status: "dead" },
  { name: "Retool", batch: "W17", valuation: 3.2, raised: "$445M", category: "moderate", story: "Internal tools builder. Quiet Demo Day but became default for ops teams.", industry: "Dev Tools", founded: 2017, seedYear: 2017, seriesAYear: 2019, unicornYear: 2021, status: "active" },
  { name: "Ramp", batch: "W19", valuation: 44, raised: "$2.35B", category: "hot-won", story: "Raised fast post-Demo Day. Series F at $44B (June 2026). Fastest-growing YC fintech.", industry: "Fintech", founded: 2019, seedYear: 2019, seriesAYear: 2020, unicornYear: 2021, status: "active" },
  { name: "Vanta", batch: "W18", valuation: 2.45, raised: "$353M", category: "moderate", story: "SOC 2 compliance automation. Steady growth to $2.45B.", industry: "Security", founded: 2018, seedYear: 2018, seriesAYear: 2020, unicornYear: 2022, status: "active" },
  { name: "Applied Intuition", batch: "S17", valuation: 15, raised: "$1.05B", category: "sleeper", story: "AV simulation tools. Under the radar at Demo Day. Series F at $15B.", industry: "Autonomous", founded: 2017, seedYear: 2017, seriesAYear: 2019, unicornYear: 2021, status: "active" },
  { name: "Lattice", batch: "W16", valuation: 3, raised: "$329M", category: "moderate", story: "People management platform. Steady SaaS grower.", industry: "HR", founded: 2015, seedYear: 2016, seriesAYear: 2017, unicornYear: 2021, status: "active" },
  { name: "Ironclad", batch: "S15", valuation: 3.2, raised: "$333M", category: "moderate", story: "Contract lifecycle management. Accel-backed.", industry: "Legal", founded: 2014, seedYear: 2015, seriesAYear: 2017, unicornYear: 2022, status: "active" },
  { name: "Zip", batch: "S20", valuation: 2.2, raised: "$370M", category: "hot-won", story: "Procurement platform. Raised $1.7M at Demo Day, then exploded.", industry: "SaaS", founded: 2020, seedYear: 2020, seriesAYear: 2021, unicornYear: 2022, status: "active" },
  { name: "Zepto", batch: "W21", valuation: 7, raised: "$2.3B", category: "hot-won", story: "10-minute grocery delivery in India. Two 19-year-old Stanford dropouts. 640M+ orders in FY2026. Filing for IPO.", industry: "Delivery", founded: 2020, seedYear: 2021, seriesAYear: 2021, unicornYear: 2023, status: "active" },
  { name: "Supabase", batch: "S20", valuation: 10.5, raised: "$544M", category: "hot-won", story: "Open-source Firebase alternative exploded via vibe-coding wave. Doubled valuation in 8 months to $10.5B.", industry: "Dev Tools", founded: 2020, seedYear: 2020, seriesAYear: 2021, unicornYear: 2024, status: "active" },
  { name: "Replit", batch: "W18", valuation: 9, raised: "$400M+", category: "hot-won", story: "Browser-based IDE became AI coding juggernaut. $525M ARR, tripled valuation in 6 months to $9B.", industry: "AI", founded: 2016, seedYear: 2018, seriesAYear: 2020, unicornYear: 2025, status: "active" },
  { name: "Lambda", batch: "S17", valuation: 2.9, raised: "$628M", category: "sleeper", story: "Started as a face recognition API. Pivoted to GPU cloud for AI training.", industry: "AI", founded: 2017, seedYear: 2017, seriesAYear: 2019, unicornYear: 2023, status: "active" },
  { name: "Ginkgo Bioworks", batch: "S14", valuation: 0.4, raised: "$2.8B", category: "hot-failed", story: "SPAC at $17.5B valuation. Stock crashed 97%. Synthetic biology hype cycle.", industry: "Biotech", founded: 2009, seedYear: 2014, seriesAYear: 2015, unicornYear: 2020, status: "public" },
  { name: "Convoy", batch: "W15", valuation: 0, raised: "$900M", category: "hot-failed", story: "Jeff Bezos invested. Valued at $3.8B. Shut down Oct 2023.", industry: "Logistics", founded: 2015, seedYear: 2015, seriesAYear: 2017, unicornYear: 2019, status: "dead" },
  { name: "Pebble", batch: "S11", valuation: 0, raised: "$16M+", category: "sleeper", story: "Kickstarter record $10M. Sold to Fitbit for parts. Pioneer that lost to Apple Watch.", industry: "Hardware", founded: 2012, seedYear: 2012, status: "dead" },
  { name: "Docker", batch: "S10", valuation: 2.1, raised: "$392M", category: "sleeper", story: "Applied as dotCloud (PaaS). Container side project became the product.", industry: "Dev Tools", founded: 2008, seedYear: 2010, seriesAYear: 2013, unicornYear: 2015, status: "active" },
  { name: "Weebly", batch: "W07", valuation: 0.35, raised: "$35M", category: "moderate", story: "Website builder. Acquired by Square for $365M in 2018.", industry: "Dev Tools", founded: 2006, seedYear: 2007, seriesAYear: 2012, status: "acquired" },
  { name: "Optimizely", batch: "W10", valuation: 0.6, raised: "$251M", category: "moderate", story: "A/B testing. Acquired by Episerver for ~$600M.", industry: "Analytics", founded: 2010, seedYear: 2010, seriesAYear: 2013, status: "acquired" },
  { name: "Machine Zone", batch: "S08", valuation: 0.8, raised: "$8M", category: "sleeper", story: "Game of War made $1B+/year. Kate Upton Super Bowl ads. Peak $5B. Acquired by Tripledot for $800M.", industry: "Gaming", founded: 2008, seedYear: 2008, unicornYear: 2014, status: "acquired" },
  { name: "Gumroad", batch: "S11", valuation: 0.1, raised: "$8M", category: "sleeper", story: "Sahil Lavingia's creator platform. Failed to raise Series B. Rebuilt as solo founder.", industry: "E-commerce", founded: 2011, seedYear: 2012, seriesAYear: 2012, status: "active" },
  { name: "Sendbird", batch: "W16", valuation: 1.05, raised: "$221M", category: "moderate", story: "Chat API for apps. Grew to unicorn status from South Korea.", industry: "Dev Tools", founded: 2013, seedYear: 2016, seriesAYear: 2018, unicornYear: 2021, status: "active" },
  { name: "Kalshi", batch: "W19", valuation: 1, raised: "$166M", category: "hot-won", story: "CFTC-regulated prediction market. Bet on elections going mainstream.", industry: "Fintech", founded: 2018, seedYear: 2019, seriesAYear: 2021, unicornYear: 2024, status: "active" },
  { name: "PostHog", batch: "W20", valuation: 1.4, raised: "$180M", category: "sleeper", story: "Pivoted 6 times in 6 months, launched MVP on Hacker News, hit 1,500 GitHub stars in 2 weeks. Open-source product analytics unicorn.", industry: "Analytics", founded: 2020, seedYear: 2020, seriesAYear: 2021, unicornYear: 2025, status: "active" },
  { name: "Relativity Space", batch: "S16", valuation: 4.2, raised: "$1.3B", category: "hot-won", story: "3D-printed rockets. Raised at $4.2B valuation. First launch 2023.", industry: "Space", founded: 2015, seedYear: 2016, seriesAYear: 2018, unicornYear: 2021, status: "active" },
  { name: "Boom Supersonic", batch: "W16", valuation: 1.5, raised: "$700M", category: "moderate", story: "Building supersonic jets. United ordered 15. Series B at $1.5B, far below hype.", industry: "Aviation", founded: 2014, seedYear: 2016, seriesAYear: 2017, unicornYear: 2024, status: "active" },
  { name: "Airtable", batch: "W12", valuation: 4, raised: "$1.4B", category: "sleeper", story: "Spreadsheet-database hybrid. Barely got into YC. Peaked at $11.7B, secondary ~$4B.", industry: "SaaS", founded: 2012, seedYear: 2013, seriesAYear: 2015, unicornYear: 2018, status: "active" },
  { name: "Loom", batch: "S16", valuation: 1.53, raised: "$203M", category: "moderate", story: "Async video messaging. Acquired by Atlassian for $975M.", industry: "SaaS", founded: 2015, seedYear: 2016, seriesAYear: 2019, status: "acquired" },
  { name: "Wufoo", batch: "W06", valuation: 0.035, raised: "$118K", category: "sleeper", story: "Only raised $118K ever. Acquired by SurveyMonkey for $35M. Pure YC ethos.", industry: "SaaS", founded: 2006, seedYear: 2006, status: "acquired" },
  { name: "Socialcam", batch: "W12", valuation: 0.06, raised: "$8M", category: "hot-won", story: "Video sharing app. Hit #1 in App Store. Acquired by Autodesk for $60M in 6 months.", industry: "Social", founded: 2012, seedYear: 2012, status: "acquired" },
  { name: "Panorama Education", batch: "S13", valuation: 0.4, raised: "$105M", category: "moderate", story: "Mark Zuckerberg's first angel investment. K-12 data analytics.", industry: "Education", founded: 2012, seedYear: 2013, seriesAYear: 2015, status: "active" },
  { name: "Cal.com", batch: "W19", valuation: 0.3, raised: "$32M", category: "moderate", story: "Open-source Calendly alternative. Rebranded from Calendso.", industry: "SaaS", founded: 2020, seedYear: 2021, seriesAYear: 2022, status: "active" },
  { name: "Mintlify", batch: "W22", valuation: 0.15, raised: "$20M", category: "moderate", story: "Developer docs platform. AI-powered documentation.", industry: "Dev Tools", founded: 2022, seedYear: 2022, seriesAYear: 2023, status: "active" },
  { name: "Roboflow", batch: "S20", valuation: 0.3, raised: "$24M", category: "moderate", story: "Computer vision infrastructure. Used by 250K+ developers.", industry: "AI", founded: 2019, seedYear: 2020, seriesAYear: 2022, status: "active" },
  { name: "Lever", batch: "S12", valuation: 0.5, raised: "$122M", category: "moderate", story: "Recruiting ATS. Acquired by Employ Inc. Steady SaaS play.", industry: "HR", founded: 2012, seedYear: 2013, seriesAYear: 2015, status: "acquired" },
  { name: "ReadMe", batch: "W15", valuation: 0.2, raised: "$37M", category: "moderate", story: "Interactive API documentation. Developer tools niche.", industry: "Dev Tools", founded: 2014, seedYear: 2015, seriesAYear: 2019, status: "active" },
  { name: "Stytch", batch: "W21", valuation: 1, raised: "$210M", category: "hot-won", story: "Auth infrastructure. Raised at $1B within 18 months of YC.", industry: "Security", founded: 2020, seedYear: 2021, seriesAYear: 2021, unicornYear: 2022, status: "active" },
  { name: "Monzo", batch: "S16", valuation: 6.5, raised: "$1.1B", category: "hot-won", story: "UK neobank. Coral debit card became a status symbol. 9M+ customers. Preparing London IPO.", industry: "Fintech", founded: 2015, seedYear: 2015, seriesAYear: 2016, unicornYear: 2018, status: "active" },
  { name: "Teespring", batch: "W13", valuation: 0, raised: "$56M", category: "hot-failed", story: "Custom merch platform. a16z led $55M Series B. Revenue collapsed. Rebranded to Spring.", industry: "E-commerce", founded: 2012, seedYear: 2013, seriesAYear: 2014, status: "dead" },
  { name: "Kustomer", batch: "S14", valuation: 0.25, raised: "$174M", category: "moderate", story: "CRM platform. Acquired by Meta for $1B, then spun out at ~$250M.", industry: "SaaS", founded: 2015, seedYear: 2015, seriesAYear: 2017, unicornYear: 2020, status: "active" },
  { name: "Clearbit", batch: "W14", valuation: 0.5, raised: "$74M", category: "moderate", story: "Data enrichment API. Acquired by HubSpot in 2023.", industry: "Data", founded: 2014, seedYear: 2014, seriesAYear: 2016, status: "acquired" },
  { name: "Vetcove", batch: "S16", valuation: 1.6, raised: "$120M", category: "sleeper", story: "Amazon for veterinarians. Quietly grew to $1.6B. Zero hype at Demo Day.", industry: "Healthcare", founded: 2015, seedYear: 2016, seriesAYear: 2019, unicornYear: 2024, status: "active" },
  { name: "Helion Energy", batch: "W14", valuation: 15.5, raised: "$1.5B", category: "sleeper", story: "Fusion energy startup. Sam Altman became chairman. Contract to power Microsoft. $15.5B.", industry: "Energy", founded: 2013, seedYear: 2014, seriesAYear: 2015, unicornYear: 2021, status: "active" },
  { name: "Vercel", batch: "W21", valuation: 9.3, raised: "$563M", category: "hot-won", story: "Founded as ZEIT. Creators of Next.js. Rode AI cloud wave to $9.3B with $340M ARR.", industry: "Dev Tools", founded: 2015, seedYear: 2016, seriesAYear: 2020, unicornYear: 2021, status: "active" },
  { name: "Verkada", batch: "W17", valuation: 5.8, raised: "$757M", category: "sleeper", story: "Enterprise security cameras sounded boring at Demo Day. Cloud-managed physical security grew to $5.8B.", industry: "Security", founded: 2016, seedYear: 2017, seriesAYear: 2018, unicornYear: 2021, status: "active" },
  { name: "Mercury", batch: "S19", valuation: 5.2, raised: "$546M", category: "sleeper", story: "Banking for startups when neobanks were crowded. 40%+ of YC batches now bank with Mercury.", industry: "Fintech", founded: 2017, seedYear: 2017, seriesAYear: 2020, unicornYear: 2022, status: "active" },
  { name: "Oklo", batch: "S14", valuation: 6.16, raised: "$1.9B", category: "sleeper", story: "Nuclear microreactor company. Sam Altman chairman. Went public via SPAC 2024. ~$6B market cap.", industry: "Nuclear", founded: 2013, seedYear: 2014, seriesAYear: 2016, unicornYear: 2024, status: "public" },
  { name: "Rigetti Computing", batch: "S14", valuation: 6.16, raised: "$298M", category: "moderate", story: "Quantum computing hardware. Went public via SPAC. Volatile but hit $6B amid quantum hype.", industry: "Quantum", founded: 2013, seedYear: 2014, seriesAYear: 2017, unicornYear: 2024, status: "public" },
  { name: "Solugen", batch: "W17", valuation: 2, raised: "$656M", category: "sleeper", story: "Plant-sugar-to-chemicals got modest Demo Day attention. First YC climate tech unicorn.", industry: "Climate", founded: 2016, seedYear: 2017, seriesAYear: 2019, unicornYear: 2022, status: "active" },
  { name: "Substack", batch: "W18", valuation: 1.1, raised: "$190M", category: "moderate", story: "Newsletter platform seemed niche at Demo Day. Rode creator economy wave to unicorn.", industry: "Media", founded: 2017, seedYear: 2018, seriesAYear: 2019, unicornYear: 2025, status: "active" },
  { name: "Matterport", batch: "W12", valuation: 1.6, raised: "$163M", category: "moderate", story: "3D spatial capture for real estate. SPAC'd at $2.9B. Acquired by CoStar for $1.6B.", industry: "Real Estate", founded: 2011, seedYear: 2012, seriesAYear: 2013, unicornYear: 2021, status: "acquired" },
  { name: "Apollo.io", batch: "W16", valuation: 1.6, raised: "$250M", category: "sleeper", story: "Sales intelligence grew slowly for years then exploded to $150M ARR. Capital-efficient unicorn.", industry: "Sales", founded: 2015, seedYear: 2016, seriesAYear: 2021, unicornYear: 2023, status: "active" },
  { name: "Gecko Robotics", batch: "S16", valuation: 1.25, raised: "$354M", category: "sleeper", story: "Wall-climbing inspection robots for power plants. Founded at 19. Took 12 years to unicorn.", industry: "Robotics", founded: 2013, seedYear: 2016, seriesAYear: 2018, unicornYear: 2025, status: "active" },
  { name: "Astranis", batch: "W16", valuation: 2, raised: "$753M", category: "sleeper", story: "Small geostationary satellites. Demo Day investors skeptical of hardware. Now $2B+ with defense contracts.", industry: "Space", founded: 2015, seedYear: 2016, seriesAYear: 2018, unicornYear: 2024, status: "active" },
  { name: "Front", batch: "S14", valuation: 1.7, raised: "$202M", category: "sleeper", story: "Shared inbox for teams seemed incremental. Steadily grew to $100M ARR and $1.7B.", industry: "SaaS", founded: 2013, seedYear: 2014, seriesAYear: 2016, unicornYear: 2022, status: "active" },
  { name: "Clipboard Health", batch: "W17", valuation: 1.3, raised: "$94M", category: "sleeper", story: "Healthcare staffing marketplace. Hit unicorn on just $94M raised — most capital-efficient YC unicorn.", industry: "Healthcare", founded: 2016, seedYear: 2017, seriesAYear: 2021, unicornYear: 2022, status: "active" },
  { name: "Xendit", batch: "S15", valuation: 1, raised: "$530M", category: "sleeper", story: "First Southeast Asian YC company. Pivoted from Bitcoin to payment infrastructure. Processes $15B/year in Indonesia.", industry: "Fintech", founded: 2015, seedYear: 2015, seriesAYear: 2018, unicornYear: 2021, status: "active" },
  { name: "Paystack", batch: "W16", valuation: 0.2, raised: "$11.7M", category: "hot-won", story: "First Nigerian YC company. Processed half of Nigeria's online transactions. Acquired by Stripe for $200M+.", industry: "Fintech", founded: 2015, seedYear: 2016, seriesAYear: 2018, status: "acquired" },
  { name: "Newfront", batch: "W18", valuation: 2.2, raised: "$310M", category: "moderate", story: "Modern commercial insurance brokerage. Digitized old-school industry to $2.2B.", industry: "Insurance", founded: 2017, seedYear: 2018, seriesAYear: 2019, unicornYear: 2022, status: "active" },
  { name: "GoCardless", batch: "S11", valuation: 2.1, raised: "$540M", category: "moderate", story: "UK bank-to-bank payments. One of YC's earliest international successes. Acquired in 2025.", industry: "Fintech", founded: 2011, seedYear: 2012, seriesAYear: 2014, unicornYear: 2022, status: "acquired" },
  { name: "Honeylove", batch: "S18", valuation: 2.3, raised: "$13.2M", category: "sleeper", story: "DTC shapewear by an EDM artist. Only raised $13M. One of YC's most capital-efficient consumer brands.", industry: "DTC", founded: 2018, seedYear: 2018, seriesAYear: 2022, unicornYear: 2022, status: "active" },
  { name: "BillionToOne", batch: "S17", valuation: 1, raised: "$230M", category: "sleeper", story: "Prenatal genetic testing 10x more accurate than competitors. Grew from diagnostics niche to unicorn.", industry: "Biotech", founded: 2016, seedYear: 2017, seriesAYear: 2020, unicornYear: 2023, status: "active" },
  { name: "Stoke Space", batch: "W21", valuation: 2, raised: "$175M", category: "sleeper", story: "Fully reusable rocket by Blue Origin veterans. Quietly building while SpaceX dominates headlines.", industry: "Space", founded: 2019, seedYear: 2021, seriesAYear: 2023, unicornYear: 2024, status: "active" },
  { name: "Go1", batch: "S15", valuation: 2, raised: "$414M", category: "sleeper", story: "Australian corporate learning aggregator. Overlooked at Demo Day. World's largest curated e-learning library.", industry: "EdTech", founded: 2015, seedYear: 2015, seriesAYear: 2017, unicornYear: 2022, status: "active" },
  { name: "Scribd", batch: "S06", valuation: 0.45, raised: "$107M", category: "moderate", story: "One of YC's earliest companies. Pivoted from doc sharing to 'Netflix for books.' Survived 20 years.", industry: "Media", founded: 2006, seedYear: 2006, seriesAYear: 2008, status: "active" },
  { name: "Boosted", batch: "S12", valuation: 0, raised: "$72M", category: "hot-failed", story: "Electric skateboard pioneer with devoted fans. Killed by Trump-era tariffs on Chinese components. Shut down 2020.", industry: "Hardware", founded: 2012, seedYear: 2012, seriesAYear: 2015, status: "dead" },
  { name: "Weave", batch: "W14", valuation: 0.7, raised: "$168M", category: "moderate", story: "Communication platform for small healthcare businesses. Went public on NYSE 2021.", industry: "SaaS", founded: 2008, seedYear: 2015, seriesAYear: 2017, status: "public" },
  // CLASSIC ERA ADDITIONS
  { name: "Loopt", batch: "S05", valuation: 0.043, raised: "$30M", category: "moderate", story: "Sam Altman's first startup. Location-sharing app. Acquired by Green Dot for $43M. Altman went on to run YC and then OpenAI.", industry: "Mobile", founded: 2005, seedYear: 2005, seriesAYear: 2006, status: "acquired" },
  { name: "Xobni", batch: "S06", valuation: 0.06, raised: "$42M", category: "moderate", story: "'Inbox' spelled backwards. Smart email search for Outlook. Yahoo acquired for ~$60M, then shut it down.", industry: "Productivity", founded: 2006, seedYear: 2006, seriesAYear: 2008, status: "dead" },
  { name: "OMGPOP", batch: "S06", valuation: 0.2, raised: "$17M", category: "hot-won", story: "Created Draw Something — 50M downloads in 50 days. Zynga bought for $210M then shut it down within a year.", industry: "Gaming", founded: 2006, seedYear: 2006, seriesAYear: 2007, status: "dead" },
  { name: "Meebo", batch: "W06", valuation: 0.1, raised: "$70M", category: "moderate", story: "Web-based IM aggregator for AIM/Yahoo/MSN. Google acquired for ~$100M to bolster Google+. Shut down shortly after.", industry: "Messaging", founded: 2005, seedYear: 2006, seriesAYear: 2006, status: "dead" },
  { name: "Disqus", batch: "S07", valuation: 0, raised: "$14.6M", category: "moderate", story: "Dominant third-party commenting system used by millions of websites. Acquired by Zeta Global for ad-tech data.", industry: "Web", founded: 2007, seedYear: 2007, seriesAYear: 2011, status: "acquired" },
  { name: "Posterous", batch: "S08", valuation: 0, raised: "$10.1M", category: "moderate", story: "Dead-simple blogging co-founded by Garry Tan (now YC President). Twitter acqui-hired the team, killed the product.", industry: "Social", founded: 2008, seedYear: 2008, seriesAYear: 2010, status: "dead" },
  { name: "Genius", batch: "S11", valuation: 0.4, raised: "$94M", category: "moderate", story: "Started as Rap Genius. a16z $40M Series B. Google briefly de-indexed them for SEO manipulation. Never hit unicorn.", industry: "Media", founded: 2009, seedYear: 2011, seriesAYear: 2012, status: "active" },
  { name: "Codecademy", batch: "S11", valuation: 0.525, raised: "$87.5M", category: "moderate", story: "Taught millions to code for free. One of the most culturally impactful ed-tech companies. Acquired by Skillsoft for $525M.", industry: "EdTech", founded: 2011, seedYear: 2011, seriesAYear: 2012, status: "acquired" },
  { name: "Parse", batch: "S11", valuation: 0.085, raised: "$7M", category: "hot-won", story: "Made mobile backends trivially easy. Facebook acquired for $85M. Shut down in 2017. Open-sourced as Parse Server.", industry: "Dev Tools", founded: 2011, seedYear: 2011, seriesAYear: 2012, status: "dead" },
  { name: "SingleStore", batch: "W11", valuation: 1.3, raised: "$464M", category: "sleeper", story: "Originally MemSQL. Cloud-native distributed SQL combining transactional + analytical workloads. Quiet path to unicorn.", industry: "Data", founded: 2011, seedYear: 2011, seriesAYear: 2013, unicornYear: 2021, status: "active" },
  { name: "Humble Bundle", batch: "W11", valuation: 0, raised: "$4.7M", category: "moderate", story: "Pay-what-you-want game bundles with charity donations. Sequoia-backed. Donated $250M+ to charity. Acquired by IGN.", industry: "Gaming", founded: 2010, seedYear: 2011, seriesAYear: 2012, status: "acquired" },
  { name: "Tilt", batch: "W12", valuation: 0, raised: "$62M", category: "hot-failed", story: "Group payment platform. a16z poured in $62M. Airbnb acqui-hired team for just $12M — massive loss for investors.", industry: "Fintech", founded: 2012, seedYear: 2012, seriesAYear: 2013, status: "dead" },
  { name: "Soylent", batch: "S12", valuation: 0.2, raised: "$82M", category: "moderate", story: "Rob Rhinehart's meal replacement went viral on Hacker News. a16z and GV backed. Controversial but built a real brand.", industry: "Food", founded: 2013, seedYear: 2013, seriesAYear: 2015, status: "active" },
  { name: "Watsi", batch: "W13", valuation: 0, raised: "$5M", category: "moderate", story: "First-ever YC nonprofit. Paul Graham personally championed them. Crowdfunds medical treatments — helped 33K+ people.", industry: "Healthcare", founded: 2012, seedYear: 2013, status: "active" },
  // 2021+ ERA — AI BOOM
  { name: "Anysphere", batch: "S22", valuation: 60, raised: "$3.4B", category: "hot-won", story: "Built Cursor, the AI code editor. $0 to $2B ARR in 3 years. Fastest-growing dev tool in history.", industry: "AI", founded: 2022, seedYear: 2022, seriesAYear: 2023, unicornYear: 2025, status: "active" },
  { name: "Cognition", batch: "S23", valuation: 25, raised: "$1.6B", category: "hot-won", story: "Built Devin, the AI software engineer. Three IOI gold medalists. ARR from $1M to $73M in 9 months.", industry: "AI", founded: 2023, seedYear: 2024, seriesAYear: 2024, unicornYear: 2025, status: "active" },
  { name: "Mercor", batch: "S23", valuation: 10, raised: "$500M+", category: "hot-won", story: "AI recruiting platform pivoted to AI training labor. Three 21-year-old college dropouts became youngest self-made billionaires.", industry: "AI", founded: 2023, seedYear: 2023, seriesAYear: 2024, unicornYear: 2025, status: "active" },
  { name: "Glean", batch: "S19", valuation: 7.2, raised: "$765M", category: "hot-won", story: "AI enterprise search. $300M ARR, up 89% YoY. Used by hundreds of companies.", industry: "AI", founded: 2019, seedYear: 2019, seriesAYear: 2021, unicornYear: 2024, status: "active" },
  { name: "LangChain", batch: "W23", valuation: 1.25, raised: "$260M", category: "hot-won", story: "Open-source LLM framework became default infrastructure for building AI apps. Sequoia + Benchmark backed.", industry: "AI", founded: 2022, seedYear: 2023, seriesAYear: 2024, unicornYear: 2025, status: "active" },
  { name: "Pika", batch: "S23", valuation: 0.7, raised: "$135M", category: "hot-won", story: "Stanford AI PhD dropouts built AI video generation competing with Runway and Sora. Meta explored $500M acquisition.", industry: "AI", founded: 2023, seedYear: 2023, seriesAYear: 2023, status: "active" },
  { name: "Bland AI", batch: "S23", valuation: 0.6, raised: "$106M", category: "hot-won", story: "Rejected by 180 investors during YC. Now handles 3.5M+ AI phone calls per week for 250+ enterprise customers.", industry: "AI", founded: 2023, seedYear: 2023, seriesAYear: 2024, status: "active" },
  { name: "Retell AI", batch: "W24", valuation: 0.5, raised: "$4.6M", category: "sleeper", story: "Voice AI platform. Hit $60M ARR on just $4.6M raised — 650% YoY growth. Insane capital efficiency.", industry: "AI", founded: 2023, seedYear: 2024, status: "active" },
  { name: "Jasper AI", batch: "W22", valuation: 0.5, raised: "$125M", category: "hot-failed", story: "Early generative AI darling for marketing content. Hit $1.5B valuation in 2022. Got crushed by ChatGPT commoditizing its core use case.", industry: "AI", founded: 2021, seedYear: 2021, seriesAYear: 2022, unicornYear: 2022, status: "active" },
  { name: "Corgi Insurance", batch: "S24", valuation: 2.6, raised: "$108M", category: "hot-won", story: "Full-stack insurance carrier for startups. $630M in Jan 2026, unicorn by May, $2.6B by late May. Fastest YC insurtech ever.", industry: "Insurance", founded: 2024, seedYear: 2024, seriesAYear: 2026, unicornYear: 2026, status: "active" },
  // CLASSIC DEEP DIVE
  { name: "Auctomatic", batch: "W08", valuation: 0.005, raised: "$0.1M", category: "sleeper", story: "Patrick and John Collison's first startup (pre-Stripe). Acquired for $5M. They returned to YC with Stripe in S09.", industry: "E-commerce", founded: 2007, seedYear: 2008, status: "acquired" },
  { name: "Spire Global", batch: "S12", valuation: 0.53, raised: "$290M", category: "moderate", story: "Nanosatellite constellation for weather, maritime, and aviation data. SPAC'd at $1.6B in 2021, now $533M. Ticker: SPIR.", industry: "Space", founded: 2012, seedYear: 2012, seriesAYear: 2015, status: "public" },
  { name: "Triplebyte", batch: "S15", valuation: 0, raised: "$45M", category: "hot-failed", story: "Technical hiring platform by YC partner Harj Taggar. Tried to fix engineering interviews. Struggled, acquired by Karat.", industry: "HR Tech", founded: 2015, seedYear: 2015, seriesAYear: 2018, status: "acquired" },
  // S16-W19 MID ERA
  { name: "Athelas", batch: "S16", valuation: 7, raised: "$136M", category: "sleeper", story: "Started as blood diagnostics device, pivoted to healthcare AI platform (now Commure). $7B valuation on just $136M raised — remarkable capital efficiency.", industry: "Healthcare", founded: 2016, seedYear: 2016, seriesAYear: 2019, unicornYear: 2022, status: "active" },
  { name: "Flutterwave", batch: "S16", valuation: 3.25, raised: "$474M", category: "hot-won", story: "Africa's most valuable startup. Payments infrastructure across 34 African countries. Aiming for Nasdaq IPO.", industry: "Fintech", founded: 2016, seedYear: 2016, seriesAYear: 2018, unicornYear: 2022, status: "active" },
  { name: "Mux", batch: "W16", valuation: 1, raised: "$177M", category: "sleeper", story: "Video API infrastructure for developers. Quietly became the backend for streaming across thousands of companies.", industry: "Dev Tools", founded: 2015, seedYear: 2016, seriesAYear: 2019, unicornYear: 2021, status: "active" },
  { name: "Outschool", batch: "W16", valuation: 3, raised: "$260M", category: "hot-won", story: "Marketplace for live online kids' classes. Exploded during COVID to $3B valuation. Largest platform of its kind.", industry: "EdTech", founded: 2015, seedYear: 2016, seriesAYear: 2019, unicornYear: 2021, status: "active" },
  { name: "MessageBird", batch: "S16", valuation: 1, raised: "$400M", category: "hot-failed", story: "Amsterdam-based Twilio competitor. Bootstrapped profitably for 6 years, hit $3B in 2020. Rebranded to Bird, slashed staff. Fading.", industry: "Communications", founded: 2011, seedYear: 2016, seriesAYear: 2017, unicornYear: 2020, status: "active" },
  { name: "Standard Cognition", batch: "S17", valuation: 0.1, raised: "$236M", category: "hot-failed", story: "Cashierless checkout backed by SoftBank at $1B. Quietly abandoned core product, pivoted to generic AI cameras. Zombie unicorn.", industry: "Retail Tech", founded: 2017, seedYear: 2017, seriesAYear: 2018, unicornYear: 2021, status: "active" },
  { name: "Abnormal Security", batch: "S19", valuation: 5.1, raised: "$534M", category: "hot-won", story: "AI email security detecting phishing and social engineering. $200M ARR. One of the fastest-growing cybersecurity companies ever.", industry: "Security", founded: 2018, seedYear: 2019, seriesAYear: 2020, unicornYear: 2023, status: "active" },
  { name: "Melio", batch: "W19", valuation: 2.5, raised: "$654M", category: "hot-won", story: "B2B payments for SMBs. Raised at $4B peak in 2021. Acquired by Xero for $2.5B — strong exit even if below peak.", industry: "Fintech", founded: 2018, seedYear: 2019, seriesAYear: 2020, unicornYear: 2021, status: "acquired" },
  // W20-W21 ERA
  { name: "Jeeves", batch: "S20", valuation: 2.1, raised: "$380M", category: "hot-won", story: "Global corporate expense management for emerging markets. Hit $1B+ annualized transaction volume within 11 months of launch.", industry: "Fintech", founded: 2020, seedYear: 2020, seriesAYear: 2021, unicornYear: 2022, status: "active" },
  { name: "Airbyte", batch: "W20", valuation: 2, raised: "$181M", category: "sleeper", story: "Pivoted 3 times in their first YC month, landed on open-source ELT data integration. Now the standard with 600+ connectors.", industry: "Data", founded: 2020, seedYear: 2020, seriesAYear: 2021, unicornYear: 2024, status: "active" },
  { name: "Pave", batch: "W20", valuation: 1.6, raised: "$175M", category: "sleeper", story: "Compensation benchmarking used by 900+ companies. One-third of customers from the YC network. Quiet but dominant.", industry: "HR Tech", founded: 2019, seedYear: 2020, seriesAYear: 2021, unicornYear: 2022, status: "active" },
  // S22-S25 AI BOOM
  { name: "Resend", batch: "W23", valuation: 0.15, raised: "$21.5M", category: "hot-won", story: "Built by Zeno Rocha, creator of React Email. Developer-favorite email API displacing SendGrid/Mailgun with beautiful DX.", industry: "Dev Tools", founded: 2023, seedYear: 2023, seriesAYear: 2024, status: "active" },
  { name: "Firecrawl", batch: "S22", valuation: 0.1, raised: "$16.2M", category: "hot-won", story: "Web scraping API built for LLMs. Essential infrastructure for RAG pipelines and AI agents. Backed by Shopify CEO.", industry: "AI", founded: 2024, seedYear: 2024, seriesAYear: 2025, status: "active" },
  { name: "Gumloop", batch: "W24", valuation: 0.3, raised: "$70M", category: "hot-won", story: "No-code AI agent builder used by Shopify, Ramp, Instacart. Aims to be $1B company with just 10 employees.", industry: "AI", founded: 2024, seedYear: 2024, seriesAYear: 2025, status: "active" },
  { name: "Browserbase", batch: "S23", valuation: 0.3, raised: "$67.5M", category: "hot-won", story: "Headless browser infrastructure for AI agents. 88% of Fortune 100 signed up. Backed by Patrick Collison and Guillermo Rauch.", industry: "AI", founded: 2024, seedYear: 2024, seriesAYear: 2024, status: "active" },
  { name: "E2B", batch: "W23", valuation: 0.15, raised: "$35M", category: "hot-won", story: "Open-source sandboxes for AI-generated code execution. Used by Perplexity, Hugging Face, and 88% of Fortune 100.", industry: "AI", founded: 2023, seedYear: 2023, seriesAYear: 2025, status: "active" },
  { name: "Limitless AI", batch: "W22", valuation: 0.37, raised: "$34.3M", category: "hot-won", story: "Built the Limitless Pendant wearable for recording conversations. Pivoted from Rewind screen recording. Acquired by Meta for 'personal superintelligence.'", industry: "AI", founded: 2020, seedYear: 2022, seriesAYear: 2023, status: "acquired" },
  { name: "Letta", batch: "W24", valuation: 0.07, raised: "$10M", category: "sleeper", story: "Spun out of UC Berkeley's MemGPT research. Builds tiered memory for AI agents. Backed by Google's Jeff Dean and Founders Fund.", industry: "AI", founded: 2024, seedYear: 2024, status: "active" },
  { name: "OpenPipe", batch: "S23", valuation: 0, raised: "$7.2M", category: "moderate", story: "Built tools to replace GPT-4 with cheaper fine-tuned models. Acqui-hired by CoreWeave for inference expertise.", industry: "AI", founded: 2023, seedYear: 2024, status: "acquired" },
  { name: "Skyvern", batch: "W24", valuation: 0.02, raised: "$2.7M", category: "sleeper", story: "AI browser automation with 21.9K GitHub stars and 30K+ users. Automates complex web workflows without code.", industry: "AI", founded: 2024, seedYear: 2025, status: "active" },
  // INTERNATIONAL
  { name: "ClearTax", batch: "S14", valuation: 0.7, raised: "$141M", category: "moderate", story: "First India-focused startup to join YC. Automates tax filing for Indian workers and businesses. Rebranded to 'Clear.'", industry: "Fintech", founded: 2011, seedYear: 2014, seriesAYear: 2017, status: "active" },
  { name: "Mono", batch: "W21", valuation: 0.03, raised: "$20M", category: "moderate", story: "'Plaid for Africa.' Powered millions of bank account linkages. First YC-to-YC exit in Africa — acquired by Flutterwave.", industry: "Fintech", founded: 2020, seedYear: 2020, seriesAYear: 2021, status: "acquired" },
];

const sleepers = COMPANIES.filter((c) => c.category === "sleeper");
const hotWon = COMPANIES.filter((c) => c.category === "hot-won");
const hotFailed = COMPANIES.filter((c) => c.category === "hot-failed");

const sleepersTotal = sleepers.reduce((s, c) => s + c.valuation, 0);
const hotFailedRaised = "$1.5B+";

const tcBatches = [
  { batch: "S13", year: 2013, picks: 8, failed: 3, failedNames: "SpoonRocket, Buttercoin, Standard Treasury", missed: "DoorDash ($71B IPO)" },
  { batch: "W14", year: 2014, picks: 8, failed: 5, failedNames: "Dating Ring (#2), Kimono Labs, Boostable, BatteryOS…", missed: "Cruise ($30B exit)" },
  { batch: "W19", year: 2019, picks: 10, failed: 3, failedNames: "Flockjay, Docucharm, Parker (bankrupt)", missed: "Deel ($17.3B)" },
];

const quotes = [
  { who: "Paul Graham", role: "YC Co-founder", text: "The hard part was predicting how tough and ambitious they would become. I learned to maintain a completely open mind about which startups in each batch would turn out to be the stars." },
  { who: "Sam Altman", role: "Former YC President", text: "About 25% of YC companies appear to be on a trajectory for billion-dollar valuations at the end of YC, but only a handful actually achieve it." },
  { who: "Dalton Caldwell", role: "YC Managing Director", text: "Tar pit ideas get enthusiastic Demo Day reception but trap founders. They've been tried since the '90s. The real advice is simpler: just don't die." },
  { who: "Aaron Harris", role: "Former YC Partner", text: "There are no specific events that will automatically get money from an investor. I've seen founders cross $1M ARR and still not be able to raise." },
];

const categoryBreakdown = [
  { name: "Sleepers that won", count: sleepers.length, value: Math.round(sleepersTotal), color: "#FF6600" },
  { name: "Hot & won", count: hotWon.length, value: Math.round(hotWon.reduce((s, c) => s + c.valuation, 0)), color: "#10b981" },
  { name: "Moderate & won", count: COMPANIES.filter(c => c.category === "moderate").length, value: Math.round(COMPANIES.filter(c => c.category === "moderate").reduce((s, c) => s + c.valuation, 0)), color: "#3b82f6" },
  { name: "Hot & failed", count: hotFailed.length, value: 0, color: "#ef4444" },
];

const pieData = [
  { name: "Top 5 (Stripe, Airbnb, DoorDash, Cursor, Ramp)", value: 55, fill: "#FF6600" },
  { name: "Other unicorns", value: 35, fill: "#3b82f6" },
  { name: "Remaining ~90%", value: 10, fill: "#e5e5e5" },
];

const CATEGORY_META: Record<string, { label: string; color: string; bg: string }> = {
  sleeper: { label: "Sleeper", color: "#FF6600", bg: "#FFF3EB" },
  "hot-won": { label: "Hot → Won", color: "#10b981", bg: "#ecfdf5" },
  "hot-failed": { label: "Hot → Failed", color: "#ef4444", bg: "#fef2f2" },
  moderate: { label: "Moderate", color: "#3b82f6", bg: "#eff6ff" },
};

function ValuationBar({ company, maxVal }: { company: Company; maxVal: number }) {
  const pct = company.valuation > 0 ? Math.max((company.valuation / maxVal) * 100, 2) : 0;
  const meta = CATEGORY_META[company.category];
  return (
    <div className="flex items-center gap-3 py-2 group">
      <div className="w-28 sm:w-36 shrink-0 text-right">
        <span className="text-sm font-semibold text-yc-dark">{company.name}</span>
        <span className="text-xs text-neutral-500 ml-1">{company.batch}</span>
      </div>
      <div className="flex-1 relative h-8 rounded bg-neutral-100 overflow-hidden">
        <div
          className="absolute inset-y-0 left-0 rounded transition-all duration-700 ease-out flex items-center"
          style={{ width: `${pct}%`, backgroundColor: meta.color }}
        >
          {pct > 15 && (
            <span className="text-white text-xs font-bold ml-2 whitespace-nowrap">${company.valuation}B</span>
          )}
        </div>
        {pct <= 15 && company.valuation > 0 && (
          <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs font-bold text-neutral-600">${company.valuation}B</span>
        )}
        {company.valuation === 0 && (
          <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs font-bold text-red-500">$0 — Failed</span>
        )}
      </div>
      <div className="hidden sm:block w-20 shrink-0">
        <span className="company-badge text-xs" style={{ backgroundColor: meta.bg, color: meta.color }}>
          {meta.label}
        </span>
      </div>
    </div>
  );
}

export default function Home() {
  const [filter, setFilter] = useState<string>("all");
  const [showAll, setShowAll] = useState(false);

  const maxVal = Math.max(...COMPANIES.map((c) => c.valuation));

  const filteredCompanies = filter === "all" ? COMPANIES : COMPANIES.filter((c) => c.category === filter);
  const sorted = [...filteredCompanies].sort((a, b) => b.valuation - a.valuation);
  const displayed = showAll ? sorted : sorted.slice(0, 20);

  return (
    <main>
      {/* ── HERO ── */}
      <section className="relative overflow-hidden bg-yc-dark min-h-[85vh] sm:min-h-screen flex flex-col justify-center">
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />

        <div className="relative z-10 max-w-5xl mx-auto px-6 sm:px-8 py-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-sm text-white/80 mb-8 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-[#FF6600] pulse-dot" />
            176 companies tracked · 20 years of data
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-8xl font-bold text-white leading-[0.95]">
            Does Demo Day<br />
            hype predict<br />
            <span className="text-[#FF6600]">success?</span>
          </h1>

          <p className="text-lg sm:text-xl text-white/60 mt-8 max-w-xl leading-relaxed">
            We tracked 176 of the most hyped YC companies across 20 years to find out if fundraising momentum at Demo Day predicts long-term outcomes.<br />
            <span className="text-white/90 font-semibold">The answer surprised us.</span>
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-12">
            {[
              { big: "0.09", label: "R² correlation", sub: "Demo Day hype → valuation" },
              { big: "~25%", label: "Look like winners", sub: "at the end of YC batch" },
              { big: "~6%", label: "Actually become", sub: "unicorns ($1B+)" },
              { big: "50%", label: "Ultimately", sub: "fail entirely" },
            ].map((s, i) => (
              <div key={i} className="border border-white/10 rounded-xl p-4 sm:p-5 bg-white/5 backdrop-blur-sm">
                <p className="text-2xl sm:text-3xl font-bold text-[#FF6600] tabular-nums">{s.big}</p>
                <p className="text-sm font-medium text-white/90 mt-1">{s.label}</p>
                <p className="text-xs text-white/50 mt-0.5">{s.sub}</p>
              </div>
            ))}
          </div>

          <p className="text-xs text-white/30 mt-8">Not affiliated with Y Combinator. Independent research by <a href="https://x.com/Trace_Cohen" className="text-[#FF6600]/70 hover:text-[#FF6600]">@Trace_Cohen</a></p>
        </div>
      </section>

      {/* ── THE THESIS ── */}
      <section className="max-w-5xl mx-auto px-6 sm:px-8 py-16 sm:py-24">
        <Reveal>
          <div className="max-w-3xl">
            <div className="inline-block px-3 py-1 rounded-full bg-[#FFF3EB] text-[#FF6600] text-xs font-bold uppercase tracking-widest mb-4">The Thesis</div>
            <h2 className="text-3xl sm:text-5xl font-bold text-yc-dark leading-tight">
              The companies nobody wanted<br />
              are worth <span className="text-[#FF6600]">${Math.round(sleepersTotal)}B+</span> today.
            </h2>
            <p className="text-neutral-600 mt-4 text-base sm:text-lg leading-relaxed max-w-2xl">
              Airbnb was rejected 7+ times. DoorDash was bottom half of its batch. Coinbase couldn&apos;t fill a $1M round. Meanwhile, the companies investors fought over at Demo Day? Many raised hundreds of millions — and are now worth $0.
            </p>
          </div>
        </Reveal>

        <Reveal delay={100}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-12">
            <div className="rounded-2xl border-2 border-[#FF6600]/20 bg-[#FFF3EB] p-6">
              <p className="text-sm font-bold text-[#FF6600] uppercase tracking-wider">The Sleepers</p>
              <p className="text-4xl sm:text-5xl font-bold text-yc-dark mt-2">
                $<CountUp to={Math.round(sleepersTotal)} duration={2000} />B+
              </p>
              <p className="text-neutral-600 text-sm mt-2">Combined valuation of {sleepers.length} companies that were overlooked or struggled at Demo Day</p>
              <div className="flex flex-wrap gap-2 mt-4">
                {sleepers.slice(0, 8).map((c) => (
                  <span key={c.name} className="company-badge bg-white text-yc-dark text-xs border border-[#FF6600]/20">
                    {c.name} <span className="text-neutral-400">{c.batch}</span>
                  </span>
                ))}
                {sleepers.length > 8 && <span className="company-badge bg-white text-neutral-500 text-xs border border-neutral-200">+{sleepers.length - 8} more</span>}
              </div>
            </div>

            <div className="rounded-2xl border-2 border-red-200 bg-red-50 p-6">
              <p className="text-sm font-bold text-red-600 uppercase tracking-wider">The Darlings That Died</p>
              <p className="text-4xl sm:text-5xl font-bold text-yc-dark mt-2">$0</p>
              <p className="text-neutral-600 text-sm mt-2">{hotFailed.length} companies that were hyped at Demo Day but raised {hotFailedRaised} and failed</p>
              <div className="flex flex-wrap gap-2 mt-4">
                {hotFailed.slice(0, 8).map((c) => (
                  <span key={c.name} className="company-badge bg-white text-yc-dark text-xs border border-red-200">
                    {c.name} <span className="text-neutral-400">{c.raised}</span>
                  </span>
                ))}
                {hotFailed.length > 8 && <span className="company-badge bg-white text-neutral-500 text-xs border border-neutral-200">+{hotFailed.length - 8} more</span>}
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ── VALUATION BAR RACE ── */}
      <section className="bg-white border-y border-neutral-200">
        <div className="max-w-5xl mx-auto px-6 sm:px-8 py-16 sm:py-24">
          <Reveal>
            <div className="inline-block px-3 py-1 rounded-full bg-[#FFF3EB] text-[#FF6600] text-xs font-bold uppercase tracking-widest mb-4">The Data</div>
            <h2 className="text-3xl sm:text-5xl font-bold text-yc-dark">Every company, ranked</h2>
            <p className="text-neutral-500 mt-2 text-sm sm:text-base">Orange = sleepers nobody wanted. Green = hot from day 1. Blue = moderate. Red = hot but failed.</p>
          </Reveal>

          <Reveal delay={100}>
            <div className="flex flex-wrap gap-2 mt-6 mb-4">
              {[
                { key: "all", label: "All" },
                { key: "sleeper", label: "Sleepers" },
                { key: "hot-won", label: "Hot → Won" },
                { key: "hot-failed", label: "Hot → Failed" },
                { key: "moderate", label: "Moderate" },
              ].map((f) => (
                <button
                  key={f.key}
                  onClick={() => { setFilter(f.key); setShowAll(false); }}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition active:scale-[0.97] ${
                    filter === f.key
                      ? "bg-yc-dark text-white"
                      : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </Reveal>

          <div className="mt-4 space-y-0.5">
            {displayed.map((c) => (
              <ValuationBar key={c.name} company={c} maxVal={maxVal} />
            ))}
          </div>
          {sorted.length > 20 && !showAll && (
            <button
              onClick={() => setShowAll(true)}
              className="mt-6 px-6 py-3 bg-yc-dark text-white rounded-full text-sm font-semibold hover:bg-neutral-800 transition active:scale-[0.97]"
            >
              Show all {sorted.length} companies
            </button>
          )}
        </div>
      </section>

      {/* ── SLEEPER STORIES ── */}
      <section className="max-w-5xl mx-auto px-6 sm:px-8 py-16 sm:py-24">
        <Reveal>
          <div className="inline-block px-3 py-1 rounded-full bg-[#FFF3EB] text-[#FF6600] text-xs font-bold uppercase tracking-widest mb-4">Sleeper Stories</div>
          <h2 className="text-3xl sm:text-5xl font-bold text-yc-dark">Nobody wanted them.</h2>
          <p className="text-neutral-500 mt-2 text-sm sm:text-base">These companies were rejected, ignored, or struggled to raise at Demo Day. They went on to be worth billions.</p>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
          {sleepers.map((c, i) => (
            <Reveal key={c.name} delay={Math.min(i * 30, 150)}>
              <div className="rounded-2xl border border-neutral-200 bg-white p-5 h-full hover:border-[#FF6600]/40 hover:shadow-lg transition-all duration-200">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-yc-dark">{c.name}</h3>
                    <p className="text-xs text-neutral-500 font-mono">{c.batch} · {c.industry}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-[#FF6600]">${c.valuation}B</p>
                  </div>
                </div>
                <p className="text-sm text-neutral-600 mt-3 leading-relaxed">{c.story}</p>
                <div className="mt-3 pt-3 border-t border-neutral-100">
                  <p className="text-xs text-neutral-400">Raised {c.raised} total</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── HOT FAILURES ── */}
      <section className="bg-yc-dark">
        <div className="max-w-5xl mx-auto px-6 sm:px-8 py-16 sm:py-24">
          <Reveal>
            <div className="inline-block px-3 py-1 rounded-full bg-red-500/20 text-red-400 text-xs font-bold uppercase tracking-widest mb-4">The Graveyard</div>
            <h2 className="text-3xl sm:text-5xl font-bold text-white">Everyone fought over them.</h2>
            <p className="text-white/50 mt-2 text-sm sm:text-base">These companies were the hottest at Demo Day. Top VC firms piled in. They raised hundreds of millions. They&apos;re all dead.</p>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
            {hotFailed.map((c, i) => (
              <Reveal key={c.name} delay={Math.min(i * 30, 150)}>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-5 h-full backdrop-blur-sm hover:border-red-500/40 transition-all duration-200">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-white">{c.name}</h3>
                      <p className="text-xs text-white/40 font-mono">{c.batch} · {c.industry}</p>
                    </div>
                    <span className="text-xs font-bold text-red-400 bg-red-500/20 px-2 py-1 rounded-full">DEAD</span>
                  </div>
                  <p className="text-sm text-white/60 mt-3 leading-relaxed">{c.story}</p>
                  <div className="mt-3 pt-3 border-t border-white/10">
                    <p className="text-xs text-white/30">Raised {c.raised}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── TECHCRUNCH PICKS ── */}
      <section className="max-w-5xl mx-auto px-6 sm:px-8 py-16 sm:py-24">
        <Reveal>
          <div className="inline-block px-3 py-1 rounded-full bg-[#FFF3EB] text-[#FF6600] text-xs font-bold uppercase tracking-widest mb-4">TechCrunch Cross-Reference</div>
          <h2 className="text-3xl sm:text-5xl font-bold text-yc-dark">The pundits were wrong.<br />Every. Single. Time.</h2>
          <p className="text-neutral-500 mt-2 text-sm sm:text-base max-w-2xl">In every batch we tracked, TechCrunch&apos;s &ldquo;Top Picks&rdquo; missed the actual biggest winner.</p>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          {tcBatches.map((b, i) => (
            <Reveal key={b.batch} delay={i * 50}>
              <div className="rounded-2xl border border-neutral-200 bg-white p-6 h-full">
                <div className="flex items-baseline justify-between">
                  <h3 className="text-2xl font-bold text-yc-dark">{b.batch}</h3>
                  <span className="text-xs text-neutral-400">{b.year}</span>
                </div>

                <div className="mt-4 flex items-center gap-3">
                  <div className="flex-1 h-3 rounded-full bg-neutral-100 overflow-hidden">
                    <div className="h-full bg-red-500 rounded-full" style={{ width: `${(b.failed / b.picks) * 100}%` }} />
                  </div>
                  <span className="text-sm font-bold text-red-600">{b.failed}/{b.picks}</span>
                </div>
                <p className="text-xs text-neutral-500 mt-1">top picks failed or acqui-hired</p>

                <div className="mt-4 p-3 rounded-xl bg-[#FFF3EB] border border-[#FF6600]/20">
                  <p className="text-xs font-bold text-[#FF6600]">BIGGEST WINNER NOT PICKED</p>
                  <p className="text-sm font-semibold text-yc-dark mt-1">{b.missed}</p>
                </div>

                <p className="text-xs text-neutral-400 mt-3 leading-relaxed">{b.failedNames}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── POWER LAW ── */}
      <section className="bg-white border-y border-neutral-200">
        <div className="max-w-5xl mx-auto px-6 sm:px-8 py-16 sm:py-24">
          <Reveal>
            <div className="inline-block px-3 py-1 rounded-full bg-[#FFF3EB] text-[#FF6600] text-xs font-bold uppercase tracking-widest mb-4">Power Law</div>
            <h2 className="text-3xl sm:text-5xl font-bold text-yc-dark">5 companies = 55%+ of all value</h2>
            <p className="text-neutral-500 mt-2 text-sm sm:text-base max-w-2xl">
              YC&apos;s returns follow an extreme power law. Stripe, Airbnb, DoorDash, Cursor, and Ramp account for over half of all YC portfolio value. Three of those five were sleepers.
            </p>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mt-12 items-center">
            <Reveal>
              <div role="img" aria-label="Pie chart showing share of YC portfolio value">
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={70}
                      outerRadius={120}
                      dataKey="value"
                      startAngle={90}
                      endAngle={-270}
                      stroke="none"
                    >
                      {pieData.map((d, i) => (
                        <Cell key={i} fill={d.fill} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ background: "#1a1a1a", border: "none", borderRadius: 8, color: "#fff", fontSize: 13 }} formatter={(v) => `${v}%`} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-wrap gap-4 justify-center mt-2">
                {pieData.map((d) => (
                  <div key={d.name} className="flex items-center gap-2 text-xs text-neutral-600">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: d.fill }} />
                    {d.name}
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal delay={100}>
              <div className="space-y-4">
                {[
                  { n: "0.6%", label: "of YC companies are decacorns", sub: ">$10B — account for >55% of total value" },
                  { n: "6%", label: "become unicorns at all", sub: "Account for 90% of total YC value" },
                  { n: "821+", label: "companies in the YC Graveyard", sub: "Documented failures across all batches" },
                  { n: "3/5", label: "of the top 5 were sleepers", sub: "Airbnb, DoorDash, and Cursor were overlooked" },
                ].map((s, i) => (
                  <div key={i} className="flex gap-4 items-start">
                    <span className="text-2xl font-bold text-[#FF6600] tabular-nums shrink-0 w-16 text-right">{s.n}</span>
                    <div>
                      <p className="text-sm font-semibold text-yc-dark">{s.label}</p>
                      <p className="text-xs text-neutral-500">{s.sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── CATEGORY BREAKDOWN ── */}
      <section className="max-w-5xl mx-auto px-6 sm:px-8 py-16 sm:py-24">
        <Reveal>
          <div className="inline-block px-3 py-1 rounded-full bg-[#FFF3EB] text-[#FF6600] text-xs font-bold uppercase tracking-widest mb-4">Breakdown</div>
          <h2 className="text-3xl sm:text-5xl font-bold text-yc-dark">By the numbers</h2>
        </Reveal>

        <Reveal delay={100}>
          <div className="bg-white rounded-2xl border border-neutral-200 p-4 sm:p-6 mt-8">
            <div role="img" aria-label="Bar chart showing combined valuation by Demo Day category">
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={categoryBreakdown} layout="vertical" margin={{ left: 140, right: 30, top: 10, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" horizontal={false} />
                  <XAxis type="number" tickFormatter={(v: number) => `$${v}B`} tick={{ fill: "#737373", fontSize: 12 }} />
                  <YAxis type="category" dataKey="name" tick={{ fill: "#1a1a1a", fontSize: 13, fontWeight: 600 }} width={130} />
                  <Tooltip contentStyle={{ background: "#1a1a1a", border: "none", borderRadius: 8, color: "#fff", fontSize: 13 }} formatter={(v) => `$${v}B combined`} />
                  <Bar dataKey="value" radius={[0, 8, 8, 0]} barSize={28}>
                    {categoryBreakdown.map((d, i) => (
                      <Cell key={i} fill={d.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-neutral-100">
              {categoryBreakdown.map((d) => (
                <div key={d.name} className="text-center">
                  <p className="text-3xl font-bold tabular-nums" style={{ color: d.color }}>{d.count}</p>
                  <p className="text-xs text-neutral-500 mt-1">{d.name}</p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </section>

      {/* ── FUNDING VELOCITY ── */}
      <section className="bg-white border-y border-neutral-200">
        <div className="max-w-5xl mx-auto px-6 sm:px-8 py-16 sm:py-24">
          <Reveal>
            <div className="inline-block px-3 py-1 rounded-full bg-[#FFF3EB] text-[#FF6600] text-xs font-bold uppercase tracking-widest mb-4">Funding Velocity</div>
            <h2 className="text-3xl sm:text-5xl font-bold text-yc-dark">How fast did they scale?</h2>
            <p className="text-neutral-500 mt-2 text-sm sm:text-base max-w-2xl">
              Time from founding to unicorn status ($1B+ valuation). The fastest got there in 1–2 years. Some took over a decade. Many never made it.
            </p>
          </Reveal>

          {(() => {
            const unicorns = COMPANIES
              .filter(c => c.unicornYear && c.founded)
              .map(c => ({ ...c, yearsToUnicorn: c.unicornYear! - c.founded }))
              .sort((a, b) => a.yearsToUnicorn - b.yearsToUnicorn);

            const fastest = unicorns.slice(0, 15);
            const slowest = [...unicorns].sort((a, b) => b.yearsToUnicorn - a.yearsToUnicorn).slice(0, 10);

            const seedToA = COMPANIES
              .filter(c => c.seedYear && c.seriesAYear)
              .map(c => ({ ...c, gap: c.seriesAYear! - c.seedYear! }));

            const avgSeedToA = seedToA.length > 0 ? (seedToA.reduce((s, c) => s + c.gap, 0) / seedToA.length).toFixed(1) : "N/A";
            const avgToUnicorn = unicorns.length > 0 ? (unicorns.reduce((s, c) => s + c.yearsToUnicorn, 0) / unicorns.length).toFixed(1) : "N/A";

            const speedBuckets = [
              { label: "≤2 years", count: unicorns.filter(c => c.yearsToUnicorn <= 2).length, color: "#FF6600" },
              { label: "3–4 years", count: unicorns.filter(c => c.yearsToUnicorn >= 3 && c.yearsToUnicorn <= 4).length, color: "#10b981" },
              { label: "5–6 years", count: unicorns.filter(c => c.yearsToUnicorn >= 5 && c.yearsToUnicorn <= 6).length, color: "#3b82f6" },
              { label: "7–9 years", count: unicorns.filter(c => c.yearsToUnicorn >= 7 && c.yearsToUnicorn <= 9).length, color: "#f59e0b" },
              { label: "10+ years", count: unicorns.filter(c => c.yearsToUnicorn >= 10).length, color: "#ef4444" },
            ];

            const statusCounts = [
              { label: "Active (Private)", count: COMPANIES.filter(c => c.status === "active").length, color: "#10b981" },
              { label: "Public", count: COMPANIES.filter(c => c.status === "public").length, color: "#3b82f6" },
              { label: "Acquired", count: COMPANIES.filter(c => c.status === "acquired").length, color: "#f59e0b" },
              { label: "Dead", count: COMPANIES.filter(c => c.status === "dead").length, color: "#ef4444" },
            ];

            const maxFastest = Math.max(...fastest.map(c => c.yearsToUnicorn));

            return (
              <>
                <Reveal delay={100}>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-10">
                    <div className="rounded-2xl border border-neutral-200 p-5 text-center">
                      <p className="text-3xl sm:text-4xl font-bold text-[#FF6600] tabular-nums">{avgToUnicorn}y</p>
                      <p className="text-xs text-neutral-500 mt-1">Avg. years to unicorn</p>
                    </div>
                    <div className="rounded-2xl border border-neutral-200 p-5 text-center">
                      <p className="text-3xl sm:text-4xl font-bold text-[#10b981] tabular-nums">{avgSeedToA}y</p>
                      <p className="text-xs text-neutral-500 mt-1">Avg. seed → Series A</p>
                    </div>
                    <div className="rounded-2xl border border-neutral-200 p-5 text-center">
                      <p className="text-3xl sm:text-4xl font-bold text-[#3b82f6] tabular-nums">{unicorns.length}</p>
                      <p className="text-xs text-neutral-500 mt-1">Reached unicorn status</p>
                    </div>
                    <div className="rounded-2xl border border-neutral-200 p-5 text-center">
                      <p className="text-3xl sm:text-4xl font-bold text-[#ef4444] tabular-nums">{COMPANIES.filter(c => c.status === "dead").length}</p>
                      <p className="text-xs text-neutral-500 mt-1">Completely dead</p>
                    </div>
                  </div>
                </Reveal>

                <Reveal delay={150}>
                  <div className="mt-12">
                    <h3 className="text-lg font-bold text-yc-dark mb-1">Fastest to Unicorn</h3>
                    <p className="text-xs text-neutral-500 mb-4">Years from founding to $1B+ valuation</p>
                    <div className="space-y-1">
                      {fastest.map((c) => {
                        const meta = CATEGORY_META[c.category];
                        const pct = Math.max((c.yearsToUnicorn / maxFastest) * 100, 8);
                        return (
                          <div key={c.name} className="flex items-center gap-3 py-1.5 group">
                            <div className="w-28 sm:w-36 shrink-0 text-right">
                              <span className="text-sm font-semibold text-yc-dark">{c.name}</span>
                              <span className="text-xs text-neutral-400 ml-1">{c.batch}</span>
                            </div>
                            <div className="flex-1 relative h-7 rounded bg-neutral-100 overflow-hidden">
                              <div
                                className="absolute inset-y-0 left-0 rounded transition-all duration-700 ease-out flex items-center"
                                style={{ width: `${pct}%`, backgroundColor: meta.color }}
                              >
                                <span className="text-white text-xs font-bold ml-2 whitespace-nowrap">{c.yearsToUnicorn}y</span>
                              </div>
                            </div>
                            <div className="hidden sm:block w-16 shrink-0 text-right">
                              <span className="text-xs text-neutral-500">${c.valuation}B</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </Reveal>

                <Reveal delay={200}>
                  <div className="mt-12">
                    <h3 className="text-lg font-bold text-yc-dark mb-1">Slowest to Unicorn</h3>
                    <p className="text-xs text-neutral-500 mb-4">Patience paid off — these took the longest but still got there</p>
                    <div className="space-y-1">
                      {slowest.map((c) => {
                        const meta = CATEGORY_META[c.category];
                        const maxSlow = Math.max(...slowest.map(s => s.yearsToUnicorn));
                        const pct = Math.max((c.yearsToUnicorn / maxSlow) * 100, 8);
                        return (
                          <div key={c.name} className="flex items-center gap-3 py-1.5">
                            <div className="w-28 sm:w-36 shrink-0 text-right">
                              <span className="text-sm font-semibold text-yc-dark">{c.name}</span>
                              <span className="text-xs text-neutral-400 ml-1">{c.batch}</span>
                            </div>
                            <div className="flex-1 relative h-7 rounded bg-neutral-100 overflow-hidden">
                              <div
                                className="absolute inset-y-0 left-0 rounded transition-all duration-700 ease-out flex items-center"
                                style={{ width: `${pct}%`, backgroundColor: meta.color }}
                              >
                                <span className="text-white text-xs font-bold ml-2 whitespace-nowrap">{c.yearsToUnicorn}y</span>
                              </div>
                            </div>
                            <div className="hidden sm:block w-16 shrink-0 text-right">
                              <span className="text-xs text-neutral-500">${c.valuation}B</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </Reveal>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-12">
                  <Reveal delay={250}>
                    <div className="rounded-2xl border border-neutral-200 p-6">
                      <h3 className="text-lg font-bold text-yc-dark mb-4">Time to Unicorn Distribution</h3>
                      <div className="space-y-3">
                        {speedBuckets.map((b) => (
                          <div key={b.label} className="flex items-center gap-3">
                            <span className="text-sm text-neutral-600 w-20 shrink-0">{b.label}</span>
                            <div className="flex-1 h-6 rounded bg-neutral-100 overflow-hidden">
                              <div
                                className="h-full rounded flex items-center transition-all duration-500"
                                style={{ width: `${Math.max((b.count / unicorns.length) * 100, 4)}%`, backgroundColor: b.color }}
                              >
                                {b.count > 0 && <span className="text-white text-xs font-bold ml-2">{b.count}</span>}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </Reveal>

                  <Reveal delay={300}>
                    <div className="rounded-2xl border border-neutral-200 p-6">
                      <h3 className="text-lg font-bold text-yc-dark mb-4">Current Status</h3>
                      <div className="space-y-3">
                        {statusCounts.map((s) => (
                          <div key={s.label} className="flex items-center gap-3">
                            <span className="text-sm text-neutral-600 w-28 shrink-0">{s.label}</span>
                            <div className="flex-1 h-6 rounded bg-neutral-100 overflow-hidden">
                              <div
                                className="h-full rounded flex items-center transition-all duration-500"
                                style={{ width: `${Math.max((s.count / COMPANIES.length) * 100, 4)}%`, backgroundColor: s.color }}
                              >
                                <span className="text-white text-xs font-bold ml-2">{s.count}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <p className="text-xs text-neutral-400 mt-4">{COMPANIES.length} companies tracked</p>
                    </div>
                  </Reveal>
                </div>
              </>
            );
          })()}
        </div>
      </section>

      {/* ── INSIDER QUOTES ── */}
      <section className="bg-yc-dark">
        <div className="max-w-5xl mx-auto px-6 sm:px-8 py-16 sm:py-24">
          <Reveal>
            <div className="inline-block px-3 py-1 rounded-full bg-[#FF6600]/20 text-[#FF6600] text-xs font-bold uppercase tracking-widest mb-4">From the Insiders</div>
            <h2 className="text-3xl sm:text-5xl font-bold text-white">Even YC can&apos;t predict winners</h2>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
            {quotes.map((q, i) => (
              <Reveal key={i} delay={i * 50}>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-6 h-full backdrop-blur-sm">
                  <p className="text-[#FF6600] text-4xl font-serif leading-none mb-3">&ldquo;</p>
                  <p className="text-sm text-white/80 leading-relaxed">{q.text}</p>
                  <div className="mt-4 pt-3 border-t border-white/10">
                    <p className="text-sm font-bold text-white">{q.who}</p>
                    <p className="text-xs text-white/40">{q.role}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── BOTTOM LINE ── */}
      <section className="max-w-5xl mx-auto px-6 sm:px-8 py-16 sm:py-24">
        <Reveal>
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl sm:text-5xl font-bold text-yc-dark">The signal isn&apos;t in the sizzle.</h2>
            <p className="text-xl sm:text-2xl text-[#FF6600] font-semibold mt-4">It&apos;s in the survival.</p>
            <p className="text-neutral-600 text-base sm:text-lg mt-8 leading-relaxed max-w-xl mx-auto">
              Demo Day hype is a weak predictor of YC startup success. The R² is 0.09. The correlation is 0.23. In every batch we tracked, the pundits missed the biggest winner. The most iconic YC successes were the companies nobody wanted.
            </p>
          </div>
        </Reveal>
      </section>

      {/* ── SOURCES ── */}
      <section className="border-t border-neutral-200 bg-white">
        <div className="max-w-5xl mx-auto px-6 sm:px-8 py-12">
          <h3 className="text-sm font-bold text-neutral-400 uppercase tracking-widest mb-4">Sources &amp; Methodology</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-2">
            {[
              "Rebel Fund: What Predicts YC Success (Jared Heyman)",
              "Rebel Fund: Investing in Hot YC Startups",
              "Rebel Fund: Power Law of YC Startups",
              "Sam Altman: The Post-YC Slump",
              "Aaron Harris: Fundraising Isn't Predictable",
              "Sequoia: Crucible Moments — DoorDash",
              "TechCrunch: YC S13, W14, W19 Demo Day Coverage",
              "Contrary Research: Webflow, Checkr, Whatnot",
              "First Round Review: GOAT's Path to PMF",
              "YC Graveyard Database (821+ companies)",
              "Eqvista: Top 100 YC Companies",
              "176 companies tracked across 20 years of YC batches",
            ].map((s) => (
              <p key={s} className="text-xs text-neutral-500 py-1">{s}</p>
            ))}
          </div>
          <p className="text-xs text-neutral-400 mt-6">Not affiliated with Y Combinator. Valuations from most recent public reports as of June 2026. &ldquo;Failed&rdquo; = shut down, acqui-hired for &lt;$10M, or filed bankruptcy.</p>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-neutral-200 py-8 text-center bg-yc-cream">
        <p className="text-sm text-neutral-500">
          Research by <a href="https://x.com/Trace_Cohen" target="_blank" rel="noopener" className="text-[#FF6600] hover:underline font-semibold">@Trace_Cohen</a>
          {" · "}
          <a href="mailto:t@nyvp.com" className="text-neutral-600 hover:text-yc-dark transition">t@nyvp.com</a>
        </p>
      </footer>
    </main>
  );
}
